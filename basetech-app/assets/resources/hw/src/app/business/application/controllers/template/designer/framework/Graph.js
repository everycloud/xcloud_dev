define(["mxGraph", "./mxSwimlane", "./mxImageShape"], function (mxClient) {
    // Defines an icon for creating new connections in the connection handler.
    // This will automatically disable the highlighting of the source vertex.
    mxConnectionHandler.prototype.connectImage = new mxImage('/resources/hw/theme/default/images/connector.gif', 16, 16);

    function Graph(container, model, renderHint, stylesheet) {
        mxGraph.call(this, container, model, renderHint, stylesheet);
        this.setConnectable(true);
        this.setDropEnabled(true);
        this.setPanning(true);
        this.setAllowLoops(false);
        this.connectionHandler.setCreateTarget(true);

        if (!stylesheet) {
            this.loadStylesheet();
        }
    }

    mxUtils.extend(Graph, mxGraph);

    //加载样式
    Graph.prototype.loadStylesheet = function () {
        var node = mxUtils.load(STYLE_PATH + '/designbone.xml').getDocumentElement();
        var dec = new mxCodec(node.ownerDocument);
        dec.decode(node, this.getStylesheet());
    };

    Graph.prototype.flipEdge = function (edge) {
        if (edge != null) {
            var state = this.view.getState(edge);
            var style = (state != null) ? state.style : this.getCellStyle(edge);

            if (style != null) {
                var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
                    mxConstants.ELBOW_HORIZONTAL);
                var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ? mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
                this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
            }
        }
    };

    Graph.prototype.init = function () {
        mxGraph.prototype.init.apply(this, arguments);
        this.container.style.overflow = 'auto';
        this.container.style.cursor = 'default';
        this.container.style.backgroundImage = 'url(' + IMAGE_PATH + '/grid.gif)';
        this.container.focus();
    };

    /**
     * 创建键盘事件
     */
    Graph.prototype.createKeyHandler = function () {
        var graph = this;
        var keyHandler = new mxKeyHandler(this);

        keyHandler.isControlDown = function (evt) {
            return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
        };

        function nudge(keyCode) {
            if (!this.isSelectionEmpty()) {
                var dx = 0;
                var dy = 0;

                if (keyCode == 37) {
                    dx = -1;
                } else if (keyCode == 38) {
                    dy = -1;
                } else if (keyCode == 39) {
                    dx = 1;
                } else if (keyCode == 40) {
                    dy = 1;
                }

                this.moveCells(this.getSelectionCells(), dx, dy);
                this.scrollCellVisible(this.getSelectionCell());
            }
        }

        keyHandler.enter = function () {};
        keyHandler.bindKey(46, function () {
            var cells = graph.getSelectionCells();
            var model = graph.getModel();
            model.beginUpdate();
            try {
                graph.removeCells(cells);
            } finally {
                model.endUpdate();
            }
        }); // Delete
        keyHandler.bindControlKey(83, true, 'save'); // Ctrl+S
        keyHandler.bindControlShiftKey(83, true, 'saveAs', true); // Ctrl+Shift+S
        keyHandler.bindKey(107, false, 'zoomIn'); // Add
        keyHandler.bindKey(109, false, 'zoomOut'); // Subtract
        keyHandler.bindControlKey(90, true, 'undo'); // Ctrl+Z
        keyHandler.bindControlKey(89, true, 'redo'); // Ctrl+Y
        return keyHandler;
    };

    return Graph;
});
