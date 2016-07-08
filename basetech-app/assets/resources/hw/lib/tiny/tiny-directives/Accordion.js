define( ["tiny-directives/Directive", "tiny-widgets/Accordion"], function( Directive, accordionWidget ){
    
    var DEFAULT_CONFIG = {
        
        "directiveName": "tinyAccordion",
        
        "widgetClass": accordionWidget,
        
        "constantProperties": [],
        
        "scope":{
        	"id":"=",
            "head":"=",
            "content":"=",
            "width":"=",
            "height":"=",
            "active":"=",
            "hidePanel":"="
        }
        
    };
    
    var accordion = Directive.extend({
        
        "init": function(options){
            
            var directiveThis = this;
            
            directiveThis._super( _.extend( {}, DEFAULT_CONFIG, options )  );
            
        },
        
        "link": function( scope, element, attrMap ){
        	scope.$watch("id", function(newValue, oldValue){
                
                element.widget().option("id", newValue);  
            });
            
            scope.$watch("head", function(newValue, oldValue){
                
                element.widget().option("head", newValue);  
            });
            
            scope.$watch("content", function(newValue, oldValue){
                
                element.widget().option("content", newValue);
                
            });
            
            scope.$watch("width", function(newValue, oldValue){
                
                element.widget().option("width", newValue);
                
            });
            
            scope.$watch("height", function(newValue, oldValue){
                
                element.widget().option("height", newValue);
                
            });
            
            scope.$watch("active", function(newValue, oldValue){

                element.widget().option("active", newValue);
   
            });
            
            scope.$watch("hidePanel", function(newValue, oldValue){

                element.widget().option("hide-panel", newValue);
   
            });
        }
        
    });
    
    new accordion().toAngularDirective();
    
    return accordion;
    
} );
