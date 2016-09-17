define(["./Graph", "./GenenalNameUtil"], function (Graph, GenenalNameUtil) {
    function Sidebar(mainGraph) {
        //主画布区的mxGraph对象
        this.mainGraph = mainGraph;
        this.graph = new Graph(document.createElement('div'), null, null, null);
        this.graph.foldingEnabled = false;
        this.graph.autoScroll = true;
        this.graph.setConnectable(false);
        this.graph.view.setTranslate(this.thumbBorder, this.thumbBorder);
        this.graph.setEnabled(true);

        if (this.shiftThumbs) {
            this.graph.view.canvas.setAttribute('transform', 'translate(1, 1)');
        }
        this.init();
    }

    Sidebar.prototype.init = function () {};

    /**
     * thumb的延迟
     */
    Sidebar.prototype.thumbBorder = 2;
    Sidebar.prototype.SOFTWARE_VIRTUAL_HEIGHT = 45; // 软件虚拟高度
    Sidebar.prototype.SOFTWARE_ACTUAL_HEIGHT = 40; // 软件实际高度
    Sidebar.prototype.VM_PADDING_HEIGHT = 35; // 虚拟机padding的高度
    Sidebar.prototype.VM_HEIGHT = 70; // 虚拟机整体的高度

    /**
     * 创建一个Drop处理处理函数
     */
    Sidebar.prototype.createDropHandler = function (cell, allowSplit) {
        if (cell.type === "VmTemplate" || cell.type === "ScalingGroup") {
            return this.createTemplateDropHandler(cell, allowSplit);
        }
        if (cell.type === "Network") {
            return this.createNetworkDropHandler(cell, allowSplit);
        }
        if (cell.type === "Software") {
            return this.createSoftwareScriptDropHandler(cell, allowSplit);
        }
        if (cell.type === "Script") {
            return this.createSoftwareScriptDropHandler(cell, allowSplit);
        }
        if (cell.type == "Host"){
            return this.createHostDropHandler(cell, allowSplit);
        }
    };

    /**
     * 创建一个虚拟机模板拖动的回调函数
     */
    Sidebar.prototype.createTemplateDropHandler = function (cell, allowSplit) {
        return function (graph, evt, target, x, y) {
            graph.stopEditing(true);
            // 如果资源达到三百个不能再添加
            var model = graph.getModel();
            var newCell = model.cloneCell(cell);
            newCell.setGeometry(new mxGeometry(x, y, cell.geometry.width, cell.geometry.height));

            // 给资源名称加一，同时需要判断资源名称是否重复
            var resourceName = "";
            while (true) {
                resourceName = GenenalNameUtil.genSerialName(cell.type);
                break;
            }
            var displayName = GenenalNameUtil.displayResourceName(resourceName, cell.type);
            newCell.setValue(displayName);


            model.beginUpdate();
            try {
                graph.addCell(newCell);
            } finally {
                model.endUpdate();
            }
            graph.addTemplateNodeOverlayStyle(newCell);

            //处理资源
            var resourceId = TemplateUtils.createId();
            var resource = TemplateDefine.createResource(graph.template, [], newCell.type, resourceName, resourceId);
            newCell.resource = resource;
            newCell.resourceId = resourceId;
            graph.template.addResource(resource);

            //必须放到最后，触发graph的seleceHandler事件
            graph.setSelectionCell(newCell);
        };
    };

    /**
     * 创建一个拖动host节点的回调函数
     */
    Sidebar.prototype.createHostDropHandler = function (cell) {
        return function (graph, evt, target, x, y) {
            graph.stopEditing(true);
            var model = graph.getModel();
            var newCell = model.cloneCell(cell);
            newCell.setGeometry(new mxGeometry(x, y, cell.geometry.width, cell.geometry.height));
            // 给资源名称加一，同时需要判断资源名称是否重复
            var resourceName = "";
            while (true) {
                resourceName = GenenalNameUtil.genSerialName(cell.type);
                break;
            }
            var displayName = GenenalNameUtil.displayResourceName(resourceName, cell.type);
            newCell.setValue(displayName);
            model.beginUpdate();
            try {
                graph.addCell(newCell);
            } finally {
                model.endUpdate();
            }

            //生成资源
            var resourceId = TemplateUtils.createId();
            var resource = TemplateDefine.createResource(graph.template, [], cell.type, resourceName, resourceId);
            newCell.resource = resource;
            newCell.resourceId = resourceId;
            graph.template.addResource(resource);

            //必须放到最后，触发graph的seleceHandler事件
            graph.setSelectionCell(newCell);
        };
    };

    /**
     * 创建一个拖动网络节点的回调函数
     */
    Sidebar.prototype.createNetworkDropHandler = function (cell) {
        return function (graph, evt, target, x, y) {
            graph.stopEditing(true);
            var model = graph.getModel();
            var newCell = model.cloneCell(cell);
            newCell.setGeometry(new mxGeometry(x, y, cell.geometry.width, cell.geometry.height));
            // 给资源名称加一，同时需要判断资源名称是否重复
            var resourceName = "";
            while (true) {
                resourceName = GenenalNameUtil.genSerialName(cell.type);
                break;
            }
            var displayName = GenenalNameUtil.displayResourceName(resourceName, cell.type);
            newCell.setValue(displayName);
            model.beginUpdate();
            try {
                graph.addCell(newCell);
            } finally {
                model.endUpdate();
            }

            //生成资源
            var resourceId = TemplateUtils.createId();
            var resource = TemplateDefine.createResource(graph.template, [], cell.type, resourceName, resourceId);
            newCell.resource = resource;
            newCell.resourceId = resourceId;
            graph.template.addResource(resource);

            //必须放到最后，触发graph的seleceHandler事件
            graph.setSelectionCell(newCell);
        };
    };


    /**
     * 创建一个拖动软件包&脚本的回调函数
     */
    Sidebar.prototype.createSoftwareScriptDropHandler = function (cell) {
        return mxUtils.bind(this, function (graph, evt, target, x, y) {
            graph.stopEditing(true);
            var offset = mxUtils.getOffset(graph.container);
            var parent = graph.getSwimlaneAt(evt.clientX - offset.x + $(graph.container).scrollLeft(), evt.clientY - offset.y + $(graph.container).scrollTop());
            var pstate = graph.getView().getState(parent);
            if (parent == null || pstate == null || (parent.type !== "VmTemplate" && parent.type !== "ScalingGroup")) {
                return;
            }
            // 记录 当前软件的个数
            var childCount = graph.model.getChildCount(parent);
            if (childCount >= 50) {
                // 软件&脚本个数已经到达50个。
                return;
            }
            var model = graph.getModel();
            var newCell = model.cloneCell(cell);
            newCell.setConnectable(false);
            // 软件在VM中左边距10, 35为VM padding的高度
            newCell.setGeometry(new mxGeometry(10, this.VM_PADDING_HEIGHT + 5, cell.geometry.width, cell.geometry.height));
            // 给资源名称加一，同时需要判断资源名称是否重复
            var resourceName = "";
            while (true) {
                resourceName = GenenalNameUtil.genSerialName(cell.type);
                break;
            }
            var displayName = GenenalNameUtil.displayResourceName(resourceName, cell.type);
            newCell.setValue(displayName);

            model.beginUpdate();
            try {
                if (childCount != 0) {
                    //移动软件或者脚本的顺序，软件&脚本下移
                    for (var i = 0; i < childCount; i++) {
                        var item = parent.getChildAt(i);
                        item.geometry.y += this.SOFTWARE_VIRTUAL_HEIGHT;
                        model.add(parent, item, i);
                    }
                }
                // 新增软件
                graph.addCell(newCell, parent);
                //注意：10表示 最后一个软件离VM的最底边的距离
                parent.geometry.height = this.VM_PADDING_HEIGHT + (childCount + 1) * this.SOFTWARE_VIRTUAL_HEIGHT + 10;
            } finally {
                model.endUpdate();
            }

            //处理资源
            var resourceId = TemplateUtils.createId();
            var resource = TemplateDefine.createResource(graph.template, [], newCell.type, resourceName, resourceId);
            resource.properties.type = newCell.type;
            newCell.resource = resource;
            newCell.resourceId = resourceId;
            // 将资源添加到容器中
            var parentResource = graph.template.getResourceById(parent.resourceId);
            parentResource.addSoftware(resourceId, resource);
            graph.resetSoftwareInstallOrder(parent);

            //必须放到最后，触发graph的seleceHandler事件
            graph.setSelectionCell(newCell);
        });
    };


    /**
     * 为元素创建一个拖动对象
     */
    Sidebar.prototype.createDragSource = function (elt, dropHandler) {
        var dragSource = mxUtils.makeDraggable(elt, this.mainGraph, dropHandler,
            elt, 0, 0, this.mainGraph.autoscroll, true, true);

        dragSource.getDropTarget = function (graph, x, y) {
            var target = mxDragSource.prototype.getDropTarget.apply(this, arguments);
            if (!graph.isValidRoot(target)) {
                target = null;
            }
            return target;
        };
        return dragSource;
    };

    /**
     * 对给定的元素创建一个可拖动的对象
     */
    Sidebar.prototype.createVertexTemplate = function (elt, type, width, height, value) {
        var styleString = "";
        if (type === "VmTemplate") {
            styleString = "VmTemplate";
        }
        if (type === "ScalingGroup") {
            styleString = "ScalingGroup";
        }
        if (type === "Network") {
            styleString = "Network";
        }
        if (type == "Software") {
            styleString = "Software";
        }
        if (type == "Script") {
            styleString = "Script";
        }
        if (type == "Host") {
            styleString = "Host";
        }
        if (type == "Component") {
            styleString = "Component";
        }
        var cell = new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), styleString);
        cell.vertex = true;
        cell.type = type;
        return this.createVertexTemplateFromCell(elt, cell, width, height);
    };

    /**
     * 对给定的Cell创建一个可拖动事件
     */
    Sidebar.prototype.createVertexTemplateFromCell = function (elt, cell, width, height) {
        var ds = this.createDragSource(elt, this.createDropHandler(cell, true));
        return elt;
    };

    return Sidebar;
});
