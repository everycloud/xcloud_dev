define(["tiny-directives/Directive", "tiny-widgets/Pagination"], function(Directive, PaginationWidget) {

    var DEFAULT_CONFIG = {

        "directiveName" : "tinyPagination",

        "widgetClass" : PaginationWidget,

        "constantProperties" : ["type", "lengthOptions", "callback", "changeSelect"],

        "scope" : {
            "id" : "=",
            "display" : "=",
            "totalRecords" : "=",
            "curPage" : "=",
            "displayLength" : "=",
            "lengthOptions" : "=",
            "hideTotalRecords" : "=",
            "hideDisplayLength" : "=",
            "type" : "=",
            "callback" : "=",
            "changeSelect" : "="
        },

        "template" : '<div class="tiny-linechart"></div>',

        "replace" : true

    };

    var Pagination = Directive.extend({

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
            
            // 获取用户设置的属性
            var userOpts = _.pick(scope, _.keys(attrMap));
            // 将用户设置的属性中的驼峰形式转化为中划线形式（构造器方式下属性为中划线形式）
            var destOpts = directiveThis.camelPropToSnake(userOpts);
            // 通过用户设置的属性来生成控件实例
            directiveThis.widgetInstance = new directiveThis.widgetClass(destOpts);
            
            var $pagDom = directiveThis.widgetInstance._element;
            
            element.replaceWith($pagDom);
            
            !_.isUndefined(scope.id) && $pagDom.prop("id", scope.id);
            
            var widgetObj = $pagDom.widget();

            scope.$watch("totalRecords", function(newValue, oldValue) {
                 if(newValue === oldValue){
                    return;
                }
                widgetObj.option("total-records", newValue);

            });

            scope.$watch("curPage", function(newValue, oldValue) {
                 if(newValue === oldValue){
                    return;
                }
                widgetObj.option("cur-page", newValue);

            });
            
            scope.$watch("displayLength", function(newValue, oldValue) {
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("display-length", newValue);

            });

            scope.$watch("hideTotalRecords", function(newValue, oldValue) {
                 if(newValue === oldValue){
                    return;
                }
                widgetObj.option("hide-total-records", newValue);

            });

            scope.$watch("hideDisplayLength", function(newValue, oldValue) {
                 if(newValue === oldValue){
                    return;
                }
                widgetObj.option("hide-display-length", newValue);

            });

            scope.$watch("display", function(newValue, oldValue) {
                 if(newValue === oldValue){
                    return;
                }
                widgetObj.option("display", newValue);

            });

        }
    });

    new Pagination().toAngularDirective();

    return Pagination;

});
