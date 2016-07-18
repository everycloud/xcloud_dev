define(["tiny-directives/Directive", "tiny-widgets/Menu"], function(Directive, MenuWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyMenu",
        "widgetClass" : MenuWidget,
        "scope" : {
            "id" : "="
        }
    };

    var Menu = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },

        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },

        "link" : function(scope, element, attrMap) {
            var directiveThis = this;
            element.prop("id",scope.id);
            directiveThis.widgetInstance = new directiveThis.widgetClass({"id":scope.id});
            element.append(directiveThis.widgetInstance._element);
        }
    });

    new Menu().toAngularDirective();
    return Menu;
}); 