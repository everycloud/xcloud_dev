define(["tiny-directives/Directive", "tiny-widgets/Tabs"], function(Directive, TabsWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyTabs",
        "widgetClass" : TabsWidget,
        "constantProperties" : ["id","active","closable","position","tooltip","height","width","values","moreTitle"],
        "scope" : {
            "id" :"=",
            "active" : "=",
            "position" : "=",
            "height" : "=",
            "width" : "=",
            "values" : "=",
            "tooltip" : "=",
            "moreTitle" : "=",
            "closable" : "=",
            "change" : "&",
            "model" : "=tinyTabs"
        },
        "replace" : true,
        "template":"<div></div>"
    };

    var Tabs = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },
        
        "link": function( scope, element, attrMap ){
            var TabsThis = this;
            TabsThis.widgetInstance = new TabsThis.widgetClass(_.pick(scope, TabsThis.constantProperties));
            element.append(TabsThis.widgetInstance._element);
            TabsThis.widgetInstance._element.prop("id",scope.id);
            if (attrMap.change) {
                TabsThis.widgetInstance.on("changeEvt", function() {
                    scope.$apply(scope.change());
                });
            }
        }
    });
    new Tabs().toAngularDirective();
    return Tabs;
});
