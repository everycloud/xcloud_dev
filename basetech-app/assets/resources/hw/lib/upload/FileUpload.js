/**
 * 文件上传
 */
define(["tiny-lib/jquery", "jre/deployJava"], function ($, deployJava) {

    var fileUpload = {
        "loadedCallBack":"",
        "uploadCallBack":"",
        "progressCallBack":"",
        "init":function (loadedCallBack, uploadCallBack, progressCallBack) {
            fileUpload.loadedCallBack = loadedCallBack;
            fileUpload.uploadCallBack = uploadCallBack;
            fileUpload.progressCallBack = progressCallBack;
        },

        //检查jre 版本
        "checkJreVersion": function () {
            var result = false;
            var targetVersion = "1.7.0_15";
            if ($.browser.msie) {
                targetVersion = "1.7.0";
            }
            try {
                var versionStr = deployJava.getJREs();
                if (versionStr) {
                    for (var i = 0; i < versionStr.length; i++) {
                        if (targetVersion <= versionStr[i]) {
                            result = true;
                            break;
                        }
                    }
                } else {
                    result = true;
                }
            }
            catch (e) {
                result = true;
            }

            // 如果没有安装JRE，则给出提示以及下载链接
            return result;
        },

        /**
         * ftp加载入口
         * 重要：使用页面必须存在id为ftpUpload的容器
         */
        "loadFtpApplet": function (ipAddr) {
            var path = "../../public/";
            var appletString = "<div id='ftpApplet'><applet codebase=" + path
                + " code='FtpsFileUpload' name='FtpsFileUpload' archive='FileUpload.jar'"
                + " width='0' height='0' border='0' MAYSCRIPT>"
                + " <param name='param_host' value='" + ipAddr + "'>"
                + " <param name='param_port' value='21'>"
                + " <PARAM name='separate_jvm' value='true'>"
                + " <param name='log_level' value='DEBUG'>"
                + " <param name='js_log_func_name' value='writelog'>"
                + " </applet><div>";

            // 重要：使用页面必须存在id为ftpUpload的容器
            $("#ftpUpload").html(appletString);
        },

        /**
         * 打开选择文件window
         *
         * key:多选场景，需要区分文件
         */
        "openFtpSelectWindow": function (key) {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                return;
            }
            var selectedFileName = ftpApplets.addFile(key);
            return selectedFileName;
        },

        /**
         * 删除文件
         *
         * key:多选场景，需要区分文件
         */
        "deleteFile": function (key) {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                return;
            }
            ftpApplets.deleteFile(key);
        },

        /**
         * 获取文件总大小
         */
        "getTotalFileSize": function () {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                return;
            }
            return ftpApplets.getTotalFileSize();
        },

        /**
         * 获取文件大小
         *
         * @param key
         * @returns {*}
         */
        "getFileSize":function (key) {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                return;
            }
            return ftpApplets.getFileSize(key);
        },

        /**
         * 查看applet是否加载完成
         * @returns {*}
         */
        "checkIsAppletLoaded": function () {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                //
                return;
            }

            var isLoaded = ftpApplets.checkIsAppletLoaded();
            return isLoaded;
        },

        /**
         * 文件上传
         * @param remoteDir
         * @param user
         * @param pwd
         */
        "uploadFile": function (remoteDir, user, pwd) {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                return;
            }

            ftpApplets.uploadFile(remoteDir, user, pwd);
        },

        /**
         * 获取上传进度
         *
         * @returns {*}
         */
        "getProgress": function () {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                //
                return;
            }

            return ftpApplets.getProgess();
        },

        /**
         * 查看运行状态
         *
         * @returns {*}
         */
        "checkUploadStatus": function () {
            var ftpApplets = document.FtpsFileUpload;
            if (!ftpApplets) {
                //
                return;
            }

            var uploadStatus = ftpApplets.checkUploadStatus();
            return uploadStatus;
        },

        "loadedStatusCallBack":function(status) {
            if (typeof(fileUpload.loadedCallBack) == 'function') {
                fileUpload.loadedCallBack(status);
            }
        },

        "uploadStatusCallBack":function (status) {
            if (typeof(fileUpload.uploadCallBack) == 'function') {
                fileUpload.uploadCallBack(status);
            }
        },

        "updateProgressCallBack":function (progress) {
            if (typeof(fileUpload.progressCallBack) == 'function') {
                fileUpload.progressCallBack(progress);
            }
        }
    };

    window.top.ftpAppletIsReady = function(status) {
        fileUpload.loadedStatusCallBack(status);
    };
    window.top.updateUploadStatus = function(status) {
        fileUpload.uploadStatusCallBack(status);
    };
    window.top.updateProgress = function(status) {
        fileUpload.updateProgressCallBack(status);
    };

    return fileUpload;
});