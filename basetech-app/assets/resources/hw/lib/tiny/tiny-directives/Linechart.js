define(["tiny-directives/Directive", "tiny-widgets/Linechart"], function(Directive, LinechartWidget) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyLinechart",

        "widgetClass" : LinechartWidget,

        "constantProperties" : ["id", "seriesList", "axis", "legend", "background", "animate","click"],

        "scope" : {
            "id" : "=",
            "width" : "=",
            "display" : "=",
            "height" : "=",
            "grid" : "=",
            "chartTitle" : "=",
            "model" : "=tinyLinechart",
            "seriesList" : "=",
            "legend" : "=",
            "axis" : "=",
            "background" : "=",
            "animate" : "=",
            "click" : "="
        },

        "template" : '<div class="tiny-linechart"></div>',

        "replace" : true

    };

    var Linechart = Directive.extend({

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

            scope.$watch("grid", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("grid", newValue);

            });

            scope.$watch("chartTitle", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("chart-title", newValue);

            });

        }
    });

    new Linechart().toAngularDirective();

    return Linechart;

});
