define(["tiny-directives/Directive", "tiny-widgets/CirqueChart"], 
function(Directive, Cirquechar) {
	var DEFAULT_CONFIG = {
		"directiveName" : "tinyCirque",
		"widgetClass" : Cirquechar,
		"constantProperties" : ["id","rotate","r","defaultColor", "height","width", "hasAnimate", "percent", "showClickEvent","strokeWidth","showShadow","showLegend","centerText","legendFontColor","data"],
		"scope" : {
			"id" :"=",
			"rotate" : "=",
			"r" : "=",
			"height" : "=",
			"percent" : "=",
			"width" : "=",
			"showClickEvent" : "=",
			"strokeWidth" : "=",
			"showShadow" : "=",
			"showLegend" : "=",
			"hasAnimate" : "=",
			"legendFontColor" :　"=",
			"defaultColor" :　"=",
			"centerText" :　"=",
			"data" : "="
		},
		"replace" : true,
		"template":"<div></div>"
	};

	var CirqueChart = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },
		
		"link": function( scope, element, attrMap ){
			element.attr('id', scope.id);
			var directiveThis = this,constants = _.pick(scope, directiveThis.constantProperties);
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}                return value !== undefined;
			});			
			directiveThis.widgetInstance = new directiveThis.widgetClass(_.pick(constants,validProperName));
        }
	});
	new CirqueChart().toAngularDirective();
	return CirqueChart;
});
