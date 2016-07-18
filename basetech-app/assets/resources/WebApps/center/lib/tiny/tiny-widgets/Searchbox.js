define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util"], function(angular, $, Class, Widget, util) {
    var DEFAULT_CONFIG = {
        "template" : '<div class="tiny-searchbox"></div>',
        "display" : true,
        "disable" : false,
        "type" : 'round',
        "width" : -1,
        "placeholder" : "",
        "suggest-size" : 10,
        "maxlength" : 30
    };

    var Searchbox = Widget.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis.content = "";
            widgetThis._super(_.extend({
            }, DEFAULT_CONFIG, options));
            widgetThis._setOptions(widgetThis.options);
            $("#" + options["id"]).append(widgetThis._element);
        },

        "_generateElement" : function() {
            var widgetThis = this;
            widgetThis.oSearchbox = $('<div>');
            widgetThis.oSearchbox.addClass("tiny-searchbox");
            widgetThis._reRender();
            return widgetThis.oSearchbox;
        },
        //成员变量初始化
        "_setOption" : function(key, value) {
            var widgetThis = this;
            widgetThis._super(key, value);
            if(key === "id") {
            	widgetThis._updateId(value);
            }
            widgetThis.selectClass = widgetThis.options.type === "round" ? ("tiny-searchbox-select_round") : ("tiny-searchbox-select_square");
            var optionWidth = parseInt(widgetThis.options.width, 10), width;
            if ('round' === widgetThis.options.type) {
                var defaultRoundWidth = 180;
                widgetThis.width = optionWidth > 0 ? optionWidth : defaultRoundWidth;
            } else if (widgetThis.options.type == "square") {
                var defaultSquareWidth = 200;
                widgetThis.width = optionWidth > 0 ? optionWidth : defaultSquareWidth;
            } else if (widgetThis.options.type == "long") {
                var defaultLongWidth = 500;
                widgetThis.width = optionWidth > 0 ? optionWidth : defaultLongWidth;
            }
            widgetThis._reRender();
        },
        "_reRender" : function() {
            var widgetThis = this;
            widgetThis.oSearchbox.empty();
            var inputElement = null;
            var imageElement = null;
            var width = widgetThis.width;
            if ('round' === widgetThis.options.type) {
                var searchDivLeft = $('<div class = "tiny-searchbox-search_div_left"></div>');
                var searchDivMid = $('<div class = "tiny-searchbox-search_div_mid"><input type="text"  class="tiny-searchbox-inputText_round"/></div>');
                inputElement = searchDivMid.find(".tiny-searchbox-inputText_round");
                var searchDivRight = $('<div class = "tiny-searchbox-search_div_right"></div>');
                var maxlen = widgetThis.options["maxlength"];
                if (maxlen !== null && maxlen > 0) {
                    inputElement[0].maxLength = maxlen;
                }
                var inputTextWidth = (width - 59) + 'px';
                var searchDivMidWidth = (width - 59) + 'px';
                inputElement.css('width', inputTextWidth);
                var imageElement = $('<div>');
                imageElement.addClass("tiny-searchbox-searchbox_searchImage_round");
                searchDivMid.css('width', searchDivMidWidth);
                imageElement.appendTo(searchDivMid);
                widgetThis.oSearchbox.append(searchDivLeft).append(searchDivMid).append(searchDivRight);
            } else if (widgetThis.options.type == "square") {
                inputElement = $('<input type="text" ></input>');
                var maxlen = widgetThis.options["maxlength"];
                if (maxlen !== null && maxlen > 0) {
                    inputElement[0].maxLength = maxlen;
                }
                inputElement.addClass("tiny-searchbox-inputText_square");
                if ($.browser.msie) {
                    inputElement.css('width', width - 31);
                } else {
                    inputElement.css('width', width - 30);
                }
                widgetThis.oSearchbox.append(inputElement);
                var imageElement = $('<div>');
                imageElement.addClass("tiny-searchbox-searchbox_searchImage_square");
                widgetThis.oSearchbox.append(imageElement);
            } else if (widgetThis.options.type == "long") {
                inputElement = $('<input type="text" ></input>');
                var maxlen = widgetThis.options["maxlength"];
                if (maxlen !== null && maxlen > 0) {
                    inputElement[0].maxLength = maxlen;
                }
                inputElement.addClass("tiny-searchbox-inputText_long");
                if ($.browser.msie) {
                    inputElement.css('width', width - 92);
                } else {
                    inputElement.css('width', width - 91);
                }
                widgetThis.oSearchbox.append(inputElement);
                var imageElement = $('<div>');
                imageElement.addClass("tiny-searchbox-searchbox_searchImage_long");
                widgetThis.oSearchbox.append(imageElement);

            }

            widgetThis.options.width = width;
            if (util.isFalse(widgetThis.options.display)) {
                widgetThis.oSearchbox.hide();
            } else {
                widgetThis.oSearchbox.show();
            }

            //disabled
            if (util.isTrue(widgetThis.options.disabled)) {
                inputElement.attr("disabled", "disabled");
            } else {
                inputElement.removeAttr("disabled");
            }

            widgetThis.oSearchbox.inputElement = inputElement;
            if (widgetThis.options.placeholder) {
                widgetThis.oSearchbox.find(".tiny-searchbox-placeholder").remove();
                widgetThis._showPlaceholder();
            }
            widgetThis.oSearchbox.imageElement = imageElement;
            widgetThis._addBehavior();
        },

        "_addBehavior" : function() {
            var widgetThis = this;
            var element = widgetThis.oSearchbox;
            var imageElement = element.imageElement;
            var inputElement = element.inputElement;

            //添加事件：
            if ('round' === widgetThis.options.type){
            	imageElement.click(function() {
                inputElement.val("");
                widgetThis.content = "";
            });
            $('div.tiny-searchbox-search_div_left', widgetThis._element).click(function(){
            	 widgetThis._clearSuggests();
                var content = widgetThis.content;
                widgetThis.options.search(content);
            });
            }
            else{
            	//1.点击放大镜图标触发搜索。
            imageElement.click(function() {
                widgetThis._clearSuggests();
                var content = widgetThis.content;
                widgetThis.options.search(content);
            });
            }
            

            //2.输入字符触发显示Suggest List
            inputElement.keyup(function(e) {
                e = (window.event) ? event : e;
                if (widgetThis.label) {
                    if (widgetThis.oSearchbox.inputElement[0].value !== "") {
                        widgetThis.label.style.display = "none";
                    } else {
                        widgetThis.label.style.display = "block";
                    }
                }
                var code = e.keyCode;
                if (code == 13) {
                    widgetThis._clearSuggests();
                    widgetThis.content = inputElement[0].value;
                    widgetThis.options.search(widgetThis.content);
                } else if (code < 37 || code > 40) {
                    //除去"上下左右"四个键！！trim已经做判断了！！
                    if (widgetThis.content !== inputElement[0].value && $.trim(inputElement[0].value) != '') {
                        widgetThis.content = inputElement[0].value;
                        if (widgetThis.options.suggest && widgetThis.options.suggest.length != 0) {
                            widgetThis._showSuggests();
                        }
                    } else if ($.trim(inputElement[0].value) == '') {
                        widgetThis._clearSuggests();
                    }
                    widgetThis.content = inputElement[0].value;
                }
            });

            //4.输入框获得焦点。
            inputElement.focus(function() {
                widgetThis._showContent();
            });

            //3.输入方向键触发suggestList上下移动。
            inputElement.keydown(function(e) {
                e = (window.event) ? event : e;
                if (widgetThis.oSearchbox.suggestsElement && widgetThis.oSearchbox.suggestsElement.children().length != 0) {
                    var suggestsElement = widgetThis.oSearchbox.suggestsElement;
                    var currentSuggestItem = suggestsElement.find("." + widgetThis.selectClass);
                    if (e.keyCode == 38) {
                        currentSuggestItem.removeClass(widgetThis.selectClass);
                        if (currentSuggestItem.length == 0 || currentSuggestItem.prev().length == 0) {
                            suggestsElement.children().last().addClass(widgetThis.selectClass);
                        } else {
                            currentSuggestItem.prev().addClass(widgetThis.selectClass);
                        }
                        widgetThis.content = suggestsElement.find("." + widgetThis.selectClass).text();
                        inputElement[0].value = widgetThis.content;
                    }
                    if (e.keyCode == 40) {
                        currentSuggestItem.removeClass(widgetThis.selectClass);
                        if (currentSuggestItem.length == 0 || currentSuggestItem.next().length == 0) {
                            suggestsElement.children().first().addClass(widgetThis.selectClass);
                        } else {
                            currentSuggestItem.next().addClass(widgetThis.selectClass);
                        }
                        widgetThis.content = suggestsElement.find("." + widgetThis.selectClass).text();
                        inputElement[0].value = widgetThis.content;
                    }
                }
            });

            //5.输入框失去焦点。
            inputElement.blur(function(e) {
                if (!widgetThis.oSearchbox.suggestsElement) {
                    return;
                }
                widgetThis._clearSuggests();
                if (widgetThis.content != "") {
                    widgetThis.content = widgetThis.oSearchbox.inputElement[0].value;
                    widgetThis._showContent();
                } else {
                    if (widgetThis.label) {
                        widgetThis.label.style.display = "block";
                    }
                }
            });
        },

        "_showContent" : function() {
            var widgetThis = this;
            var inputElement = widgetThis.oSearchbox.inputElement;
            if (widgetThis.options.type === 'round') {
                inputElement.removeClass("tiny-searchbox-content_square  tiny-searchbox-placeholder");
                inputElement.addClass("tiny-searchbox-content_round");
            } else {
                inputElement.removeClass("tiny-searchbox-content_round tiny-searchbox-placeholder");
                inputElement.addClass("tiny-searchbox-content_square");
            }
        },

        "_showPlaceholder" : function() {
            var widgetThis = this;
            var inputElement = widgetThis.oSearchbox.inputElement;
            inputElement.attr("placeholder", widgetThis.options.placeholder);
            var input = inputElement[0];
            if (!("placeholder" in input)) {
                widgetThis.createPlaceholder(inputElement[0]);
            }
        },

        "createPlaceholder" : function(obj) {
            var defaultValue = obj.getAttribute('placeholder');
            var placeHolderCont = document.createTextNode(defaultValue);
            var oWrapper = document.createElement('span');
            oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
            oWrapper.className = 'tiny-searchbox-placeholder';
            oWrapper.style.fontFamily = this._getStyle(obj, 'fontFamily');
            oWrapper.style.fontSize = this._getStyle(obj, 'fontSize');
            oWrapper.style.marginLeft = parseInt(this._getStyle(obj, 'marginLeft')) ? parseInt(this._getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
            oWrapper.style.marginTop = parseInt(this._getStyle(obj, 'marginTop')) ? this._getStyle(obj, 'marginTop') : 1 + 'px';
            oWrapper.style.paddingLeft = this._getStyle(obj, 'paddingLeft');
            oWrapper.style.width = obj.offsetWidth - parseInt(this._getStyle(obj, 'marginLeft')) + 'px';
            oWrapper.style.height = obj.offsetHeight + 'px';
            oWrapper.style.lineHeight = obj.nodeName.toLowerCase() == 'textarea' ? '' : obj.offsetHeight + 'px';
            oWrapper.appendChild(placeHolderCont);
            obj.parentNode.insertBefore(oWrapper, obj);
            oWrapper.onclick = function() {
                obj.focus();
            };
            this.label = oWrapper;
        },

        "_getStyle" : function(obj, styleName) {
            var oStyle = null;
            if (obj.currentStyle)
                oStyle = obj.currentStyle[styleName];
            else if (window.getComputedStyle)
                oStyle = window.getComputedStyle(obj, null)[styleName];
            return oStyle;
        },

        "_showSuggests" : function() {
            var widgetThis = this;
            widgetThis._clearSuggests();
            var div = widgetThis.oSearchbox;
            var suggests = widgetThis.options.suggest(widgetThis.content);
            var suggestsElement = $('<div></div>');
            var position = widgetThis.oSearchbox.inputElement.position();
            var left = position.left;
            var listItems = [];
            if (suggests !== undefined && suggests.length > 0) {
                for (var i = 0; i < suggests.length && i < widgetThis.options["suggest-size"]; i++) {

                    if (widgetThis.options.type == 'round') {
                        listItems[i] = $('<li style="list-style:none; padding-left:7px;">' + suggests[i] + '</li>');
                    } else {
                        listItems[i] = $('<li style="list-style:none;padding-left:4px;">' + suggests[i] + '</li>');
                    }
                    listItems[i].appendTo(suggestsElement);
                }
            }

            if (listItems.length > 0) {
                widgetThis.oSearchbox.suggestsElement = suggestsElement;
                var width = widgetThis.width;
                var top = position.top + 23;
                if (widgetThis.options.type == "round") {
                    width -= 2;
                    left -= 8;
                }
                if (widgetThis.options.type == "long") {
                    width -= 86;
                }
                suggestsElement.css({
                    'width' : width,
                    "top" : top,
                    "left" : left
                });
                suggestsElement.addClass("tiny-searchbox-suggest");
                div.append(suggestsElement);

                suggestsElement.mouseover(function(e) {
                    e = (window.event) ? event : e;
                    var currentSuggestElement = e.target || e.srcElement;
                    if (currentSuggestElement.tagName == 'LI') {
                        $(currentSuggestElement).siblings().removeClass(widgetThis.selectClass);
                        $(currentSuggestElement).addClass(widgetThis.selectClass);
                        widgetThis.content = currentSuggestElement.innerHTML;
                    }
                });
                suggestsElement.mouseout(function(e) {
                    suggestsElement.children().removeClass(widgetThis.selectClass);
                    widgetThis.content = widgetThis.oSearchbox.inputElement[0].value;

                });
                suggestsElement.mousedown(function(e) {
                    e = window.event || e;
                    var currentSuggestElement = e.target || e.srcElement;
                    if (currentSuggestElement.tagName == "LI") {
                        var inputElement = widgetThis.oSearchbox.inputElement;
                        widgetThis.content = currentSuggestElement.innerHTML;
                        inputElement[0].value = widgetThis.content;
                        widgetThis.options.search(widgetThis.content);
                    }
                    widgetThis._clearSuggests();
                });
            }
        },
        "getValue" : function() {
            var widgetThis = this;
            return widgetThis.content;
        },
        "setValue" : function(value) {
        	var widgetThis = this;
        	widgetThis._element.find("input").val(value);
        	widgetThis.content = value;
            if(value) {
                widgetThis._clearplaceholder();
            }
        },
        "_clearSuggests" : function() {
            var widgetThis = this;
            if (widgetThis.oSearchbox.suggestsElement) {
                widgetThis.oSearchbox.suggestsElement.remove();
            }
        },
        "_clearplaceholder": function() {
            var widgetThis = this;
            if (widgetThis.oSearchbox) {
                widgetThis.oSearchbox.find(".tiny-searchbox-placeholder").remove();
            }
        }
    });
    return Searchbox;

});
