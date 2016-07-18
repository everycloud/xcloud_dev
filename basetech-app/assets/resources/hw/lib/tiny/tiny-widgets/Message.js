define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util", "tiny-lib/jquery-ui.custom.min", "tiny-lib/jquery.ui.dialog", "language/widgetsLanguage", "tiny-lib/encoder"],
function(angular, $, Class, Widget, util, jqueryui, jqueryuidialog, widgetsLanguage, encoder) {
    var DEFAULT_CONFIG = {
        "template" : '',
        "id" : null,
        "modal" : true,
        "title" : "",
        "content" : "",
        "detail-msg" : "",
        "width" : "330px",
        "height" : "auto",
        "msg-icon" : "",
        "buttons" : [],
        "callback" : null,
        "position" : "auto",
        "resizable" : false,
        "type" : "prompt",
        "append-to" : "body"
    };

    var Message = Widget.extend({

        "init" : function(options) {

            var widgetThis = this;

            widgetThis._varInit(options);

            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));

            widgetThis._init(options);

        },
        "_varInit" : function(options) {
            var widgetThis = this;
            widgetThis.mDialog = widgetThis;
            widgetThis.actualDialogTitle = null;
            var rand1 = (Math.floor(Math.random() * 100000) + 1), rand2 = (Math.floor(Math.random() * 100000) + 1);
            widgetThis.dialogId = "MessageDialog_" + rand1 + "_" + rand2;
            widgetThis.DEFAULT_IMG = "../themes/default/images/space.gif";
        },
        "show" : function() {
            var widgetThis = this;
            widgetThis.messageDialog.dialog('open');
            widgetThis.messageDialog.parent().attr('id', 'messageDialog_main_' + widgetThis.messageDialog[0].id);
        },
        "destroy" : function() {
            var widgetThis = this;
            widgetThis.messageDialog.dialog("destroy");
            $(document).unbind("keydown.tinyMsg");
            $("#" + widgetThis.dialogId).remove();
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
            $(document).bind("keydown.tinyMsg", function (event) {
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
            });
        },
        "_closeHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("close", [evt]);
            $(document).unbind("keydown.tinyMsg");
            $("#" + widgetThis.dialogId).remove();
        },

        "_openHandler" : function(evt) {
            var widgetThis = $(this).widget();
            widgetThis.trigger("open", [evt]);
        },
        "_setOption" : function(key, value) {
            var widgetThis = this;
            widgetThis._super(key, value);
            switch(key) {
                case "title":
                case "position":
                    widgetThis.messageDialog.dialog("option", key, value);
                    break;
                case "buttons":
                    widgetThis._createMsgBoxButtons();
                    widgetThis.messageDialog.dialog("option", key, widgetThis.dialogButtons);
                    break;
                case "width":
                case "height":
                case "detail-msg":
                case "content":
                case "id":
                    var isOpen = false;
                    if (widgetThis.messageDialog.dialog("isOpen")) {
                        isOpen = true;
                    }
                    widgetThis.destroy();
                    widgetThis._init(widgetThis.options);
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
        "_setContent" : function() {
            var widgetThis = this, options = widgetThis.options;
            if (options["type"]) {
                var $imgDiv = $("<div></div>");
                var $defaultImgDiv = $("<div class='tinyMesageDialog_default_" + options["type"] + "_img'></div>");
                var $img = $("<div></div>");
                widgetThis.titleText = '';
                switch (options["type"]) {
                    case "warn":
                    case "prompt":
                    case "error":
                    case "confirm":
                    case "systemNotice":
                        widgetThis._setContentByType(options["type"], $img, $imgDiv);
                        break;
                    default:
                        break;
                }
            }
        },
        "_setContentByType" : function(type, $img, $imgDiv) {
            var widgetThis = this, options = widgetThis.options;
            var title = {
                "prompt" : widgetsLanguage.promptTitle,
                "error" : widgetsLanguage.errorTitle,
                "warn" : widgetsLanguage.warnTitle,
                "confirm" : widgetsLanguage.confirmTitle,
                "systemNotice" : widgetsLanguage.systemNoticeTitle
            };
            options["title"] = (options["title"] && !util.isEmptyString(options["title"])) ? options["title"] : title[type];

            if (options["msg-icon"] != "") {
                $("img", $img.append("<img>")).attr("src", options["msg-icon"]);
            }

            if (type !== "systemNotice") {
                widgetThis.titleText = options["title"];
                if (options["msg-icon"] == null || options["msg-icon"] == "") {
                    $img.addClass("tiny-img-" + type);
                }
                $imgDiv.append($img);
                widgetThis.content = widgetThis._createMsgBoxContent($imgDiv, options["content"]);
                widgetThis._createMsgBoxButtons();
            } else {
                $img.addClass("tiny-img-systemNotice");
                widgetThis.actualDialogTitle = options["title"];
                options["msg-icon"] = $imgDiv.html();
                options["title"] = $imgDiv.html() + options["title"];
                widgetThis.titleText = options["title"];
                widgetThis.content = widgetThis._createMsgBoxContent($imgDiv, options["content"]);
            }

        },
        "_setDetailMsg" : function() {
            var widgetThis = this, options = widgetThis.options, detailMsg = document.getElementById("detailsMsg" + widgetThis.mDialog.dialogId);
            if (detailMsg) {
                var detailsMsgContentShowFlag = false;
                detailMsg.onclick = function() {
                    if (options["type"] == "systemNotice" && options["detail-url"]) {
                        window.open(options["detail-url"]);
                        return;
                    }
                    var $detailsMsgContent = $("#detailsMsgContent" + widgetThis.mDialog.dialogId);
                    if (detailsMsgContentShowFlag === false) {
                        $detailsMsgContent.removeClass("tiny-dialog-detail-close").addClass("tiny-dialog-detail-open").html(options["detail-msg"]);
                        detailsMsgContentShowFlag = true;
                    } else {
                        $detailsMsgContent.removeClass("tiny-dialog-detail-open").addClass("tiny-dialog-detail-close").html("");
                        detailsMsgContentShowFlag = false;
                    }
                };
            }
        },
        "_init" : function(dialogOptions) {
            var widgetThis = this, options = widgetThis.options, okAccessKey = "O", cancelAccessKey = "C", yesAccessKey = "Y", noAccessKey = "N";
            widgetThis.dialogButtons = [];
            widgetThis.focus = 0;
            options["modal"] = (util.isFalse(options["modal"])) ? false : true;

            var msgBoxWidth = parseInt(options["width"], 10),
                msgBoxHeight = parseInt(options["height"], 10);
            widgetThis.dialogWidth = (isNaN(msgBoxWidth) || msgBoxWidth < 0 ) ? "330" : msgBoxWidth;
            widgetThis.dialogHeight = (isNaN(msgBoxHeight) || msgBoxHeight < 0 ) ? "auto" : msgBoxHeight;

            widgetThis._setContent();

            var $dialogDiv = $("<div id=" + widgetThis.dialogId + "></div>");
            options["title"] = (options["title"] == null) ? "" : options["title"];
            for (var j = 0; j < widgetThis.dialogButtons.length; j++) {
                if (widgetThis.dialogButtons[j]['focused'] === true) {
                    widgetThis.focus = j;
                    break;
                }
            }

            if (options["type"] == "systemNotice") {
                widgetThis.messageDialog = $dialogDiv.html(widgetThis.content).dialog({
                    autoOpen : false,
                    title : options["title"],
                    titleText : widgetThis.actualDialogTitle,
                    titleIcon : $.encoder.encodeForHTMLAttribute("titleIcon", options["msg-icon"], true),
                    dialogType : options["type"],
                    draggable : false,
                    close : widgetThis._closeHandler,
                    open : widgetThis._openHandler,
                    show : {
                        effect : 'clip',
                        duration : 750
                    },
                    hide : {
                        effect : 'clip',
                        duration : 750
                    },
                    resizable : options["resizable"],
                    modal : false,
                    minHeight : false,
                    height : widgetThis.dialogHeight,
                    width : widgetThis.dialogWidth,
                    position : "right bottom",
                    appendTo : options["id"] ? ("#" + options["id"]) : null
                });
            } else {
                widgetThis.messageDialog = $dialogDiv.html(widgetThis.content).dialog({
                    autoOpen : false,
                    title : options["title"],
                    titleText : widgetThis.titleText,
                    dialogType : options["type"],
                    buttons : widgetThis.dialogButtons,
                    show : 'fade',
                    resizable : options["resizable"],
                    modal : options["modal"],
                    minHeight : false,
                    height : widgetThis.dialogHeight,
                    width : widgetThis.dialogWidth,
                    position : options["position"],
                    close : widgetThis._closeHandler,
                    open : widgetThis._openHandler,
                    appendTo : options["id"] ? ("#" + options["id"]) : options["append-to"]
                });
            }

            $dialogDiv.widget(widgetThis);

            widgetThis.messageDialog.bind("dialogclose", function(event, ui) {
                widgetThis.mDialog.destroy();
                if (options["callback"]) {
                    options["callback"]({
                        "type" : "closed",
                        "value" : true
                    });
                }
            });

            widgetThis._setDetailMsg();

        },
        "_createMsgBoxContent" : function($imgDiv, dialogContent) {
            var widgetThis = this, msgBoxContent = "", divClass = "<div class='tiny-dialog-pic'>";
            
            if (widgetThis.options["msg-icon"] !== "") {
                divClass = "<div class='tiny-dialog-pic-custom'>";
            }
            
            if (widgetThis.options["type"] !== "systemNotice") {
                if (widgetThis.options["detail-msg"]) {
                    msgBoxContent = divClass + $imgDiv.html() + "</div><div class='tiny-dialog-content tinyMessageBox_msgBoxContent'>" + dialogContent + "</div><div class='tiny-dialog-detail tinyMessageBox_msgBoxContent'>" + "<a href='javascript:void(0)' id='detailsMsg" + widgetThis.mDialog.dialogId + "'>" + widgetsLanguage.detailMsgHeading + "</a>" + "<div id ='detailsMsgContent" + widgetThis.mDialog.dialogId + "'></div></div>";
                } else {
                    msgBoxContent = divClass + $imgDiv.html() + "</div><div class='tiny-dialog-content tinyMessageBox_msgBoxContent'>" + dialogContent + "</div>";
                }
            } else {
                if (widgetThis.options["detail-msg"]) {
                    if (widgetThis.options["detail-url"]) {
                        msgBoxContent = "<div class='tiny-dialog-sys-content'>" + dialogContent + "</div>" + "<a href='javascript:void(0)' id='detailsMsg" + widgetThis.mDialog.dialogId + "'>" + widgetThis.options["detail-msg"] + "</a>" + "</div>";
                    } else {
                        msgBoxContent = "<div class='tiny-dialog-sys-content'>" + dialogContent + "</div>" + "<a href='javascript:void(0)' id='detailsMsg" + widgetThis.mDialog.dialogId + "'>" + widgetsLanguage.detailMsgHeading + "</a>" + "<div id ='detailsMsgContent" + widgetThis.mDialog.dialogId + "'></div></div>";
                    }

                } else {
                    msgBoxContent = "<div>" + dialogContent + "</div>";
                }
            }

            return msgBoxContent;
        },
        "_createMsgBoxButtons" : function() {
            var widgetThis = this, options = widgetThis.options, okBtnTitile = widgetsLanguage.okBtnTitile, cancelBtnTitile = widgetsLanguage.cancelBtnTitile, yesBtnTitile = widgetsLanguage.yesBtnTitile, noBtnTitile = widgetsLanguage.noBtnTitile, label = null, key = null, accessKeyValue = null, defaultFocus = false, buttonHandler = null, buttonDetails = null;
            if (null == options["buttons"]) {
                widgetThis.dialogButtons = [];
                return;
            }
            if (options["buttons"].length > 0) {
                for (var i = 0; i < options["buttons"].length; i++) {
                    if (options["buttons"][i]) {
                        buttonHandler = null;
                        label = options["buttons"][i]['label'] ? options["buttons"][i]['label'] : '';
                        key = options["buttons"][i]["key"] ? options["buttons"][i]["key"] : 'btn' + i;
                        accessKeyValue = options["buttons"][i]['accessKey'] ? options["buttons"][i]['accessKey'] : '';
                        defaultFocus = options["buttons"][i]['focused'] ? options["buttons"][i]['focused'] : false;
                        majorBtn = options["buttons"][i]['majorBtn'] ? options["buttons"][i]['majorBtn'] : false;
                        buttonDetails = {
                            accessKey : accessKeyValue,
                            text : label,
                            key : key,
                            focused : defaultFocus,
                            majorBtn : majorBtn,
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
                if (options["type"] === 'error' || options["type"] === 'prompt') {
                    widgetThis.dialogButtons = [widgetThis._oBtn(okBtnTitile, true)];
                } else if (options["type"] === 'warn') {
                    widgetThis.dialogButtons = [widgetThis._oBtn(okBtnTitile, true), widgetThis._oBtn(cancelBtnTitile)];
                } else if (options["type"] === 'confirm') {
                    widgetThis.dialogButtons = [widgetThis._oBtn(yesBtnTitile, true), widgetThis._oBtn(noBtnTitile)];
                }
            }
        },
        "_oBtn" : function(title, focused) {
            var widgetThis = this;
            var oBtn = {
                text : title,
                focused : focused,
                containerType : "message",
                click : function() {
                    widgetThis.mDialog.destroy();
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
        
         "setButton" : function(key, clickfn, text) {
            var widgetThis = this, options = widgetThis.options;
            if (options["buttons"].length > 0) {
                for (var i = 0; i < options["buttons"].length; i++) {
                    var btn = options["buttons"][i];
                    if (btn !== null && btn["key"] == key) {
                        btn.label = text || btn.label;
                        if ( typeof (clickfn) == "function") {
                            btn.handler = clickfn;
                        }
                    }
                }
            }
            widgetThis.option("buttons", options["buttons"]);
        }
    });

    return Message;

});
