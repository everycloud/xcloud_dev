/**
 * main service
 * main.js中内容过多，方法在次service中实现
 */
define(["app/business/system/services/vdiManageService"], function (VdiManageService) {
    "use strict";

    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {

        //显示桌面云菜单,在rootScope作用域下调用
        this.showVdiMenu = function (show) {
            var menus = this.plugins;
            for (var i = 0, len = menus.length; i < len; i++) {
                var menu = menus[i];
                if (menu && menu.type === "vdi") {
                    menu.hide = !show;
                    break;
                }
            }
        };
        //检查是否需要显示桌面云菜单并显示
        this.vdiMenuAction = function (options) {
            if(options.scope.user.privilege.sys_term_desktopAddr_label){
                !options.scope.showVdiMenu && (options.scope.showVdiMenu = this.showVdiMenu);
                var vdiManageService = new VdiManageService($q, camel);
                var monitor = false;
                var promise = vdiManageService.vdiList(options.userId, {
                    start: 0,
                    limit: 10
                }, monitor);
                promise.then(function (response) {
                    options.scope.showVdiMenu(response.total);
                },function(){
                    options.scope.showVdiMenu(false);
                });
            }
        };

        this.isCompetenceState = function (menus, state) {
            var self = this;
            for (var i = 0, len = menus.length; i < len; i++) {
                var node = menus[i];
                if (node.children) {
                    if(self.isCompetenceState(node.children, state)){
                        return true;
                    }
                } else if (node.state === state) {
                    return !node.hide;
                }
            }
            return false;
        }
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});