/**
 * Created on 2014/5/13.
 */
define(["tiny-lib/jquery", "tiny-lib/raphael", "app/services/icons", "app/business/ecs/services/vm/vmCommonService","language/keyID"], function ($, Raphael, icons, VmCommonService, i18n) {
    "use strict";
    var vmCommonService = new VmCommonService();

    function ArrayList() {
        this.properties = {};
    }

    ArrayList.prototype.add = function (key, value) {
        if (key) {
            this.properties[key] = value;
            return true;
        }
        return false;
    };

    ArrayList.prototype.update = function (key, value) {
        if (key) {
            this.properties[key] = value;
            return true;
        }
        return false;
    };

    ArrayList.prototype.del = function (key) {
        if (key && this.properties[key]) {
            this.properties[key] = null;
            delete this.properties[key];
            return true;
        }
        return false;
    };

    ArrayList.prototype.get = function (key) {
        if (key && key in this.properties) {
            return this.properties[key];
        }
        return null;
    };

    ArrayList.prototype.length = function () {
        var length = 0;
        for (var key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
                length++;
            }
        }
        return length;
    };

    ArrayList.prototype.getArray = function () {
        var result = [];
        for (var key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
                result.push(this.get(key));
            }
        }
        return result;
    };

    //计算高度，宽度，并设定全局画布的大小
    function Topo(id, json, $scope) {
        var caversSize = this.getCaversSize();
        var paper = Raphael(id, caversSize.width, caversSize.height);
        this.caversSize = caversSize;
        this.icons = new icons(paper);
        this.paper = paper;
        this.json = json;
        this.id = id;
        this.$scope = $scope;
        //画布在动态画节点时的总宽度
        this.currentWidth = caversSize.width;
        //画布在动态画节点时的总高度
        this.currentHeight = caversSize.height;

        //获取网络信息
        this.infos = this.rebuildJSON(json);

        //画网络
        this.drawnNetworks();

        //画VLB
        this.drawVLBs();

        //画与VLB无关的SG和VM节点
        this.drawOthers();
    }

    //获取画布大小
    Topo.prototype.getCaversSize = function () {
        //215为layout的宽度，20为内容区的margin
        var width = parseInt($("#appTopoDiv").css("width"));
        return {
            "width": width,
            "height": Topo.NETWORK_ERECK_MARGIN * 1
        };
    };

    //反解析JSON
    Topo.prototype.rebuildJSON = function (json) {
        var connections = json.Connections;
        var Resources = json.Resources;
        var obj = null;
        var from = null;
        var to = null;
        var key = null;
        for (key in connections) {
            if (!connections.hasOwnProperty(key)) {
                continue;
            }
            obj = connections[key];
            from = Resources[obj.From];
            to = Resources[obj.To];
            to["in"] = to["in"] ? to["in"] : 0; //被VLB或者伸缩组内连接次数

            if (from.Type === Topo.SCALINGGROUP_TYPE && to.Type === Topo.INSTANCE_TYPE) {
                from.vms = from.vms ? from.vms : new ArrayList();
                from.vms.add(obj.To, to);
                to["in"] += 1;
            } else {
                from.relations = from.relations ? from.relations : new ArrayList();
                from.relations.add(obj.To, to);
                if (from.Type === Topo.VLB_TYPE) {
                    to["in"] += 1;
                }
            }
        }

        var vlbs = new ArrayList();
        var scalinggroups = new ArrayList();
        var networks = new ArrayList();
        var instances = new ArrayList();
        var others = new ArrayList();

        for (key in Resources) {
            if (!Resources.hasOwnProperty(key)) {
                continue;
            }
            obj = Resources[key];
            obj.Key = key;
            if (obj.Type === Topo.INSTANCE_TYPE) {
                instances.add(key, obj);
            }
            if (obj.Type === Topo.SCALINGGROUP_TYPE) {
                scalinggroups.add(key, obj);
            }
            if (obj.Type === Topo.NETWORK_TYPE) {
                obj.NetworkType = this.networkStatus(obj.NetworkType);
                obj.DhcpIsolation = Boolean(obj.DhcpIsolation) ? i18n.common_term_yes_button :i18n.common_term_no_label;
                obj.IpMacBind = Boolean(obj.IpMacBind) ? i18n.common_term_yes_button  : i18n.common_term_no_label;
                networks.add(key, obj);
            }
            if (obj.Type === Topo.VLB_TYPE) {
                vlbs.add(key, obj);
            }
        }

        var insPs = instances.properties;
        for (key in insPs) {
            if (!insPs.hasOwnProperty(key)) {
                continue;
            }
            obj = insPs[key];
            if (obj["in"] === 0 || obj["in"] === undefined) {
                others.add(key, obj);
            }
        }
        var sgPs = scalinggroups.properties;
        for (key in sgPs) {
            if (!sgPs.hasOwnProperty(key)) {
                continue;
            }
            obj = sgPs[key];
            if (obj["in"] === 0 || obj["in"] === undefined) {
                others.add(key, obj);
            }
        }
        return {
            "vlbs": vlbs,
            "sgs": scalinggroups,
            "networks": networks,
            "instances": instances,
            "connections": connections,
            "others": others
        };
    };

    //画所有的网络
    Topo.prototype.drawnNetworks = function () {
        var info = this.getNetworkInfo().networks.getArray();
        var xx = Topo.NETWORK_LEFT_MARGIN;
        var yy = 0;
        var point = null;
        var jsonItem = null;
        for (var i = 1; i <= info.length; i++) {
            point = {
                "x": xx,
                "y": yy + Topo.NETWORK_ERECK_MARGIN * i
            };

            jsonItem = info[i - 1];
            this.drawNetwork(point, jsonItem);
        }
    };

    //画网络线
    Topo.prototype.drawNetwork = function (point, jsonItem) {
        var xx = point.x;
        var yy = point.y;
        var icons = this.icons;
        var color = this.randomColor();
        var line = icons.line("", 4, [xx, yy, this.caversSize.width - xx]);
        var st = icons.text(jsonItem.Name, xx, yy - 3, line);
        st.effect(this.selectedCell(Topo.NETWORK_TYPE, jsonItem));

        jsonItem.graphItem = line;
        jsonItem.graph = st;
        jsonItem.color = color;
        st.attr({
            "fill": color,
            "stroke": color
        });
        this.refreshCaversSize(jsonItem.graph);
        return line;
    };

    //画VLB
    Topo.prototype.drawVLBs = function () {
        var netInfos = this.getNetworkInfo();
        var xx = Topo.VLB_LEFT_MARGIN;
        //计算出网络节点所占的空间
        var yy = netInfos.size * Topo.NETWORK_ERECK_MARGIN;

        var info = this.getRVLBInfo().vlbs.getArray();
        var point = null;
        var jsonItem = null;
        var vlb = null;
        for (var i = 1; i <= info.length; i++) {
            point = {
                "x": xx,
                "y": this.currentHeight + Topo.VLB_ERECK_MARGIN
            };
            jsonItem = info[i - 1];

            //画VLB
            vlb = this.drawVLB(point, jsonItem);

            //画与VLB相关联的伸缩组和VM
            this.drawSGAndVmByVLB(vlb, jsonItem);
        }
    };

    //只画VLB节点
    Topo.prototype.drawVLB = function (point, jsonItem) {
        var xx = point.x;
        var yy = point.y;
        var icons = this.icons;
        var paper = this.paper;

        var st = paper.set();

        //云节点
        var cloud = icons.cloud(jsonItem.VIP);
        icons.trans(cloud, xx, yy - 40);
        st.push(cloud);

        //连线
        var cloudBox = cloud.getBBox();
        xx = cloudBox.x + cloudBox.width;
        var line = icons.line("", 4, [xx, yy, Topo.CLOUD_DISPATCH_MARGIN]);
        st.push(line);
        xx = xx + Topo.CLOUD_DISPATCH_MARGIN;
        //分发器
        var vlb = icons.vlb("");
        icons.trans(vlb, xx, yy - 30);
        vlb.effect(this.selectedCell(Topo.VLB_TYPE, jsonItem));
        st.push(vlb);

        jsonItem.graphItem = vlb;
        jsonItem.graph = st;
        this.refreshCaversSize(jsonItem.graph);

        return vlb;
    };

    //画与VLB相关联的伸缩组和VM
    Topo.prototype.drawSGAndVmByVLB = function (vlb, jsonItem) {
        var vlbBox = vlb.getBBox();
        var xx = vlbBox.x + Topo.VM_HORIZ_MARGIN;
        var yy = vlbBox.y;

        var obj = null;
        var graph = null;
        var point = null;
        var graphBox = null;
        var relations = jsonItem.relations;
        if (!relations) {
            return;
        }
        var properties = relations.properties;
        var before = null;
        var beforeBox = null;
        var key = null;
        for (key in properties) {
            if (!properties.hasOwnProperty(key)) {
                continue;
            }
            obj = relations.get(key);
            if (obj.Type === Topo.NETWORK_TYPE) {
                graph = obj.graphItem;
                this.drawVLBToNetwork(vlb, graph, obj.color);
                continue;
            }

            if (obj.Type === Topo.SCALINGGROUP_TYPE) {
                //画伸缩组
                point = {
                    "x": xx,
                    "y": yy
                };
                before = this.drawScalingGroup(point, obj);
                this.drawVLBToSGAndVm(vlb, before);
            }

            if (obj.Type === Topo.INSTANCE_TYPE) {
                //画虚拟机
                point = {
                    "x": xx,
                    "y": yy
                };
                before = this.drawVM(point, obj);
                this.drawVLBToSGAndVm(vlb, before);
            }
            beforeBox = before.getBBox();
            xx = beforeBox.x + beforeBox.width + Topo.AUTO_LAYOUT_HORIZ_MARGIN;
        }
    };

    //画与VLB无关的SG和VM节点
    Topo.prototype.drawOthers = function () {
        var others = this.infos.others;
        //计算当前的长度和高度
        //一行最多显示8个，如果长度更长，则依据长度来计算
        var offset = Topo.NETWORK_LEFT_MARGIN + Topo.VLB_LEFT_MARGIN + Topo.CLOUD_DISPATCH_MARGIN + 30; //自由排列时的左偏移量
        var width = this.currentWidth - offset;
        var numb = Math.ceil(width / (Topo.AUTO_LAYOUT_HORIZ_MARGIN + Topo.SCALINGGROUP_HORIZ_MARGIN));
        numb = numb < Topo.AUTO_LAYOUT_NUM ? Topo.AUTO_LAYOUT_NUM : numb;

        var nodeNums = others.getArray();
        var point = null;
        var itemJSON = null;
        var lock = null;
        var xx = offset;
        var yy = this.currentHeight + 50;
        var before = null;
        var beforeBox = null;
        for (var i = 0; i < nodeNums.length; i++) {
            var floor = Math.floor(i / numb);
            if (lock === null) {
                lock = floor;
            }
            if (lock !== floor) {
                xx = offset;
                yy = this.currentHeight + 50;
                lock = floor;
            }
            itemJSON = nodeNums[i];
            point = {
                "x": xx,
                "y": yy
            };
            if (itemJSON.Type === Topo.SCALINGGROUP_TYPE) {
                before = this.drawScalingGroup(point, itemJSON);
            }
            if (itemJSON.Type === Topo.INSTANCE_TYPE) {
                before = this.drawVM(point, itemJSON);
            }
            beforeBox = before.getBBox();
            xx = beforeBox.x + beforeBox.width + Topo.AUTO_LAYOUT_HORIZ_MARGIN;
        }
    };

    //VLB与网络的连线
    Topo.prototype.drawVLBToNetwork = function (vlb, network, color) {
        var vlbBox = vlb.getBBox();
        var netBox = network.getBBox();

        var xx = vlbBox.x + vlbBox.width / 2;
        var yy = vlbBox.y;

        var yy2 = netBox.y2;

        var icons = this.icons;
        var line = icons.line("", 1, [xx, yy2, undefined, yy - yy2]);
        line.toBack();
        line.attr({
            "stroke": color
        });
        line.effect();
    };

    //虚拟机与网络的连线
    Topo.prototype.drawVmToNetworks = function (vm, jsonItem) {
        var relations = jsonItem.relations;
        if (!relations) {
            return;
        }

        var network = null;
        var netBox = null;
        var vmBox = vm.getBBox();
        var xx = vmBox.x + vmBox.width / 2;
        var yy = vmBox.y;
        var xx2 = 0;
        var yy2 = 0;

        var vmPs = relations.getArray();
        var icons = this.icons;
        var line = null;

        var margin = (vmBox.width - Topo.SCALINGGROUP_NETWORK_LINE_HZ_MARGIN * 2) / (vmPs.length - 1);
        var i = 0;
        //如果是奇数
        if (vmPs.length % 2) {
            for (i = 1; i <= vmPs.length; i++) {
                network = vmPs[i - 1];
                netBox = network.graph.getBBox();
                yy2 = netBox.y2;
                if (i * 2 < vmPs.length + 1) {
                    xx2 = xx - (((vmPs.length + 1) / 2) - i) * margin;
                }
                if (i * 2 === vmPs.length + 1) {
                    xx2 = xx;
                }
                if (i * 2 > vmPs.length + 1) {
                    xx2 = xx + ((i - (vmPs.length + 1) / 2)) * margin;
                }
                line = icons.line("", 1, [xx2, yy2, undefined, yy - yy2]);
                line.toBack();
                line.attr({
                    "stroke": network.color
                });
                line.effect();
            }
        } else {
            for (i = 1; i <= vmPs.length; i++) {
                network = vmPs[i - 1];
                netBox = network.graph.getBBox();
                yy2 = netBox.y2;
                if (i * 2 < vmPs.length) {
                    xx2 = xx - (vmPs.length / 2 - i) * margin - margin / 2;
                }
                if (i * 2 === vmPs.length) {
                    xx2 = xx - margin / 2;
                }
                if (i * 2 > vmPs.length) {
                    xx2 = xx + (i - vmPs.length / 2 - 1) * margin + margin / 2;
                }
                line = icons.line("", 1, [xx2, yy2, undefined, yy - yy2]);
                line.toBack();
                line.attr({
                    "stroke": network.color
                });
                line.effect();
            }
        }
    };

    //虚拟机与网络的连线
    Topo.prototype.drawVmToNetwork = function (vm, network, color) {
        var vmBox = vm.getBBox();
        var netBox = network.getBBox();

        var xx = vmBox.x + vmBox.width / 2;
        var yy = vmBox.y;

        var yy2 = netBox.y2;

        var icons = this.icons;
        var line = icons.line("", 1, [xx, yy2, undefined, yy - yy2]);
        line.toBack();
        line.attr({
            "stroke": color
        });
        line.effect();
    };

    //VLB与VM和伸缩组连线
    Topo.prototype.drawVLBToSGAndVm = function (vlb, node, color) {
        var vlbBox = vlb.getBBox();
        var nodeBox = node.getBBox();

        var xx = vlbBox.x2;
        var yy = vlbBox.y + vlbBox.height / 2;

        var xx2 = nodeBox.x;
        var icons = this.icons;
        var line = icons.line("", 4, [xx, yy, xx2 - xx]);
        line.toBack();
        line.effect();
    };

    //伸缩组与网络的连线
    Topo.prototype.drawScalingGroupToNetwork = function (jsonItem) {
        var sg = jsonItem.graph;
        var relations = jsonItem.relations;
        if (!relations) {
            return;
        }
        var sgBox = sg.getBBox();
        var network = null;
        var netBox = null;
        var xx = sgBox.x + sgBox.width / 2;
        var yy = sgBox.y;
        var xx2 = 0;
        var yy2 = 0;

        var sgPs = relations.getArray();
        var icons = this.icons;
        var line = null;

        var margin = (sgBox.width - Topo.SCALINGGROUP_NETWORK_LINE_HZ_MARGIN * 2) / (sgPs.length - 1);
        var i = 0;
        //如果是奇数
        if (sgPs.length % 2) {
            for (i = 1; i <= sgPs.length; i++) {
                network = sgPs[i - 1];
                netBox = network.graph.getBBox();
                yy2 = netBox.y2;
                if (i * 2 < sgPs.length + 1) {
                    xx2 = xx - (((sgPs.length + 1) / 2) - i) * margin;
                }
                if (i * 2 === sgPs.length + 1) {
                    xx2 = xx;
                }
                if (i * 2 > sgPs.length + 1) {
                    xx2 = xx + ((i - (sgPs.length + 1) / 2)) * margin;
                }
                line = icons.line("", 1, [xx2, yy2, undefined, yy - yy2]);
                line.toBack();
                line.attr({
                    "stroke": network.color
                });
                line.effect();
            }
        } else {
            for (i = 1; i <= sgPs.length; i++) {
                network = sgPs[i - 1];
                netBox = network.graph.getBBox();
                yy2 = netBox.y2;
                if (i * 2 < sgPs.length) {
                    xx2 = xx - (sgPs.length / 2 - i) * margin - margin / 2;
                }
                if (i * 2 === sgPs.length) {
                    xx2 = xx - margin / 2;
                }
                if (i * 2 > sgPs.length) {
                    xx2 = xx + (i - sgPs.length / 2 - 1) * margin + margin / 2;
                }
                line = icons.line("", 1, [xx2, yy2, undefined, yy - yy2]);
                line.toBack();
                line.attr({
                    "stroke": network.color
                });
                line.effect();
            }
        }
    };


    //画伸缩组
    Topo.prototype.drawScalingGroup = function (point, jsonItem) {
        var xx = point.x;
        var yy = point.y;

        var vms = jsonItem.vms;
        if (!vms) {
            vms = new ArrayList();
        }
        var vmsArray = vms.getArray();
        var length = Topo.VM_ERECK_MARGIN * vmsArray.length + Topo.SCALINGGROUP_VM_TOP_MARGIN * 2 + Topo.SCALINGGROUP_VM_VM_MARGIN * (vmsArray.length - 1);

        var icons = this.icons;
        var paper = this.paper;

        //伸缩组
        var sg = paper.rect(xx, yy, Topo.SCALINGGROUP_HORIZ_MARGIN, length).attr(icons.defaults.stroke).attr({
            "r": 10
        });
        var titleUI = icons.getDisplayText(jsonItem.Name, 25);
        var setsg = icons.text(titleUI, xx + Topo.SCALINGGROUP_HORIZ_MARGIN / 2, yy + length - 28);
        setsg.tooltip(jsonItem.Name);

        setsg.push(sg);

        var sgset = paper.set();
        sgset.push(setsg);
        //伸缩组内的虚拟机
        var tpoint = null;
        var vm = null;
        var i = 0;
        for (i = 0; i < vmsArray.length; i++) {
            tpoint = {
                "x": xx + (Topo.SCALINGGROUP_HORIZ_MARGIN - Topo.VM_HORIZ_MARGIN) / 2 + 30,
                "y": yy + Topo.SCALINGGROUP_VM_TOP_MARGIN + (Topo.VM_ERECK_MARGIN + Topo.SCALINGGROUP_VM_VM_MARGIN) * i
            };
            vm = this.drawVM(tpoint, vmsArray[i]);
            sgset.push(vm);
        }
        setsg.effect(this.selectedCell(Topo.SCALINGGROUP_TYPE, jsonItem));

        jsonItem.graphItem = setsg;
        jsonItem.graph = sgset;

        this.drawScalingGroupToNetwork(jsonItem);

        this.refreshCaversSize(jsonItem.graph);

        return setsg;
    };

    //画虚拟机
    Topo.prototype.drawVM = function (point, jsonItem) {
        var xx = point.x;
        var yy = point.y;
        var icons = this.icons;
        var paper = this.paper;
        var st = paper.set();
        var vm = icons.vm(jsonItem.Ip);
        var titleUI = icons.getDisplayText(jsonItem.Name, 20);
        var t = icons.text(titleUI, 28, -28);
        t.tooltip(jsonItem.Name);
        vm.push(t.pop());
        icons.trans(vm, xx, yy + 10); //46为偏移量

        this.drawVmToNetworks(vm, jsonItem);
        
        vm.effect(this.selectedCell(Topo.INSTANCE_TYPE, jsonItem));

        jsonItem.graphItem = vm;
        jsonItem.graph = vm;
        this.refreshCaversSize(jsonItem.graph);
        return vm;
    };

    //获取vlb节点集合
    Topo.prototype.getRVLBInfo = function (json) {
        var infos = this.infos;
        if (!infos.vlbs) {
            infos.vlbs = new ArrayList();
        }
        return {
            "size": infos.vlbs.length,
            "vlbs": infos.vlbs
        };
    };

    //获取网络节点集合
    Topo.prototype.getNetworkInfo = function () {
        var infos = this.infos;
        if (!infos.networks) {
            infos.networks = new ArrayList();
        }
        return {
            "size": infos.networks.length(),
            "networks": infos.networks
        };
    };

    Topo.prototype.refreshCaversSize = function (graph) {
        var graphBBox = graph.getBBox();
        var xx = graphBBox.x2;
        var yy = graphBBox.y2;
        if (this.currentWidth < xx) {
            this.currentWidth = xx;
        }
        if (this.currentHeight < yy) {
            this.currentHeight = yy;
        }
        //刷新网络连线长度
        var info = this.getNetworkInfo().networks.getArray();
        var graphItem = null;
        var graphBox = null;
        var textBox = null;
        var x = 0,
            y = 0,
            w = 0,
            s = 0;
        for (var i = 0; i < info.length; i++) {
            graphItem = info[i].graphItem;
            if (!graphItem) {
                continue;
            }
            graphBox = graphItem.getBBox();
            x = graphBox.x;
            y = graphBox.y;
            w = graphBox.width;
            s = (this.currentWidth - Topo.NETWORK_LEFT_MARGIN) / w;
            if (s === 1) {
                continue;
            }
            graphItem[0].transform(("s" + s + ",2," + Topo.NETWORK_LEFT_MARGIN + "," + y));
            textBox = graphItem[1].getBBox();
            graphItem[1].transform(("t" + (w - textBox.width) + ",1"));

            if (this.currentWidth < graphBox.x2) {
                this.currentWidth = graphBox.x2;
            }
        }
        this.paper.setSize(this.currentWidth + 8, this.currentHeight + 20); //8是线宽的大小限制
        $("#" + this.id).css({
            "height": this.currentHeight + 50 + "px"
        });
    };

    Topo.prototype.randomColor = function () {
        var color = "#";
        //循环6次生成随机六位数
        for (var i = 0; i < 6; i++) {
            color += Math.round(Math.random() * 8);
        }
        return color;
    };


    Topo.prototype.selectedCell = function (type, cellJSON) {
        var self = this;
        return function (evt) {
            evt.stopPropagation();
            if (type === Topo.VLB_TYPE) {
                self.$scope.setCurrentNode("vlb");
                self.$scope.vlbNodeJSON = cellJSON;
            }
            if (type === Topo.NETWORK_TYPE) {
                self.$scope.setCurrentNode("net");
                self.$scope.netNodeJSON = cellJSON;
                var strType = cellJSON.DhcpServerType.substring(6,cellJSON.DhcpServerType.length-2);
                self.$scope.netNodeJSON.DhcpServerIPType = vmCommonService.getDhcpServerType(strType);
            }
            if (type === Topo.INSTANCE_TYPE) {
                self.$scope.setCurrentNode("vm");
                self.$scope.vmNodeJSON = cellJSON;
                self.$scope.vmNodeJSON.statusUI = vmCommonService.getStatusStr(cellJSON.Status);
                self.$scope.vmNodeJSON.supportStart = !vmCommonService.getSupportOpt(cellJSON.Status, "start");
                self.$scope.vmNodeJSON.supportStop = !vmCommonService.getSupportOpt(cellJSON.Status, "stop");
                self.$scope.vmNodeJSON.supportReboot = !vmCommonService.getSupportOpt(cellJSON.Status, "reboot");
            }
            if (type === Topo.SCALINGGROUP_TYPE) {
                if(self.$scope.isIT){
                    self.$scope.setCurrentNode("sg");
                    self.$scope.queryScalingGroup({
                        "sgId": cellJSON.Id
                    });
                    self.$scope.displayDetail();
                    return;
                }
                else{
                    return;
                }
            }
            self.$scope.$digest();
            self.$scope.displayDetail();
        };
    };

    Topo.prototype.networkStatus = function (code) {
        var str = null;
        switch (code) {
        case "EXTERNAL":
            str = i18n.resource_term_externalNet_label;
            break;
        case "INTERNAL":
            str = i18n.vpc_term_innerNet_label;
            break;
        case "ROUTED":
            str = i18n.vpc_term_routerNet_label;
            break;
        default:
            str = i18n.common_term_unknown_value;
            break;
        }
        return str;
    };

    //资源类型
    Topo.INSTANCE_TYPE = "GM::Instance";
    Topo.NETWORK_TYPE = "GM::Network";
    Topo.SCALINGGROUP_TYPE = "GM::ScalingGroup";
    Topo.VLB_TYPE = "GM::Vlb";

    //云节点和分发器之间的距离
    Topo.CLOUD_DISPATCH_MARGIN = 30;
    //VLB离左侧的最小距离
    Topo.VLB_LEFT_MARGIN = 50;
    //VLB空间
    Topo.VLB_ERECK_MARGIN = 100;
    //网络线离左侧的最小距离
    Topo.NETWORK_LEFT_MARGIN = 80;
    //网络所占空间高度
    Topo.NETWORK_ERECK_MARGIN = 50;
    //虚拟机水平空间
    Topo.VM_HORIZ_MARGIN = 120;
    //虚拟机垂直空间
    Topo.VM_ERECK_MARGIN = 80;

    Topo.SCALINGGROUP_HORIZ_MARGIN = 160;
    //水平自由排列节点之间的空间
    Topo.AUTO_LAYOUT_HORIZ_MARGIN = 60;

    Topo.SCALINGGROUP_VM_TOP_MARGIN = 40;
    //伸缩组中VM与VM之间的空间
    Topo.SCALINGGROUP_VM_VM_MARGIN = 20;
    //伸缩组与网络连线之间的空间
    Topo.SCALINGGROUP_NETWORK_LINE_HZ_MARGIN = 40;
    //水平自由排列节点个数
    Topo.AUTO_LAYOUT_NUM = 6;
    return Topo;
});
