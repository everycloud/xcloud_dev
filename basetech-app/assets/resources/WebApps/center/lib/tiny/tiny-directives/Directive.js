define(["tiny-lib/Class", "tiny-lib/underscore", "tiny-lib/jquery", "tiny-lib/angular", "tiny-widgets/common", "tiny-widgets/Widget"], 
    function(Class, _, $, angular, common, Widget){
    
    /*
     * 创建angular 指令模块 
     */
    angular.module( common.WIDGET_MODULE_NAME, [] );
    
    var DEFAULT_CONFIG = {
        
        "restrict": "E",
         
        "scope":{},
        
        "moduleName": common.WIDGET_MODULE_NAME,
        
        "directiveName": "wccDirective",
        
        "widgetClass": Widget,
        /**
         * 常量属性，必须在标签中指定常量值
         */
        "constantProperties": [],
        
        "controllerDependencies" : ['$scope', '$attrs', '$element', '$parse']
        
    };
    
    var Directive = Class.extend({
        
        "compile": function (element, attrMap, transclude) {
            
            var directiveThis = this;
            //只读取出常量的属性，用于构造 widgetInstance
            var widgetInstance = new directiveThis.widgetClass( _.pick( attrMap, directiveThis.constantProperties ) );
            
            var dom = widgetInstance.getDom();
            
            element.replaceWith( dom );
            
            return directiveThis.link;
            
        },
        
        "link": function (scope, element, attrMap){
            
            //在这里， 增加angular双向绑定等功能， 可以通过 element.widget()， 获取到对应的  widgetInstance
            
        },
        
        "controller": function(scope, attr, element, parse){
            
            
        },
        
        "init": function(options){
            
            var directiveThis = this;
            
            //对scope进行单独处理
            var scope = _.extend( {}, _.isObject( directiveThis.scope ) ? directiveThis.scope: {} , 
                                _.isObject( DEFAULT_CONFIG.scope ) ? DEFAULT_CONFIG.scope: {},
                                options && _.isObject( options.scope ) ? options.scope: {} );
            
            _.extend( directiveThis, DEFAULT_CONFIG, options );
            
            directiveThis.scope = scope;
            
            //为 compile 和 link 函数增加一层绑定, 防止 angular 调用时， 丢掉 directiveThis
            directiveThis.compile = _.bind( directiveThis.compile, directiveThis );
            directiveThis.link = _.bind( directiveThis.link, directiveThis );
            directiveThis.controller = _.bind( directiveThis.controller, directiveThis );
            //手动配置 directive controller 的依赖关系
            directiveThis.controller.$inject = directiveThis.controllerDependencies;
        },
        
        "toAngularDirective": function(){
            
            var directiveThis = this;
            
            //必须首先定义模块，否则报错 
            var module = angular.module( directiveThis.moduleName );
            
            module.directive( directiveThis.directiveName, function(){
                
                var directiveConfig = directiveThis;
                
                return directiveConfig;
                    
            } );
        },
        
        /**
         * 将驼峰形式的属性改为中划线形式，主要是为了解决指令方式中与构造器方式属性命名形式不一致的问题；
         * 注意：该方法只能在属性和事件名均为中划线的情况下在link函数中使用，如分页、进度条等控件
         * @param {Object} opts 驼峰形式的属性对象
         */
        "camelPropToSnake":function(opts){
        	
           var directiveThis = this;
       
           var destOpts = {};
           var destPropName = "";
           // 遍历对象属性，将驼峰形式转化为中划线形式
           for (var prop in opts) {
           	   // 过滤掉原型中的属性及用户未设置的属性
               if (opts.hasOwnProperty(prop) && !_.isUndefined(opts[prop])) {
                   destPropName = prop.replace(/([a-z\d])([A-Z]+)/g,'$1-$2').toLowerCase();
                   destOpts[destPropName] = opts[prop];
               }
           }
           return destOpts;
        }
        
    });
    
    return Directive;
        
});
