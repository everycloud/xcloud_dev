define( ["tiny-directives/Directive", "tiny-widgets/Slider"], function( Directive, sliderWidget ){
    
    var DEFAULT_CONFIG = {
        
        "directiveName": "tinySlider",
        
        "widgetClass": sliderWidget,
        
        "constantProperties": ["id","disable","leftCaption","rightCaption","from","to","step","smooth","limits","dimension","skin","scale","value"],
        
        "scope":{
        	"id" : "=",
        	"width" : "=",
        	"leftCaption" : "=",
        	"rightCaption" : "=",
        	"width" : "=",
        	"from" : "=",
        	"to" :"=",
        	"value" : "=",
        	"step" : "=",
        	"smooth" : "=",
        	"limits" : "=",
        	"dimension" : "=",
        	"skin" : "=",
        	"scale":"=",
        	"disable" : "=",
        	"change" : "&"
        },
        "replace" : true,
        "template":"<span></span>"
        
    };
    
    var slider = Directive.extend({
        
        "init": function(options){
            
            var directiveThis = this;
            
            directiveThis._super( _.extend( {}, DEFAULT_CONFIG, options )  );
            
        },
        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },
		
		"link": function( scope, element, attrMap ){
			var sliderThis = this,constants = _.pick(scope, sliderThis.constantProperties);
			
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});		
			element.prop("id",scope.id);	
			sliderThis = new sliderThis.widgetClass(_.pick(constants,validProperName));
			element.append(sliderThis._element);
			element.removeAttr("id");
			sliderThis._element.prop("id",scope.id);
			scope.$watch("width", function(newValues, oldValues) {
                sliderThis.option("width", newValues);
            });
            scope.$watch("value", function(newValues, oldValues) {
                sliderThis.option("value", newValues);
            });
            if (attrMap.change) {
                sliderThis.on("changeEvt", function(event,value) {
                    scope.$apply(scope.change);
                });
            }
        }

    });
    
    new slider().toAngularDirective();
    
    return slider;
    
} );
