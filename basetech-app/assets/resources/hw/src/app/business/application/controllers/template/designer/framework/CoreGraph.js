define(["./Graph", "./mxVertexToolHandler", "./GenenalNameUtil"], function (Graph, mxVertexToolHandler, GenenalNameUtil) {
    mxLog.show = function() {
    	return;
    }
		
    function CoreGraph(container, model, renderHint, stylesheet) {
        Graph.call(this, container, model, renderHint, stylesheet);
        //是否可编辑
        this.setEnabled(true);
        //不允许编辑Cell
        this.setCellsEditable(false);
    }

    mxUtils.extend(CoreGraph, Graph);

    /**
     * 初始化方法，侦听选中事件
     */
    CoreGraph.prototype.init = function (container) {
        Graph.prototype.init.apply(this, arguments);
        this.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, this._selectCellHandle));
    };

    /**
     * 选中节点后的处理函数
     */
    CoreGraph.prototype._selectCellHandle = function (sender, evt) {

    };

    CoreGraph.prototype.softwareVirtualHeight = 45; // 软件虚拟高度
    CoreGraph.prototype.softwareActualHeight = 40; // 软件实际高度
    CoreGraph.prototype.vmPaddingHeight = 35; // 虚拟机padding的高度

    //加载删除图标
    CoreGraph.prototype.createHandler = function (state) {
        if (state != null && this.model.isVertex(state.cell)) {
            return new mxVertexToolHandler(state, new mxPoint(0, 0));
        }
        return Graph.prototype.createHandler.apply(this, arguments);
    };

    /**
     * 为虚拟机Cell添加伸缩组的按钮
     */
    CoreGraph.prototype.addTemplateNodeOverlayStyle = function (templateCell) {
        this.removeCellOverlays(templateCell);
        //操作系统的图标
        var osType = "Windows";
        var image = "/resources/hw/theme/default/images/icon-vm.png";
        var overlay = new mxCellOverlay(new mxImage(image, 32, 32), null);
        overlay.cursor = 'inherit';
        overlay.offset = new mxPoint(0, 16);
        overlay.align = mxConstants.ALIGN_LEFT;
        overlay.verticalAlign = mxConstants.ALIGN_TOP;
        this.addCellOverlay(templateCell, overlay);
        var ScalingGroup = "/resources/hw/theme/default/images/designerbone-del-scalinggroup.png";
        var VmTemplate = "/resources/hw/theme/default/images/designerbone-add-scalinggroup.png";
        var image = templateCell.style === "ScalingGroup" ? ScalingGroup : VmTemplate;
        var overlay = new mxCellOverlay(new mxImage(image, 16, 16), "");
        overlay.cursor = 'hand';
        overlay.offset = new mxPoint(-16, 16);
        overlay.align = mxConstants.ALIGN_RIGHT;
        overlay.verticalAlign = mxConstants.ALIGN_TOP;
        overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
            if (templateCell.style === "VmTemplate") {
                templateCell.style = "ScalingGroup";
                this.createScalingGroupNode(templateCell);
            } else {
                templateCell.style = "VmTemplate";
                this.deleteScalingGroupNode(templateCell);
            }
            this.refresh(templateCell);
            this.setSelectionCell(templateCell);
            this.addTemplateNodeOverlayStyle(templateCell);
            mxEvent.consume(evt);
        }));
        this.addCellOverlay(templateCell, overlay);
    };

    CoreGraph.prototype.createScalingGroupNode = function (mxcell) {
        // 给资源名称加一，同时需要判断资源名称是否重复
        mxcell.type = "ScalingGroup";
        var resourceName = "";
        while (true) {
            resourceName = GenenalNameUtil.genSerialName(mxcell.type);
            break;
        }
        //处理资源
        var resourceId = TemplateUtils.createId();
        var resource = TemplateDefine.createResource(this.template, [], mxcell.type, resourceName, resourceId);
        resource.setVmTemplateId(mxcell.resourceId);
        mxcell.scalinggroup = resource;
        mxcell.scalinggroupId = resourceId;
        this.template.addResource(resource);
    };
    CoreGraph.prototype.deleteScalingGroupNode = function (mxcell) {
        mxcell.type = "VmTemplate";
        TemplateDefine.deleteResource(this.template, mxcell.scalinggroup);
        mxcell.scalinggroup = null;
        mxcell.scalinggroupId = null;
    };
    // 取消虚拟机模板上的缩小按钮
    CoreGraph.prototype.isCellFoldable = function (cell, collapse) {
        return !this.isSwimlane(cell) && cell.getChildCount() > 0;
    };

    /**
     * 重载插入边接口
     */
    CoreGraph.prototype.addEdge = function (edge, parent, source, target, index) {
        if (!target || !source) {
            return null;
        }
        // 只支持VM连接到Network, 判断资源是否连接自己
        if ((source.type !== "VmTemplate" && source.type !== "ScalingGroup") || target.type !== "Network" || source.resourceId === target.resourceId) {
            return null;
        }

        //判断是否存在连线
        var connectResource = this.template.getConnsByResId(source.resourceId, target.resourceId);
        if (connectResource) {
            return null;
        }

        //判断是否有可用的网卡
        var sourceResource = this.template.getResourceById(source.resourceId);
        if (!sourceResource || !sourceResource.hasAvailableNics()) {
            return null;
        }

        var connectionId = TemplateUtils.createId();
        var connectResource = TemplateDefine.createConnection(this.template, source.resourceId, target.resourceId, "", connectionId);
        edge.resource = connectResource;
        edge.lineName = connectionId;

        var nics = sourceResource.getNics().getArray();
        for (var i = 0; i < nics.length; i++) {
            if (nics[i] && nics[i].type === Constant.NICTYPE && nics[i].portGroupId && (nics[i].portGroupId.refId === null)) {
                nics[i].portGroupId.refId = target.resourceId;
                break;
            }
        }
        return Graph.prototype.addEdge.apply(this, arguments);
    };

    CoreGraph.prototype.moveCells = function (cells, dx, dy, clone, target, evt) {
        //单独的边不允许移动
        if (cells.length === 1 && cells[0].isEdge()) {
            return false;
        }
        //如果按住shift键，多选了软件包或者脚本，也不允许拖动
        for (var j = 0; j < cells.length; j++) {
            if ((cells[j].type === "Software" || cells[j].type === "Script") && cells.length >= 2) {
                return false;
            }
        }
        if (cells.length === 1 && (cells[0].type === "Software" || cells[0].type === "Script")) {
            //移动的是虚拟机模板中的一个软件或者脚本
            var offset = mxUtils.getOffset(this.container);
            var parent = this.getCellAt(evt.clientX - offset.x + $(this.container).scrollLeft(), evt.clientY - offset.y + $(this.container).scrollTop());
            if (!parent) {
                return false;
            }

            var cell = cells[0];
            var parentCell = cell.getParent();
            //不能将一个虚拟机下的软件或者脚本拖到另一个虚拟机下
            if (parentCell.resourceId !== parent.resourceId) {
                return false;
            }

            var resource = this.template.getResourceById(cell.resourceId);
            if (!resource || !resource.graph) {
                return false;
            }
            resource.graph.position.x = resource.graph.position.x + dx;
            resource.graph.position.y = resource.graph.position.y + dy;
            for (var i = 0; i < cells.length; i++) {
                //只移动资源，不移动线
                if (this.model.isVertex(cells[i])) {
                    this.translateCell(cells[i], dx, dy)
                }
            }

        }
        return Graph.prototype.moveCells.apply(this, arguments);
    };

    /**
     * 删除资源，主要处理软件包和脚本
     */
    CoreGraph.prototype.deleteCells = function (cells) {
        if (!cells) {
            return;
        }
        var model = this.getModel();
        model.beginUpdate();
        try {
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (model.isEdge(cell) || (cell.type !== "Software" && cell.type !== "Script")) {
                    this.removeCells([cell]);
                    continue;
                }
                //以下是删除software或者Script对象
                var parent = cell.getParent();
                // 记录待删除的cell位置
                var height = this.softwareVirtualHeight;
                var delCellY = cell.geometry.y;


                this.removeCells([cell]);

                var childCount = model.getChildCount(parent);
                // 重设虚拟机模板的高度
                if (childCount <= 0) {
                    parent.geometry.height = 70;
                } else {
                    parent.geometry.height -= height;

                    // 重设vm下的所有子节点的位置
                    var children = model.getChildCells(parent, true, false);
                    for (var index in children) {
                        var item = children[index];
                        item.geometry.x = 10;
                        if (item.geometry.y > delCellY) {
                            item.geometry.y = item.geometry.y - height;
                        }
                        this.addCell(item, parent);
                    }
                }
                this.resetSoftwareInstallOrder(parent);
            }
        } finally {
            model.endUpdate();
        }
    };

    /**
     * 根据所见图形，设置虚拟机中软件的安装顺序. 增加软件、删除软件、拖放排序时调用. 安装顺序自下至上从0开始编号.
     * 说明：打开现有模板时，软件的安装顺序默认值为null.
     */
    CoreGraph.prototype.resetSoftwareInstallOrder = function (cell) {
        if (!cell || (cell.type !== "VmTemplate" && cell.type !== "ScalingGroup")) {
            return;
        }
        var total = this.model.getChildCount(cell);
        var curVM = this.template.getResourceById(cell.resourceId);

        for (var i = 0; i < total; i++) {
            var item = cell.getChildAt(i);
            var curSoftware = curVM.getSoftwareByName(item.resource.name);
            if (curSoftware) {
                var sn = parseInt((item.geometry.y - this.vmPaddingHeight) / this.softwareVirtualHeight);
                curSoftware.installOrder = total - 1 - sn;
            }
        }
    };

    /**
     * 删除cells
     */
    CoreGraph.prototype.removeCells = function (cells, includeEdges) {
        if (this.isSelectionEmpty() || !cells) {
            return;
        }
        var model = this.getModel();
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (model.isVertex(cell)) {
                if (cell.type === "VmTemplate" || cell.type === "ScalingGroup") {
                    this.template.removeVMTemplateResource(cell);
                    continue;
                }
                if (cell.type === "Network") {
                    this.template.removeNetworkResource(cell);
                    continue;
                }
                if (cell.type === "Software" || cell.type === "Script") {
                    this.template.removeSoftwareResource(cell);
                    continue;
                }
            } else if (model.isEdge(cell)) {
                this.template.removeEdgeResource(cell);
            } else {
                continue;
            }
        }
        model.beginUpdate();
        try {
            Graph.prototype.removeCells.apply(this, arguments);
        } finally {
            model.endUpdate();
        }
    };

    /**
     * @param name 名称
     * @param selectionCell 要更新的cell，如果不传入，则去更新用户选中的cell
     */
    CoreGraph.prototype.updateCellName = function (name, cell) {
        if (!cell || !name || cell.isEdge()) {
            return;
        }
        var name = GenenalNameUtil.displayResourceName(name, cell.type);
        this.getModel().beginUpdate();
        try {
            cell.setValue(name);
        } finally {
            this.refresh(cell);
            this.getModel().endUpdate();
        }
    };

    /**
     * 反解析 将资源(portgroup, vmtemplate)添加到画布上
     * @param resource 已经生成的资源
     * @param parentId cell的ID
     * @param x 横坐标
     * @param y 纵坐标
     * @param w 宽度
     * @param h 高度
     * @param style cell的css样式
     */
    CoreGraph.prototype.redrawResource = function (templateDef, resource, parentId, x, y, w, h, type) {
        var template = this.template;
        // 有效性判断，需要判断x/y/w/h是否为正整数
        if (resource == null || !TemplateUtils.isNumber(x) || !TemplateUtils.isNumber(y) || !TemplateUtils.isNumber(w) || !TemplateUtils.isNumber(h)) {
            return;
        }

        // 设置资源对象的位置，大小
        var position = new PositionDefine(parseInt(x), parseInt(y));
        var size = new SizeDefine(parseInt(w), parseInt(h));

        resource.graph = new GraphDefine(resource.id);
        resource.graph.parentID = parentId;
        resource.graph.position = position;
        resource.graph.size = size;

        var name = resource.getName();
        name = GenenalNameUtil.displayResourceName(name, resource.type);
        var resourceCell = new mxCell(name, new mxGeometry(position.x, position.y, size.w, size.h), type);

        // 属性列表默认值
        resourceCell.attributes = resource.genCellAttr();
        // 如果是查看状态,则不可以连线
        resourceCell.setConnectable(true);
        resourceCell.setVertex(true);
        resourceCell.type = type;
        resourceCell.resourceId = resource.id;
        resourceCell.resource = resource;

        // 把资源加入到template中
        template.addResource(resource);

        // 更新最大的资源序列号
        GenenalNameUtil.updateMaxSerial();

        // 返回把将要添加画布中的cell
        return resourceCell;
    };

    CoreGraph.prototype.redrawEdge = function (connection, srcResource, targetResource) {
        GenenalNameUtil.updateMaxSerial();
        // 初始化连线
        var geo = new mxGeometry();
        var edge = new mxCell('');
        geo.relative = true;
        edge.setEdge(true);
        edge.setGeometry(geo);
        edge.lineName = connection.getConnectionId();
        edge.resource = connection;

        edge.sourceId = srcResource.id;
        edge.targetId = targetResource.id;
        return edge;
    };

    /**
     * 反解析 绘制vmtemplate下的software
     * @param resource vmtemplate资源对象
     * @param vmtemplateCell vmtemplate资源对象对应的cell
     */
    CoreGraph.prototype.redrawSoftware = function (resource, vmtemplateCell) {
        // 有效性判断
        if (resource == null || resource.type != "VmTemplate") {
            return;
        }
        var templateDefine = this.template;

        // 获取所有的软件列表。返回的对象不为null
        var softwares = resource.getSoftwares();
        var lastIndex = softwares.length();
        softwares = softwares.properties;
        var softwareCells = [];
        for (var key in softwares) {
            // 获取软件对象
            var softwareObj = softwares[key];
            if (!softwareObj) {
                continue;
            }
            var type = softwareObj.type;
            var name = softwareObj.name;
            name = GenenalNameUtil.displayResourceName(name, type);
            // 创建software的cell，注意先加入的software要放到vmtemplate图标的最下面，因此需要使用 lastIndex
            var softwareCell = new mxCell(name,
                new mxGeometry(10, 45 * (lastIndex - 1) + 35 + 5, 150, 40), type);
            lastIndex--;
            softwareCell.resourceName = softwareObj.name;
            softwareCell.setConnectable(false);
            // 类型名称
            softwareCell.resourceType = templateDefine.getResourceTypeById(softwareObj.type);
            // 属性列表默认值
            softwareCell.attributes = softwareObj.genCellAttr();

            softwareCell.setVertex(true);
            softwareCell.type = type;
            softwareCell.resourceId = softwareObj.id;
            // undo/redo 需要的两个属性
            softwareCell.resource = softwareObj;
            softwareCell.resourcePid = vmtemplateCell.resourceId;
            softwareCells.push(softwareCell);
        }
        this.addCells(softwareCells, vmtemplateCell);
    };

    /**
     * 反解析增加的连线；不需要其他任何处理，直接连线，
     */
    CoreGraph.prototype.addEdgeWithoutCheck = function (edge, parent, source, target, index) {
        parent = this.getDefaultParent();
        var children = this.getModel().getChildCells(parent, false, false);
        // 获取连线的源和目的的cell
        for (var i in children) {
            if (children[i].resourceId == edge.sourceId) {
                source = children[i];
            } else if (children[i].resourceId == edge.targetId) {
                target = children[i];
            }
        }
        return mxGraph.prototype.addEdge.apply(this, [edge, parent, source, target, index]);
    };

    /**
     * 将多个资源添加到画布中去
     * @param resourceCells 多个资源
     */
    CoreGraph.prototype.addCells2 = function (resourceCells, lines) {
        var template = this.template;
        if (resourceCells) {
            // 把资源的cell加入到画布中
            this.addCells(resourceCells, this.getDefaultParent());
            for (var i = 0; i < resourceCells.length; i++) {
                var resource = template.getResourceById(resourceCells[i].resourceId);
                // 有效性判断
                if (resource != null && resource.type == "VmTemplate") {
                    // 把vmtemplate下的虚拟机也加入到画布中
                    this.redrawSoftware(resource, resourceCells[i]);
                }
            }
        }
        if (lines) {
            for (var i = 0; i < lines.length; i++) {
                var edge = lines[i];
                // 直接添加连线，不需要校验
                this.addEdgeWithoutCheck(edge);
            }
        }
    };

    return CoreGraph;
});
