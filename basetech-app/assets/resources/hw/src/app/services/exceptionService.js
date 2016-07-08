define([
    "app/services/tipMessageService",
    "language/keyID"], function (tipMessageService, i18n) {
    "use strict";
    function closeWidget(widget) {
        if (!widget) {
            return;
        }
        widget.destroy();
    }

    var exceptionCollection = {};
    function extend(obj){
        for (var k in obj){
            exceptionCollection[k] = obj[k];
        }
    }

    require(["language/ssp-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/iam-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/irm-rpool-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/ssp-rpool-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/ui-common-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/ame-rpool-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/sr-rpool-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/ssp-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/framework-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/fault-exception"], function(Exc){
        extend(Exc);
    });
    require(["language/dataanalytics-exception"], function(Exc){
        extend(Exc);
    });

    var exception = function () {
        var tipMessage = new tipMessageService();
        this.doException = function (response, widget) {
            //优先判断http响应码， 后台框架中2xx已经全部转为200
            //当是异常时，返回体中是JSON格式字符串
            //针对put或者delete 返回可能是204, 这里表示返回没有内容，jquery header中设置了content-type:json时会走fail分支
            if (!this.isException(response)) {
                closeWidget(widget);
                return;
            }

            // 处理401错误
            if (response.status === 401) {
                response.responseText = JSON.stringify({"code": "0000030001", "message": "The user is not authorized to perform the operation."});
            }
            var responseObj = {};
            try {
                responseObj = JSON.parse(response.responseText);
                //对null的处理
                if(!responseObj) {
                    return;
                }
            } catch (e) {
                // 处理状态码是500，但没有错误码的情况
                if (response.status === 500) {
                    responseObj = {"code": "0000000001", "message": "System error."};
                }
                else{
                    return;
                }
            }

            exception = exceptionCollection[responseObj.code];
            if (exception) {
                tipMessage.alert("error", exception.desc);
                return;
            }

            require(["language/system-exception"], function (systemException) {
                exception = systemException[responseObj.code];
                if (exception) {
                    tipMessage.alert("error", exception.desc);
                    return;
                }

                if (responseObj.message) {
                    tipMessage.alert("error", responseObj.message);
                }
                else {
                    for (var index in responseObj) {
                        if(responseObj[index]){
                            tipMessage.alert("error", responseObj[index].message);
                            break;
                        }
                    }
                }
            },function(){
                if (responseObj.message) {
                    tipMessage.alert("error", responseObj.message);
                }
                else {
                    for (var index in responseObj) {
                        if(responseObj[index]){
                            tipMessage.alert("error", responseObj[index].message);
                            break;
                        }
                    }
                }
            });
        };

        // 获取code对应的exception信息
        this.getException = function (code) {
            return exceptionCollection[code];
        };

        //异后台返回的不是真正的异常时弹出的提示框,一般为前台问题,接口问题等
        this.doFaultPopUp = function () {
            tipMessage.alert("error", "Internal Error.");
        };

        //判断是否是一个真正的异常
        this.isException = function (response) {
            if (!response || /^2\d\d$/.test(response.status) || (response.responseText === "" && response.status !== 401)) {
                return false;
            }
            return true;
        };
    };

    return exception;
});