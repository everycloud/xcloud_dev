define(["tiny-directives/Directive", "tiny-widgets/Menubutton"], function(Directive, menubuttonWidget) {
    var DEFAULT_CONFIG = {
        "directiveName" : "tinyMenubutton",
        "widgetClass" : menubuttonWidget,
        "constantProperties" : ["clickCallback", "params", "content", "text","contentFrom","recur","border","type", "cls", "dropbtn"],
        "scope" : {
            "id" : "=",
            "content" : "=",
            "text" : "=",
            "contentFrom" :"=",
            "params" : "=",
            "type" : "=",
            "cls" : "=",
            "dropbtn" : "=",
            "clickCallback" : "=",
            "recur" : "=",
            "expand": "&",
            "loadMenu": "&"
        },
        "template" : "<span></span>",
        "replace" : "true"
    };
    var menubutton = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },        
        "compile" : function(){
            var directiveThis = this;
            return directiveThis.link;
        },
        "link" : function(scope, element, attrMap) {
            var directiveThis = this,constants = _.pick(scope, directiveThis.constantProperties);
            
            //filter undefined scope
            var validProperName = [];
            _.filter(constants,function(value,key){
                if(value !== undefined) {
                    validProperName.push(key);
                }
                return value !== undefined;
            });
            directiveThis = new directiveThis.widgetClass(_.pick(constants,validProperName));
            element.append(directiveThis._element);

            scope.$watch("id", function(newValue, oldValue) {

                directiveThis.option("id", newValue);
            });
            scope.$watch("content", function(newValue, oldValue) {

                directiveThis.option("content", newValue);
            });
            
            if (attrMap.expand) {
                directiveThis.on("expand", function() {
                    scope.$apply(scope.expand());
                });
            };
            if (attrMap.loadMenu) {
                directiveThis.on("loadMenu", function() {
                    scope.$apply(scope.loadMenu());
                });
            };
        }
    });
    new menubutton().toAngularDirective();
    return menubutton;
});
