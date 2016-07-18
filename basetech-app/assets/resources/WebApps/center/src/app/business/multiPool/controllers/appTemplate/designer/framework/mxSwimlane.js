define(["mxGraph"], function (mxClient) {
    //扩展mxSwimlane, 为mxSwimlan添加一个伸缩组的图标
    var redraw = mxSwimlane.prototype.redraw;
    mxSwimlane.prototype.redraw = function () {
        redraw.apply(this, arguments);
        var isSvg = (this.dialect == mxConstants.DIALECT_SVG);
        var isVml = mxUtils.isVml(this.node);
        var imageWidth = 0;
        var imageHeight = 0;

        if (false) {
            imageWidth = (this.style[mxConstants.STYLE_IMAGE_WIDTH] || this.imageSize) * this.scale;
            imageHeight = (this.style[mxConstants.STYLE_IMAGE_HEIGHT] || this.imageSize) * this.scale;

            var x = (this.bounds.width - imageWidth - 6 * this.scale);
            var y = 6 * this.scale;

            if (isSvg) {
                this.imageNode.setAttribute('x', (this.bounds.x + x) + 'px');
                this.imageNode.setAttribute('y', (this.bounds.y + y) + 'px');
                this.imageNode.setAttribute('width', imageWidth + 'px');
                this.imageNode.setAttribute('height', imageHeight + 'px');
            } else {
                this.imageNode.style.position = 'relative';
                this.imageNode.style.left = x + 'px';
                this.imageNode.style.top = y + 'px';
                this.imageNode.style.width = imageWidth + 'px';
                this.imageNode.style.height = imageHeight + 'px';
                this.imageNode.setAttribute('stroked', 'false');
            }
            this.imageNode.style.zIndex = '100';
            this.imageNode.style.cursor = "pointer";

            mxEvent.release(this.imageNode);
            mxEvent.addListener(this.imageNode, 'click',
                mxUtils.bind(this, function (evt) {
                    if (this.style.type === "VmTemplate") {
                        this.style.type = "ScalingGroup";
                        if (isVml) {
                            this.imageNode.src = "../theme/default/images/designerbone-del-scalinggroup.png";
                        } else {
                            this.imageNode.setAttribute("href", "../theme/default/images/designerbone-del-scalinggroup.png");
                        }
                    } else {
                        this.style.type = "VmTemplate";
                        //IE8 不要使用setAttribute为VML对象添加属性
                        if (isVml) {
                            this.imageNode.src = "../theme/default/images/designerbone-add-scalinggroup.png";
                        } else {
                            this.imageNode.setAttribute("href", "../theme/default/images/designerbone-add-scalinggroup.png");
                        }
                    }
                    this.redraw();
                    mxEvent.consume(evt);
                })
            );
        }
    };

    var redrawSvg = mxSwimlane.prototype.redrawSvg;
    mxSwimlane.prototype.redrawSvg = function () {
        redrawSvg.apply(this, arguments);
        this.content.setAttribute("fill", this.fill);
        if (this.style.type !== "ScalingGroup") {
            return;
        }

        var crisp = (this.crisp && mxClient.IS_IE) ? 0.5 : 0;
        var x = Math.round(this.bounds.x) + crisp;
        var y = Math.round(this.bounds.y) + crisp;
        var w = Math.round(this.bounds.width);
        var h = Math.round(this.bounds.height);
        var ss = this.startSize * this.scale;
        var horizontal = mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true);
        if (horizontal) {
            ss = Math.min(ss, h);
            var ext = 6 * this.scale;
            var points = 'M ' + x + ' ' + (y + ss) +
                ' l 0 ' + (h - ss) +
                ' l ' + w + ' 0' +
                ' l 0 ' + (ss - h) +
                ' z ' +
                ' m ' + w + ' ' + (h - ss - ext) + //重右下角开始
            ' l ' + ext + ' 0' +
                ' l 0 ' + (-h) +
                ' l ' + (-w) + ' 0' +
                ' l 0 ' + ext +
                ' l ' + (w - ext) + ' 0' +
                ' z ' +
                ' m ' + ext + ' ' + (-ext) +
                ' l ' + ext + ' 0' + //重右下角开始
            ' l 0 ' + (-h) +
                ' l ' + (-w) + ' 0' +
                ' l 0 ' + ext +
                ' l ' + (w - ext) + ' 0';
            this.content.setAttribute('d', points);
        }
    }

    //扩展表现，如果样式采用的是
    var redrawVml = mxSwimlane.prototype.redrawVml;
    mxSwimlane.prototype.redrawVml = function () {
        redrawVml.apply(this, arguments);
        var ext = Math.round(6 * this.scale);
        var ext2 = 2 * ext;
        //画叠影效果, 添加两个v:shap, 暂不支持圆角
        var x = 0;
        var y = 0;
        var w = Math.round(this.bounds.width);
        var h = Math.round(this.bounds.height);
        this.startSize = parseInt(mxUtils.getValue(this.style,
            mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
        var start = Math.round(this.startSize * this.scale);
        if (this.style.type !== "ScalingGroup") {
            if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
                var points = "M " + x + "," + y +
                    'l ' + x + ',' + (y + h) + " " +
                    (x + w) + ',' + (y + h) + " " +
                    (x + w) + ',' + y +
                    ' x e';
                this.content.path = points;
                return;
            }
        }
        if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
            ss = parseInt(this.label.style.top) + parseInt(this.label.style.height) + Math.round(22 * this.scale);
            var points = "M " + x + "," + y +
                'l ' + x + ',' + (y + h) + " " +
                (x + w) + ',' + (y + h) + " " +
                (x + w) + ',' + y +
                ' x e' +
                ' M ' + (x + ext) + "," + (y - ss) +
                ' l ' + (x + ext) + "," + (y - ss - ext) + " " +
                (x + ext + w) + "," + (y - ss - ext) + " " +
                (x + ext + w) + "," + (y + h - ext) + " " +
                (x + w) + "," + (y + h - ext) + " " +
                (x + w) + "," + (y - ss) + " " +
                " x e" +
                ' M ' + (x + ext2) + "," + (y - ss - ext) +
                ' l ' + (x + ext2) + "," + (y - ss - ext2) + " " +
                (x + ext2 + w) + "," + (y - ss - ext2) + " " +
                (x + ext2 + w) + "," + (y + h - ext2) + " " +
                (x + ext + w) + "," + (y + h - ext2) + " " +
                (x + ext + w) + "," + (y - ss - ext) + " " +
                " x e";
            this.content.path = points;
            return;
        }
    }

    //覆盖原始的createVml函数， 将content修改为v:shap， 自定义其图形
    mxSwimlane.prototype.createVml = function () {
        var node = document.createElement('v:group');
        var name = (this.isRounded) ? 'v:roundrect' : 'v:rect';
        this.label = document.createElement(name);
        this.configureVmlShape(this.label);
        if (this.isRounded) {
            this.label.setAttribute('arcsize', '20%');
        }
        this.isShadow = false;
        this.configureVmlShape(node);
        node.coordorigin = '0,0';
        node.appendChild(this.label);

        //主要修改点
        this.content = document.createElement("v:shape");
        this.content.strokecolor = color;
        this.content.fillcolor = this.fill;
        var tmp = this.fill;
        this.configureVmlShape(this.content);
        node.style.background = '';

        this.fill = tmp;
        this.content.style.borderBottom = '0px';

        node.appendChild(this.content);

        var color = this.style[mxConstants.STYLE_SEPARATORCOLOR];

        if (color != null) {
            this.separator = document.createElement('v:shape');
            this.separator.style.position = 'absolute';
            this.separator.strokecolor = color;

            var strokeNode = document.createElement('v:stroke');
            strokeNode.dashstyle = '2 2';
            this.separator.appendChild(strokeNode);

            node.appendChild(this.separator);
        }
        if (this.image != null) {
            this.imageNode = document.createElement('v:image');
            this.imageNode.src = this.image;
            this.configureVmlShape(this.imageNode);
            this.imageNode.stroked = 'false';

            node.appendChild(this.imageNode);
        }
        return node;
    };
    return mxSwimlane;
});