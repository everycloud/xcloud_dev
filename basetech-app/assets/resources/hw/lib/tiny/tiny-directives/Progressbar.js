define(["tiny-directives/Directive", "tiny-widgets/Progressbar"], function(Directive, ProgressbarWidget) {
    var DEFAULT_CONFIG = {

        "directiveName" : "tinyProgressbar",

        "widgetClass" : ProgressbarWidget,

        "constantProperties" : [],

        "scope" : {
            "id" : "=",
            "display" : "=",
            "width" : "=",
            "height" : "=",
            "labelPosition" : "=",
            "value" : "=",
            "color" : "=",
            "labelColor" : "=",
            "change" : "&",
            "complete" : "&"
        },

    };

    var Progressbar = Directive.extend({

        "init" : function(options) {

            var progressBarThis = this;

            progressBarThis._super(_.extend({
            }, DEFAULT_CONFIG, options));

        },
        "compile" : function(){
            var progressBarThis = this;
            return progressBarThis.link;
        },
        "link": function( scope, element, attrMap ){
            var progressBarThis = this,constants = _.pick(scope, progressBarThis.constantProperties);
            //filter undefined scope
            var validProperName = [];
            _.filter(constants,function(value,key){
                if(value !== undefined) {
                    validProperName.push(key);
                }
                return value !== undefined;
            });
            progressBarThis = new progressBarThis.widgetClass(_.pick(constants,validProperName));
            element.append(progressBarThis._element);
            scope.$watch("id", function(newValue, oldValue) {

                progressBarThis.option("id", newValue);

            });

            scope.$watch("display", function(newValue, oldValue) {

                progressBarThis.option("display", newValue);

            });

            scope.$watch("width", function(newValue, oldValue) {

                progressBarThis.option("width", newValue);

            });

            scope.$watch("height", function(newValue, oldValue) {

                progressBarThis.option("height", newValue);

            });
            scope.$watch("labelPosition", function(newValue, oldValue) {

                progressBarThis.option("label-position", newValue);

            });
            scope.$watch("value", function(newValue, oldValue) {

                progressBarThis.option("value", newValue);

            });
            scope.$watch("color", function(newValue, oldValue) {

                progressBarThis.option("color", newValue);

            });
            scope.$watch("labelColor", function(newValue, oldValue) {

                progressBarThis.option("labelColor", newValue);

            });

            if (attrMap.complete) {
                progressBarThis.on("completeEvt",function() {
                    scope.$apply(scope.complete);
                });
            };
            if (attrMap.change) {
                progressBarThis.on("changeEvt", function() {
                    scope.$apply(scope.change);
                });
            }

        }
    });

    new Progressbar().toAngularDirective();

    return Progressbar;

});

