define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-lib/jquery.ztree.all", "tiny-lib/jquery.ztree.exhide", "tiny-widgets/Widget"], 
function(angular, $, Class, zTreeAll, zTreeExhide, Widget) {
    var DEFAULT_CONFIG = {
        "template" : '<ul class="ztree"></ul>',
        "display" : true,
        "values" : []
    };
    
    var CONST_VALUES = {
        "DECIMAL" : 10
    };

    var Tree = Widget.extend({
        "init" : function(options) {
            var treeThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            treeThis._super(options);
            treeThis._propInit();
            treeThis._setOptions(treeThis.options);
            $("#"+options["id"]).append(treeThis._element);
        },
        "_propInit" : function() {
            var treeThis = this;
            treeThis.zSetting = {
                async : {
                    autoParam : [],
                    contentType : "application/x-www-form-urlencoded",
                    dataFilter : null,
                    dataType : "text",
                    enable : false,
                    otherParam : [],
                    type : "post",
                    url : ""
                },
                callback : {
                    beforeAsync : null,
                    beforeCheck : null,
                    beforeClick : null,
                    beforeCollapse : null,
                    beforeDblClick : null,
                    beforeDrag : null,
                    beforeDragOpen : null,
                    beforeDrop : null,
                    beforeEditName : null,
                    beforeExpand : null,
                    beforeMouseDown : null,
                    beforeMouseUp : null,
                    beforeRemove : null,
                    beforeRename : null,
                    beforeRightClick : null,

                    onAsyncError : null,
                    onAsyncSuccess : null,
                    onCheck : null,
                    onClick : null,
                    onCollapse : null,
                    onDblClick : null,
                    onDrag : null,
                    onDrop : null,
                    onExpand : null,
                    onMouseDown : null,
                    onMouseUp : null,
                    onNodeCreated : null,
                    onRemove : null,
                    onRename : null,
                    onRightClick : null
                },

                check : {
                    autoCheckTrigger : false,
                    chkboxType : {
                        "Y" : "ps",
                        "N" : "ps"
                    },
                    chkStyle : "checkbox",
                    enable : false,
                    nocheckInherit : false,
                    chkDisabledInherit : false,
                    radioType : "level"
                },

                data : {
                    keep : {
                        leaf : false,
                        parent : false
                    },
                    key : {
                        checked : "checked",
                        children : "children",
                        name : "name",
                        title : "",
                        url : "url"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "id",
                        pIdKey : "pId",
                        rootPId : null
                    }
                },

                edit : {
                    drag : {
                        autoExpandTrigger : true,
                        isCopy : true,
                        isMove : true,
                        prev : true,
                        next : true,
                        inner : true,
                        borderMax : 10,
                        borderMin : -5,
                        minMoveSize : 5,
                        maxShowNodeNum : 5,
                        autoOpenTime : 500
                    },
                    editNameSelectAll : false,
                    enable : false,
                    removeTitle : "remove",
                    renameTitle : "rename",
                    showRemoveBtn : true,
                    showRenameBtn : true
                },

                view : {
                    addDiyDom : null,
                    addHoverDom : null,
                    autoCancelSelected : true,
                    dblClickExpand : true,
                    expandSpeed : "fast",
                    fontCss : {},
                    nameIsHTML : false,
                    removeHoverDom : null,
                    selectedMulti : true,
                    showIcon : true,
                    showLine : false,
                    showTitle : true
                }
            };
            treeThis.zNodes = [];
        },
        "_setOptions" : function(options) {
            var key;
            var isNeedCreate = false;
            for (key in options) {
            	//judge which attributes should creat Tree
                var isNeed = this._setOption(key, options[key]);
                if (isNeed) {
                    isNeedCreate = true;
                }
            }

            if (isNeedCreate) {
                this._initZTree();
            }
            return this;
        },
        "_initZTree" : function() {
            var treeThis = this;  
            if (treeThis.zTreeObj) {
                treeThis.zTreeObj.destroy();
            }
            // 不指定id时,使用默认id. 如果id中途被修改,则会丢失zTreeObj,请不要中途修改id
            if("undefined"==typeof(treeThis.options["id"])){
            	treeThis.zTreeId = _.uniqueId('tiny-tree-');
            }
            else {
                treeThis.zTreeId = treeThis.options["id"];
            }
            treeThis._element.attr("id", treeThis.zTreeId);
            
            $.fn.zTree.init(treeThis._element, treeThis.zSetting, treeThis.zNodes);
            treeThis.zTreeObj = $.fn.zTree.getZTreeObj(treeThis.zTreeId);
        },
        "_setOption" : function(key, value) {
            var treeThis = this;
            treeThis._super(key, value);
            var isNeedCreate = false;
            switch (key) {
            	case "id" :
                    treeThis._updateId(value);
                    break;
                case "display" :
                    treeThis._updateDisplay();
                    break;
                case "width" :
                    treeThis._updateWidth();
                    break;
                case "height" :
                    treeThis._updateHeight();
                    break;
                case "cls" :
                    treeThis._updateCls();
                    break;
                case "setting" : 
                    treeThis._updateSetting();
                    isNeedCreate = true;
                    break;
                case "values" :
                    treeThis._updateValues();
                    isNeedCreate = true;
                    break;
                default :
                    break;
            }
            return isNeedCreate;
        },
        "_updateDisplay" : function() {
            var treeThis = this;
            var options = treeThis.options;
            if (options["display"]) {
                treeThis._element.show();
            }
            else {
                treeThis._element.hide();
            }
        },
        "_updateWidth" : function() {
            var treeThis = this;
            var options = treeThis.options;
            var width = parseInt(options["width"], CONST_VALUES.DECIMAL);
            treeThis._element.css("width", width);
        },
        "_updateHeight" : function() {
            var treeThis = this;
            var options = treeThis.options;
            var height = parseInt(options["height"], CONST_VALUES.DECIMAL);
            treeThis._element.css("height", height);
        },
        //考虑去掉！！
        "_updateCls" : function() {
            var treeThis = this;
            var options = treeThis.options;

            if (_.isString(options["cls"])) {
                var currCls = treeThis._element.attr("class");
                currCls = currCls.replace("ztree", "");
                treeThis._element.removeClass(currCls).addClass(options["cls"]);
            }
            
            if (_.isObject(options["cls"])) {
                treeThis._element.css(options["cls"]);
            }
        },
        "_updateSetting" : function() {
            var treeThis = this;
            var options = treeThis.options;
            if (_.isObject(options["setting"])) {
                _.extend(treeThis.zSetting, options["setting"]);
            }
        },
        "_updateValues" : function() {
            var treeThis = this;
            var options = treeThis.options;            
            treeThis.zNodes = _.isArray(options["values"]) ? options["values"] : [];
        },
        //命名更改，开放！！
        "getZTreeObj" : function() {
            return this.zTreeObj;
        }
    });
    return Tree;
});
