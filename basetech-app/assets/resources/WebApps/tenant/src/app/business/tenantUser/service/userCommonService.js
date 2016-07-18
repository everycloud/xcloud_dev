/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-6
 */
define(["app/services/messageService",
        "language/iam-exception"
    ],
    function (MessageService, IamException) {
        "use strict";
        var service = function () {
            this.doException = function (response, widget) {
                if (response && '200' !== response.status && '204' !== response.status) {
                    var responseObj = {};
                    try {
                        responseObj = JSON.parse(response.responseText);

                    } catch (e) {
                        new MessageService().errorMsgBox(response.status, "系统异常");
                        return;
                    }
                    var desc = "",
                        cause = "",
                        solution = "";
                    var exception = IamException[responseObj.code];
                    if (exception) {
                        desc = exception.desc;
                        cause = exception.cause;
                        solution = exception.solution;
                    }
                    new MessageService().errorMsgBox(responseObj.code, desc);
                } else {
                    if (widget === "") {
                        return;
                    }
                    if (widget) {
                        widget.destroy();
                    }
                }
            };
        };
        return service;
    });
