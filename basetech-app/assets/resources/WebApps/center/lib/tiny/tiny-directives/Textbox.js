define(["tiny-directives/Directive", "tiny-widgets/Textbox"], function(Directive, TextboxWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyTextbox",
        "widgetClass" : TextboxWidget,
        "constantProperties" : ["type", "value", "focused", "validate", "tooltip", "isvalidtip", "errorMsg", "extendFunction",
        "keydownfn","keyupfn","keypressfn", "tipPosition", "tipWidth"],
        "scope" : {
            "id" : "=",
            "validate" : "=",
            "tooltip" : "=",
            "isvalidtip" : "=",
            "errorMsg" : "=",
            "value" : "=",
            "readonly" : "=",
            "disable" : "=",
            "width" : "=",
            "height" : "=",
            "focused" : "=",
            "type" : "=",
            "extendFunction" : "=",
            "tipPosition" : "=",
            "tipWidth" : "=",
            "change" : "&",
            "focus" : "&",
            "blur" : "&",
            "keyup" : "&",
            "keyupfn" : "=",
            "keydown" : "&",
            "keydownfn" : "=",
            "keypress" : "&",
            "keypressfn" : "="
        },
        "replace" : true,
        "template" : "<span></span>"
    };

    var Textbox = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },

        "link" : function(scope, element, attrMap) {
            var directiveThis = this, constants = _.pick(scope, directiveThis.constantProperties);
            
            //filter undefined scope
            var validProperName = [];
            _.filter(constants, function(value, key) {
                if (value !== undefined) {
                    validProperName.push(key);
                }
                return value !== undefined;
            });
            directiveThis.widgetInstance = new directiveThis.widgetClass(_.pick(constants, validProperName));
            element.append(directiveThis.widgetInstance._element);
            directiveThis.widgetInstance._element.find(':input[focused="true"]').focus();
            var element = directiveThis.widgetInstance;
            scope.$watch("id", function(newValue, oldValue) {
                element.option("id", newValue);
            });
            scope.$watch("focused", function(newValue, oldValue) {
                element.option("focused", newValue);
            });
            scope.$watch("value", function(newValue, oldValue) {
                element.option("value", newValue);
            });
            scope.$watch("width", function(newValue, oldValue) {
                element.option("width", newValue);
            });
             scope.$watch("height", function(newValue, oldValue) {
                element.option("height", newValue);
            });
            scope.$watch("readonly", function(newValue, oldValue) {
                element.option("readonly", newValue);
            });
            scope.$watch("disable", function(newValue, oldValue) {
                element.option("disable", newValue);
            });
            
            if (attrMap.change) {
                element.on("change", function() {
                    scope.$apply(scope.change);
                });
            }
            if (attrMap.focus) {
                element.on("focus", function() {
                    scope.$apply(scope.focus);
                });
            }
            if (attrMap.blur) {
                element.on("blur", function() {
                    scope.$apply(scope.blur);
                });
            }
            if (attrMap.keyup) {
                element.on("keyup", function() {
                    scope.$apply(scope.keyup);
                });
            }
            if (attrMap.keydown) {
                element.on("keydown", function() {
                    scope.$apply(scope.keydown);
                });
            }
            if (attrMap.keypress) {
                element.on("keypress", function(e) {
                    scope.$apply(scope.keypress);
                });
            }
        },
        "controller" : function(scope, attr, element, parse) {
            this.$viewValue = Number.NaN;
            this.$modelValue = Number.NaN;
            this.$formatters = [];
            this.$dirty = false;
            var ngModelGet = parse(attr.value), ngModelSet = ngModelGet.assign;
            
            // model -> value
            var ctrl = this;
            scope.$watch(function ngModelWatch() {
                var value = ngModelGet(scope);
                var formatters = ctrl.$formatters, idx = formatters.length;
                ctrl.$modelValue = value;
                while (idx--) {
                    value = formatters[idx](value);
                }
                if (ctrl.$viewValue !== value) {
                    if (value !== undefined)
                        scope.value = value;
                }
            });
        }
    });

    new Textbox().toAngularDirective();

    return Textbox;

});
