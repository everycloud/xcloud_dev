define(["tiny-directives/Directive", "tiny-widgets/Checkbox"], function(Directive, CheckboxWidget) {

	var DEFAULT_CONFIG = {
		"directiveName" : "tinyCheckbox",
		"widgetClass" : CheckboxWidget,
		"scope" : {
			"id" :"=",
			"iconClass" : "=",
			"text" : "=",
			"width" : "=",
			"height" : "=",
			"checked" : "=",
			"disable" : "=",
			"tooltip" : "=",
			"tipWidth" : "=",
			"click" : "&",
			"change" : "&",
			"value" : "="
		},
		"template" : "<span></span>",
		"replace" : "true",
		"constantProperties" : ["value", "tipWidth"]
	};

	var Checkbox = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var checkboxThis = this,constants = _.pick(scope, checkboxThis.constantProperties);
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			checkboxThis = new checkboxThis.widgetClass(_.pick(constants,validProperName));
			element.append(checkboxThis._element);
			scope.$watch("id", function(newValues, oldValues) {
                checkboxThis.option("id", newValues);
            });
			scope.$watch("iconClass", function(newValues, oldValues) {
                checkboxThis.option("icon-class", newValues);
            });
            scope.$watch("text", function(newValues, oldValues) {
                checkboxThis.option("text", newValues);
            });
            scope.$watch("width", function(newValues, oldValues) {
                checkboxThis.option("width", newValues);
            });
            scope.$watch("height", function(newValues, oldValues) {
                checkboxThis.option("height", newValues);
            });
            scope.$watch("checked", function(newValues, oldValues) {
                checkboxThis.option("checked", newValues);
            });
            scope.$watch("disable", function(newValues, oldValues) {
                checkboxThis.option("disable", newValues);
            });
            scope.$watch("tooltip", function(newValues, oldValues) {
                checkboxThis.option("tooltip", newValues);
            });
            if (attrMap.click) {
                checkboxThis._element.on("clickEvt",function(event) {
                    scope.$apply(scope.click);
                });
            };
            if (attrMap.change) {
                checkboxThis._element.on("changeEvt", function(event) {
                    scope.$apply(scope.change);
                });
            }   
        }
	});
	new Checkbox().toAngularDirective();
	return Checkbox;
});
