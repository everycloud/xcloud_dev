/**
 */
define(["jquery", "jre/deployJava"], function ($, deployJava) {
    var service = function ($q, camel) {

        var subRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;
        var sub = function (s, o) {
            return ((s.replace) ? s.replace(subRegRex, function (match, key) {
                return (!angular.isUndefined(o[key])) ? o[key] : match;
            }) : s);
        };

        var isFirstLogin = true;

        var vmID = undefined;

        var vncOptions = {};

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
            if (infoStr === "") {
                return "success";
            }
            return "fail";
        };

        window.top.getServerIp = function () {
            return vncOptions.vncIp + ',' + vncOptions.toolInstallStatus;
        };

        window.top.getHostdevices = function() {
            return "";
        };

        window.top.getVNCInfos = function() {
            return vncOptions.vncIp + "," + vncOptions.vmPort + "," + vncOptions.vncPwd + "," + "0" + "," + vncOptions.status + "," + vncOptions.vncPwd;
        };

        window.top.vncpwdInfo1 = function ()
        {
            queryVmInfo();
            return vncOptions.cdRomStatus;
        };

        window.top.VM_DetachCdrom = function() {
            var config = {
                "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vm/{id}/dettachISO", "o": {"tenant_id": 1, "id": vncOptions.id}},
                "params":JSON.stringify({"vmId":vncOptions.id}),
                "beforeSend": function (request) {
                    request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                }
            };
            var deferred = $.ajax({
                "type": "POST",
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": config.beforeSend || function () {
                }
            });

            deferred.complete(function(xmlHttpRequest, ts){
                if (xmlHttpRequest.status != "200") {
                    if ('timeout' == ts){
                        jsAlert(i18n.connectTimeOut);
                    }
                    else{
                        var code = -1;
                        try {
                            var responseObj = JSON.parse(xmlHttpRequest.responseText);
                            code = responseObj.code;
                        } catch (e) {
                        }

                        if ("0" == code){
                            document.vncApp.unloadSuccess();
                        }
                        else if("1002105" == code){
                            document.vncApp.unloadSuccess();
                            setTimeout(function(){
                                document.vncApp.showMessage(i18n.info, i18n.hasNoCdRom);
                            }, 500);
                        }
                        else{
                            jsAlert(i18n.unmountFailure);
                        }
                    }

                } else {
                    jsAlert(i18n.unmountCdRomSuccess);
                    document.vncApp.unloadSuccess();
                }
            });
        };

        window.top.loadCDRom = function() {
            clearTimer();
            var devicePath = vncOptions.devicePath.replace(/\\/g, '/');

            var config = {
                "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vm/{id}/attachISO", "o": {"tenant_id": 1, "id": vncOptions.id}},
                "params":JSON.stringify({
                    "vmId":vncOptions.id,
                    "devicePath":devicePath,
                    "username":"",
                    "password":"",
                    "protocol":"sff"
                }),
                "beforeSend": function (request) {
                    request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                }
            };

            var deferred = $.ajax({
                "type": "POST",
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "timeout":120000,
                "beforeSend": config.beforeSend || function () {
                }
            });

            deferred.complete(function(xmlHttpRequest, ts){
                var code = -1;
                var taskID = -1;
                try {
                    var responseObj = JSON.parse(xmlHttpRequest.responseText);
                    code = responseObj.code;
                    taskID = responseObj.taskUri;
                } catch (e) {
                }

                if (xmlHttpRequest.status != "200") {
                    if ('timeout' == ts){
                        jsAlert(i18n.connectTimeOut);
                    }
                    else{
                        if ("1002104" == code) {
                            document.vncApp.loadCdRomSuccess();
                            document.vncApp.destroyLink();
                            setTimeout(function () {
                                document.vncApp.showMessage(i18n.info, i18n.alreadyMountCdRom);
                            }, 500);
                        }
                        else {
                            document.vncApp.loadCdRomFailed();
                            jsAlert(i18n.mountFailure);
                        }
                    }
                    startTimer();
                } else {

                    startQueryTaskTimer(taskID, "local");

                    startTimer();
                }
            });

        };

        window.top.cifsLoadCDRom = function (sharePath, username, password, isLocal) {
            clearTimer();
            sharePath = sharePath.replace(/\\/g, '/');

            var protocal = "";
            if (isLocal) {
                password = password.replace(/\\/g, "\\\\");
                password = password.replace(/"/g, "\\\"");

                protocal = "cifs";
            } else {
                password = "";
                username = "";
            }

            var config = {
                "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vm/{id}/attachISO", "o": {"tenant_id": 1, "id": vncOptions.id}},
                "params":JSON.stringify({
                    "vmId":vncOptions.id,
                    "devicePath":sharePath,
                    "username":username,
                    "password":password,
                    "protocol":protocal
                }),
                "beforeSend": function (request) {
                    request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                }
            };

            var deferred = $.ajax({
                "type": "POST",
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "timeout":120000,
                "beforeSend": config.beforeSend || function () {
                }
            });

            deferred.complete(function(xmlHttpRequest, ts){
                var code = -1;
                var taskID = -1;
                try {
                    var responseObj = JSON.parse(xmlHttpRequest.responseText);
                    code = responseObj.code;
                    taskID = responseObj.taskUri;
                } catch (e) {
                }

                if (xmlHttpRequest.status != "200") {
                    if ('timeout' == ts){
                        jsAlert(i18n.connectTimeOut);
                    }
                    else{
                        if("1002104" == code){
                            document.vncApp.cifsLoadSuccess();
                            document.vncApp.destroyLink();
                            setTimeout(function(){
                                document.vncApp.showMessage(i18n.info, i18n.alreadyMountCdRom);
                            }, 500);
                        }
                        else{
                            document.vncApp.loadCdRomFailed();
                            document.vncApp.cifsButEnable();
                            jsAlert(i18n.mountFailure);
                        }
                    }

                    document.vncApp.loadCdRomFailed();
                    document.vncApp.cifsButEnable();

                    startTimer();
                } else {
                    startQueryTaskTimer(taskID, "share");
                    startTimer();
                }
            });
        };

        window.top.restartVm = function() {
            clearTimer();

            var config = {
                "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vms/action", "o": {"tenant_id": 1}},
                "params":JSON.stringify({"operate":{
                    "type":"reboot",
                    "vmIds":[vncOptions.id],
                    "vmOpMode":"force"
                }}),
                "beforeSend": function (request) {
                    request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                }
            };
            var deferred = $.ajax({
                "type": "POST",
                "contentType": "application/json; charset=UTF-8",
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": config.beforeSend || function () {
                }
            });
            deferred.success(function (data) {
            });
            deferred.fail(function(){
                jsAlert(i18n.serverError);
            });

            startTimer();
            return "js is running.";
        };

        window.top.doCreatVMLink = function(filePath)
        {
            vncOptions.devicePath = filePath;
            var regExp = /.ISo$/gi;
            if(filePath == "" || filePath == null)
            {
                jsAlert(i18n.notSelectIso);
                return "failure";
            }

            else if(filePath.length > 4 && regExp.test(filePath))
            {
                return "success";
            }
            else if(filePath.length == 2 && filePath.lastIndexOf(":") > 0)
            {
                return "success";
            }
            else
            {
                jsAlert(i18n.notSelectIso);
                return "failure";
            }
        };

        window.top.fcloseVM = function() {
            var msgTitle = "请确认要强制关闭虚拟机吗？";
            var result = document.vncApp.showConfirmDialog(i18n.ok, msgTitle, true);

            if (result == 0){
                clearTimer();

                var config = {
                    "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vms/action", "o": {"tenant_id": 1}},
                    "params":JSON.stringify({
                        "operate":
                        {
                            "type": "stop",
                            "vmIds": [vncOptions.id],
                            "vmOpMode": "force"
                        }
                    }),
                    "beforeSend": function (request) {
                        request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                    }
                };
                var deferred = $.ajax({
                    "type": "POST",
                    "contentType": "application/json; charset=UTF-8",
                    "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                    "data": config.params || {},
                    "beforeSend": config.beforeSend || function () {
                    }
                });
                deferred.success(function (data) {

                });
            }

        };

        window.top.checkSharePath = function(sharePath) {
            var regExp = /^((\\\\(([1-9]|[1-9]\d|(10|11)\d|12[0-6]|12[8-9]|1[3-9]\d|2[0-1]\d|22[0-3])(\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3})){1})((((\\){1})([a-zA-Z0-9-_ .]{1,})){1,})((\\){1})([a-zA-Z0-9-_ .]{1,})((\.iso)|(\.ISO)|(\.Iso)|(\.iSo)|(\.isO)|(\.ISo)|(\.IsO)|(\.iSO)){1}$/;

            //判断文件路径是否符合正则要求，且长度不超过100
            if(regExp.test(sharePath) && sharePath.length <= 100)
            {
                return "success";
            }
            else
            {
                return "failed";
            }
        };

        var jsAlert = function(msg, okBack)
        {
            document.vncApp.showMessage(i18n.info, msg);
            if (okBack)
            {
                okBack();
            }
        };

        var timeHandle = undefined;
        var startTimer = function(){
            clearTimer();
            timeHandle = setInterval(queryVmInfo, 10000);
        };

        var clearTimer = function() {

            try{
                window.clearInterval(timeHandle);
            } catch(e) {
                // do nothing
            }

        };

        var queryTimehandle = undefined;
        var startQueryTaskTimer = function(taskID, type){
            clearQueryTaskTimer();
            vncOptions.taskID = taskID;
            vncOptions.type = type;

            queryTimehandle = setInterval(queryMountTask, 2000);
        };

        var clearQueryTaskTimer = function() {

            try{
                window.clearInterval(queryTimehandle);
            } catch(e) {
                // do nothing
            }

        };

        var queryMountTask = function () {
            var taskID = vncOptions.taskID;
            var type = vncOptions.type;

            var defered = camel.get({
                "url": {s: "/goku/rest/v1.5/1/tasks?taskid={taskid}&withsubtask={withsubtask}", o: {"taskid": taskID, "withsubtask": 'false'}},
                "userId": $("html").scope().user && $("html").scope().user.id,
                "monitor":false
            });
            defered.success(function (response) {
                if (response.specificTask.task.taskProgress.status == "SUCCESS") {
                    clearQueryTaskTimer();
                    if (type == "share") {
                        jsAlert(i18n.mountCdRomSuccess);
                        document.vncApp.cifsLoadSuccess();
                    } else if (type == "local") {
                        jsAlert(i18n.mountCdRomSuccess);
                        document.vncApp.loadCdRomSuccess();
                    } else {
                        // do nothing
                    }
                } else if ("FAILED" == response.specificTask.task.taskProgress.status
                    || "COMPLETED" == response.specificTask.task.taskProgress.status
                    || "CANCELLED" == response.specificTask.task.taskProgress.status
                    || "CANCELLING" == response.specificTask.task.taskProgress.status) {

                    clearQueryTaskTimer();
                    if (type == "share") {
                        jsAlert(i18n.unmountFailure);
                        document.vncApp.loadCdRomFailed();
                        document.vncApp.cifsButEnable();
                        jsAlert(i18n.mountFailure);
                    } else if (type == "local") {
                        jsAlert(i18n.unmountFailure);
                        document.vncApp.loadCdRomFailed();
                        jsAlert(i18n.mountFailure);
                    } else {
                        // do nothing
                    }
                } else {
                    // 处理中
                }
            });
            defered.fail(function (response) {
                clearQueryTaskTimer();
            });
        };

        var getLanguage = function() {
            var key = "locale";
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, key.length + 1) == (key + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(key.length + 1));
                        break;
                    }
                }
            }

            if (cookieValue == null) {
                return "zh_CN";
            }

            return cookieValue;
        };

        // 国际化
        var i18n = {};
        var i18nInit = function() {
            if(getLanguage() == "zh_CN")
            {
                i18n.ok = "确定";
                i18n.cancel = "取消";
                i18n.info = "提示";
                i18n.confirm = "确认";
                i18n.notSupportVnc = "虚拟机当前无法支持VNC登录，请稍后重试!";
                i18n.connectTimeOut = "服务器连接超时，请重试!";
                i18n.serverError = "服务器连接失败，请重试!";
                i18n.rebootTips = "提示：如果您登录虚拟机安装系统时发现虚拟机已经从硬盘启动，请强制重启虚拟机并重新登录。";
                i18n.forcecloseTips="强制关机可能会造成虚拟机磁盘数据的损坏，以及主机资源不释放，确定要强制关机吗？";
                i18n.checkingJre = "检查JRE...";
                i18n.vncLoad = "VNC登录_";
                i18n.forceRestart = "强制重启";
                i18n.mountCdRom = "挂载光驱";
                i18n.unmountCdRom = "卸载光驱";
                i18n.mountCdRomSuccess = "挂载光驱成功！";
                i18n.unmountCdRomSuccess = "卸载光驱成功！";
                i18n.sureToReboot = "您确认要强制重启吗？";
                i18n.rebootAfterMount = "挂载成功，是否立即重启操作系统？";
                i18n.sureToUnmountCdRom = "您确认要执行卸载光驱操作吗？";
                i18n.unmountFailure = "卸载光驱失败，请到任务中心查看详情！";
                i18n.sureToMountCdRom = "您确认要执行挂载光驱操作吗？";
                i18n.mountFailure = "挂载光驱失败，请到任务中心查看详情！";
                i18n.notSelectIso = "请选择ISO文件或者光驱盘!";
                i18n.alreadyMountCdRom = "虚拟机已挂载光驱，不能重复挂载。";
                i18n.hasNoCdRom = "虚拟机未挂载光驱，不能卸载。";
                i18n.systemError = "系统异常，请稍后重试。";
                i18n.installJreTips = "请先<a href='../lib/vnc/jre-7u15-windows-i586.exe'>下载</a>并安装JRE。安装后如果仍存在问题，请卸载PC上所有JRE，再重新安装。<br>注意：安装JRE后，首次打开VNC登录页面时，如果弹出\"Java Update Needed\"窗口，请勾选\"Do not ask again until the next update is available.\"，并单击\"Later\"。否则可能无法正常登录VNC，需要卸载JRE并重新安装最新版本的JRE。";
                i18n.vncloginTip = "提示：";
                i18n.vncloginTip1 = "1、挂载光驱时，请勿关闭或刷新VNC登录页面，否则光驱会断开。";
                i18n.vncloginTip2 = "2、安装操作系统时，如果虚拟机已经从硬盘启动，请强制重启虚拟机。";
                i18n.vncloginTip3 = "3、浏览器可能会提示Java(TM)插件已过期。该提示不影响功能使用，请选择继续运行。更新Java(TM)插件到最新版本后,提示会自动消失。";
                i18n.vncloginTip4 = "4、VNC登录大概需要1分钟，请耐心等待。"
            }
            else
            {
                i18n.ok = "OK";
                i18n.cancel = "Cancel";
                i18n.info = "Info";
                i18n.confirm = "Confirm";
                i18n.notSupportVnc = "The VM cannot be logged in to using VNC at this moment. Please try again later.";
                i18n.connectTimeOut = "Connection to the server timed out. Please try again.";
                i18n.serverError = "The server failed to be connected. Please try again later.";
                i18n.rebootTips = "If the VM on which you want to install an operating system starts from the hard disk, please forcibly restart the VM and log in to the VM again.";
                i18n.forcecloseTips="The system disk data may be corrupted if you forcibly stop the server, and the host resource does not release, Are you sure you want to perform the operation?";
                i18n.checkingJre = "Checking JRE...";
                i18n.vncLoad = "VNC login ";
                i18n.forceRestart = "Forcibly restart";
                i18n.mountCdRom = "Attach a CD-ROM drive.";
                i18n.unmountCdRom = "Detach a CD-ROM drive.";
                i18n.mountCdRomSuccess = "The CD-ROM drive is attached.";
                i18n.unmountCdRomSuccess = "The CD-ROM drive is detached.";
                i18n.sureToReboot = "Are you sure you want to forcibly restart the VM?";
                i18n.rebootAfterMount = "The CD-ROM drive is attached successfully. Do you want to restart the operating system immediately?";
                i18n.sureToUnmountCdRom = "Are you sure you want to detach the CD-ROM drive?";
                i18n.unmountFailure = "The CD-ROM drive fails to be detached. Please see detail info in task center.";
                i18n.sureToMountCdRom = "Are you sure you want to attach the CD-ROM drive?";
                i18n.mountFailure = "The CD-ROM drive fails to be attached. Please see detail info in task center.";
                i18n.notSelectIso = "Please select the ISO file or CD-ROM drive.";
                i18n.alreadyMountCdRom = "A CD-ROM drive has been attached to the VM.";
                i18n.hasNoCdRom = "No CD-ROM drive is attached to the VM.";
                i18n.systemError = "System error. Please try again later.";
                i18n.installJreTips = "Please <a href='../lib/vnc/jre-7u15-windows-i586.exe'>download</a> and install JRE. if you still cannot use this function after installing the Java plug-in, uninstall all plug-ins on the PC and reinstall them.<br>Note: After JRE is installed, if \"Java Update Needed\" is displayed upon your first login, select \"Do not ask again until the next update is available.\" and click \"Later\". Otherwise, the VNC login fails and you need to install the latest version of JRE.";
                i18n.vncloginTip = "Tips：";
                i18n.vncloginTip1 = "1. When mounting a CD-ROM drive or an ISO file, do not close or refresh VNC login page. Otherwise, the CD-ROM drive or ISO file fails to be mounted.";
                i18n.vncloginTip2 = "2. When installing the OS for a VM, forcibly restart the VM if the VM has started from the hard disk.";
                i18n.vncloginTip3 = "3. The browser may display message indicating that the Java (TM) plug-in has expired. Please select Continue because it still can be used. After you install the Java (TM) of the latest version, the message is not displayed.";
                i18n.vncloginTip4 = "4. VNC login takes about 1 minute. Please wait."
            }
        };

        var getUportalInfo = function () {
            var key = "JSESSIONID";
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, key.length + 1) == (key + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(key.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        };

        /**
         * vnc登陆
         * @param vmtID
         */
        var queryVmInfo = function() {
            var id = vncOptions.id;
            var config = {
                "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vm/{id}", "o": {"tenant_id": 1, "id": id}},
                "beforeSend": function (request) {
                    request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                }
            };
            var deferred = $.ajax({
                "type": "GET",
                "cache": false,
                "async": false,
                "contentType": "application/json; charset=UTF-8",
                "timeout":60000,
                "url": !angular.isString(config.url) ? sub(config.url.s, config.url.o) : config.url,
                "data": config.params || {},
                "beforeSend": config.beforeSend || function () {
                }
            });
            deferred.success(function (data) {
                if (!data || !data.vmInfos) {
                    return;
                }

                var vmInfo = data.vmInfos;
                vncOptions.sessionId = getUportalInfo();
                vncOptions.path = "./";
                vncOptions.vncIp = vmInfo[id].vncAcessInfo.hostip;
                vncOptions.vmPort = vmInfo[id].vncAcessInfo.vncport;
                vncOptions.vncPwd = vmInfo[id].vncAcessInfo.vncpassword;
                vncOptions.shaEncFlag = vmInfo[id].vncAcessInfo.shaEncFlag;
                vncOptions.vmID = vmInfo[id].vmVisibleId;
                vncOptions.vmTitle = vmInfo[id].vmVisibleId + "[" + vmInfo[id].name + "]";
                vncOptions.cdRomStatus = vmInfo[id].cdRomStatus;
                vncOptions.canMountCdRom = vmInfo[id].vmOption.supportRemoteAttach;
                vncOptions.status = vmInfo[id].status;
                vncOptions.toolInstallStatus = vmInfo[id].toolInstallStatus;
            });
        };

        this.clearTime = function () {
            clearTimer();
            clearQueryTaskTimer();
        };

        // 加载applet
        this.loadVNCApplet = function (domId, options) {
            // 保存vnc信息
            vncOptions = options;

            // 初始化国际化
            i18nInit();

            // 检查Jre版本

            var appletString = "<applet archive='../lib/vnc/VncViewer.jar;JSESSIONID=" + options.sessionId +
                "'codebase=" + options.path +
                " code='com.glavsoft.viewer.Viewer' width='1' height='1' name='vncApp'>" +
                "<param name='Host' value=" + options.vncIp +
                " /><param name='Port' value=" + options.vmPort +
                " /><param name='Password' value='" + options.vncPwd +
                "'/><param name='vmID' value='" + options.vmID +
                "'/><param name='shaencflag' value='" + options.shaEncFlag +
                "'/><param name='OpenNewWindow' value='yes' />" +
                "<param name='ShowControls' value='yes' />" +
                "<param name='ViewOnly' value='no' /> " +
                "<param name='AllowClipboardTransfer' value='yes' />" +
                "<param name='RemoteCharset' value='standard' />" +
                "<param name='hcdromflag' value='failure' />" +
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
                "<param name='language' value='" + getLanguage() +
                "'/><param name='title' value='" + options.vmTitle +
                "'/><param name='cdRomStatus' value='" + options.cdRomStatus +
                "'/><param name='canMountCdRom' value='" + options.canMountCdRom +
                "'/><param name='sshPort' value='' /></applet>";

            $(domId).html(appletString);
        };
    };

    return service;
});