/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/jquery.base64",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "app/business/template/controllers/constants",
        'upload/FileUpload',
        'tiny-widgets/Message',
        "app/business/template/services/templateService",
        'app/services/userService'
    ],
    function ($, $jBase, angular, _, constants, FileUpload, Message, templateService, UserService) {
        "use strict";

        var registSoftwareCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$interval", "$timeout", "exception", "$q",
            function ($scope, $compile, $state, $stateParams, camel, $interval, $timeout, exception, $q) {
                var templateServiceIns = new templateService(exception, $q, camel);
                var userService = new UserService(exception, $q, camel);
                var i18n = $scope.i18n;
                var user = $scope.user;
                $scope.service = {
                    step: {
                        "id": "repairSoftwareStep",
                        "values": [i18n.common_term_basicInfo_label, i18n.common_term_uploadFile_label],
                        "width": 450,
                        "jumpable": false
                    },

                    "softQueryEnded": false,

                    progress: 0,

                    ftpAppletLoaded: false,

                    jreChecked: true,

                    forceInterrupt: false,

                    uploadPath: new Date().getTime(),

                    show: "baseInfo",

                    model: {
                        "name": "",
                        "softwareName": "",
                        "mainFilePath": "",
                        "osType": "",
                        "fileType": "",
                        "picture": "../theme/default/images/softwarePackage/icon_software_1.png",
                        "range": "0",
                        "rangeValue": i18n.sys_term_sysConfig_label,
                        "version": "",
                        "description": "",
                        "userId": $("html").scope().user && $("html").scope().user.id,

                        "attachmentPaths": "",
                        "destinationPath": "",
                        "installCommand": "",
                        "unInstallCommand": "",
                        "startCommand": "",
                        "stopCommand": ""
                    }
                };

                /**
                 * 中断操作提醒
                 * @param event
                 * @param toState
                 * @param toParams
                 */
                $scope.interruptConfirm = function (interruptEvent, toState, toParams) {
                    var msgOptions = {
                        "type": "confirm", //prompt,confirm,warn,error
                        "title": i18n.common_term_confirm_label,
                        "content": "确实要取消修复该软件包吗？",
                        "width": "300",
                        "height": "200"
                    };

                    var msgBox = new Message(msgOptions);

                    var buttons = [{
                        label: i18n.common_term_ok_button,
                        accessKey: 'Y',
                        'default': true,
                        handler: function (event) {
                            $scope.service.forceInterrupt = true;
                            $state.go(toState.name, toParams);
                            msgBox.destroy();
                        }
                    }, {
                        label: i18n.common_term_cancle_button,
                        accessKey: 'N',
                        'default': false,
                        handler: function (event) {
                            msgBox.destroy();
                        }
                    }];

                    msgBox.option("buttons", buttons);
                    msgBox.show();
                };

                /**
                 * applet超时机制
                 * @type {number}
                 */
                $scope.checkLoadTimeOut = 0;
                $scope.checkUploadTimeOut = 0;

                $scope.checkFtpResponseTimeOut = 0;

                $scope.buttonGroup = {
                    label: "",
                    require: false
                };

                /**
                 * 事件定义
                 */
                $scope.repairSoftwareEvents = {
                    "softwareInfoInit": "softwareInfoInit",
                    "baseInfoChanged": "baseInfoChanged",
                    "baseInfoChangedFromParent": "baseInfoChangedFromParent",
                    "confirmed": "confirmed",
                    "confirmedFromParent": "confirmedFromParent",
                    "updateProgress": "updateProgress"
                };

                /**
                 * 定时器句柄
                 * @type {undefined}
                 */
                $scope.promise = undefined;

                /**
                 * 清除定时器
                 */
                $scope.clearTimer = function () {
                    try {
                        $interval.cancel($scope.promise);
                    } catch (e) {
                        // do nothing
                    }
                };

                /**
                 * 注册软件包
                 */
                $scope.repairSoftwareHandle = function () {

                    // 防止上传被中断
                    $scope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {
                            if (fromState.name === "repairSoftwarePackage.navigation") {
                                var scope = event.currentScope;
                                if (!scope.service.forceInterrupt) {
                                    event.preventDefault();
                                    $scope.interruptConfirm(event, toState, toParams);
                                }
                            }
                        });
                    var promise = userService.queryMachineAccount({
                        "type": "FTP",
                        "userId": user.id,
                        "vdcId": user.vdcId
                    });
                    promise.then(function(data) {
                        if (!data) {
                            return;
                        }
                        var info = data.machineAccountInfo;
                        if (!info) {
                            return;
                        }
                        // 1.上传文件
                        FileUpload.uploadFile("/" + $scope.service.uploadPath, info.userName, $scope.service.ftpInfo.pwd);

                        // 2.查询进度
                        $scope.promise = $interval(function () {
                            var progress = FileUpload.getProgress();
                            if (progress >= 99) {
                                $scope.service.progress = 99;
                            } else if (progress > $scope.service.progress) {
                                $scope.service.progress = progress;
                            }

                            // 发送心跳
                            if ($scope.checkUploadTimeOut % 30 === 0) {
                                $scope.operator.heartbeat();
                            }

                            $scope.checkUploadTimeOut++;

                            // 更新进度
                            $scope.$broadcast($scope.repairSoftwareEvents.updateProgress, $scope.service.progress);

                            // 查询上传状态
                            var uploadStatus = 0;
                            try {
                                uploadStatus = FileUpload.checkUploadStatus();
                            } catch (e) {}

                            /**
                             *  0:上传中
                             *  1：成功
                             *  2：失败
                             */
                            if (uploadStatus === 0) {
                                if (progress === 100 && $scope.checkFtpResponseTimeOut >= 60) {
                                    $scope.uploadSuccess();
                                }

                                if (progress === 100) {
                                    $scope.checkFtpResponseTimeOut++;
                                }
                            } else if (uploadStatus === 1) {
                                $scope.uploadSuccessHandle();
                            } else if (uploadStatus === 2) {
                                $scope.uploadErrorHandle();
                            } else {
                                $scope.uploadErrorHandle();
                            }
                        }, 2000);
                    });
                };

                /**
                 * 上传成功
                 */
                $scope.uploadSuccessHandle = function () {
                    $scope.clearTimer();

                    var requestModel = {
                        "mainFilePath": "",
                        "attachmentPaths": []
                    };

                    _.each($scope.service.model.repairList, function (item) {
                        var file = item;

                        if (!file || file.status !== "Abnormal") {
                            return;
                        }

                        var path = "/" + $scope.service.uploadPath + "/" + file.name;
                        if (file.type === "main") {
                            requestModel.mainFilePath = path;
                        } else {
                            requestModel.attachmentPaths.push(path);
                        }
                    });

                    var deferred = camel.post({
                        "url": {
                            "s": constants.rest.SOFTWARE_REPAIR.url,
                            "o": {
                                "vdc_id": $("html").scope().user.vdcId,
                                "softwareid": $stateParams.id,
                                "cloud_infra_id": $stateParams.cloudInfraId
                            }
                        },
                        "params": JSON.stringify(requestModel),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "timeout": 30 * 60 * 1000,
                        "monitor": false
                    });
                    deferred.success(function (data) {
                        // 更新进度
                        $scope.service.progress = 100;
                        $scope.$broadcast($scope.repairSoftwareEvents.updateProgress, $scope.service.progress);
                    });

                    // 失败处理
                    deferred.error(function (data) {
                        var errorCode = "5100003";
                        try {
                            errorCode = JSON.parse(data && data.responseText).code;
                        } catch (e) {
                            //
                        }
                        $scope.$broadcast($scope.repairSoftwareEvents.updateProgress, errorCode);
                    });

                    deferred.always(function (jqXHR, textStatus, errorThrown) {
                        $scope.service.forceInterrupt = true;
                    });
                };

                /**
                 * 错误处理
                 */
                $scope.uploadErrorHandle = function () {
                    $scope.clearTimer();

                    $timeout(function () {
                        $scope.$broadcast($scope.repairSoftwareEvents.updateProgress, "5100003");
                    }, 100);
                };

                // 事件转发
                $scope.$on($scope.repairSoftwareEvents.confirmed, function (event, msg) {
                    $scope.repairSoftwareHandle();
                });

                // 事件转发
                $scope.$on($scope.repairSoftwareEvents.confirmed, function (event, msg) {
                    $scope.$broadcast($scope.repairSoftwareEvents.confirmedFromParent, msg);
                });

                // 清理定时器
                $scope.$on('$destroy', function () {
                    $scope.clearTimer();
                });

                /**
                 * 操作定义
                 * @type {{}}
                 */
                $scope.operator = {
                    "querySoftwareInfo": function () {
                        // 查询软件包信息
                        var options = {
                            "user": $("html").scope().user,
                            "softwareid": $stateParams.id,
                            "cloudInfraId": $stateParams.cloudInfraId
                        };
                        var deferred = templateServiceIns.querySoftwarePackageById(options);
                        deferred.then(function(data){
                            var installCommand = data.installCommand;
                            data.installCommand = $.base64.decode(installCommand || "", true);
                            var unInstallCommand = data.unInstallCommand;
                            data.unInstallCommand = $.base64.decode(unInstallCommand || "", true);
                            var startCommand = data.startCommand;
                            data.startCommand = $.base64.decode(startCommand || "", true);
                            var stopCommand = data.stopCommand;
                            data.stopCommand = $.base64.decode(stopCommand || "", true);
                            // 广播软件包信息
                            $scope.service.softQueryEnded = true;
                            $scope.$broadcast($scope.repairSoftwareEvents.softwareInfoInit, data);
                        },function(data){
                            $scope.service.softQueryEnded = false;
                        });
                    },
                    "loadApplet": function () {
                        FileUpload.loadFtpApplet(constants.config.SERVICE);
                        $scope.promise = $interval(function () {
                            if ($scope.checkLoadTimeOut > 45) {
                                // applet加载超时，提示重新加载
                                $scope.clearTimer();
                                //exceptionService.doException({"status":"400","responseText":'{"code":"5100003"}'}, ameException);
                            }
                            var isLoaded = 0;
                            try {
                                isLoaded = FileUpload.checkIsAppletLoaded();
                            } catch (e) {}

                            $scope.checkLoadTimeOut++;

                            if (isLoaded === 1) {
                                $scope.clearTimer();
                                $scope.service.ftpAppletLoaded = true;
                            } else if (isLoaded === -1) {
                                // applet加载失败处理
                                $scope.clearTimer();
                                // exceptionService.doException({"status":"400","responseText":'{"code":"5100003"}'}, ameException);
                            }
                        }, 2000);
                    },
                    "heartbeat": function () {

                        camel.get({
                            "url": {
                                "s": constants.rest.REST_HEART_BEAT.url
                            },
                            "userId": $("html").scope().user && $("html").scope().user.id,
                            "monitor": false
                        });
                    }
                };

                /**
                 * 初始化操作
                 */
                $scope.init = function () {
                    // 查询软件包信息
                    $scope.operator.querySoftwareInfo();

                    // 校验jre版本
                    if (!FileUpload.checkJreVersion()) {
                        $scope.service.jreChecked = false;
                        return;
                    }

                    // 加载applet
                    $scope.operator.loadApplet();
                };

                $scope.init();
            }
        ];

        return registSoftwareCtrl;
    });
