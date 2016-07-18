/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-1-24

 */
define(['tiny-lib/angular',
    "tiny-widgets/Message",
    "app/services/messageService",
    "app/services/exceptionService",
    "app/services/downloadService",
    "app/business/resources/services/device/import/importService",
    "upload/jquery-form"
],
    function (angular, Message, MessageService, ExceptionService, DownloadService, ImportService, jqueryForm) {
        "use strict";
        var importCtrl = ['$scope', "$q", "camel", "$state", "$timeout", function ($scope, $q, camel, $state, $timeout) {
            var user = $scope.user;
            var i18n = $scope.i18n;
            var timer = null;
            var exceptionService = new ExceptionService();
            var downloadService = new DownloadService();
            var importService = new ImportService($q, camel);
            var deviceTypes = importService.getDeviceType();
            var messageConfig = {
                type: 'error',
                width: '360px',
                height: '200px',
                title: i18n.alarm_term_warning_label || '提示',
                content: i18n.common_term_unknownError_label || "未知错误"
            };

            $scope.showProcess = false;
            $scope.hasDeviceOperateRight = user.privilege.role_role_add_option_deviceHandle_value;
            $scope.checkProgress = {
                text: "查看设备导入进度",
                click: function () {
                    $state.go("system.taskCenter");
                }
            };
            var langConfig = {
                zh: "zh_CN",
                en: "en_US"
            };
            var lang = langConfig[window.urlParams.lang];
            $scope.downloadModel = {
                url: "/goku/rest/v1.5/irm/device-templates/" + lang,
                text: i18n.common_term_downloadTemplate_button || "下载模板",
                handler: function () {
                    $scope.operator.downloadTemplate();
                }
            };
            $scope.report = {
                text: i18n.common_term_downloadReport_button || "下载报告",
                display: false,
                url: "/goku/rest/v1.5/irm/device-templates/import-report/" + lang,
                handler: function () {
                    $scope.operator.downloadReport();
                }
            };
            $scope.uploadModel = {
                "id": "deviceUploadId",
                "display": true,
                "fileObjName": "deviceUploadName",
                "action": "/goku/rest/v1.5/irm/device-templates/" + lang,
                "maxSize": 10 * 1024 * 1024,//10MB,
                "fileType": ".xlsm;.xlsx",
                select: function () {
                    $scope.$apply(function () {
                        $scope.statisticsTable.data = [];
                        $scope.progress.value = 0;
                        $scope.report.display = false;
                    });
                },
                selectError: function (event, file, errorMsg) {
                    var sizeContent = i18n.common_term_fileMaxWithValue_valid
                        ? i18n.sprintf(i18n.common_term_fileMaxWithValue_valid, $scope.uploadModel.maxSize / (1024 * 1024) + "MB")
                        : "文件大小超过上限" + $scope.uploadModel.maxSize / (1024 * 1024) + "MB";
                    var contents = {
                        "INVALID_FILE_TYPE": i18n.common_term_fileFormatXls_valid || "文件类型不符合要求，请选择.xlsm或.xlsx文件",
                        "EXCEED_FILE_SIZE": sizeContent
                    };
                    var content = contents[errorMsg];
                    new Message($.extend({}, messageConfig, {content: content})).show();
                },
                afterSubmit: function () {
                    $("#" + $scope.uploadModel.id).find(".tiny-file-bytes-uploaded,.tiny-file-upload-cancel").hide();
                },
                complete: function (event, responseText) {
                    //解决IE9兼容
                }
            };

            $scope.init = function()
            {
                var options={
                    "complete":function(respond, status)
                    {
                        var $uploadEl = $("#" + $scope.uploadModel.id);

                        //上传组件状态
                        $uploadEl.find(".tiny-file-single-detail-line").hide();
                        $uploadEl.find(".tiny-file-input")
                            .val("")
                            .css("backgroundColor", "#fff");
                        $uploadEl.widget().empty();
                        try {
                            var resp = JSON.parse(respond.responseText);
                            var code = resp && resp.code;
                            if (code == 0) {
                                $scope.uploadModel.display = false;
                                $scope.operator.statisticsImportResult();
                            } else {
                                resp = {
                                    status: "500",
                                    responseText: respond.responseText
                                };
                                exceptionService.doException(resp);
                            }
                        } catch (e) {
                            new Message($.extend({}, messageConfig)).show();
                        }
                    }
                };

                $timeout(function () {
                    $("#" + $scope.uploadModel.id + " form").ajaxForm(options);
                }, 1000);
            }

            $scope.progress = {
                id: "progressbarId",
                width: 300,
                height: 20,
                value: 0
            };
            //表格组件配置信息
            $scope.statisticsTable = {
                "id": "licenseTableId",
                "legend": (i18n.common_term_statisticInfo_label || "统计信息") + ":",
                "data": [],
                "columns": [
                    {
                        "sTitle": i18n.device_term_deviceType_label || "设备类型",
                        "mData": function (data) {
                            var deviceTypeText = data.deviceTypeText || "";
                            return $.encoder.encodeForHTML("" + deviceTypeText);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.device_term_deviceNumTotal_label || "设备总数",
                        "mData": function (data) {
                            var totalNum = data.totalNum || "";
                            return $.encoder.encodeForHTML("" + totalNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_success_value || "成功",
                        "mData": function (data) {
                            var successNum = data.successNum || "0";
                            return $.encoder.encodeForHTML("" + successNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_fail_label || "失败",
                        "mData": function (data) {
                            var failedNum = data.failedNum || "0";
                            return $.encoder.encodeForHTML("" + failedNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_repeat_label || "重复",
                        "mData": function (data) {
                            var repeatNum = data.repeatNum || "0";
                            return $.encoder.encodeForHTML("" + repeatNum);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_waitImport_value || "待导入",
                        "mData": function (data) {
                            var unDealNo = data.unDealNo || "0";
                            return $.encoder.encodeForHTML("" + unDealNo);
                        },
                        "bSortable": false
                    }
                ]
            };

            var parseTableData = function (resolvedValue) {
                var conProgress = resolvedValue.conProgress || {};
                var data = [];
                var total = 0;
                var unDeal = 0;
                for (var p in conProgress) {
                    var item = conProgress[p];
                    if (item) {
                        item.deviceTypeText = deviceTypes[p];
                        total += parseInt(item.totalNum);
                        unDeal += parseInt(item.unDealNo);
                        data.push(item);
                    }
                }
                $scope.statisticsTable.data = data;
                $scope.progress.value = total ? parseInt(100 * (total - unDeal) / total) : 0;
                if (unDeal > 0) {
                    timer = setTimeout(function () {
                        $scope.operator.statisticsImportResult();
                    }, 1000);
                } else {
                    $scope.uploadModel.display = true;
                    $scope.report.display = true;
                }
            };

            $scope.operator = {
                statisticsImportResult: function () {
                    var promise = importService.importResult(user.id);
                    promise.then(function (resolvedValue) {
                        parseTableData(resolvedValue);
                    });
                },
                downloadTemplate: function () {
                    var promise = importService.downloadTemplate(user.id, lang);
                    promise.then(function (resolvedValue) {
                        var name = resolvedValue && resolvedValue.file;
                        name && $scope.operator.downloadFile(name);
                    });
                },
                downloadReport: function () {
                    var promise = importService.downloadReport(user.id, lang);
                    promise.then(function (resolvedValue) {
                        var name = resolvedValue && resolvedValue.file;
                        name && $scope.operator.downloadFile(name);
                    });
                },
                downloadFile: function (name) {
                    downloadService.download({
                        name: name,
                        type: "export"
                    });
                }
            };

            $scope.$on('$destroy', function () {
                timer && clearTimeout(timer);
            });

            $scope.init();
        }];
        return importCtrl;
    });


