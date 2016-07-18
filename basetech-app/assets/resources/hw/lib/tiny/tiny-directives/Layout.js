define(["tiny-directives/Directive", "tiny-widgets/Layout"], function(Directive, layoutWidget) {
    var DEFAULT_CONFIG = {
        "directiveName" : "tinyLayout",
        "widgetClass" : layoutWidget,
        "constantProperties" : [],
        "scope" : {
            "id" : "=",
            "topheight" : "="
        },
        "transclude" : 'true',
        "replace" : true,
        "template":"<div ng-transclude></div>"
    };

    var layout = Directive.extend({
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
            directiveThis.widgetInstance = new directiveThis.widgetClass({"id":scope.id,"topheight" : scope.topheight});
            element.append(directiveThis.widgetInstance._element);
        }
    });
    new layout().toAngularDirective();
    return layout;
});