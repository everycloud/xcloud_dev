define(["tiny-directives/Directive", "tiny-widgets/Searchbox"], function(Directive, Searchbox) {
    var DEFAULT_CONFIG = {

        "directiveName" : "tinySearchbox",

        "widgetClass" : Searchbox,

        "constantProperties" : ["id"],

        "scope" : {
        	"id" : "=",
            "display" : "=",
            "width" : "=",
            "type" : "=",
            "placeholder" : "=",
            "suggestSize" : "=",
            "maxlength" : "=",
            "search" : "=",
            "suggest" : "=",
        },
        "template" : "<span></span>",
		"replace" : "true"

    };

    var Searchbox = Directive.extend({

        "init" : function(options) {

            var directiveThis = this;

            directiveThis._super(_.extend({
            }, DEFAULT_CONFIG, options));

        },
        "compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var directiveThis = this;
			directiveThis = new directiveThis.widgetClass(scope.id);
			element.append(directiveThis._element);
        	scope.$watch('id', function(newValue, oldValue) {
                directiveThis.option('id', newValue);
            });
            scope.$watch('display', function(newValue, oldValue) {
                directiveThis.option('display', newValue);
            });
            scope.$watch('width', function(newValue, oldValue) {
                directiveThis.option('width', newValue);
            });
            scope.$watch('type', function(newValue, oldValue) {
                directiveThis.option('type', newValue);
            });
            scope.$watch('placeholder', function(newValue, oldValue) {
                directiveThis.option('placeholder', newValue);
            });
            scope.$watch('suggestSize', function(newValue, oldValue) {
                directiveThis.option('suggest-size', newValue);
            });
            scope.$watch('maxlength', function(newValue, oldValue) {
                directiveThis.option('maxlength', newValue);
            });
            scope.$watch('search', function(newValue, oldValue) {
                directiveThis.option('search', newValue);
            });
            scope.$watch('suggest', function(newValue, oldValue) {
                directiveThis.option('suggest', newValue);
            });
        }
    });

    new Searchbox().toAngularDirective();

    return Searchbox;

});

