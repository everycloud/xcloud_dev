define(["tiny-directives/Directive", "tiny-widgets/Portlets"], function(Directive, PortletWidget) {

	var DEFAULT_CONFIG = {
		"directiveName" : "tinyPortlet",
		"widgetClass" : PortletWidget,
		"scope" : {
			"id" :"=",
			"columns" : "="
		}
	};

	var Portlet = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		
		"link": function( scope, element, attrMap ){
			var portletThis = element.widget();
			scope.$watch("id", function(newValues, oldValues) {
                portletThis.option("id", newValues);
            });
			scope.$watch("columns", function(newValues, oldValues) {
                portletThis.option("columns", newValues);
            });  
        }
	});
	new Portlet().toAngularDirective();
	return Portlet;
});
