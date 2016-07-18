define(["tiny-directives/Directive", "tiny-widgets/Tip", "tiny-common/util"], function(Directive, TipWidget, util) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyTip",

        "widgetClass" : TipWidget,

        "restrict" : "A",

        "constantProperties" : [],

        "scope" : {
            "model" : "=tinyTip"
        },

    };

    var Tip = Directive.extend({

        "init" : function(options) {

            var directiveThis = this;

            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));

        },
        "compile" : function(element, attrMap, transclude) {

            var directiveThis = this;
            //只读取出常量的属性，用于构造 widgetInstance
            var widgetInstance = new directiveThis.widgetClass(_.pick(attrMap, directiveThis.constantProperties));

            widgetInstance.option("element", element);

            var tip = attrMap.$attr.tinyTip;

            widgetInstance.show();

            directiveThis.widgetInstance = widgetInstance;

            return directiveThis.link;

        },

        "link" : function(scope, element, attrMap) {

            var directiveThis = this;

            scope.$watch("model.content", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("content", newValue);

            });

            scope.$watch("model.width", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("width", newValue);

            });

            scope.$watch("model.position", function(newValue, oldValue) {

                directiveThis.widgetInstance.option("position", newValue);

            });

            scope.$watch("model.display", function(newValue, oldValue) {
                if (util.isFalse(newValue)) {
                    directiveThis.widgetInstance.hide();
                } else {
                    directiveThis.widgetInstance.show();
                }
            });

            scope.$watch("model.auto", function(newValue, oldValue) {
                directiveThis.widgetInstance.option("auto", newValue);
            });
        }
    });

    new Tip().toAngularDirective();

    return Tip;

});
