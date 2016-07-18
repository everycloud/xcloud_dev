define(["tiny-directives/Directive","tiny-widgets/AngularGauge"], function(Directive, AngularGauge) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyAngularGauge",

        "widgetClass" : AngularGauge,

        "constantProperties" : ["ranges"],

        "scope" : {
        "id" : "=",
        "width": "=", 
        "height": "=",
        "style": "=",
        "ranges": "=",
        "curValue": "=",
        "startAngle":"=",
        "endAngle": "=",
        "majorTicks": "=",
        "minorTicks": "=",
        "needleColor": "=",
        "title":"=",
        "ticksLabel": "=",
        "transitionDuration":"="
        },

        "template" : "<span></span>",

        "replace" : true

    };

    var AngularGauge = Directive.extend({

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
            
            //生成指令方式下控件的临时父容器Id,临时的父容器为element
            var tinyDirectiveGaugeId = _.uniqueId('tinyDirectiveGauge_');
            element.attr('id', tinyDirectiveGaugeId);
            
            //构造器方式下生成控件，并将id设为父容器Id
            var constantPro = _.pick(scope, directiveThis.constantProperties);
            constantPro.id = tinyDirectiveGaugeId;
            directiveThis.widgetInstance = new directiveThis.widgetClass(constantPro);
            
            //控件在页面上生成之后，用控件的Dom取代element
            element.replaceWith(directiveThis.widgetInstance._element);
            
           var widgetObj = directiveThis.widgetInstance;

            scope.$watch("id", function(newValues, oldValues) {
                widgetObj.option("id", newValues);
            });
            scope.$watch("width", function(newValues, oldValues) {
                widgetObj.option("width", newValues);
            });
            scope.$watch("height", function(newValues, oldValues) {
                widgetObj.option("height", newValues);
            });
            scope.$watch("style", function(newValues, oldValues) {
                widgetObj.option("display", newValues);
            });
            scope.$watch("ranges", function(newValues, oldValues) {
                 widgetObj.option("ranges", newValues);
            });
            scope.$watch("curValue", function(newValues, oldValues) {
                 widgetObj.option("curValue", newValues);
            });
            scope.$watch("startAngle", function(newValues, oldValues) {
                 widgetObj.option("startAngle", newValues);
            });
            scope.$watch("endAngle", function(newValues, oldValues) {
                 widgetObj.option("endAngle", newValues);
            });
             scope.$watch("majorTicks", function(newValues, oldValues) {
                 widgetObj.option("majorTicks", newValues);
            });
            scope.$watch("minorTicks", function(newValues, oldValues) {
                 widgetObj.option("minorTicks", newValues);
            });
            scope.$watch("needleColor", function(newValues, oldValues) {
                widgetObj.option("needleColor", newValues);
            });
            scope.$watch("title", function(newValues, oldValues) {
                 widgetObj.option("title", newValues);
            });
            scope.$watch("ticksLabel", function(newValues, oldValues) {
                 widgetObj.option("ticksLabel", newValues);
            });
            scope.$watch("transitionDuration", function(newValues, oldValues) {
                 widgetObj.option("transitionDuration", newValues);
            });
        }
     
    });

    new AngularGauge().toAngularDirective();

    return AngularGauge;

});