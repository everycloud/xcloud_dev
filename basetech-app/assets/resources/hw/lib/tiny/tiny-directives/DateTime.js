define(["tiny-directives/Directive", "tiny-widgets/DateTime"], function(Directive, DateTime) {

    var DEFAULT_CONFIG = {
        "directiveName" : "tinyDatetime",
        "widgetClass" : DateTime,
        "constantProperties" : ["id", "type", "dateFormat","timeFormat", "ampm","firstDay","width","onClose", "showStyle", "showClear"],
        "scope" : {
            "id" :"=",
            "type" : "=",
            "defaultTime" : "=",
            "defaultDate" : "=",
            "timeFormat" : "=",
            "dateFormat" : "=",
            "ampm" : "=",
            "firstDay" : "=",
            "minDate" :　"=",
            "maxDate" :　"=",
            "disable" : "=",
            "width" : "=",
            "onClose" : "=",
            "showStyle" : "=",
            "showClear" : "="
        }, 
        "replace" : true,
        "template":"<span></span>"
    };

    var Datetime = Directive.extend({
        "init" : function(options) {
            var directiveThis = this;
            directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
        },
        "compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },
        
        "link": function( scope, element, attrMap ){
            var dateTimeThis = this,constants = _.pick(scope, dateTimeThis.constantProperties);
            
            //filter undefined scope
            var validProperName = [];
            _.filter(constants,function(value,key){
                if(value !== undefined) {
                    validProperName.push(key);
                }
                return value !== undefined;
            });            
            dateTimeThis = new dateTimeThis.widgetClass(_.pick(constants,validProperName));
            element.append(dateTimeThis._element);
            dateTimeThis._element.prop("id",scope.id);
            scope.$watch("defaultDate", function(newValues, oldValues) {
                dateTimeThis.option("defaultDate", newValues);
            });
            scope.$watch("defaultTime", function(newValues, oldValues) {
                dateTimeThis.option("defaultTime", newValues);
            });
            scope.$watch("minDate", function(newValues, oldValues) {
                dateTimeThis.option("minDate", newValues);
            });
            scope.$watch("maxDate", function(newValues, oldValues) {
                dateTimeThis.option("maxDate", newValues);
            });            
            scope.$watch("disable", function(newValues, oldValues) {
                dateTimeThis.option("disable", newValues);
            });
            dateTimeThis._element.on('$destroy', function(){
                scope.$destroy();
                dateTimeThis.destroy();
            });
        }
    });
    new Datetime().toAngularDirective();
    return Datetime;
});
