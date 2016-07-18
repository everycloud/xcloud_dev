define(["tiny-directives/Directive", "tiny-widgets/Scrollbar"], function(Directive, ScrollbarWidget) {
    var DEFAULT_CONFIG = {

        "directiveName" : "tinyScrollbar",

        "widgetClass" : ScrollbarWidget,

        "constantProperties" : [],

        "scope" : {
        	"id" : "=",
            "axis":"=",
            "step":"=",
            "scroll":"=",
            "position":"=",
        },
    };

    var Scrollbar = Directive.extend({

        "init" : function(options) {

            var directiveThis = this;

            directiveThis._super(_.extend({
            }, DEFAULT_CONFIG, options));

        },

        "link" : function(scope, element, attrMap) {
        	scope.$watch("id", function(newValue, oldValue) {

                element.widget().option("id", newValue);

            });

            scope.$watch("axis", function(newValue, oldValue) {

                element.widget().option("axis", newValue);

            });

            scope.$watch("step", function(newValue, oldValue) {

                element.widget().option("step", newValue);

            });

            scope.$watch("scroll", function(newValue, oldValue) {

                element.widget().option("scroll", newValue);

            });
            scope.$watch("position", function(newValue, oldValue) {

                element.widget().option("position", newValue);

            });
            var widgetInstance = element.widget();
            widgetInstance.element=element.parent().parent();
            element.widget()._setTo(widgetInstance.element);
        }
    });

    new Scrollbar().toAngularDirective();

    return Scrollbar;

});

