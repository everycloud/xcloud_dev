/**
 */
define(["jquery",
    "tiny-lib/angular",
    "app/business/resources/controllers/constants",
    'upload/FileUpload',
    'tiny-widgets/Message'],
    function ($, angular, constants, FileUpload, Message) {
        "use strict";

        var registSoftwareCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$interval", "$timeout","exception",
            function ($scope, $compile, $state, $stateParams, camel, $interval, $timeout, exception) {

                $scope.service = {
                    step: {
                        "id": "repairSoftwareStep",
                        "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_uploadFile_label],
                        "width": 450,
                        "jumpable": false
                    },

                    ftpInfo:{
                        "user":"",
                        "pwd":""
                    },

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
                        "rangeValue": $scope.i18n.common_term_system_label,
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

                $scope.interruptConfirm = function (interruptEvent, toState, toParams) {
                    var msgOptions = {
                        "type":"confirm", 
                        "title":$scope.i18n.common_term_confirm_label,
                        "content":$scope.i18n.template_software_cancleRestore_info_confirm_msg,
                        "width":"300",
                        "height":"200"
                    };

                    var msgBox = new Message(msgOptions);

                    var buttons = [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            accessKey: 'Y',
                            majorBtn : true,
                            default: true,
                            handler: function (event) {
                                $scope.service.forceInterrupt = true;
                                $state.go(toState.name, toParams);
                                msgBox.destroy();
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            accessKey: 'N',
                            default: false,
                            handler: function (event) {
                                msgBox.destroy();
                            }
                        }
                    ];

                    msgBox.option("buttons",buttons);
                    msgBox.show();
                };

                $scope.checkLoadTimeOut = 0;
                $scope.checkUploadTimeOut = 0;

                $scope.checkFtpResponseTimeOut = 0;

                $scope.buttonGroup = {
                    label: "",
                    require: false
                };

                $scope.repairSoftwareEvents = {
                    "softwareInfoInit": "softwareInfoInit",
                    "baseInfoChanged": "baseInfoChanged",
                    "baseInfoChangedFromParent": "baseInfoChangedFromParent",
                    "confirmed": "confirmed",
                    "confirmedFromParent": "confirmedFromParent",
                    "updateProgress": "updateProgress"
                };

                $scope.promise = undefined;

                $scope.clearTimer = function () {
                    try {
                        $interval.cancel($scope.promise);
                    }
                    catch(e) {
                        // do nothing
                    }
                };

                $scope.repairSoftwareHandle = function () {

                    // 防止上传被中断
                    $scope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {
                            if (fromState.name == "resources.repairSoftwarePackage.navigation") {
                                var scope = event.currentScope;
                                if (!scope.service.forceInterrupt) {
                                    event.preventDefault();
                                    $scope.interruptConfirm(event, toState, toParams);
                                }
                            }
                        });

                    // 1.上传文件
                    FileUpload.uploadFile("/" + $scope.service.uploadPath, $scope.service.ftpInfo.user, $scope.service.ftpInfo.pwd);

                    // 2.查询进度
                    $scope.promise = $interval(function () {
                        var progress = FileUpload.getProgress();
                        if (progress >= 99) {
                            $scope.service.progress = 99;
                        } else if(progress > $scope.service.progress) {
                            $scope.service.progress = progress;
                        } else {
                            // do nothing
                        }

                        // 发送心跳
                        if ($scope.checkUploadTimeOut % 30 == 0) {
                            $scope.operator.heartbeat();
                        }

                        $scope.checkUploadTimeOut++;

                        // 更新进度
                        $scope.$broadcast($scope.repairSoftwareEvents.updateProgress, $scope.service.progress);

                        // 查询上传状态
                        var uploadStatus = 0;
                        try {
                            uploadStatus = FileUpload.checkUploadStatus();
                        } catch (e) {
                        }

                        /**
                         *  0:上传中
                         *  1：成功
                         *  2：失败
                         */
                        if (uploadStatus == 0) {
                            if (progress == 100 && $scope.checkFtpResponseTimeOut >= 60) {
                                $scope.uploadSuccess();
                            }

                            if (progress == 100) {
                                $scope.checkFtpResponseTimeOut++;
                            }
                        } else if (uploadStatus == 1) {
                            $scope.uploadSuccessHandle();
                        } else {
                            $scope.uploadErrorHandle(uploadStatus);
                        }
                    }, 2000);
                };

                $scope.uploadSuccessHandle = function () {
                    $scope.clearTimer();

                    var requestModel = {"mainFilePath":"","attachmentPaths":[]};
                    for (var index in $scope.service.model.repairList) {
                        var file = $scope.service.model.repairList[index];

                        if (!file || file.status != "Abnormal") {
                            continue;
                        }

                        var path = "/" + $scope.service.uploadPath + "/" + file.name;
                        if (file.type == "main") {
                            requestModel.mainFilePath = path;
                        } else {
                            requestModel.attachmentPaths.push(path);
                        }
                    }

                    var deferred = camel.post({
                        "url": {"s": constants.rest.SOFTWARE_REPAIR.url, "o": {"tenant_id": 1, "softwareid": $stateParams.id}},
                        "params": JSON.stringify(requestModel),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
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

                    deferred.always(function(jqXHR, textStatus, errorThrown) {
                        $scope.service.forceInterrupt = true;
                    });
                };

                $scope.uploadErrorHandle = function(uploadStatus) {
                    $scope.clearTimer();

                    $timeout(function() {
                        $scope.$broadcast($scope.repairSoftwareEvents.updateProgress, uploadStatus);
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

                $scope.loadedCallBack = function(status) {
                    if (status) {
                        $scope.clearTimer();
                        $scope.service.ftpAppletLoaded = true;
                        $scope.$digest();
                    } else {
                        // applet加载失败处理
                        $scope.clearTimer();
                        exception.doException({"status":"400","responseText":'{"code":"5100003"}'}, null);
                    }
                };
                $scope.uploadCallBack = function(status) {
                };
                $scope.progressCallBack = function(status) {
                };

                $scope.operator = {
                    "querySoftwareInfo":function() {
                        // 查询软件包信息
                        var deferred = camel.get({
                            "url": {"s": constants.rest.SOFTWARE_DETAIL.url, "o": {"tenant_id": 1, "softwareid": $stateParams.id}},
                            "userId": $("html").scope().user && $("html").scope().user.id
                        });
                        deferred.success(function (data) {
                            // 广播软件包信息
                            $scope.$broadcast($scope.repairSoftwareEvents.softwareInfoInit, data);
                        });
                        deferred.fail(function (data) {
                            exception.doException(data, null);
                        });
                    },
                    "loadApplet":function() {
                        FileUpload.init($scope.loadedCallBack,$scope.uploadCallBack, $scope.progressCallBack);
                        FileUpload.loadFtpApplet(constants.config.SERVICE);
                        $scope.promise = $interval(function () {
                            // applet加载超时，提示重新加载
                            if ($scope.checkLoadTimeOut > 45) {
                                // applet加载超时，提示重新加载
                                $scope.clearTimer();
                                exception.doException({"status":"400","responseText":'{"code":"5100003"}'}, null);
                            }

                            if (!$scope.service.ftpAppletLoaded) {
                                $scope.checkLoadTimeOut++;
                            }
                        }, 2000);

                        // 获取ftp信息
                        var deferred = camel.get({
                            "url": {"s": constants.rest.VSFTP_INFO.url, "o": {"vdc_id":1, "type": "FTP"}},
                            "userId": $("html").scope().user && $("html").scope().user.id
                        });
                        deferred.success(function (data) {
                            if (data && data.machineAccountInfo) {
                                $scope.service.ftpInfo = {
                                    "user": data.machineAccountInfo.userName
                                };
                            } else {
                                exception.doFaultPopUp();
                            }
                        });
                        deferred.fail(function (data) {
                            exception.doException(data, null);
                        });
                    },
                    "heartbeat": function () {

                        camel.get({
                            "url": {"s": constants.rest.REST_HEART_BEAT.url},
                            "userId": $("html").scope().user && $("html").scope().user.id,
                            "monitor": false
                        });
                    }
                };

                $scope.init = function () {
                    // 查询软件包信息
                    $scope.operator.querySoftwareInfo();

                    // 校验jre版本
                    if(!FileUpload.checkJreVersion()) {
                        $scope.service.jreChecked = false;
                        return;
                    }

                    // 加载applet
                    $scope.operator.loadApplet();
                };

                $scope.init();
            }];

        return registSoftwareCtrl;
    });
