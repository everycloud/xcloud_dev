define(["tiny-directives/Directive", "tiny-widgets/Radio"], function(Directive, RadioWidget) {

	var DEFAULT_CONFIG = {
		"directiveName" : "tinyRadio",
		"widgetClass" : RadioWidget,
		"scope" : {
			"id" :"=",
			"name" : "=",
			"iconClass" : "=",
			"text" : "=",
			"value" : "=",
			"width" : "=",
			"height" : "=",
			"checked" : "=",
			"disable" : "=",
			"tooltip" : "=",
			"tipWidth" : "=",
			"click" : "&",
			"change" : "&"
		},
		"template" : "<span></span>",
		"replace" : "true",
		"constantProperties" : ["value", "tipWidth"]
	};

	var Radio = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var radioThis = this,constants = _.pick(scope, radioThis.constantProperties);
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			radioThis = new radioThis.widgetClass(_.pick(constants,validProperName));
			element.append(radioThis._element);
			scope.$watch("id", function(newValues, oldValues) {
                radioThis.option("id", newValues);
            });
			scope.$watch("name", function(newValues, oldValues) {
                radioThis.option("name", newValues);
            });
			scope.$watch("iconClass", function(newValues, oldValues) {
                radioThis.option("icon-class", newValues);
            });
            scope.$watch("text", function(newValues, oldValues) {
                radioThis.option("text", newValues);
            });
            scope.$watch("width", function(newValues, oldValues) {
                radioThis.option("width", newValues);
            });
            scope.$watch("height", function(newValues, oldValues) {
                radioThis.option("height", newValues);
            });
            scope.$watch("checked", function(newValues, oldValues) {
                radioThis.option("checked", newValues);
            });
            scope.$watch("disable", function(newValues, oldValues) {
                radioThis.option("disable", newValues);
            });
            scope.$watch("tooltip", function(newValues, oldValues) {
                radioThis.option("tooltip", newValues);
            });
            if (attrMap.click) {
                radioThis._element.on("clickEvt",function() {
                    scope.$apply(scope.click);
                });
            };
            if (attrMap.change) {
                radioThis._element.on("changeEvt",function() {
                    scope.$apply(scope.change);
                });
            }        
        }
	});
	new Radio().toAngularDirective();
	return Radio;
});
