define(["tiny-directives/Directive", "tiny-widgets/Tree"], function(Directive, TreeWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyTree",
        "widgetClass" : TreeWidget,
        "scope" : {
        	"id" : "=",
            "display" : "=",
            "width" : "=",
            "height" : "=",
            "cls" : "=",
            "values" : "=",
            "setting" : "="
        },
        "constantProperties" : [],
        "template" : "<span></span>",
		"replace" : "true"
    };

    var Tree = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "compile" : function(){
			var directiveThis = this;
			return directiveThis.link;
		},		
		"link": function( scope, element, attrMap ){
			var treeThis = this;
			treeThis = new treeThis.widgetClass();
			element.append(treeThis._element);
            scope.$watch("id", function(newValues, oldValues) {
                treeThis.option("id", newValues);
            });
            scope.$watch("display", function(newValues, oldValues) {
                treeThis.option("display", newValues);
            });

            scope.$watch("width", function(newValues, oldValues) {
                treeThis.option("width", newValues);
            });

            scope.$watch("height", function(newValues, oldValues) {
                treeThis.option("height", newValues);
            });

            scope.$watch("cls", function(newValues, oldValues) {
                treeThis.option("cls", newValues);
            });

            scope.$watch("values", function(newValues, oldValues) {
                treeThis.option("values", newValues);
            });
            
            scope.$watch("setting", function(newValues, oldValues) {
                treeThis.option("setting", newValues);
            });
        }
    });

    new Tree().toAngularDirective();
    return Tree;
});
