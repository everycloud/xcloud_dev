/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-3-14
 */

define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/RadioGroup",
    "tiny-widgets/Message",
    "tiny-directives/DateTime",
    "app/services/commonService",
    "app/services/messageService",
    "language/system-exception",
    "app/services/userService",
    "app/services/exceptionService",
    "upload/jquery-form",
    "app/services/tipMessageService",
    "fixtures/systemFixture"
], function ($, angular, Window, RadioGroup, Message, DateTime, commonService, MessageService, SysException, UserService, ExceptionService, jqueryForm) {

    "use strict";
    var licenseManageCtrl = ["$scope", "camel" , "$rootScope", "$q", "$timeout", function ($scope, camel, $rootScope, $q, $timeout) {
        var user = $rootScope.user;
        var userId = user.id;
        var exceptionService = new ExceptionService();
        var userService = new UserService(exceptionService, $q, camel);
        var licenseVersion = userService.licenseVersion;
        var i18n = $scope.i18n;

        $scope.hasLicenseOperateRight = user.privilege.role_role_add_option_licenseHandle_value;
        $scope.licenseExpired = false;

        //上传组件配置信息
        $scope.licenseUpload = {
            id: "licenseUploadId",
            fileObjName: "licenseUploadName",
            type: ".dat",
            maxSize: 50 * 1024,//50KB
            url: "/goku/rest/v1.5/license/file",

            complete: function (event, responseText) {

            },
            selectError: function (event, file, errorMsg) {
                var content = {
                    INVALID_FILE_TYPE: i18n.common_term_fileFormatBat_valid || "文件类型不合法，请选择后缀类型为dat的文件。",
                    EXCEED_FILE_SIZE: i18n.sprintf(i18n.common_term_fileMaxWithValue_valid, $scope.licenseUpload.maxSize / 1024 + "KB")
                };
                new Message({
                    type: 'error',
                    width: '360px',
                    height: '200px',
                    title: i18n.common_term_tip_label || '提示',
                    content: content[errorMsg] || i18n.common_term_unknownError_label || "未知错误"
                }).show();
            }
        };
        //IE9不兼容
        $scope.init = function () {
            var options = {
                "complete": function (response, status) {
                    try {
                        var $licenseUploadEl = $("#" + $scope.licenseUpload.id);
                        //隐藏上传组件状态
                        $licenseUploadEl.find(".tiny-file-single-detail-line").hide();

                        var $fileNameInput = $licenseUploadEl.find(".tiny-file-input");
                        var fileName = $fileNameInput.val();
                        $fileNameInput.val("").css("backgroundColor", "#fff");
                        $licenseUploadEl.widget().empty();

                        var resp = JSON.parse(response.responseText);
                        var licenseResp = resp && resp.licenseImportResp;
                        if (licenseResp) {
                            if (licenseResp.lessThanUsingResource) {
                                var content = {
                                    zh: "加载的Lincense资源数目小于系统中已经使用的资源数目",
                                    en: "The number of resources allowed in the uploaded license file is less than that of in-use resources."
                                };
                                new Message({
                                    type: 'error',
                                    width: '360px',
                                    height: '200px',
                                    title: i18n.common_term_tip_label || '提示',
                                    content: content[window.urlParams.lang]
                                }).show();
                            }
                            else if (licenseResp.resourceReduce) {
                                var confirmMessage = new Message({
                                    type: 'warn',
                                    width: '350px',
                                    height: '150px',
                                    title: i18n.common_term_tip_label || '提示',
                                    content: i18n.sys_license_update_info_smallThanUsed_msg || '加载的License资源数目小于系统中已经使用的资源数目。',
                                    buttons: [
                                        {
                                            label: i18n.common_term_ok_button || '确定',//按钮上显示的文字
                                            default: true,//默认焦点
                                            handler: function (event) {//点击回调函数
                                                $scope.operater.updateLicense("FORCEIMPORT", fileName);
                                                confirmMessage.destroy();
                                            }
                                        },
                                        {
                                            label: i18n.common_term_cancle_button || '取消',
                                            default: false,
                                            handler: function (event) {
                                                $scope.operater.updateLicense("CANCELIMPORT", fileName);
                                                confirmMessage.destroy();
                                            }
                                        }
                                    ],
                                    close: function () {
                                        $scope.operater.updateLicense("CANCELIMPORT", fileName);
                                    }
                                });
                                confirmMessage.show();
                            }
                            else {
                                new MessageService().okMsgBox(i18n.common_term_uploadSucceed_value);
                                $scope.operater.getLicenseInfo();
                            }
                        } else {
                            resp = {
                                status: 500,
                                responseText: response.responseText
                            };
                            exceptionService.doException(resp);
                        }
                    }catch(e){
                        resp = {
                            status: 500,
                            responseText: response.responseText
                        };
                        exceptionService.doException(resp);
                    }
                }
            };

            $timeout(function () {
                $("#" + $scope.licenseUpload.id + " form").ajaxForm(options);
            }, 1000);
        };
        //表格组件配置信息
        $scope.licenseTable = {
            "id": "licenseTableId",
            "data": [],
            "columns": [
                {
                    //License许可项
                    "sTitle": i18n.sys_term_licenseItem_label,
                    "mData": function (data) {
                        data.resourceNameCN = data.resourceNameCN || "";
                        return $.encoder.encodeForHTML("" + data.resourceNameCN);
                    },
                    "bSortable": false
                },
                {
                    //授权许可值
                    "sTitle": i18n.sys_license_view_para_licenseValue_label,
                    "mData": function (data) {
                        data.resourceNum = data.resourceNum === 0 ? "0" : (data.resourceNum || "");
                        return $.encoder.encodeForHTML("" + data.resourceNum);
                    },
                    "bSortable": false
                },
                {
                    //当前资源使用值
                    "sTitle": i18n.sys_license_view_para_usage_label,
                    "mData": function (data) {
                        data.actResourceNum = data.actResourceNum === 0 ? "0" : (data.actResourceNum || "");
                        return $.encoder.encodeForHTML("" + data.actResourceNum);
                    },
                    "bSortable": false
                }
            ]
        };
        //resourceName说明配置
        var resourceNameConfig = {
            "LGM0CSL01": {
                //计算服务器许可(每CPU)
                "label": i18n.sys_license_view_para_computeCPU_label,
                "desc": "Computing Server License for 1 CPU"
            },
            "LGM0VCSL01": {
                //可虚拟化的服务器许可(每CPU)
                "label": i18n.sys_license_view_para_virtualCPU_label,
                "desc": "Virtualizable Computing Server License for 1 CPU"
            }
        };

        //解析为可以直接显示的数据结构
        var parseLicenseInfo = function (resp) {
            $scope.licenseImportTime = resp.importTime;
            var licenseInfo = resp.licenseInfo;
            $scope.licenseCanUpdate = licenseInfo.licenseCanUpdate;
            var version = licenseInfo.salesVersionInfo;
            var versionText = version && licenseVersion[version];
            var list;
            if (licenseInfo && (list = licenseInfo.resourceItemList)) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var resourceName = list[i].resourceName;
                    var resourceNameConf = resourceNameConfig[resourceName];
                    list[i].resourceNameCN = resourceNameConf ? resourceNameConf.label : resourceName;
                    list[i].resourceNameCN = versionText + list[i].resourceNameCN;
                }
                if (licenseInfo.serviceExpireTimeString !== "0000-00-00") {
                    list.push({
                        resourceName: "expire",
                        resourceNameCN: i18n.sys_term_specialUpgradeDeadline_label || "专项升级服务截止日期",
                        actResourceNum: "-",
                        resourceNum: licenseInfo.serviceExpireTimeString || ""
                    });
                }
                list.push({
                    resourceName: "deadline",
                    resourceNameCN: i18n.common_term_deadline_label,
                    actResourceNum: "-",
                    resourceNum: licenseInfo.deadline || ""
                });
            }
            $scope.licenseTable.data = resp.licenseInfo.resourceItemList || [];
        };
        //页面操作
        $scope.operater = {
            //获取license esn
            getLicenseESN: function () {
                var promise = userService.queryLicenseESN(userId);
                promise.then(function (data) {
                    $scope.licenseESN = data.esn;
                });
            },
            //获取license信息
            getLicenseInfo: function () {
                var promise = userService.queryLicense(userId);
                promise.then(function (response) {
                    parseLicenseInfo(response);
                });
            },
            //update or add license
            updateLicense: function (impt, name) {
                var promise = userService.updateLicense({
                    "userId": userId,
                    "data": {
                        confirmImport: impt,
                        licenseName: name
                    }
                });
                promise.then(function (data) {
                    //更新license信息
                    var content = {
                        "FORCEIMPORT": i18n.sys_term_licenseUpdateSucceed_msg || "License更新成功",
                        "CANCELIMPORT": i18n.sys_license_cancelUpdate_info_msg || "您取消了License更新"
                    };
                    if ("FORCEIMPORT" === impt) {
                        $scope.operater.getLicenseInfo();
                    }
                });
            }
        };

        $scope.operater.getLicenseESN();
        $scope.operater.getLicenseInfo();

        $scope.$on('$destroy', function () {
        });
        $scope.init();
    }];

    return licenseManageCtrl;
});