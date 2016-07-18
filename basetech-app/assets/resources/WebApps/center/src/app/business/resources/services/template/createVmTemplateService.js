/**
 */
define(function () {
    "use strict";

    var createVmTemplate = function() {
        return {
            step: {
                "id": "vmTemplateCreateStep",
                "values": ["基本信息", "虚拟机模板规格", "创建虚拟机模板", "安装软件"],
                "width": 450,
                "jumpable":false
            },

            show: "baseInfo",

            model: {
                "name":"",
                "picture":"../theme/default/images/edit.png",
                "hypervisor":"",
                "visibility":"system",
                "description":""
            }
        }
    };

    return createVmTemplate;
});
