define(["tiny-directives/Directive", "tiny-widgets/Spinner"], function(Directive, SpinnerWidget) {

	var DEFAULT_CONFIG = {
		"directiveName" : "tinySpinner",
		"widgetClass" : SpinnerWidget,
		"scope" : {
			"id" : "=",
			"value" : "=",
			"placeholder" : "=",
			"max" : "=",
			"min" : "=",
			"step" : "=",
			"width" : "=",
			"disable" : "=",
			"change" : "&"
		},
		"template" : "<span></span>",
		"replace" : "true"
	};

	var Spinner = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile": function (element, attrMap, transclude) {
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var spinnerThis = this,constants = _.pick(scope, spinnerThis.constantProperties);
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			spinnerThis = new spinnerThis.widgetClass(_.pick(constants,validProperName));
			element.append(spinnerThis._element);
			scope.$watch("id", function(newValues, oldValues) {
                spinnerThis.option("id", newValues);
            });
            scope.$watch("max", function(newValues, oldValues) {
                spinnerThis.option("max", newValues);
            });
            scope.$watch("min", function(newValues, oldValues) {
                spinnerThis.option("min", newValues);
            });
			scope.$watch("value", function(newValues, oldValues) {
                spinnerThis.option("value", newValues);
            });
            scope.$watch("step", function(newValues, oldValues) {
                spinnerThis.option("step", newValues);
            });
			scope.$watch("placeholder", function(newValues, oldValues) {
                spinnerThis.option("placeholder", newValues);
            });
            scope.$watch("width", function(newValues, oldValues) {
                spinnerThis.option("width", newValues);
            });
            scope.$watch("disable", function(newValues, oldValues) {
                spinnerThis.option("disable", newValues);
            });
            if (attrMap.change) {
                spinnerThis.on("change", function() {
                    scope.$apply(scope.change);
                });
            }   
        }
	});
	new Spinner().toAngularDirective();
	return Spinner;
});
