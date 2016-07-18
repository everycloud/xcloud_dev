define(["mxGraph"], function (mxClient) {
    //扩展网络的样式，网络由一个图标和线组成，其中图标和线都具有锚点，可以感应连接
    var create = mxImageShape.prototype.create;
    var imageWidth = 32;
    var w = null;
    mxImageShape.prototype.create = function () {
        w = this.bounds.width;
        var node = create.apply(this, arguments);
        //为其添加横线，实际为一个矩形
        if (this.dialect == mxConstants.DIALECT_SVG) {
            this.networkLine = document.createElementNS(mxConstants.NS_SVG, 'rect');
            this.configureSvgShape(this.networkLine);
            node.appendChild(this.networkLine);
        } else {
            this.networkLine = document.createElement('v:rect');
            this.stroke = "#727272";
            this.fill = "#727272";
            this.configureVmlShape(this.networkLine);
            this.stroke = null;
            this.fill = null;

            this.networkLineNode = document.createElement('DIV');
            this.configureHtmlShape(this.networkLineNode);
            this.networkLineNode.style.overflow = 'visible';
            this.networkLineNode.appendChild(this.networkLine);

            node.appendChild(this.networkLineNode);
        }

        return node;
    }

    var redrawSvg = mxImageShape.prototype.redrawSvg;
    mxImageShape.prototype.redrawSvg = function () {
        redrawSvg.apply(this, arguments);
        if (!this.style || this.style.type !== "Network") {
            return;
        }

        var x = this.bounds.x;
        var y = this.bounds.y;
        var w = w ? Math.round(w * this.scale) : this.bounds.width;


        var imageWidth1 = Math.round(imageWidth * this.scale);
        var imageHeight = Math.round(this.imageNode.getAttribute("height"))
        // 配置文件无效，原因是在生成mxImageShap时没有将颜色值传进来
        this.networkLine.setAttribute("stroke", "#727272");
        this.networkLine.setAttribute("stroke-width", this.strokewidth);
        this.networkLine.setAttribute("fill", "#727272");

        this.networkLine.setAttribute("x", Math.round(x + imageWidth1));
        this.networkLine.setAttribute("y", Math.round((y + imageHeight - 12 * this.scale)));
        this.networkLine.setAttribute("width", Math.round(w - imageWidth1));
        this.networkLine.setAttribute("height", "2");

        this.imageNode.setAttribute("width", imageWidth1);
    }

    var updateAspect = mxImageShape.prototype.updateAspect;
    mxImageShape.prototype.updateAspect = function (w, h) {
        updateAspect.apply(this, arguments);
        if (!this.style || this.style.type !== "Network") {
            return;
        }
        this.node.style.paddingLeft = 0;

        var x = this.bounds.x;
        var y = this.bounds.y
        var w = this.bounds.width;

        var imageWidth = parseInt(this.imageNode.style.width);
        var imageHeight = parseInt(this.imageNode.style.height);
        this.networkLine.fillcolor = "#727272";
        this.networkLine.style.width = (w - imageWidth) + "px";
        this.networkLine.style.height = "2px";

        this.networkLineNode.style.paddingLeft = imageWidth + 'px';
        this.networkLineNode.style.paddingTop = Math.round(imageHeight - 12 * this.scale) + "px";
    }
    return mxImageShape;
});