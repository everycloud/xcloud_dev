define(["tiny-directives/Directive", "tiny-widgets/IP"], function(Directive, IpWidget) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyIp",
        "widgetClass" : IpWidget,
        "constantProperties" : ["id", "type", "focused","validate", "tooltip", "tipWidth", "isvalidtip", "errorMsg", "extendFunction"],
        "scope" : {
            "id" : "=",
            "type" : "=",
            "value" : "=",
            "disable" : "=",
            "width" : "=",
            "focused" : "=",
            "validate" : "=",
            "tooltip" : "=",
            "tipWidth" : "=",
            "isvalidtip" : "=", 
            "errorMsg" : "=", 
            "extendFunction" : "=",
        },
        "replace" : true,
        "template":"<span></span>"
    };

    var Ip = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        
        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },

        "link": function( scope, element, attrMap ){
            // pick 是只选择白名单中的属性
            var ipThis = this,constants = _.pick(scope, ipThis.constantProperties);
            //filter undefined scope
            var validProperName = [];
            _.filter(constants,function(value,key){
                if(value !== undefined) {
                    validProperName.push(key);
                }
                return value !== undefined;
            });            
            ipThis = new ipThis.widgetClass(_.pick(constants,validProperName));
            element.append(ipThis._element);
            
            ipThis._element.find(':input[focused="true"]').focus();
            scope.$watch("id", function(newValues, oldValues) {
                ipThis.option("id", newValues);
            });
            scope.$watch("value", function(newValues, oldValues) {
                ipThis.option("value", newValues);
            });
            scope.$watch("disable", function(newValues, oldValues) {
                ipThis.option("disable", newValues);
            });
            scope.$watch("width", function(newValues, oldValues) {
                ipThis.option("width", newValues);
            });
        }
    });

    new Ip().toAngularDirective();
    return Ip;
}); 
