/**
 * 每个节点返回值必须是一个set
 */
define(["tiny-lib/jquery", "tiny-lib/encoder", "tiny-lib/raphael"], function ($, $encoder, Raphael) {
    "use strict";

    function Icons(paper) {
        var self = this;
        this.paper = paper;
        this.defaults = {
            "font": {
                "text-anchor": "left",
                "font-size": "12px",
                "stroke-width": "0.5",
                "stroke": "#000",
                "fill": "#77858b",
                "stroke-opacity": "0"
            },
            "stroke": {
                "fill": "#FFFFFF",
                "stroke": "#77858B",
                "stroke-width": "3",
                "stroke-miterlimit": "10"
            },
            "line": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-width": "2",
                "stroke-miterlimit": "10"
            },
            "polygon": {
                "fill": "#77858B",
                "stroke": "#77858B"
            }
        };

        //自定义属性，用于画直线
        this.paper.ca.line = function (x, y, xlength, ylength) {
            var path = [
                ["M", x, y]
            ];
            if (xlength) {
                path.push(["L", x + xlength, y]);
            }
            else {
                path.push(["L", x, y + ylength]);
            }
            path.push(["z"]);

            return {
                "path": path
            };
        };

        //云节点
        this.cloud = function (title) {
            var p = paper.path(this.cloud.defaults.path).attr(this.cloud.defaults.stroke);
            var titleUI = this.getDisplayText(title, 15);
            var t = paper.text(30.5, 38.5, titleUI).attr(this.cloud.defaults.font);
            t.tooltip(title);
            return paper.set(p, t);
        };
        this.cloud.defaults = {
            "path": "M-3.395,59.04c-14.011,0-25.373-8.319-25.373-18.572l0,0c0.008-8.233,7.331-15.173,17.453-17.601l0,0c0.35-6.996,8.189-12.585,17.833-12.585l0,0c3.083,0,5.981,0.581,8.5,1.6l0,0C20.372,5.359,30.122,0.993,41.274,0.986l0,0c16.7,0.009,30.269,9.77,30.655,21.921l0,0c9.986,2.493,17.183,9.396,17.192,17.561l0,0c0,10.253-11.362,18.572-25.381,18.572l0,0H-3.395L-3.395,59.04L-3.395,59.04L-3.395,59.04z",
            "stroke": {
                "fill": "#FFFFFF",
                "stroke-width": "3",
                "stroke": "#77858b"
            },
            "font": {
                "text-anchor": "left",
                "font-family": "Helvetica, Arial, sans-serif",
                "font-size": "14px",
                "stroke-width": "0",
                "stroke": "#000",
                "fill": "#77858b"
            }
        };

        //防火墙节点
        this.firewall = function (options) {
            var options = options || {};
            var defaults = this.firewall.defaults;
            var rect11 = paper.rect(3.993, 1.934, 14.726, 8.504);
            var rect12 = paper.rect(23.137, 1.934, 14.726, 8.504);
            var rect13 = paper.rect(42.281, 1.934, 14.726, 8.504);

            var rect21 = paper.rect(3.993, 13.84, 7.363, 8.504);
            var rect22 = paper.rect(14.301, 13.84, 14.726, 8.504);
            var rect23 = paper.rect(31.973, 13.84, 14.726, 8.504);
            var rect24 = paper.rect(49.644, 13.84, 7.363, 8.504);

            var rect31 = paper.rect(3.993, 25.748, 14.726, 8.182);
            var rect32 = paper.rect(23.137, 25.748, 14.726, 8.504);
            var rect33 = paper.rect(42.281, 25.748, 14.726, 8.504);

            var rect41 = paper.rect(3.993, 37.654, 7.363, 8.504);
            var rect42 = paper.rect(14.301, 37.654, 14.726, 8.504);
            var rect43 = paper.rect(31.973, 37.654, 14.726, 8.504);
            var rect44 = paper.rect(49.644, 37.654, 7.363, 8.504);

            var rect51 = paper.rect(3.993, 49.562, 14.726, 8.504);
            var rect52 = paper.rect(23.137, 49.562, 14.726, 8.504);
            var rect53 = paper.rect(42.281, 49.562, 14.726, 8.504);

            var text = options.text || defaults.text;
            var t = paper.text(28, -12, text).attr(this.defaults.font);

            var st = paper.set(rect11, rect12, rect13, rect21, rect22, rect23, rect24, rect31, rect32, rect33, rect41, rect42, rect43, rect44, rect51, rect52, rect53, t);
            st.attr(this.firewall.defaults.stroke);
            return st;
        };
        this.firewall.defaults = {
            "text": "防火墙",
            "stroke": {
                "fill": "#77858B",
                "stroke": "#000000",
                "stroke-miterlimit": "10",
                "stroke-opacity": "0"
            }
        };

        //路由器节点
        this.router = function (options) {
            var options = options || {};
            var defaults = this.router.defaults;

            var c = paper.circle(30, 30, 28.316).attr(this.defaults.stroke);
            var line1 = paper.path("M30.5,21L30.5,25").attr(this.router.defaults.line);
            var polygon1 = paper.path("M27.74,23L30.645,12.159L33.55,23").attr(this.defaults.polygon);

            var line2 = paper.path("M30.5,35L30.5,39").attr(this.router.defaults.line);
            var polygon2 = paper.path("M27.661,37L30.566,47.841L33.472,37").attr(this.defaults.polygon);

            var line3 = paper.path("M12,29.5L17,29.5").attr(this.router.defaults.line);
            var polygon3 = paper.path("M15,32.495L25.841,29.59L15,26.685").attr(this.defaults.polygon);

            var line4 = paper.path("M48,29.5L43,29.5").attr(this.router.defaults.line);
            var polygon4 = paper.path("M45,26.685L34.159,29.59L45,32.495").attr(this.defaults.polygon);

            var text = options.text || defaults.text;
            var t = paper.text(30, -12, text).attr(this.defaults.font);
            return paper.set(c, line1, polygon1, line2, polygon2, line3, polygon3, line4, polygon4, t);
        };
        this.router.defaults = {
            "text": "路由器",
            "line": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-miterlimit": "10"
            }
        };

        //路由网络节点
        this.routerNetwork = function (title, size) {
            var c = paper.circle(28, 28, 26.678).attr(this.defaults.stroke);

            var line1 = paper.path("M9,22L48.5,22").attr(this.defaults.line);
            var polygon1 = paper.path("M41.154,29.701L39.79,28.236L47.013,21.523L39.79,14.808L41.154,13.343L49.95,21.523").attr(this.defaults.polygon);

            var line2 = paper.path("M11,36L50,36").attr(this.defaults.line);
            var polygon2 = paper.path("M17.846,44.659L19.21,43.194L11.987,36.481L19.21,29.766L17.846,28.301L9.05,36.481").attr(this.defaults.polygon);

            var titleUI = this.getDisplayText(title, size);
            var t = paper.text(28, -12, titleUI).attr(this.defaults.font);
            t.tooltip(title);

            return paper.set(c, line1, polygon1, line2, polygon2, t);
        };
        this.routerNetwork.defaults = {
            "text": "路由网络"
        };

        //内部网络节点
        this.innerNetwork = function (title, size) {
            var c = paper.circle(28, 28, 26.678).attr(this.defaults.stroke);
            var line1 = paper.path("M47.032,8.382L10.77,47.457").attr(this.innerNetwork.defaults.line);
            var titleUI = this.getDisplayText(title, size);
            var t = paper.text(28, -12, titleUI).attr(this.defaults.font);
            t.tooltip(title);
            return paper.set(c, line1, t);
        };
        this.innerNetwork.defaults = {
            "text": "内部网络",
            "line": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-width": "3",
                "stroke-miterlimit": "10"
            }
        };

        //更多节点
        this.moreNetwork = function (title, size) {
            var c = paper.circle(28, 28, 26.678).attr(this.defaults.stroke);
            var titleUI = this.getDisplayText(title, size);
            var t = paper.text(28, 28, titleUI).attr(this.defaults.font);
            return paper.set(c, t);
        };

        //虚拟机节点
        this.vm = function (title, size) {
            var line = paper.path("M18,38L41,38z").attr(this.vm.defaults.line);
            var rect = paper.path("M53,23.237C53,27.376,50.883,31,46.558,31h-32.31C9.922,31,6,27.376,6,23.237V9.185C6,5.045,9.922,2,14.248,2h32.31C50.883,2,53,5.045,53,9.185V23.237z").attr(this.vm.defaults.line).attr({"fill": "#FFFFFF"});
            var rect1 = paper.rect(18, 15, 14, 6).attr(this.vm.defaults.stroke);
            var polyline1 = paper.path("M26.5,15L26.5,8.5L35,8.5").attr(this.vm.defaults.polyline);
            var rect2 = paper.rect(35.5, 7.5, 9, 2).attr(this.vm.defaults.polyline);
            var polyline2 = paper.path("M40.5,10L40.5,18.5L32,18.5").attr(this.vm.defaults.polyline);
            var line1 = paper.path("M23,23.5L27,23.5z").attr(this.vm.defaults.polyline);

            var titleUI = this.getDisplayText(title, size || 25);
            var t = paper.text(28, -12, titleUI).attr(this.defaults.font);
            t.tooltip(title);
            return  paper.set(line, rect, rect1, polyline1, rect2, polyline2, line1, t);
        };
        this.vm.defaults = {
            "text": "虚拟机",
            "stroke": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-width": "2",
                "stroke-linejoin": "round",
                "stroke-miterlimit": "8"
            },
            "line": {
                "fill": "#FFFFFF",
                "stroke": "#77858B",
                "stroke-width": "4",
                "stroke-linejoin": "round",
                "stroke-miterlimit": "8"
            },

            "polyline": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-linejoin": "round",
                "stroke-miterlimit": "8"
            }
        };

        this.vlb = function (title) {
            var c = paper.circle(30, 30, 26.678).attr(this.defaults.stroke);
            var line1 = paper.path("M8.5,27.5L9.482,27.5L12.5,27.5L12.5,23.257L25.097,29.478L12.91,36.447L13.124,32.5L8.5,32.5z").attr(this.vlb.defaults.stroke);
            var rect1 = paper.path("M28.5,16.5L28.5,44.5").attr(this.defaults.stroke).attr({"stroke-width": "4"});

            var line2 = paper.path("M34,30L40,30z").attr(this.vlb.defaults.line);
            var polyline2 = paper.path("M38,33.671L51.009,30.185L38,26.698").attr(this.defaults.polygon);

            var line3 = paper.path("M34.725,24.565L39.558,21.219z").attr(this.vlb.defaults.line);
            var polyline3 = paper.path("M39.587,25.439L48.299,15.167L35.618,19.707").attr(this.defaults.polygon);

            var line4 = paper.path("M34.725,35.804L39.557,39.15z").attr(this.vlb.defaults.line);
            var polyline4 = paper.path("M35.617,40.663L48.296,45.203L39.587,34.931").attr(this.defaults.polygon);

            var titleUI = this.getDisplayText(title, 15);
            var t = paper.text(28, -12, titleUI).attr(this.defaults.font);
            t.tooltip(title);
            return paper.set(c, line1, rect1, line2, polyline2, line3, polyline3, line4, polyline4, t);
        };
        this.vlb.defaults = {
            "text": "VLB",
            "stroke": {
                "fill": "#77858B",
                "stroke": "#77858B",
                "stroke-miterlimit": "10"
            },
            "line": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-width": "2",
                "stroke-miterlimit": "10"
            }
        };

        //加载SVG 文件
        this.icon = function (svg, box, st) {
            var icon = paper.image(svg, box.x, box.y, box.width, box.height);
            if (!st) {
                st = paper.set(icon);
            }
            else {
                st.push(icon);
            }
            return st;
        };

        //线型
        this.line = function (title, px, params, st) {
            var strokeWidth = (px ? px : 2) + "";
            var line = paper.path().attr({"line": params}).attr(this.line.defaults.line).attr({"stroke-width": strokeWidth});
            if (!title || title === "") {
                return paper.set(line);
            }
            var lineBox = line.getBBox();
            var t = paper.text(0, 0, title).attr(this.defaults.font);
            var tBox = t.getBBox();
            var xx = lineBox.x + (lineBox.width - tBox.width) / 2;
            var yy = lineBox.y + 10; //向下偏移10个像素
            this.trans(t, xx, yy);
            if (!st) {
                st = paper.set(line, t);
            }
            else {
                st.push(line, t);
            }
            return st;
        };
        this.line.defaults = {
            "line": {
                "fill": "none",
                "stroke": "#77858B",
                "stroke-width": "2",
                "stroke-miterlimit": "10"
            }
        };

        //文字
        this.text = function (title, x, y, st, size) {
            var titleUI = this.getDisplayText(title, size);
            var t = paper.text(x, y, titleUI).attr(this.defaults.font);
            t.tooltip(title);
            if (!st) {
                st = paper.set(t);
            }
            else {
                st.push(t);
            }
            return st;
        };

        //平移
        this.trans = function (st, x, y) {
            st.translate(x, y);
        };

        //缩放
        this.transform = function (st, tstr) {
            st.transform(tstr);
        };

        Raphael.el.tooltip = function (title) {
            var el = this;
            var textEl = null;
            var over = function (e, posX, posY) {
                textEl = $("<div>" + $.encoder.encodeForHTML(title) + "</div>");
                textEl.css({
                    "position": "absolute",
                    "top": posY + 6 + "px",
                    "left": posX + 6 + "px",
                    "font-size": "12px",
                    "background": "#fafafa"
                });
                textEl.appendTo("body");
            };
            var out = function () {
                textEl.remove();
            };
            el.hover(over, out);
        };
        Raphael.st.tooltip = function (title) {
            var st = this;
            var textEl = null;
            var over = function (e, posX, posY) {
                textEl = $("<div>" + $.encoder.encodeForHTML(title) + "</div>");
                textEl.css({
                    "position": "absolute",
                    "top": posY + 6 + "px",
                    "left": posX + 6 + "px",
                    "font-size": "12px",
                    "background": "#fafafa"
                });
                textEl.appendTo("body");
            };
            var out = function () {
                textEl.remove();
            };
            st.hover(over, out);
        };


        //效果
        Raphael.st.effect = function (clickBack) {
            var st = this;
            var over = function () {
                if (st.lock) {
                    return;
                }
                st.c = st.attr("stroke");
                st.forEach(function (el) {
                    el.c = el.attr("fill");
                    el.s = el.attr("stroke");
                    el[0].style.cursor = "pointer";
                    if ((el.type === "path" && el.c !== "none" && el.c !== "#FFFFFF") || el.type === "text") {
                        el.attr({"stroke": "#4a8cf6", "fill": "#4a8cf6"});
                    }
                    else {
                        el.attr({"stroke": "#4a8cf6", "fill": "#bacabd"});
                    }
                });
            };
            var out = function () {
                if (!st.lock) {
                    st.stop().attr({"stroke": st.c});
                    st.forEach(function (el) {
                        el.attr({"stroke": el.s, "fill": el.c});
                    });
                }
            };
            if (clickBack) {
                st.click(function () {
                    st.lock = true;
                    clickBack.apply(st, arguments);
                    self.changeSingleNodeClick(st);
                });
            }
            st.hover(over, out);
        };

        //只支持单选场景
        this.changeSingleNodeClick = function (cell) {
            var beforeCell = this.selectedCell;
            if (beforeCell === cell) {
                return;
            }
            if (beforeCell) {
                beforeCell.lock = false;
                beforeCell.stop().attr({"stroke": beforeCell.c});
                beforeCell.forEach(function (el) {
                    el.attr({"stroke": el.s, "fill": el.c});
                });
            }
            this.selectedCell = cell;
        };

        this.getDisplayText = function (title, size) {
            title = title ? title : "";
            if (!size) {
                return title;
            }
            size = size > 3 ? size - 3 : size;
            var length = title.length + this.getChinaCharLength(title);
            //如果存在中文
            if (length > size) {
                var i = 0;
                var chara = "";
                var result = "";
                for (i = 0; i < title.length; i = i + 1) {
                    result += title.substr(i, 1);
                    if (result.length + this.getChinaCharLength(result) >= size) {
                        break;
                    }
                }
                return result + "...";
            }
            return title;
        };

        this.getChinaCharLength = function (title) {
            var arr = (title + "").match(/[\u0391-\uFFE5]+/);
            if (!arr) {
                return 0;
            }
            var str = arr.join("");
            return str.length;
        };
    }

    return Icons;
});