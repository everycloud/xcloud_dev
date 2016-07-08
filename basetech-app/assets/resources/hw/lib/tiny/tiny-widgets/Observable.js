/**
 * 事件源， 其他对象可以订阅、或取消订阅事件
 */
define([ "tiny-lib/Class" ], function(Class){
    
    
    var Observable = Class.extend({
        
        "init":function(options){
            
            this.listeners = {};
            
        },
        
        "trigger" : function(ev, args) {
            if (!!this.listeners[ev]) {
            	args = Object.prototype.toString.call(args) === '[object Array]' ? args : [];
                for (var i = 0; i < this.listeners[ev].length; i++) {
                    this.listeners[ev][i].apply(null, args);
                }
            }
        },
        
        "on" : function(ev, fn) {
            
            if (!this.listeners[ev]) {
                this.listeners[ev] = [];
            }
         
            if (fn instanceof Function) {
                this.listeners[ev].push(fn);
            }
        },
         
        "off" : function(ev, fn) {
            if (!!this.listeners[ev] &&
                this.listeners[ev].length > 0) {
                if (!!fn) {
                    var fns = [];
                    for (var i = 0; i < this.listeners[ev].length; i++) {
                        if (fn != this.listeners[ev][i]) {
                            fns.push(this.listeners[ev][i]);
                        }
                    }
                    this.listeners[ev] = fns;
                } else { 
                    this.listeners[ev] = [];
                }
            }
        }
        
    });
    
    
    return Observable;
    
    
});
