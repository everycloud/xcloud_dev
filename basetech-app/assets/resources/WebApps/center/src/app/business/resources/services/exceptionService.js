/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：14-3-29
 */
define(["app/services/messageService"],
    function (MessageService) {
        var service = {
            "doException": function (response, exception) {
                // 鉴权失败特殊处理
                if (response.status == "401") {
                    new MessageService().errorMsgBox("0000030001", "用户无此操作权限。", "用户无此操作权限。", "请联系系统管理员。");
                    return;
                }

                // 普通异常处理
                if (response && '200' != response.status) {

                    var code = "100000";
                    var desc = "系统异常";
                    var cause = "";
                    var solution = "";
                    try{
                        var responseObj = JSON.parse(response.responseText);
                        code = responseObj.code;
                        desc = exception && exception[responseObj.code] && exception[responseObj.code].desc || "系统异常";
                        cause = exception && exception[responseObj.code] && exception[responseObj.code].cause || "";
                        solution = exception && exception[responseObj.code] && exception[responseObj.code].solution || "";
                    } catch (e) {
                        // do nothing
                    }

                    new MessageService().errorMsgBox(code, desc, cause, solution);
                }
            }
        };

        return service;
    });