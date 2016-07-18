define(["tiny-directives/Directive", "tiny-widgets/RadioGroup"], function(Directive, RadioGroupWidget) {

	var DEFAULT_CONFIG = {
		"directiveName" : "tinyRadiogroup",
		"widgetClass" : RadioGroupWidget,
		"constantProperties" : ["layout"],
		"scope" : {
			"id" : "=",
			"spacing" : "=",
			"layout" : "=",
			"values" : "=",
			"change" : "&",
			"click" : "&"
		},
		"template" : "<span></span>",
		"replace" : "true"
	};

	var RadioGroup = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var radioGroupThis = this,constants = _.pick(scope, radioGroupThis.constantProperties);
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			radioGroupThis = new radioGroupThis.widgetClass(_.pick(constants,validProperName));
			element.append(radioGroupThis._element);
			scope.$watch("id", function(newValues, oldValues) {
                radioGroupThis.option("id", newValues);
            });
			scope.$watch("defaultIcons", function(newValues, oldValues) {
                radioGroupThis.option("defaultIcons", newValues);
            });
            scope.$watch("spacing", function(newValues, oldValues) {
                radioGroupThis.option("spacing", newValues);
            });
            scope.$watch("layout", function(newValues, oldValues) {
                radioGroupThis.option("layout", newValues);
            });
            scope.$watch("values", function(newValues, oldValues) {
                radioGroupThis.option("values", newValues);
            });
            if (attrMap.click) {
                radioGroupThis._element.on("clickEvt", function() {
                    scope.$apply(scope.click);
                });
            };
            if (attrMap.change) {
                radioGroupThis._element.on("changeEvt", function() {
                    scope.$apply(scope.change);
                });
            };
        }
	});
	new RadioGroup().toAngularDirective();
	return RadioGroup;
});
