/**
 * @author
 * @date 0214-05-15
 * for host interface
 */
define(["app/services/exceptionService", "language/keyID", "fixtures/adaptationFixture"], function (ExceptionService, i18n) {
    var Service = function ($q, camel) {
        this.$q = $q;
        this.camel = camel;
        this.exception = new ExceptionService();
    };
    Service.prototype.getProgressStatus = function () {
        var statusConfig = {
            PROGRESS_INSTALL_OK: {
                val: "0",
                text: i18n.common_term_installSucceed_label || "安装成功"
            },
            PROGRESS_UPLOAD: {
                val: "1",
                text: i18n.common_term_uploading_value || "上传中"
            },
            PROGRESS_UPLOAD_FAIL: {
                val: "2",
                text: i18n.common_term_uploadFail_value || "上传失败"
            },
            PROGRESS_UNZIPPING: {
                val: "3",
                text: i18n.common_term_unzipping_value + "解压缩中"
            },
            PROGRESS_UNZIP_DONE: {
                val: "4",
                text: i18n.common_term_unzipComplete_value || "解压缩完成"
            },
            PROGRESS_UNZIP_FAIL: {
                val: "5",
                text: i18n.common_term_unzipFail_value || "解压缩失败"
            },
            PROGRESS_CHECKING: {
                val: "6",
                text: i18n.common_term_checking_value || "核查中"
            },
            PROGRESS_CHECK_DONE: {
                val: "7",
                text: i18n.common_term_checkComplete_value || "核查完成"
            },
            PROGRESS_CHECK_FAIL: {
                val: "8",
                text: i18n.common_term_checkFail_value + "核查失败"
            },
            PROGRESS_INSTALLING: {
                val: "9",
                text: i18n.common_term_installing_value || "安装中"
            },
            PROGRESS_INSTALL_FAIL: {
                val: "10",
                text: i18n.common_term_installFail_label || "安装失败"
            }
        };
        return statusConfig;
    };
    Service.prototype.getPackageStatus = function () {
        var statusConfig = {
            PACKAGE_STATUS_UNDEPLOY: {
                val: "0",
                text: i18n.common_term_noInstall_value || "未安装"
            },
            PACKAGE_STATUS_INSTALL_FAILED: {
                val: "1",
                text: i18n.common_term_installFail_label || "安装失败"
            },
            PACKAGE_STATUS_INSTALL_ING: {
                val: "2",
                text: i18n.common_term_installing_value || "安装中"
            },
            PACKAGE_STATUS_INSTALL_SUCCESS: {
                val: "3",
                text: i18n.common_term_installSucceed_label || "安装成功"
            },
            PACKAGE_STATUS_UNINSTALL_ING: {
                val: "4",
                text: i18n.common_term_uninstalling_value || "卸载中"
            },
            PACKAGE_STATUS_UNINSTALL_FAILED: {
                val: "5",
                text: i18n.common_term_uninstallFail_value || "卸载失败"
            },
            PACKAGE_STATUS_UNINSTALL_SUCCESS: {
                val: "6",
                text: i18n.common_term_uninstallSucceed_label || "卸载成功"
            }
        };
        return statusConfig;
    };
    Service.prototype.getDeviceType = function () {
        //设备类型：1-机框服务器；2-机架服务器；3-交换机；4-存储：5-机框类型
        return [
            "",
            i18n.device_term_subrackServer_label || "机框服务器",
            i18n.device_term_rackServer_label || "机架服务器",
            i18n.device_term_switch_label || "交换机",
            i18n.common_term_storage_label || "存储",
            i18n.device_term_subrackType_label || "机框类型"
        ];
    };
    Service.prototype.http = function (method, options) {
        var exception = this.exception;
        var deferred = this.$q.defer();
        deferred.notify("");
        var deferred1 = this.camel[method](options);
        deferred1.success(function (data, textStatus, jqXHR) {
            deferred.resolve(data);
        });
        deferred1.fail(function (jqXHR, textStatus, errorThrown) {
            if (!exception.isException(jqXHR)) {
                deferred.resolve(null);
                return;
            }
            exception.doException(jqXHR, null);
        });

        return deferred.promise;
    };
    //获取适配器列表
    Service.prototype.adaptatorList = function (userId) {
        return this.http("get", {
            url: "/goku/rest/v1.5/irm/adaptors",
            userId: userId
        });
    };

    //适配器安装进度
    Service.prototype.adaptatorInstallProgress = function (name, userId) {
        return this.http("get", {
            url: {
                s: "/goku/rest/v1.5/irm/adaptors/{id}/progress",
                o: {
                    id: name
                }
            },
            userId: userId,
            monitor: false
        });
    };
    //上传&检查&安装
    Service.prototype.adaptatorInstall = function (options, method) {
        return this.http(method || "get", {
            url: "/goku/rest/v1.5/irm/adaptors",
            userId: options.userId
        });
    };

    //适配包操作
    Service.prototype.adaptatorOperator = function (options, method) {
        return this.http(method || "get", {
            url: {
                s: "/goku/rest/v1.5/irm/adaptors/{id}",
                o: {
                    id: options.id
                }
            },
            userId: options.userId
        });
    };

    return Service;
});