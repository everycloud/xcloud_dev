define([
    "tiny-lib/jquery",
    "language/keyID",
    "tiny-lib/underscore",
    "tiny-lib/raphael",
    "app/services/icons"], function ($, i18n, _, Raphael, icons) {
    "use strict";

    //计算子网数，并设定全局画布的大小
    function Topo(id, json, options) {
        this.options = options;
        this.beautifierJSON(json);
        this.beautifierVMJSON(json);
        var routerInnerInfo = this.getRouterAndInnerNetSize(json);
        var directerInfo = this.getOuterNetSize(json);

        var netSizes = routerInnerInfo.size + directerInfo.size;
        var caversSize = this.getCaversSize(netSizes);
        var paper = Raphael(id, caversSize.width, caversSize.height);
        this.icons = new icons(paper);
        this.paper = paper;

        //画布在动态画节点时的总宽度
        this.currentWidth = caversSize.width;
        //画布在动态画节点时的总高度
        this.currentHeight = caversSize.height;
        Topo.NETWORK_LINE_RIGHT = this.getNetworkLineRight(json);
        //画云节点
        this.drawCloudNode(json);
        this.drawFirewallNode(this.cloud, json);
        this.drawRouterNode(this.firewall, json);
        this.drawRouterAndInnerNetLines(this.router, json);
        this.drawDirecterNetline(this.cloud, json);
    }

    Topo.prototype.beautifierJSON = function (json) {
        var routerInnerInfo = this.getRouterAndInnerNetSize(json);
        var directerInfo = this.getOuterNetSize(json);
        var routerNet = routerInnerInfo.routerNet.slice(0, 5);
        if (routerInnerInfo.size > 5) {
            routerNet.push({
                "networkType": "more23",
                "name": i18n.common_term_more_button
            });
        }
        var outerNet = directerInfo.outerNet.slice(0, 5);
        if (directerInfo.size > 5) {
            outerNet.push({
                "networkType": "more1",
                "name": i18n.common_term_more_button
            });
        }
        json.networkInfoList = routerNet.concat(outerNet);
    };

    //IT/ICT场景下的虚拟机个数最多显示5个, 否则显示更多
    Topo.prototype.beautifierVMJSON = function (json) {
        var networkInfoList = json.networkInfoList || [];
        var vmInfo = [];
        var vms = [];
        for (var i = 0, len = networkInfoList.length; i < len; i++) {
            vmInfo = networkInfoList[i].vmInfo || [];
            vms = vmInfo.slice(0, 5);
            if (vmInfo.length > 5) {
                vms.push({
                    "name": i18n.common_term_more_button,
                    "type": "more"
                });
            }
            networkInfoList[i].vmInfo = vms;
        }
    };

    //获取画布大小
    Topo.prototype.getCaversSize = function (netSizes) {
        netSizes = netSizes <= 0 ? 1 : netSizes;
        //215为layout的宽度，20为内容区的margin
        var width = parseInt($("#service-content>div").css("width"), 10) - 215 - 20;
        return {
            "width": width,
            "height": Topo.NETWORK_ERECK_MARGIN * netSizes + 30
        };
    };

    //获取除直连网络外的其它网络数，并按照：路由网络->内部网络排序
    Topo.prototype.getRouterAndInnerNetSize = function (json) {
        var result = {
            "size": 0,
            "routerNet": []
        };
        if (!json) {
            return result;
        }
        _.each(json.networkInfoList, function (item, index) {
            if (item && (String(item.networkType) === "2" || String(item.networkType) === "3" || String(item.networkType) === "more23")) {
                result.size += 1;
                result.routerNet.push(item);
            }
        });
        return result;
    };

    //获取除直连网络外的其它网络数，并按照：路由网络->内部网络排序
    Topo.prototype.getOuterNetSize = function (json) {
        var result = {
            "size": 0,
            "outerNet": []
        };
        if (!json || !json.networkInfoList) {
            return result;
        }
        _.each(json.networkInfoList, function (item, index) {
            if (item && (String(item.networkType) === "1" || String(item.networkType) === "more1")) {
                result.size += 1;
                result.outerNet.push(item);
            }
        });
        return result;
    };

    //判断是否存在云节点,如果无路由器或者外部网络时，则无云节点
    Topo.prototype.hasCloudNode = function (json) {
        if (!json || (!json.routerInfo && this.getOuterNetSize(json).size <= 0)) {
            return false;
        }
        return true;
    };

    //画云节点
    Topo.prototype.drawCloudNode = function (json) {
        var info = this.getRouterAndInnerNetSize(json);
        //云节点需要平移的距离
        var xx = 0;
        var yy = 20;
        if (info.size > 0) {
            yy = (info.size * Topo.NETWORK_ERECK_MARGIN) / 2;
            yy -= 20;
        }
        var ticons = this.icons;
        var cloud = null;
        if (this.hasCloudNode(json)) {
            xx = Topo.CLOUD_LEFT_MARGIN;
            cloud = ticons.cloud("Internet");
            ticons.trans(cloud, xx, yy);
            var cloudBox = cloud.getBBox();
            var redline = ticons.line("", 2, [cloudBox.x2 + Topo.CLOUD_REDLINE_MARGIN, cloudBox.y - Topo.CLOUD_REDLINE_HEIGHT / 2, undefined, Topo.CLOUD_FIREWALL_MARGIN]);
            redline.attr({
                "stroke": "red",
                "stroke-dasharray": "- "
            });
        }
        var cloudInfo = {
            "x": xx,
            "y": yy,
            "node": cloud
        };
        this.cloud = cloudInfo;
        this.refreshCaversSize(cloud);
        return cloudInfo;
    };

    Topo.prototype.getNodeBBox = function (nodeInfo, key) {
        key = key ? key : "node";
        var result = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        if (nodeInfo) {
            result.x = nodeInfo.x;
            result.y = nodeInfo.y;
        }
        if (!nodeInfo[key]) {
            return result;
        }
        return nodeInfo[key].getBBox();
    };

    Topo.prototype.hasFirewallNode = function (json) {
        if (!json || !json.firewallRuleInfoList || json.firewallRuleInfoList.length <= 0) {
            return false;
        }
        return true;
    };
    //画防火墙节点
    Topo.prototype.drawFirewallNode = function (cloudInfo, json) {
        var cloudBox = this.getNodeBBox(cloudInfo);
        var xx = cloudBox.x + cloudBox.width;
        var yy = cloudInfo.y;

        //连线
        var ticons = this.icons;
        if (this.hasCloudNode(json)) {
            ticons.line("", 2, [xx, yy + 40, Topo.CLOUD_FIREWALL_MARGIN]);
            xx = xx + Topo.CLOUD_FIREWALL_MARGIN;
        }

        //防火墙
        var firewall = null;
        if (this.hasFirewallNode(json)) {
            firewall = ticons.firewall({
                "text": i18n.device_term_firewall_label
            });
            ticons.trans(firewall, xx, cloudBox.y + 8);
        }

        var firewallInfo = {
            "x": xx,
            "y": cloudInfo.y,
            "node": firewall
        };
        this.firewall = firewallInfo;
        this.refreshCaversSize(firewall);
        return firewall;
    };
    Topo.prototype.hasRouterNode = function (json) {
        if (!json || !json.routerInfo) {
            return false;
        }
        return true;
    };
    //画路由器节点
    Topo.prototype.drawRouterNode = function (firewallInfo, json) {
        var firewallBox = this.getNodeBBox(firewallInfo);
        var xx = firewallBox.x + firewallBox.width;
        var yy = firewallInfo.y;

        //连线
        var ticons = this.icons;
        if (this.hasFirewallNode(json)) {
            ticons.line("", 2, [xx, yy + 40, Topo.FIREWALL_TO_ROUTER_MARGIN]);
            //防火墙
            xx = xx + Topo.FIREWALL_TO_ROUTER_MARGIN;
        }

        var router = null;
        var rline = null;
        if (this.hasRouterNode(json)) {
            router = ticons.router({
                text: i18n.router_term_router_label
            });
            ticons.trans(router, xx, firewallInfo.y + 10);
            //连线
            xx = xx + router.getBBox().width;
            ticons = this.icons;
            var info = this.getRouterAndInnerNetSize(json);
            rline = router;
            if (info.size > 0) {
                rline = ticons.line("", 2, [xx, yy + 40, Topo.ROUTER_TO_LINE_MARGIN]);
            }
        }
        var routerInfo = {
            "x": xx,
            "y": firewallInfo.y,
            "node": router,
            "rline": rline
        };
        this.router = routerInfo;
        this.refreshCaversSize(rline);
        return router;
    };

    //画路由和内部网络
    Topo.prototype.drawRouterAndInnerNetLines = function (routerInfo, json) {
        var rlineBox = this.getNodeBBox(routerInfo, "rline");
        var xx = rlineBox.x + rlineBox.width;
        var yy = routerInfo.y + 40;

        var info = this.getRouterAndInnerNetSize(json);
        if (info.size <= 0) {
            return;
        }
        var points = [];

        var i = 0;
        //如果是奇数
        if (info.size % 2) {
            for (i = 1; i <= info.size; i = i + 1) {
                if (i * 2 < info.size + 1) {
                    points.push({
                        "x": xx,
                        "y": yy - (((info.size + 1) / 2) - i) * Topo.NETWORK_ERECK_MARGIN
                    });
                    continue;
                }
                if (i * 2 === info.size + 1) {
                    points.push({ //中心点
                        "x": xx,
                        "y": yy
                    });
                    continue;
                }
                if (i * 2 > info.size + 1) {
                    points.push({
                        "x": xx,
                        "y": yy + ((i - (info.size + 1) / 2)) * Topo.NETWORK_ERECK_MARGIN
                    });
                    continue;
                }
            }
        } else {
            for (i = 1; i <= info.size; i = i + 1) {
                if (i * 2 < info.size) {
                    points.push({
                        "x": xx,
                        "y": yy - ((info.size / 2) - i) * Topo.NETWORK_ERECK_MARGIN - Topo.NETWORK_ERECK_MARGIN / 2
                    });
                    continue;
                }
                if (i * 2 === info.size) {
                    points.push({ //中心点
                        "x": xx,
                        "y": yy - Topo.NETWORK_ERECK_MARGIN / 2
                    });
                    continue;
                }
                if (i * 2 > info.size) {
                    points.push({
                        "x": xx,
                        "y": yy + (i - info.size / 2 - 1) * Topo.NETWORK_ERECK_MARGIN + Topo.NETWORK_ERECK_MARGIN / 2
                    });
                }
            }
        }
        var ticons = this.icons;
        var length = Topo.NETWORK_ERECK_MARGIN * (info.size - 1) + 60;
        var line = ticons.line("", 4, [xx, yy, undefined, length]);
        ticons.trans(line, 0, -(length / 2));

        var jsonItem = null;
        for (i = 0; i < points.length; i = i + 1) {
            jsonItem = info.routerNet[i];
            this.drawRouterAndInnerNet(points[i], jsonItem, json);
        }
    };

    Topo.prototype.getNetworkLineName = function (jsonItem) {
        var title = "";
        if (jsonItem.subnetInfo && jsonItem.subnetInfo[0]) {
            title = jsonItem.subnetInfo[0].subnetAddr + "/" + jsonItem.subnetInfo[0].subnetPrefix;
        }
        var vlan = jsonItem.vlan;
        if (vlan != undefined || vlan != null) {
            vlan = parseInt(vlan, 10);
            title += (vlan > 4095 ? " vxlanId:" : " vlanId:") + vlan;
        }
        return title;
    };

    //画一条路由网络或者内部网络
    Topo.prototype.drawRouterAndInnerNet = function (point, jsonItem, json) {
        var self = this;
        var xx = point.x;
        var yy = point.y;
        var ticons = this.icons;
        var type = jsonItem.networkType;
        if (String(type) !== "2" && String(type) !== "3" && String(type) !== "more23") {
            return;
        }
        ticons.line("", 4, [xx, yy, Topo.ROUTER_LINE_TO_NETWORK_MARGIN]);

        //画一个路由网络或者内部网络的图元
        xx = xx + Topo.ROUTER_LINE_TO_NETWORK_MARGIN;
        var network = null;
        if (String(type) === "3") {
            network = ticons.routerNetwork(jsonItem.name, 14);
            ticons.trans(network, xx, yy - 26);
        }
        if (String(type) === "2") {
            network = ticons.innerNetwork(jsonItem.name, 14);
            ticons.trans(network, xx, yy - 26);
        }
        if (String(type) === "more23") {
            var isICT = this.options.isICT;
            network = ticons.moreNetwork(jsonItem.name, 14);
            network.effect(function () {
                var $state = $("html").injector().get("$state");
                if (isICT) {
                    $state.go("network.vpcmanager.ictnetwork.vpcnetwork", {
                        "cloud_infras": self.options.cloudInfraId,
                        "vpcId": self.options.vpcId
                    });
                }
                else {
                    $state.go("network.vpcmanager.network", {
                        "cloud_infras": self.options.cloudInfraId,
                        "vpcId": self.options.vpcId
                    });
                }

            });
            ticons.trans(network, xx, yy - 26);
        }

        var networkBox = this.getNodeBBox({
            "node": network[0]
        });
        xx = networkBox.x + networkBox.width;
        var title = this.getNetworkLineName(jsonItem);
        ticons.line(title, 4, [xx, yy, Topo.NETWORK_LINE_RIGHT]);

        xx = xx + Topo.VM_TO_LINE_HEAD;
        var pointi = {
            "x": xx,
            "y": yy
        };
        var vmsi = this.drawVMs(pointi, jsonItem, json);

        var networkInfo = {
            "x": point.x,
            "y": point.y,
            "network": network,
            "vmsi": vmsi
        };
        this.refreshCaversSize(network);
        return networkInfo;
    };

    Topo.prototype.getNetworkLineRight = function (json) {
        //获取最长的虚拟机个数，然后设置其长度
        var len = Topo.NETWORK_LINE_RIGHT;
        if (!json) {
            return len;
        }
        var networkInfoList = json.networkInfoList;
        if (!networkInfoList) {
            return len;
        }
        var size = networkInfoList.length;
        if (size <= 0) {
            return len;
        }
        var item;
        var vmInfo;
        var mvSize = 0;
        var maxNum = 0;
        for (var i = size; i--;) {
            item = networkInfoList[i];
            if (!item) {
                continue;
            }
            vmInfo = item.vmInfo;
            if (!vmInfo) {
                continue;
            }
            mvSize = vmInfo.length;
            maxNum = maxNum > mvSize ? maxNum : mvSize;
        }
        if (maxNum <= 5) {
            return len;
        }
        return maxNum * Topo.VM_HORIZ_MARGIN + 20;
    };

    //画直连网络线
    Topo.prototype.drawDirecterNetline = function (cloudInfo, json) {
        var cloudBox = this.getNodeBBox(cloudInfo);
        var xx = cloudBox.x + cloudBox.width + Topo.CLOUD_DIRECTNETWORK_MARGIN;
        var yy = cloudInfo.y;

        var info = this.getRouterAndInnerNetSize(json);
        var length = Topo.NETWORK_ERECK_MARGIN * (info.size - 1) + 60; //内部和路由网络的总高度
        length = length / 2;

        var outerInfo = this.getOuterNetSize(json);
        if (outerInfo.size <= 0) {
            return;
        }
        var points = [];
        var i = 0;
        for (i = 1; i <= outerInfo.size; i = i + 1) {
            points.push({
                "x": xx,
                "y": yy + length + Topo.NETWORK_ERECK_MARGIN * i
            });
        }
        length += outerInfo.size * Topo.NETWORK_ERECK_MARGIN;

        //连线
        var ticons = this.icons;
        ticons.line("", 2, [xx, yy + 40, undefined, length]);
        var jsonItem = null;
        for (i = 0; i < points.length; i = i + 1) {
            jsonItem = outerInfo.outerNet[i];
            this.drawDirecterNet(points[i], jsonItem, json);
        }
    };

    //画直连网络
    Topo.prototype.drawDirecterNet = function (point, jsonItem, json) {
        var self = this;
        var xx = point.x;
        var yy = point.y;
        var ticons = this.icons;
        var sublength = 20;
        if (this.hasFirewallNode(json)) {
            sublength += (60 + Topo.FIREWALL_TO_ROUTER_MARGIN);
        }
        if (this.hasRouterNode(json)) {
            sublength += 60 + Topo.ROUTER_TO_LINE_MARGIN;
        }
        if (this.getRouterAndInnerNetSize(json).size > 0) {
            sublength += (90 + Topo.ROUTER_LINE_TO_NETWORK_MARGIN);
        }
        var line = null;
        if (String(jsonItem.networkType) === "more1") {
            ticons.line("", 4, [xx, yy, Topo.ROUTER_LINE_TO_NETWORK_MARGIN]);
            //画一个路由网络或者内部网络的图元
            xx = xx + Topo.ROUTER_LINE_TO_NETWORK_MARGIN;
            var network = ticons.moreNetwork(jsonItem.name, 14);
            var isICT = this.options.isICT;
            network.effect(function () {
                var $state = $("html").injector().get("$state");
                if (isICT) {
                    $state.go("network.vpcmanager.ictnetwork.directnetwork", {
                        "cloud_infras": self.options.cloudInfraId,
                        "vpcId": self.options.vpcId
                    });
                }
                else {
                    $state.go("network.vpcmanager.network", {
                        "cloud_infras": self.options.cloudInfraId,
                        "vpcId": self.options.vpcId
                    });
                }

            });
            ticons.trans(network, xx, yy - 26);
            var networkBox = network.getBBox();
            xx = networkBox.x + networkBox.width;
            var line = ticons.line("", 4, [xx, yy, Topo.NETWORK_LINE_RIGHT + sublength - networkBox.width - Topo.ROUTER_LINE_TO_NETWORK_MARGIN]);
        }
        else {
            var title = this.getNetworkLineName(jsonItem);
            var line = ticons.line(title, 4, [xx, yy, Topo.NETWORK_LINE_RIGHT + sublength]);
            ticons.text(jsonItem.name, xx + Topo.DIRECT_NET_MARGIN_LEFT, yy - 12, line, 14);
        }

        xx = xx + Topo.VM_TO_LINE_HEAD * 3;
        var pointi = {
            "x": xx,
            "y": yy
        };
        var vmsi = this.drawVMs(pointi, jsonItem, json);

        var networkInfo = {
            "x": point.x,
            "y": point.y,
            "line": line,
            "vmsi": vmsi
        };
        this.refreshCaversSize(line);
        return networkInfo;
    };

    //画网络上的虚拟机
    Topo.prototype.drawVMs = function (point, jsonItem, json) {
        var vms = jsonItem.vmInfo;
        if (!vms) {
            return;
        }
        var xx = point.x;
        var yy = point.y;
        var ticons = this.icons;
        var length = vms.length;
        var vmsi = [];
        var sets = this.paper.set();
        var i = 0;
        var vm = null;
        var item = null;
        for (i = 0; i < length; i = i + 1) {
            item = vms[i];
            if (!item) {
                continue;
            }
            vm = ticons.vm(item.name, 13);
            if (item.type === "more") {
                vm.effect(Topo.bind(this, this.gotoVMList));
            }
            ticons.trans(vm, xx, yy - 46); //46为偏移量
            vmsi.push(vm);
            sets.push(vm);
            xx = xx + Topo.VM_HORIZ_MARGIN;
        }
        this.refreshCaversSize(sets);
        return vmsi;
    };

    Topo.prototype.refreshCaversSize = function (graph) {
        if (!graph) {
            return;
        }
        var graphBBox = graph.getBBox();
        var xx = graphBBox.x2;
        var yy = graphBBox.y2;
        var currentWidth = this.currentWidth;
        var currentHeight = this.currentHeight;
        if (currentWidth < xx) {
            this.currentWidth = xx;
        }
        if (currentHeight < yy) {
            this.currentHeight = yy;
        }
        this.paper.setSize(this.currentWidth, this.currentHeight);
    };
    Topo.bind = function (scope, funct) {
        return function () {
            funct.apply(scope, arguments);
        }
    };
    Topo.prototype.gotoVMList = function () {
        var self = this;
        var injector = $("html").injector();
        var $state = injector.get("$state");
        $state.go("ecs.vm", {
            "cloudInfraId": self.options.cloudInfraId,
            "vpcId": self.options.vpcId
        });
    };

    //每一个网络节点右侧的线长度为：400px
    Topo.NETWORK_LINE_RIGHT = 700;

    //每一条网络线占据的竖直空间为 100px
    Topo.NETWORK_ERECK_MARGIN = 100;

    //每一台虚拟机占据的水平空间为60px
    Topo.VM_HORIZ_MARGIN = 100;

    //首台虚拟机与网络线头部的距离 70px
    Topo.VM_TO_LINE_HEAD = 70;

    //云节点距离左边画布的距离 38px
    Topo.CLOUD_LEFT_MARGIN = 38;

    //云节点和红线之间的距离 30px
    Topo.CLOUD_REDLINE_MARGIN = 20;
    Topo.CLOUD_REDLINE_HEIGHT = 20;

    //云节点和防火墙之间的距离 103px
    Topo.CLOUD_FIREWALL_MARGIN = 103;

    //云节点和直连网络线之间的距离 45px
    Topo.CLOUD_DIRECTNETWORK_MARGIN = 45;

    //防火墙和路由器之间的距离 50px
    Topo.FIREWALL_TO_ROUTER_MARGIN = 50;

    //路由器到路由器线之间的距离 65px
    Topo.ROUTER_TO_LINE_MARGIN = 65;

    //路由器线和网线节点之间的距离 25px
    Topo.ROUTER_LINE_TO_NETWORK_MARGIN = 25;

    //直连网络名称与坚线之间的距离
    Topo.DIRECT_NET_MARGIN_LEFT = 50;

    return Topo;
});
