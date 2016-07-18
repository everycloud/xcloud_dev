define(["mxGraph"], function (mxClient) {
    /**
     * 添加删除按钮, 继承于mxVertexHandler
     * @param state
     * @param point 相对于右上角的位置偏移量
     */
    function mxVertexToolHandler(state, point) {
        point = point == undefined ? new mxPoint(0, 0) : point;
        if (!this.point) {
            this.point = point;
        }
        mxVertexHandler.apply(this, arguments);
    };
    mxVertexToolHandler.prototype = new mxVertexHandler();
    mxVertexToolHandler.prototype.constructor = mxVertexToolHandler;
    mxVertexToolHandler.prototype.domNode = null;
    mxVertexToolHandler.prototype.point = null;
    mxVertexToolHandler.prototype.init = function () {
        mxVertexHandler.prototype.init.apply(this, arguments);
        this.domNode = document.createElement('div');
        this.domNode.style.position = 'absolute';
        this.domNode.style.whiteSpace = 'nowrap';
        var md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
        var mo = (mxClient.IS_TOUCH) ? 'touchstart' : 'mouseover';
        var mu = (mxClient.IS_TOUCH) ? 'touchend' : 'mouseup';
        // Delete
        var img = mxUtils.createImage("../theme/default/images/designbone-resource-delete.png");
        img.style.cursor = 'pointer';
        img.style.width = '16px';
        img.style.height = '16px';
        mxEvent.addListener(img, md, mxUtils.bind(this, function (evt) {
            mxEvent.consume(evt);
        }));
        mxEvent.addListener(img, 'click', mxUtils.bind(this,
            function (evt) {
                var model = this.graph.getModel();
                model.beginUpdate();
                try {
                    var cell = this.state.cell;
                    var parent = cell.getParent();
                    this.graph.deleteCells([cell]);
                } finally {
                    model.endUpdate();
                }
                mxEvent.consume(evt);
            }));
        this.domNode.appendChild(img);
        this.graph.container.appendChild(this.domNode);
        this.redrawTools();
    };
    mxVertexToolHandler.prototype.redraw = function () {
        mxVertexHandler.prototype.redraw.apply(this);
        this.redrawTools();
    };

    mxVertexToolHandler.prototype.redrawTools = function () {
        if (this.state != null && this.domNode != null) {
            var dy = (mxClient.IS_VML && document.compatMode == 'CSS1Compat') ? 8 : 8;
            this.domNode.style.left = (this.state.x + this.state.width + this.point.x - 10) + 'px';
            this.domNode.style.top = (this.state.y + this.point.y - dy) + 'px';
        }
    };
    mxVertexToolHandler.prototype.destroy = function (sender, me) {
        mxVertexHandler.prototype.destroy.apply(this, arguments);
        if (this.domNode != null) {
            this.domNode.parentNode.removeChild(this.domNode);
            this.domNode = null;
        }
    };

    return mxVertexToolHandler;
});
