define(["tiny-lib/Class", "tiny-lib/jquery", "tiny-lib/underscore", "tiny-widgets/common"], function(Class, $, _, common){
    
    
    var ANGULAR_MODULE_PREFIX = "angular_module_";
    
    var ANGULAR_CONTROLLER_PREFIX = "angular_controller_";
    
    //angular绑定的 uuid
    var angular_uuid =0;
    
    var DEFAULT_CONFIG = {
        //考虑子类覆盖的情况
        "dependentAngularModules":[ "ng", common.WIDGET_MODULE_NAME ]
    };
    
    var emptyFn = function(){};
    
    var controllerFn =  function(model, scope){
        scope.model = model;
    };
    
    var ViewModel = Class.extend({
        
        "init":function(options){
            
            var modelThis = this;
            
            _.extend(modelThis, DEFAULT_CONFIG, options);
        },
        
        "getViewElement":function(){
            
            var modelThis = this;
            
            //如果存在viewElementId对应的唯一元素，则返回
            if(_.isString(modelThis.viewElementSelector))
            {
                var $dom = $(modelThis.viewElementSelector);
                if($dom.length === 1){
                    return $dom;
                }
            }
            
            return null;
            
        },
        
        "updateBindingView":function(){
            
            var modelThis = this;
            
            var $el = modelThis.getViewElement();
            
            if( !$el ){
                return;
            }
            
            var scope = angular.element($el).scope();
            
            //scope不存在
            if(!scope){
                return;
            }
            
            //判断是否已经在$apply阶段
            if(scope.$root && !scope.$root.$$phase){
                scope.$apply(emptyFn);
            }
            
            $el = null;
            
        },
        
        "bindView":function(){
            
            var modelThis = this;
            
            var $el = modelThis.getViewElement();
            
            if( !$el ){
                return;
            }
            
            var currentId = ( ++angular_uuid );

            var moduleName = ANGULAR_MODULE_PREFIX + currentId;

            var controllerName = ANGULAR_CONTROLLER_PREFIX + currentId; 
            
            //关联controller
            $el.attr("ng-controller",controllerName);
            
            //定义绑定模块
            angular.module(moduleName, modelThis.dependentAngularModules || [] )
                    .controller(controllerName, ["$scope", _.bind( controllerFn, null, modelThis ) ] );
            
            //指定动态绑定
            angular.bootstrap( $el ,[moduleName]);
                                  
            $el = null;  
        }
        
    });
    
    return ViewModel;
    
});
