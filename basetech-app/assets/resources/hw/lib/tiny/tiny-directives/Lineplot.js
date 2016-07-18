define(["tiny-directives/Directive","tiny-widgets/Lineplot"], function(Directive, lineplotWidget) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyLineplot",

        "widgetClass" : lineplotWidget,

        "constantProperties" : ["id", "colors","type","series","tips","data","xaxis","yaxis","caption","smooth","legend","relatedId","threshold"],

        "scope" : {
            "id" : "=",
            "type":"=",
            "data":"=",
            "width" : "=",
            "height" : "=",
            "colors":"=",
            "grid" : "=",
            "tips":"=",
            "model" : "=tinyLineplot",
            "series" : "=",
            "legend" : "=",
            "xaxis" : "=",
            "yaxis":"=",
            "caption":"=",
            "threshold":"=",
            "smooth":"=",
            "relatedId":"="
        },

        "template" : '<div class="tiny-Lineplot"></div>',

        "replace" : true

    };

    var Lineplot = Directive.extend({

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
            
            var widgetObj = directiveThis.widgetInstance._element.widget();

            scope.$watch("width", function(newValue, oldValue) {

               widgetObj.resizeChart(newValue, "");

            });

            scope.$watch("data", function(newValue, oldValue) {

               widgetObj.reDrawLines(newValue);

            });

            scope.$watch("height", function(newValue, oldValue) {

                widgetObj.resizeChart("", newValue);

            });

        }
     
    });

    new Lineplot().toAngularDirective();

    return Lineplot;

});