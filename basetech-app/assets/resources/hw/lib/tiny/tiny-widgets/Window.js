define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util", "tiny-lib/jquery-ui.custom.min", "tiny-lib/jquery.ui.dialog", "tiny-lib/jquery.dialogextend", "language/widgetsLanguage", "tiny-lib/encoder"],
function(angular, $, Class, Widget, util, jqueryui, jqueryuidialog, jquerydialogextend, widgetsLanguage, encoder) {
    var DEFAULT_CONFIG = {
        "template" : '',
        "id" : null,
        "modal" : true,
        "title" : "",
        "content" : "",
        "content-type" : "simple",
        "draggable" : true,
        "width" : "500px",
        "height" : "375px",
        "icon" : "",
        "buttons" : [],
        "position" : "auto",
        "resizable" : false,
        "type" : "prompt",
        "frame-border" : 0,
        "append-to" : "body"
    };

    var Window = Widget.extend({

        "init" : function(options) {

            var widgetThis = this;

            widgetThis._varInit(options);

            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));

            widgetThis._init();

            widgetThis._createDialogInstance();

            widgetThis._applyJQueryCSSStyles(widgetThis.window);

        },
        "_varInit" : function(options) {
            var widgetThis = this;
            widgetThis.wId = 'tinywindow_' + new Date().getTime();
            widgetThis.wHeight = 375;
            widgetThis.wWidth = 500;
        },
        "_setOption" : function(key, value) {
            var widgetThis = this;
            widgetThis._super(key, value);
            switch(key) {
                case "position":
                case "draggable":
                case "resizable":
                    widgetThis.window.dialog("option", key, value);
                    break;
                case "buttons":
                    widgetThis._createWindowButtons();
                    widgetThis.window.dialog("option", key, widgetThis.dialogButtons);
                    break;
                case "width":
                case "height":
                case "content":
                case "icon":
                case "title":
                case "id":
                    var isOpen = false;
                    if (widgetThis.window.dialog("isOpen")) {
                        isOpen = true;
                    }
                    widgetThis.destroy();
                    widgetThis._init();
                    widgetThis._createDialogInstance();
                    if (isOpen) {
                        widgetThis.show();
                    }
                    break;
                default:
                    break;
            }
        },
        "rendTo" : function(elementId) {
            var widgetThis = this;
            widgetThis._setOption("id", elementId);
            return widgetThis;
        },
        "show" : function() {
            var widgetThis = this;
            widgetThis.window.dialog("open");
            widgetThis._applyJQueryCSSStyles(widgetThis.window);
        },
        "destroy" : function() {
            var widgetThis = this;


            widgetThis.window.dialog("close");
            $(document).unbind("keydown.tinywin", widgetThis.btnTrigger);
            $("#" + widgetThis.wId).parent().remove();

        },

        "_addBehavior" : function() {
            var widgetThis = this;
            var options = widgetThis.options;
            if ( typeof options["open"] === "function") {
                widgetThis.on("open", options["open"]);
            }
            if ( typeof options["close"] === "function") {
                widgetThis.on("close", options["close"]);
            }
            if ( typeof options["beforeClose"] === "function") {
                widgetThis.on("beforeClose", options["beforeClose"]);
            }
            if ( typeof options["drag"] === "function") {
                widgetThis.on("drag", options["drag"]);
            }
            if ( typeof options["resize"] === "function") {
                widgetThis.on("resize", options["resize"]);
            }
            if ( typeof options["minimize"] === "function") {
                widgetThis.on("minimize", options["minimize"]);
            }
            if ( typeof options["maximize"] === "function") {
                widgetThis.on("maximize", options["maximize"]);
            }
            if ( typeof options["restore"] === "function") {
                widgetThis.on("restore", options["restore"]);
            }

            widgetThis.btnTrigger = function (event) {
                for (var i = 0; i < widgetThis.dialogButtons.length; i ++) {
                    if (widgetThis.dialogButtons[i].focused == true && event.keyCode == 13){
                        event.preventDefault();
                        if ($.isFunction(widgetThis.dialogButtons[i].click)) {
                            widgetThis.dialogButtons[i].click(event);
                        }

                        $(document).find(".tiny-button-focus").removeClass("tiny-button-focus");
                        widgetThis.dialogButtons[i].focused = false;

                        break;
                    }
                }
            };
            $(document).bind("keydown.tinywin", widgetThis.btnTrigger);
        },


        "_dragHandler" : function(evt) {
            $(this).widget().trigger("drag", [evt]);
        },

        "_closeHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("close", [evt]);
            $(document).unbind("keydown.tinywin", widgetThis.btnTrigger);
            $("#dialog-extend-fixed-container").remove();
            $("#" + widgetThis.wId).parent().remove();
        },

        "_beforeCloseHandler" : function(evt) {
            $(this).widget().trigger("beforeClose", [evt]);
        },

        "_openHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("open", [evt]);
        },

        "_resizeHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("resize", [evt]);
        },
        "_restoreHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("restore", [evt]);
        },

        "_minimizeHandler" : function(evt) {
            var widgetThis = $(this).widget();
            $("#dialog-extend-fixed-container").css("z-index", 10000);
            widgetThis.trigger("minimize", [evt]);
        },

        "_maximizeHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("maximize", [evt]);
        },

        "_init" : function() {
            var widgetThis = this, options = widgetThis.options;
            widgetThis.dialogButtons = [];
            widgetThis.focus = 0;
            if (options) {
                widgetThis.wIcon = options.icon;
                options["content-type"] = options["content-type"] && options["content-type"] === "url" ? "url" : "simple";
                options["content"] = options.content;
                options["modal"] = util.isFalse(options["modal"]) ? false : true;
                options["draggable"] = util.isFalse(options["draggable"]) ? false : true;
                options["resizable"] = util.isFalse(options["resizable"]) ? false : true;
                options["minimizable"] = util.isFalse(options["minimizable"]) ? false : true;
                options["maximizable"] = util.isFalse(options["maximizable"]) ? false : true;
                widgetThis.wHeight = options.height && !isNaN(parseInt(options["height"], 10)) && parseInt(options["height"], 10) > 0 ? parseInt(options["height"], 10) : widgetThis.wHeight;
                widgetThis.wWidth = options.width && !isNaN(parseInt(options["width"], 10)) && parseInt(options["width"], 10) > 0 ? parseInt(options["width"], 10) : widgetThis.wWidth;
                options["frame-border"] = options["frame-border"] && !isNaN(parseInt(options["frame-border"], 10)) && parseInt(options["frame-border"], 10) >= 0 ? parseInt(options["frame-border"], 10) : 0;
            }
            var title = options["title"], titleText = options["title"];

            if (options["icon"]) {
                title = '<span id="title_icon_' + widgetThis.wId + '" class="tinyWindow_window_title_icon" style="background-image : url(' + $.encoder.encodeForCSS('background-image', options["icon"], true) + ');"></span>' + title;
            }
            if (widgetThis.wWidth === 'auto' && options["content-type"] === 'simple') {
                var tempObj = $('<span style="visibility:hidden;"></span>'), actwid;
                $('body').append(tempObj);
                tempObj.html(options["content"]);
                actwid = tempObj.width();
                tempObj.remove();
                tempObj = null;
                widgetThis.wWidth = actwid;
            }

            widgetThis._createWindowButtons();

            var wOptions = {
                autoOpen : false,
                title : title,
                titleText : titleText,
                height : widgetThis.wHeight,
                width : widgetThis.wWidth,
                draggable : options["draggable"],
                modal : options["modal"],
                closeOnEscape : false,
                drag : widgetThis._dragHandler,
                beforeClose : widgetThis._beforeCloseHandler,
                close : widgetThis._closeHandler,
                open : widgetThis._openHandler,
                resize : widgetThis._resizeHandler,
                buttons : widgetThis.dialogButtons,
                appendTo : options["id"] ? ("#" + options["id"]) : options["append-to"],
                resizable : options["resizable"]
            };
            if (options.position) {
                wOptions.position = options.position;
            }

            widgetThis.wOptions = wOptions;
            var wExtendOptions;
            wExtendOptions = wExtendOptions ? wExtendOptions : {};
            if (options["minimizable"]) {
                wExtendOptions = wExtendOptions ? wExtendOptions : {};
                wExtendOptions.minimizable = options["minimizable"];
                wExtendOptions.minimize = widgetThis._minimizeHandler;
            }
            if (options["maximizable"]) {
                wExtendOptions = wExtendOptions ? wExtendOptions : {};
                wExtendOptions.maximizable = options["maximizable"];
                wExtendOptions.maximize = widgetThis._maximizeHandler;
            }
            wExtendOptions.restore = widgetThis._restoreHandler;
            widgetThis.wExtendOptions = wExtendOptions;
        },

        "_createWindowButtons" : function() {
            var widgetThis = this, options = widgetThis.options, okBtnTitile = widgetsLanguage.okBtnTitile, cancelBtnTitile = widgetsLanguage.cancelBtnTitile, yesBtnTitile = widgetsLanguage.yesBtnTitile, noBtnTitile = widgetsLanguage.noBtnTitile, label = null, key = null, accessKeyValue = null, defaultFocus = false, buttonHandler = null, buttonDetails = null;
            if (null == options["buttons"]) {
                widgetThis.dialogButtons = [];
                return;
            }
            if (options["buttons"].length > 0) {
                for (var i = 0; i < options["buttons"].length; i++) {
                    if (options["buttons"][i]) {
                        buttonHandler = null;
                        label = options["buttons"][i]["label"] ? options["buttons"][i]["label"] : '';
                        key = options["buttons"][i]["key"] ? options["buttons"][i]["key"] : 'btn' + i;
                        accessKeyValue = options["buttons"][i]["accessKey"] ? options["buttons"][i]["accessKey"] : "";
                        defaultFocus = options["buttons"][i]["focused"] ? options["buttons"][i]["focused"] : false;
                        buttonDetails = {
                            accessKey : accessKeyValue,
                            text : label,
                            key : key,
                            focused : defaultFocus,
                            click : function(e) {
                                evt = (window.event) ? event : e;
                                var btnLabel = null;
                                for (var k = 0; k < options["buttons"].length; k++) {
                                    if ((evt.keyCode == 13) && ("function" == ( typeof options["buttons"][k]['handler']))
                                         && options["buttons"][k]['focused']) {
                                        options["buttons"][k]['handler'](evt);
                                        break;
                                    }
                                    btnLabel = evt.target ? evt.target.textContent : evt.srcElement.innerText;
                                    if (options["buttons"][k]['label'] === btnLabel) {
                                        buttonHandler = options["buttons"][k]['handler'];
                                        break;
                                    }
                                }
                                if (buttonHandler) {
                                    buttonHandler({
                                        "type" : "button",
                                        "value" : btnLabel
                                    });
                                }
                            }
                        };
                        widgetThis.dialogButtons[i] = buttonDetails;
                        buttonDetails = [];
                    }
                }
            } else {
                widgetThis.dialogButtons = [widgetThis._oBtn(okBtnTitile, true), widgetThis._oBtn(cancelBtnTitile)];
            };

            for (var j = 0; j < widgetThis.dialogButtons.length; j++) {
                if (widgetThis.dialogButtons[j]['focused'] === true) {
                    widgetThis.focus = j;
                    break;
                }
            }
        },

        "setButton" : function(key, clickfn, text) {
            var widgetThis = this, options = widgetThis.options;
            if (options["buttons"].length > 0) {
                for (var i = 0; i < options["buttons"].length; i++) {
                    var btn = options["buttons"][i];
                    if (btn["key"] == key) {
                        btn.label = text || btn.label;
                        if ( typeof (clickfn) == "function") {
                            btn.handler = clickfn;
                        }
                    }
                }
            }
            widgetThis.option("buttons", options["buttons"]);
        },

        "_oBtn" : function(title, focused) {
            var widgetThis = this;
            var oBtn = {
                text : title,
                focused : focused,
                click : function() {
                    widgetThis.destroy();
                    if (widgetThis.options["callback"]) {
                        widgetThis.options["callback"]({
                            "type" : "button",
                            "value" : title
                        });
                    }
                }
            };
            return oBtn;
        },
        "_createDialogInstance" : function() {
            var widgetThis = this, options = widgetThis.options;
            widgetThis.wBaseDiv = $('<div id="baseDiv_' + widgetThis.wId + ' " style="height:100%;width:100%" ><div class="viewport" style="height:100%;width:100%"><div class="overview"></div></div></div>');
            if (options["content-type"] === 'url') {
                widgetThis.wBaseDiv.find(".overview").load(options["content"],  function(response, status, xhr) {
                    if (status == 'error') {
                        widgetThis.checkInvalidRequest(xhr.responseText);
                        return;
                    }
                    if(typeof options["completeFn"] === "function") {
                        options["completeFn"]
                    }
                });
            } else {
                widgetThis.wBaseDiv.find(".overview").html(options["content"]);
            }
            widgetThis.windowElement = $('<div id=' + widgetThis.wId + '></div>').html(widgetThis.wBaseDiv);
            widgetThis.windowElement.widget(widgetThis);
            widgetThis.window = widgetThis.windowElement.dialog(widgetThis.wOptions);
            if (widgetThis.wExtendOptions) {
                widgetThis.window.dialogExtend(widgetThis.wExtendOptions);
            }
            widgetThis.window.bind("drag", widgetThis._dragHandler);
            if (widgetThis.complexIFrameId) {
                var iframeWindow = $('#'+widgetThis.complexIFrameId)[0].contentWindow;
            }
            widgetThis.window.parent().keydown(function(e) {
                if (e.keyCode === $.ui.keyCode.ESCAPE) {
                    widgetThis.destroy();
                }
                return;
            });

            widgetThis._element = widgetThis.windowElement.parent();
            widgetThis._element.widget(widgetThis);
        },
        "_applyJQueryCSSStyles" : function(element) {
            var widgetThis = this,dialogElement = element.parent(),id=widgetThis.options.winId||(element[0].id);
            dialogElement.attr('id', widgetThis.options.winId);
            $('#' + id + ' .ui-dialog-titlebar-close').addClass('window-titlebar-close');
            $('#' + id + ' .ui-dialog-title').addClass('window_title');
            $('#' + id + ' .ui-icon').addClass('window_icon');
            $('#' + id + ' .ui-widget-header').addClass('window_widget_header');
            $('#' + id + ' .ui-dialog-content').addClass('window_dialog_content');
            $('#' + id + ' .ui-corner-all,.ui-corner-bottom,.ui-corner-right,.ui-corner-br').addClass('window_corner_right_style');
            $('#' + id + ' .ui-corner-all,.ui-corner-bottom,.ui-corner-left,.ui-corner-bl').addClass('window_corner_left_style');
            $('#' + id + ' .ui-icon.ui-icon-minus').addClass('window-icon-minus');
            $('#' + id + ' .ui-icon.ui-icon-extlink').addClass('window-icon-extlink');
            $('#' + id + ' .ui-icon.ui-icon-newwin').addClass('window-icon-newwin');
            $('#' + id + ' .ui-icon.ui-icon-closethick').addClass('window-icon-closethick');
            $('#' + id + ' .ui-dialog').addClass('window_main');
        }
    });

    return Window;
});
