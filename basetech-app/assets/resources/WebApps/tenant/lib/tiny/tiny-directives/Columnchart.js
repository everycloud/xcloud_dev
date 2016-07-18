define(["tiny-directives/Directive", "tiny-widgets/Columnchart"], function(Directive, ColumnchartWidget) {

    var DEFAULT_CONFIG = {
    "directiveName" : "tinyColumnchart",
    "widgetClass" : ColumnchartWidget,
    "scope" : {
        "id" : "=",
        "isFill" : "=",
        "width" : "=",
        "bold" : "=",
        "textWidth" : "=",
        "values" : "=",
        "maxNameLength" : "="
    },
    //事实上，id不是常量，id需要传入构造函数（未解析也可以），以免_testBuildMethod()发生误判
    "constantProperties" : ["id","maxNameLength"]
    };

    var Columnchart = Directive.extend({
    "init" : function(options) {
        var directiveThis = this;
        directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
    },

    "link" : function(scope, element, attrMap) {
    
        var thewidget = element.widget();
    
        scope.$watch("id", function(newValue, oldValue){
                thewidget.option("id", newValue);  
            });
            
            scope.$watch("isFill", function(newValue, oldValue){
                thewidget.option("isFill", newValue);  
            });
            
            scope.$watch("width", function(newValue, oldValue){
                thewidget.option("width", newValue);  
            });
            
            scope.$watch("bold", function(newValue, oldValue){
                thewidget.option("bold", newValue);
            });
            scope.$watch("textWidth", function(newValue, oldValue){
                thewidget.option("textWidth", newValue);
            });
            
        scope.$watch("values", function(newValue, oldValue) {
        thewidget.option("values", newValue);
        });
    }
    });

    new Columnchart().toAngularDirective();
    return Columnchart;
}); 