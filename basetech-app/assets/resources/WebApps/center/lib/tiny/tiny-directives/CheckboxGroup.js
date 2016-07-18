define(["tiny-directives/Directive", "tiny-widgets/CheckboxGroup"], function(Directive, CheckboxGroupWidget) {

	var DEFAULT_CONFIG = {
		"directiveName" : "tinyCheckboxgroup",
		"widgetClass" : CheckboxGroupWidget,
		"scope" : {
			"id" : "=",
			"spacing" : "=",
			"layout" : "=",
			"values" : "=",
			"allSelect" : "=",			
			"change" : "&",
			"click" : "&"
		},
		"constantProperties" : ["layout"],
		"template" : "<span></span>",
		"replace" : "true"
	};

	var CheckboxGroup = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var checkboxGroupThis = this,constants = _.pick(scope, checkboxGroupThis.constantProperties);
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			checkboxGroupThis = new checkboxGroupThis.widgetClass(_.pick(constants,validProperName));
			element.append(checkboxGroupThis._element);
			scope.$watch("id", function(newValues, oldValues) {
                checkboxGroupThis.option("id", newValues);
            });
            scope.$watch("spacing", function(newValues, oldValues) {
                checkboxGroupThis.option("spacing", newValues);
            });
            scope.$watch("values", function(newValues, oldValues) {
                checkboxGroupThis.option("values", newValues);
            });
            scope.$watch("allSelect", function(newValues, oldValues) {
                checkboxGroupThis.option("all-select", newValues);
            });
            if (attrMap.click) {
                checkboxGroupThis._element.on("clickEvt",function() {
                    scope.$apply(scope.click);
                });
            };
            if (attrMap.change) {
                checkboxGroupThis._element.on("changeEvt",function() {
                    scope.$apply(scope.change);
                });
            };
        }
	});
	new CheckboxGroup().toAngularDirective();
	return CheckboxGroup;
});
