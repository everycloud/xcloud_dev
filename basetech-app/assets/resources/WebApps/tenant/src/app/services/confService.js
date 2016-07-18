/**
 * 配置手风琴一级菜单显隐，true表示显示，false表示隐藏
 * 注意：非SC场景，该配置文件也需要提供，否则加载失败，只是配置项在代码中不起作用
 */
define([], function () {
    "use strict";
var service = function () {
    //SC场景下网络VPC下服务显隐配置
    //vpc概览
    this.summary = "true";
    //vpc路由器
    this.router = "true";
    //vpc VLB
    this.vlb = "true";
    //vpc 部署服务
    this.deploymentService = "true";
    //vpc  网络
    this.network = "true";
    //共享vpc 弹性IP地址
    this.shareVpcEip = "true";
    //vpc 安全
    this.security = "true";
    //vpc VPN
    this.vpn = "true";
};

return service;
});