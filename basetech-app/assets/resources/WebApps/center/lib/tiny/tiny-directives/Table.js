define( ["tiny-directives/Directive", "tiny-widgets/Table", "tiny-lib/underscore"], function( Directive, TableWidget,  _){
    
    var DEFAULT_CONFIG = {
        
        "directiveName": "tinyTable",
        
        "widgetClass": TableWidget,
        
        "scope":{
            "id" : "=",
            "tableLanguage":"=",
            "data":"=",
            "columns":"=",
            "caption":"=",
            "enablePagination":"=",
            "paginationStyle":"=",
            "lengthChange":"=",
            "lengthMenu":"=",
            "displayLength":"=",
            "enableFilter":"=",
            "enableSort":"=",
            "hideTotalRecords":"=",
            "totalRecords":"=",
            "callback" : "=",
            "curPage":"=",
            "renderRow" :"=",
            "changeSelect":"=",
            "requestConfig":"=",
            "columnsVisibility":"=",
            "columnsDraggable":"=",
            "columnSorting":"=",
            "showDetails":"=",
            "cellClickActive":"&",
            "opAreaConfig":"=",
            "checkbox":"="
        }
         
    };
    
    var Table = Directive.extend({
        
        "init": function(options){
            
            var directiveThis = this;
            
            directiveThis._super( _.extend( {}, DEFAULT_CONFIG, options )  );
            
        },
        
        "compile": function (element, attrMap, transclude) {
            
            var directiveThis = this;
            
            
            return directiveThis.link;
            
          },
         
        "link": function( scope, element, attrMap ){
            
            var directiveThis = this;

            // 获取用户设置的属性
            var userOpts = _.pick(scope, _.keys(attrMap));
            //根据用户设置的属性，构造控件实例
            directiveThis.widgetInstance = new directiveThis.widgetClass(userOpts);
            
            var $tableDom = directiveThis.widgetInstance._element;
            
            element.replaceWith($tableDom);

            !_.isUndefined(scope.id) && $tableDom.prop("id", scope.id);
            
            var widgetObj = $tableDom.widget();

            if( userOpts.columnsDraggable === true){
                 widgetObj._updateBody();
            }

            scope.$watch("opAreaConfig", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("opAreaConfig", newValue);
            });

            scope.$watch("columnSorting", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("column-sorting", newValue);
            });

            scope.$watch("columns", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("columns", newValue);
            });

            scope.$watch("hideTotalRecords", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("hide-total-records", newValue);
            });
            
            scope.$watch("caption", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("caption", newValue);
            });
            
            scope.$watch("enablePagination", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("enable-pagination", newValue);
            });
            
            scope.$watch("paginationStyle", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("pagination-style", newValue);
            });
            
            scope.$watch("lengthChange", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
               widgetObj.option("length-change", newValue);
            });
            
            scope.$watch("lengthMenu", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("length-menu", newValue);
            });
            
            scope.$watch("displayLength", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("display-length", newValue);
            });
            
            scope.$watch("enableSort", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("enable-sort", newValue);
                
            });
            
            scope.$watch("totalRecords", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("total-records", newValue);
                
            });
            
            scope.$watch("curPage", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("cur-page", newValue);
                
            });
            
             scope.$watch("data", function(newValue, oldValue){
                if(newValue === oldValue){
                    return;
                }
                widgetObj.option("data", newValue);
            });
        }
            
    });
    
    new Table().toAngularDirective();
    
    return Table;
    
} );
