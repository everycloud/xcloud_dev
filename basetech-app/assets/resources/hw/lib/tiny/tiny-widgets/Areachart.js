define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Linechart", "tiny-lib/jqPlot", "tiny-lib/underscore", "tiny-common/util"], function(angular, $, Class, Linechart, jqPlot, _, util) {
    var DEFAULT_CONFIG = {

        "template" : '<div class="tiny-areachart"></div>'

    };

    var Areachart = Linechart.extend({

        "init" : function(options) {
            var widgetThis = this;
            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "_setChartType" : function(series, type) {
            var widgetThis = this;
            series.type = widgetThis.areachart;
            series.options.renderer = undefined;
            var barwid = null;
            series.options.fill = true;
            series.options.fillAndStroke = true;
            series.options.fillAlpha = '.25';
            series.options.shadow = false;
            if (!series.options.rendererOptions) {
                series.options.rendererOptions = {};
            }
            series.options.rendererOptions.smooth = series.smooth;
        }
    });

    return Areachart;

});
