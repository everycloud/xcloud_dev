/**
 * 原生控件的基类
 */
define(["tiny-widgets/Observable", "tiny-lib/jquery", "tiny-lib/underscore", "tiny-widgets/common"], 
function(Observable, $, _, common) {

    //扩展 jquery.fn, 增加 widget() 方法
    var WCC_WIDGET_INSTANCE_KEY = "wcc-widget-instance";
    $.fn.extend({
        "widget" : function(obj) {
            if (_.isUndefined(obj)) {
                return this.data(WCC_WIDGET_INSTANCE_KEY);
            }
            else {
                this.data(WCC_WIDGET_INSTANCE_KEY, obj);
            }
        }
    });

    var DEFAULT_CONFIG = {

        "template" : "<div> for test only, never instantiate Widget </div>"

    };

    var Widget = Observable.extend({

        "init" : function(options) {

            var widgetThis = this;

            widgetThis._super(options);
            widgetThis.options = {};
            // 这里未做深拷贝. 不支持动态更新的属性,请自行实现深拷贝
            _.extend(widgetThis.options, DEFAULT_CONFIG, options);

            widgetThis._element = widgetThis._generateElement();
            widgetThis._element.widget(widgetThis);
            widgetThis._addBehavior();
        },

        "getDom" : function() {

            var widgetThis = this;

            return widgetThis._element;

        },

        "remove" : function() {

            var widgetThis = this;
            widgetThis._element.remove();
            widgetThis._element = null;

        },
        "rendTo" : function(elementId) {
            var widgetThis = this;
        	var element = null;
        	if(typeof elementId === "object") {
        		element = $(elementId);
            }
        	else {
        		element = $("#" + elementId);
        	}
            widgetThis._element.appendTo(element);
            if (widgetThis.options.focused) {
            	widgetThis._element.find(':input[focused="true"]').focus();
            }
            
            return widgetThis;
        },
        "option" : function(key, value) {

            var widgetThis = this, options = {};
            
            //参数个数为0时，返回options对象
            if (arguments.length === 0) {
                return _.extend({}, widgetThis.options);
            }

            if (_.isString(key)) {
                
                //参数个数为1时，返回对应的属性值
                if (_.isUndefined(value)) {
                    return widgetThis.options[key] === undefined ? null : this.options[key];
                }
                //参数个数为2时，更新options中对应的属性值；
                options[key] = value;

            }
            else if (_.isObject(key)) {
                options = key;
            }
            else {
                return;
            }

            widgetThis._setOptions(options);

        },

        "_setOptions" : function(options) {

            var key;
            for (key in options ) {
                this._setOption(key, options[key]);
            }

            return this;
        },

        /**
         * 子类继承，  用于处理属性的设置
         * @param {Object} key
         * @param {Object} value
         */
        "_setOption" : function(key, value) {
        	
            // 数组和对象进行深拷贝,避免使用引用导致互相影响。函数深拷贝会出问题
            if (_.isFunction(value)) {
            	this.options[key] = value;
            }
            else if (_.isArray(value)) {
            	this.options[key] = $.extend(true, [], value); 
            }
            else if (_.isObject(value)) {
            	this.options[key] = $.extend(true, {}, value);
            }
            else {
            	this.options[key] = value;
            } 
            return this;
        },

        "_generateElement" : function() {

            var widgetThis = this;

            var html = _.template( widgetThis.options.template )(this);

            return $(html);

        },

        "_addBehavior" : function() {

            var widgetThis = this;

            return;

        },
        //set directive id
        "_updateId" : function(id){
        	var widgetThis = this;
        	//distinguish directive&&constructor  
        	if($("#" + id).length>0){
			   return;
			}
			widgetThis._element.prop("id", id);	
        },
        "checkInvalidRequest": function (data) {
            //注意：该错误码为登陆失败，需要跳转到登陆首页
            if (typeof data === "string") {
                try {
                    var jsonObj = JSON.parse(data);
                    if (jsonObj.code === "0003005010") {
                        top.location.href = jsonObj.message;
                    }
                    return true;
                }
                catch (e) {
                }
            }
            return false;
        }
    });

    return Widget;

});
