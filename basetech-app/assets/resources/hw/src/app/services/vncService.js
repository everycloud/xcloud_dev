
define(['tiny-lib/jquery', "jre/deployJava", "app/services/messageService"], function ($, deployJava, message) {
    var messageInstance = new message();

    var service = function ($q, camel) {
        //是否是第一次登陆
        this.isFirstLogin = true;
        this.jarPath = "../../../../public/";

        //检查jre 版本
        this.checkJreVersion = function () {
            var infoStr = "";
            try {
                var versionStr = deployJava.getJREs();
                if (versionStr) {
                    for (var i = 0; i < versionStr.length; i++) {
                        if ("1.7.0_15" <= versionStr[i]) {
                            infoStr = "";
                            break;
                        }
                    }
                }
            }
            catch (e) {
            }
            // 如果没有安装JRE，则给出提示以及下载链接
            if (infoStr === "") {
                return "success";
            }
            return "fail";
        };

        //查询、操作VNC请求
        this.optVNCLoginInfo = function (options) {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.get({
                url: {
                    "s": "/goku/rest/v1.5/irm/{vdc_id}/vm/{id}/vncAcessInfo",
                    "o": {
                        "vdc_id": $rootScope.user.vdcId,
                        "id": options.vmId
                    }},
                userId: $rootScope.user.id
            });
            deferred1.success(function (data) {
                if (data && data.code !== "0") {
                    messageInstance.errorMsgBox(data.code, data.message);
                }
                else {
                    deferred.resolve(data);
                }
            });
            deferred1.fail(function (data) {
                if (data && data.code !== "0") {
                    messageInstance.errorMsgBox(data.code, data.message);
                }
                else {
                    deferred.reject(null);
                }
            });
            return deferred.promise;
        };

        // 加载applet
        this.loadVNCApplet = function (domId, options) {
            var appletString = "<applet archive='VncViewer.jar' codebase=" + jarPath +
                " code='com.glavsoft.viewer.Viewer' width='1' height='1' name='vncApp'>" +
                "<param name='Host' value='" + ncip +
                "' /><param name='Port' value='" + vmPort +
                "' /><param name='Password' value='" + vncPwd +
                "' /><param name='vmID' value='" + vmID +
                "' /><param name='title' value='" + vmTitle +
                "' /><param name='cdRomStatus' value='" + cdRomStatus +
                "' /><param name='hcdromflag' value='" + hcdromflag +   //是否添加本地挂光驱映射的标志，success为添加
                "' /><PARAM NAME='SHAENCFLAG' VALUE='true'>" +
                "<param name='OpenNewWindow' value='yes' />" +
                "<param name='ShowControls' value='yes' />" +
                "<param name='ViewOnly' value='no' /> " +
                "<param name='AllowClipboardTransfer' value='yes' />" +
                "<param name='RemoteCharset' value='standard' />" +
                "<param name='ShareDesktop' value='yes' />" +
                "<param name='AllowCopyRect' value='yes' />" +
                "<param name='Encoding' value='Tight' />" +
                "<param name='CompressionLevel' value='' />" +
                "<param name='JpegImageQuality' value='' /> " +
                "<param name='LocalPointer' value='On' /> " +
                "<param name='ConvertToASCII' value='no' />" +
                "<param name='colorDepth' value='' />" +
                "<param name='ScalingFactor' value='100' />" +
                "<param name='sshHost' value='' />" +
                "<param name='sshUser' value='' />" +
                "<param name='language' value='" + language +
                "'/><param name='sshPort' value='' /></applet>";

            $(domId).html(appletString);
        };

        //挂载光驱
        this.loadCDRom = function () {
            var deferred = $q.defer();
            deferred.notify("");
            var deferred1 = camel.post({
                url: {
                    "s": "/goku/rest/v1.5/irm/{vdc_id}/vm/{id}/attachISO",
                    "o": {
                        "vdc_id": $rootScope.user.vdcId,
                        "id": options.vmId
                    }},
                params: {
                    operate: {
                        key: 'VmAttachCdrom',
                        info: {
                            '0_n': vmName,
                            '1_n': vmID,
                            '2_n': sffPath,
                            '3_n': ''
                        }
                    },
                    VRM: {
                        devicePath: sffPath,
                        username: "",
                        password: "",
                        protocol: "sff"
                    }
                },
                userId: $rootScope.user.id
            });
            deferred1.success(function (data) {
                if (data && data.code !== "0") {
                    messageInstance.errorMsgBox(data.code, data.message);
                }
                else {
                    deferred.resolve(data);
                }
            });
            deferred1.fail(function (data) {
                if (data && data.code !== "0") {
                    messageInstance.errorMsgBox(data.code, data.message);
                }
                else {
                    deferred.reject(null);
                }
            });
            return deferred.promise;
        };
    };
    return service;
});