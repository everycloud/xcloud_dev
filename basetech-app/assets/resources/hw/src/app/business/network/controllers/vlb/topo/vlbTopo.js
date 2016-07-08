/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/raphael",
    "app/services/icons",
    "language/keyID"], function ($, Raphael, icons, i18n) {
    "use strict";

    //计算监控器数，并设定全局画布的大小
    function Topo(id, json, isIT) {
        var monitorInfo = this.getMonitorSize(json);
        var caversSize = this.getCaversSize(monitorInfo.size);
        var paper = Raphael(id, caversSize.width, caversSize.height);
        this.isIT = isIT;
        this.icons = new icons(paper);
        this.paper = paper;
        //画布在动态画节点时的总宽度
        this.currentWidth = caversSize.width;
        //画布在动态画节点时的总高度
        this.currentHeight = caversSize.height;
        Topo.MONITOR_LINE_RIGHT = this.getMonitorLineRight(json);

        //画云节点
        this.drawCloudNode(json);
        this.drawDispatchNode(this.cloud, json);
    }

    //获取画布大小
    Topo.prototype.getCaversSize = function (sizes) {
        //215为layout的宽度，20为内容区的margin
        var width = parseInt($("#service-content>div").css("width"), 10) - 215 - 20;
        return {
            "width": width,
            "height": Topo.MONITOR_ERECK_MARGIN * sizes
        };
    };

    //获取外部IP信息
    Topo.prototype.getCloudInfo = function (json) {
        return {
            "extIP": json.slbVmInfo.extIP
        };
    };
    //获取除直连网络外的其它网络数，并按照：路由网络->内部网络排序
    Topo.prototype.getMonitorSize = function (json) {
        var listeners = json.listeners;
        var size = 0;
        if (listeners) {
            size = listeners.length;
        }
        return {
            "size": size,
            "listeners": listeners
        };
    };

    //画云节点
    Topo.prototype.drawCloudNode = function (json) {
        var cloudInfom = this.getCloudInfo(json);
        var info = this.getMonitorSize(json);
        //云节点需要平移的距离
        var xx = Topo.CLOUD_LEFT_MARGIN;
        var yy = (info.size * Topo.MONITOR_ERECK_MARGIN) / 2 + 30; //整体下移30像素
        var icons = this.icons;
        var cloud = icons.cloud(cloudInfom.extIP);
        icons.trans(cloud, xx, yy - 40);
        var cloudInfo = {
            "x": xx,
            "y": yy,
            "node": cloud
        };
        this.cloud = cloudInfo;
        this.refreshCaversSize(cloud);
        return cloudInfo;
    };

    //画防火墙节点
    Topo.prototype.drawDispatchNode = function (cloudInfo, json) {
        var cloudBox = cloudInfo.node.getBBox();
        var xx = cloudBox.x + cloudBox.width;
        var yy = cloudInfo.y;

        //连线
        var icons = this.icons;
        icons.line("", 4, [xx, yy, Topo.CLOUD_DISPATCH_MARGIN]);

        xx = xx + Topo.CLOUD_DISPATCH_MARGIN;
        //画分发器左侧线
        var info = this.getMonitorSize(json);
        var length = Topo.MONITOR_ERECK_MARGIN * (info.size - 1) + 60;
        var line = icons.line("", 4, [xx, yy, undefined, length]);
        icons.trans(line, 0, -(length / 2));

        var lineBox = line.getBBox();
        xx = xx + lineBox.width + Topo.DISPATCH_PADDING;
        var dispatcher = icons.icon("app/services/icons/dispatcher.svg", {
            "x": xx,
            "y": yy - 30,
            "width": 60,
            "height": 60
        }, line);

        var dispatcherBox = dispatcher.getBBox();
        xx = xx + dispatcherBox.width + Topo.DISPATCH_PADDING;
        var line2 = icons.line("", 4, [xx, yy, undefined, length], dispatcher);
        icons.trans(line2, 0, -(length / 2));

        if (info.size === 0) {
            return;
        }
        xx = xx + lineBox.width;
        var points = [];
        var i = 0;
        //如果是奇数
        if (info.size % 2) {
            for (i = 1; i <= info.size; i++) {
                if (i * 2 < info.size + 1) {
                    points.push({
                        "x": xx,
                        "y": yy - (((info.size + 1) / 2) - i) * Topo.MONITOR_ERECK_MARGIN
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
                        "y": yy + ((i - (info.size + 1) / 2)) * Topo.MONITOR_ERECK_MARGIN
                    });
                    continue;
                }
            }
        } else {
            for (i = 1; i <= info.size; i++) {
                if (i * 2 < info.size) {
                    points.push({
                        "x": xx,
                        "y": yy - ((info.size / 2) - i) * Topo.MONITOR_ERECK_MARGIN - Topo.MONITOR_ERECK_MARGIN / 2
                    });
                    continue;
                }
                if (i * 2 === info.size) {
                    points.push({ //中心点
                        "x": xx,
                        "y": yy - Topo.MONITOR_ERECK_MARGIN / 2
                    });
                    continue;
                }
                if (i * 2 > info.size) {
                    points.push({
                        "x": xx,
                        "y": yy + (i - info.size / 2 - 1) * Topo.MONITOR_ERECK_MARGIN + Topo.MONITOR_ERECK_MARGIN / 2
                    });
                }
            }
        }
        var jsonItem = null;
        for (i = 0; i < points.length; i++) {
            jsonItem = info.listeners[i];
            this.drawListener(points[i], jsonItem, i, json);
        }
    };

    //画一条监控器
    Topo.prototype.drawListener = function (point, jsonItem, i, json) {
        var xx = point.x;
        var yy = point.y;
        var icons = this.icons;
        var line = icons.line("", 4, [xx, yy, Topo.DISPATCHER_LINE_TO_MONITOR_MARGIN]);

        //画一个路由网络或者内部网络的图元
        xx = xx + Topo.DISPATCHER_LINE_TO_MONITOR_MARGIN;
        var listener = icons.icon("app/services/icons/listener.svg", {
            "x": xx,
            "y": yy - 30,
            "width": 120,
            "height": 60
        });
        var listenerBox = listener.getBBox();

        var lbName = (!this.isIT) ? i18n.lb_term_listen_label : (i18n.lb_term_listen_label + "-" + i + " " + this.transStatusToUiStatus(jsonItem.status));
        var title = icons.text(lbName, listenerBox.x + 60, yy - 8, listener);
        if(this.isIT){
            var title2 = icons.text(jsonItem.protocol + " " + jsonItem.port +"/"+jsonItem.backPort, listenerBox.x + 60, yy + 8, listener);
        }else{
            var title2 = icons.text(jsonItem.protocol + " " + jsonItem.port, listenerBox.x + 60, yy + 8, listener);
        }


        xx = listenerBox.x + listenerBox.width + 2;
        var line2 = icons.line("", 4, [xx, yy, Topo.MONITOR_LINE_RIGHT]);

        xx = xx + Topo.VM_TO_LINE_HEAD;
        var pointi = {
            "x": xx,
            "y": yy
        };
        var vmsi = this.drawVMs(pointi, jsonItem, json);

        var monitorInfo = {
            "x": point.x,
            "y": point.y,
            "monitor": listenerBox,
            "vmsi": vmsi
        };
        this.refreshCaversSize(listener);
        return monitorInfo;
    };

    //画网络上的虚拟机
    Topo.prototype.drawVMs = function (point, jsonItem, json) {
        var xx = point.x;
        var yy = point.y;
        var icons = this.icons;
        var vms = jsonItem.bindingVM;
        if (!vms || vms.length === 0) {
            return;
        }

        var length = vms.length;
        var vmsi = [];
        var sets = this.paper.set();
        var vmUIStatus = "";
        for (var i = 0; i < length; i++) {
            vmUIStatus = this.transVmHealthyToUiStatus(vms[i].status);
            var vm = icons.vm(vms[i].vmIP, 15);
            var titleUI = icons.getDisplayText(vmUIStatus, 15);
            var t = icons.text(titleUI, 28, -28);
            t.tooltip(vmUIStatus);
            vm.push(t.pop());

            icons.trans(vm, xx, yy - 46); //46为偏移量
            vmsi.push(vm);
            sets.push(vm);
            xx = xx + Topo.VM_HORIZ_MARGIN;
        }
        this.refreshCaversSize(sets);
        return vmsi;
    };

    Topo.prototype.getMonitorLineRight = function (json) {
        //获取最长的虚拟机个数，然后设置其长度
        var len = Topo.MONITOR_LINE_RIGHT;
        if (!json) {
            return len;
        }
        var listeners = json.listeners;
        if (!listeners) {
            return len;
        }
        var size = listeners.length;
        if (size <= 0) {
            return len;
        }
        var item;
        var vmInfo;
        var mvSize = 0;
        var maxNum = 0;
        for (var i = size; i--;) {
            item = listeners[i];
            if (!item) {
                continue;
            }
            vmInfo = item.bindingVM;
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

    // VLB 状态转换
    Topo.prototype.transStatusToUiStatus = function (status) {
        if (status === "READY") {
            return i18n.common_term_running_value;
        } else if (status === "DISABLE") {
            return i18n.common_term_stoped_value;
        } else if (status === "FAULT") {
            return i18n.common_term_trouble_label;
        } else if (status === "ERROR") {
            return i18n.common_term_fail_label;
        } else if (status === "BUILD") {
            return i18n.common_term_executing_value;
        } else {
            return i18n.common_term_unknown_value;
        }
    };

    Topo.prototype.transVmHealthyToUiStatus = function (status) {
        if (1 === status) {
            return i18n.common_term_health_value; // 健康 Healthy
        }
        else if (2 === status) {
            return i18n.common_term_notHealth_value; // 不健康 UNHealthy
        }
        else {
            return i18n.common_term_unknown_value; // 未知 unknown
        }
    };

    //每一个监控节点右侧的线长度为：400px
    Topo.MONITOR_LINE_RIGHT = 600;

    //每一条网络线占据的竖直空间为 110px
    Topo.MONITOR_ERECK_MARGIN = 110;

    //每一台虚拟机占据的水平空间为110px
    Topo.VM_HORIZ_MARGIN = 110;

    //首台虚拟机与网络线头部的距离 70px
    Topo.VM_TO_LINE_HEAD = 70;

    //云节点距离左边画布的距离 38px
    Topo.CLOUD_LEFT_MARGIN = 38;

    //云节点和分发器之间的距离 60px
    Topo.CLOUD_DISPATCH_MARGIN = 60;

    //分发器和监控器节点之间的距离 25px
    Topo.DISPATCHER_LINE_TO_MONITOR_MARGIN = 25;

    //分发器箭头与两边的线间距 2px
    Topo.DISPATCH_PADDING = 2;

    return Topo;
});
