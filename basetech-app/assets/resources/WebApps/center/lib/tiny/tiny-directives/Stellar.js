define(["tiny-directives/Directive", "tiny-widgets/Stellar"], function(Directive, StellarWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyStellar",
        "widgetClass" : StellarWidget,
        "scope" : {
            "id" : "=",
            "width" : "=",
            "height" : "=",
            "selectOptions" : "=",
            "sliderOptions" : "=",
            "axisStart" : "=",
            "axisEnd" : "=",
            "axisUnit" : "=",
            "values" : "=",
            "axisDisplay" : "=block",
            "selectchange" : "&",
            "sliderchange" : "&",
            "search" : "&"
        }
    };

    var Stellar = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },

        "link" : function(scope, element, attrMap) {
            scope.$watch("id", function(newValue, oldValue){
                element.widget().option("id", newValue);  
            });
            
            scope.$watch("width", function(newValue, oldValue){
                element.widget().option("width", newValue);  
            });
            
            scope.$watch("height", function(newValue, oldValue){
                element.widget().option("height", newValue);  
            });
            
            scope.$watch("selectOptions", function(newValue, oldValue){
                element.widget().option("selectOptions", newValue);  
            });
            
            scope.$watch("sliderOptions", function(newValue, oldValue){
                element.widget().option("sliderOptions", newValue);  
            });
            
            scope.$watch("axisStart", function(newValue, oldValue){
                element.widget().option("axisStart", newValue);  
            });
            
            scope.$watch("axisEnd", function(newValue, oldValue){
                element.widget().option("axisEnd", newValue);  
            });
            
            scope.$watch("axisUnit", function(newValue, oldValue){
                element.widget().option("axisUnit", newValue);  
            });
            
            scope.$watch("values", function(newValue, oldValue) {
                element.widget().option("values", newValue);
            });

            scope.$watch("axisDisplay", function(newValue, oldValue){
                element.widget().option("axisDisplay", newValue);  
            });
            
            if (attrMap.selectchange) {
                element.widget().on("selectchange", function() {
                    scope.$apply(scope.selectchange);
                });
            }

            if (attrMap.sliderchange) {
                element.widget().on("sliderchange", function() {
                    scope.$apply(scope.sliderchange);
                });
            }
        }
    });

    new Stellar().toAngularDirective();
    
    return Stellar;
}); 