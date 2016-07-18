define(["tiny-directives/Directive", "tiny-widgets/Gaugechart"], function(Directive, GaugechartWidget) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyGaugechart",

        "widgetClass" : GaugechartWidget,

        "constantProperties" : ["id", "value", "background", "type", "axisData", "intervalField", "width", "height", "display", "colorField", "hubColorField"],

        "scope" : {
            "id" : "=",
            "type" : "=",
            "width" : "=",
            "value" : "=",
            "display" : "=",
            "height" : "=",
            "intervalField" : "=",
            "colorField" : "=",
            "textAngle" : "=",
            "ticks" : "=",
            "minTicks" : "=",
            "background" : "=",
            "animate" : "=",
            "unit" : "=",
            "label" : "=",
            "axisData" : "=",
            "hubColorField" : "="
        },

        "template" : '<div class="tiny-gaugechart"></div>',

        "replace" : true

    };

    var Gaugechart = Directive.extend({

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

            element.attr('id', scope.id);

            directiveThis.widgetInstance = new directiveThis.widgetClass(_.pick(scope, directiveThis.constantProperties));

            scope.$watch("width", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("width", newValue);

            });

            scope.$watch("display", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("display", newValue);

            });

            scope.$watch("height", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("height", newValue);

            });

            scope.$watch("unit", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("unit", newValue);

            });

            scope.$watch("colorField", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("color-field", newValue);

            });
            
            scope.$watch("hubColorField", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("hub-color-field", newValue);

            });

            scope.$watch("intervalField", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("interval-field", newValue);

            });

            scope.$watch("textAngle", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("text-angle", newValue);

            });

            scope.$watch("ticks", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("ticks", newValue);

            });

            scope.$watch("minTicks", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("min-ticks", newValue);

            });

            scope.$watch("label", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("label", newValue);

            });

            scope.$watch("value", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("value", newValue);

            });

        }
    });

    new Gaugechart().toAngularDirective();

    return Gaugechart;

});
