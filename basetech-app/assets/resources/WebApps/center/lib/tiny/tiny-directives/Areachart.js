define(["tiny-directives/Linechart", "tiny-widgets/Areachart"], function(Linechart, AreachartWidget) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyAreachart",

        "widgetClass" : AreachartWidget,

        "scope" : {
            "id" : "=",
            "width" : "=",
            "display" : "=",
            "height" : "=",
            "grid" : "=",
            "chartTitle" : "=",
            "model" : "=tinyAreachart",
            "seriesList" : "=",
            "legend" : "=",
            "axis" : "=",
            "background" : "="
        },

        "template" : '<div class="tiny-areachart"></div>'

    };

    var Areachart = Linechart.extend({

        "init" : function(options) {

            var directiveThis = this;

            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));

        }
    });

    new Areachart().toAngularDirective();

    return Areachart;

});
