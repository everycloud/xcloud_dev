define(["tiny-directives/Directive", "tiny-widgets/Template"], function(Directive, TemplateWidget) {
	var DEFAULT_CONFIG = {
		"directiveName" : "tinyTemplate",
		"widgetClass" : TemplateWidget,
		"scope" : {
			"id" :"=",
			"items" : "="
		}
	};

	var Template = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		
		"link": function( scope, element, attrMap ){
			var templateThis = element.widget();
			scope.$watch("id", function(newValues, oldValues) {
                templateThis.option("id", newValues);
            });
			scope.$watch("items", function(newValues, oldValues) {
                templateThis.option("items", newValues);
            });
        }
	});
	new Template().toAngularDirective();
	return Template;
});
