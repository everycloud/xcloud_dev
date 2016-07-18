define(["tiny-directives/Directive", "tiny-widgets/Combobox"], function(Directive, ComboboxWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyCombobox",
        "widgetClass" : ComboboxWidget,
        "scope" : {
            "id" : "=",
            "width" : "=",
            "display" : "=",
            "disable" : "=",
            "height" : "=",
            "value" : "=",
            "placeholder" : "=",
            "valuesFrom" : "=",
            "values" : "=",
            "matchMethod" : "=",
            "trigger" : "=",
            "delay" : "=", 
            "validate" : "=",
            "tooltip" : "=",
            "isvalidtip" : "=", 
            "errorMsg" : "=", 
            "extendFunction" : "=",
            "select" : "&",
            "search" : "&"
        },
        "constantProperties" : ["validate", "tooltip", "isvalidtip", "errorMsg", "extendFunction"],
		"template" : "<span></span>",
		"replace" : "true"
    };

    var Select = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
		"compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var comboboxThis = this,constants = _.pick(scope, comboboxThis.constantProperties);
			
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			comboboxThis = new comboboxThis.widgetClass(_.pick(constants,validProperName));
			element.append(comboboxThis._element);
			
            scope.$watch("id", function(newValues, oldValues) {
                comboboxThis.option("id", newValues);
            });
            scope.$watch("width", function(newValues, oldValues) {
                comboboxThis.option("width", newValues);
            });
            scope.$watch("display", function(newValues, oldValues) {
                comboboxThis.option("display", newValues);
            });
            scope.$watch("disable", function(newValues, oldValues) {
                comboboxThis.option("disable", newValues);
            });
            scope.$watch("height", function(newValues, oldValues) {
                comboboxThis.option("height", newValues);
            });
            scope.$watch("value", function(newValues, oldValues) {
                comboboxThis.option("value", newValues);
            });
            scope.$watch("placeholder", function(newValues, oldValues) {
                comboboxThis.option("placeholder", newValues);
            });
            scope.$watch("valuesFrom", function(newValues, oldValues) {
                comboboxThis.option("valuesFrom", newValues);
            });
            scope.$watch("values", function(newValues, oldValues) {
                comboboxThis.option("values", newValues);
            });
            scope.$watch("matchMethod", function(newValues, oldValues) {
                comboboxThis.option("matchMethod", newValues);
            });
            scope.$watch("trigger", function(newValues, oldValues) {
                comboboxThis.option("trigger", newValues);
            });
            scope.$watch("delay", function(newValues, oldValues) {
                comboboxThis.option("delay", newValues);
            });
            
            if (attrMap.select) {
                comboboxThis.on("select", function() {
                    scope.$apply(scope.select());
                });
            };
            if (attrMap.search) {
                comboboxThis.on("search", function() {
                    scope.$apply(scope.search());
                });
            }
        }
    });

    new Select().toAngularDirective();
    return Select;
});
