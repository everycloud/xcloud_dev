define(["tiny-directives/Directive", "tiny-widgets/Button"], function(Directive, ButtonWidget) {
    var DEFAULT_CONFIG = {
        "directiveName" : "tinyButton",
        "widgetClass" : ButtonWidget,
        "constantProperties" : ["id", "tipWidth"],
        "scope" : {
            "id" : "=",
            "text" : "=",
            "display" : "=",
            "disable" : "=",
            "iconsClass" : "=",
            "tooltip" : "=",
            "focused":"=",
            "tipWidth" : "=",
            "click" : "&",
            "mouseover" : "&",
            "mouseout" : "&",
            "mousedown" : "&",
            "mouseup" : "&"
        },
        "replace" : true,
        "template" : "<span></span>"
    };

    var Button = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        
        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },

        "link" : function(scope, element, attrMap) {
            var directiveThis = this;
            directiveThis.widgetInstance = new directiveThis.widgetClass();
            element.append(directiveThis.widgetInstance._element);
            element = directiveThis.widgetInstance._element.widget();
        	scope.$watch("id", function(newValue, oldValue) {
                element.option("id", newValue);
            });
            scope.$watch("iconsClass", function(newValue, oldValue) {
                element.option("icons-class", newValue);
            });
            scope.$watch("text", function(newValue, oldValue) {
                element.option("text", newValue);
            });
            scope.$watch("display", function(newValue, oldValue) {
                element.option("display", newValue);
            });
            scope.$watch("disable", function(newValue, oldValue) {
                element.option("disable", newValue);
            });
            scope.$watch("tooltip", function(newValue, oldValue) {
                element.option("tooltip", newValue);
            });
            scope.$watch("focused", function(newValue, oldValue) {
                element.option("focused", newValue);
            });
            if (attrMap.click) {
                element.on("click", function() {
                    scope.$apply(scope.click);
                });
            }
            if (attrMap.mouseover) {
                element.on("mouseover", function() {
                    scope.$apply(scope.mouseover);
                });
            }
            if (attrMap.mouseout) {
                element.on("mouseout", function() {
                    scope.$apply(scope.mouseout);
                });
            }
            if (attrMap.mousedown) {
                element.on("mousedown", function() {
                    scope.$apply(scope.mousedown);
                });
            }
            if (attrMap.mouseup) {
                element.on("mouseup", function() {
                    scope.$apply(scope.mouseup);
                });
            }
        }
    });

    new Button().toAngularDirective();

    return Button;

});
