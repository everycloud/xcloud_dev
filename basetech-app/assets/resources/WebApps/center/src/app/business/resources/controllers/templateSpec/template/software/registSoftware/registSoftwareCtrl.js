define(["jquery",
    "tiny-lib/angular",
    "app/business/resources/controllers/constants",
    'upload/FileUpload',
    'tiny-widgets/Message',
    'app/services/exceptionService'],
    function ($, angular, constants, FileUpload, Message, Exception) {
        "use strict";

        var registSoftwareCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$interval","$timeout","exception",
            function ($scope, $compile, $state, $stateParams, camel, $interval, $timeout, exception) {

                var exceptionService = new Exception();

                $scope.service = {
                    step: {
                        "id": "vmTemplateCreateStep",
                        "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setCmd_label, $scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_uploadFile_label],
                        "width": 450,
                        "jumpable": false
                    },

                    ftpInfo:{
                        "user":"",
                        "pwd":""
                    },

                    title: $scope.i18n.template_term_addSoftPacket_button,

                    from: $stateParams.from || "resources.templateSpec.software",

                    progress: 0,

                    ftpAppletLoaded: false,

                    jreChecked: true,

                    forceInterrupt: false,

                    action: $stateParams.action,

                    uploadPath: new Date().getTime(),

                    attachmentMap:{},

                    show: "baseInfo",

                    deletedFiles:[],

                    initFiles:[],

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
                        "content":$scope.i18n.template_software_cancleUpload_info_confirm_msg,
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

                $scope.registSoftwareEvents = {
                    "softwareInfoInit": "softwareInfoInit",
                    "baseInfoChanged": "baseInfoChanged",
                    "baseInfoChangedFromParent": "baseInfoChangedFromParent",
                    "toConfirm": "toConfirm",
                    "toConfirmFromParent": "toConfirmFromParent",
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

                $scope.checkSpace = function(successCallBack) {
                    var totalSize = FileUpload.getTotalFileSize();
                    var deferred = camel.get({
                        "url": {"s": constants.rest.QUERY_REPOSITORY_SPACE.url, "o": {"tenant_id": 1}},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
                    });

                    deferred.success(function (data) {
                        if (totalSize > data.freeCapacity*1024*1024) {
                            exception.doException({"status":"400","responseText":'{"code":900011}'}, null);
                        } else {
                            successCallBack();
                        }
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                };

                $scope.registSoftwareHandle = function () {
                    $scope.service.show = "upload";
                    $("#" + $scope.service.step.id).widget().next();
                    $scope.$digest();

                    // 防止上传被中断
                    $scope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {
                            if (fromState.name == "resources.registSoftwarePackage.navigation") {
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
                            $scope.heartbeat();
                        }

                        $scope.checkUploadTimeOut++;

                        // 更新进度
                        $scope.$broadcast($scope.registSoftwareEvents.updateProgress, $scope.service.progress);

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
                            return;
                        } else if (uploadStatus == 1) {
                            $scope.uploadSuccess();
                        } else {
                            $scope.uploadErrorHandle(uploadStatus);
                        }
                    }, 2000);
                };

                $scope.uploadSuccess = function () {
                    $scope.clearTimer();

                    // 主文件路径
                    $scope.service.model.mainFilePath = "/" + $scope.service.uploadPath + "/" + $scope.service.model.softwareName;

                    $scope.service.model.installCommand = $.base64.encode($scope.service.model.installCommand, true);
                    $scope.service.model.unInstallCommand = $.base64.encode($scope.service.model.unInstallCommand, true);
                    $scope.service.model.stopCommand = $.base64.encode($scope.service.model.stopCommand, true);
                    $scope.service.model.startCommand = $.base64.encode($scope.service.model.startCommand, true);

                    var deferred = camel.post({
                        "url": {"s": constants.rest.SOFTWARE_CREATE.url, "o": {"tenant_id": 1}},
                        "params": JSON.stringify($scope.service.model),
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
                    });
                    deferred.success(function (data) {
                        // 更新进度
                        $scope.service.progress = 100;
                        $scope.$broadcast($scope.registSoftwareEvents.updateProgress, $scope.service.progress);
                    });

                    // 失败处理
                    deferred.error(function (data) {
                        var errorCode = "5100003";
                        try {
                            errorCode = JSON.parse(data && data.responseText).code;
                        } catch (e) {
                            //
                        }
                        $scope.$broadcast($scope.registSoftwareEvents.updateProgress, errorCode);
                    });

                    deferred.always(function(jqXHR, textStatus, errorThrown) {
                        $scope.service.forceInterrupt = true;
                    });
                };

                $scope.modifySoftwareHandle = function () {

                    if ($scope.service.model.addedFilePaths == ""
                        || $scope.service.model.addedFilePaths && $scope.service.model.addedFilePaths.length == 0) {
                        $scope.modifySoftware();
                        return;
                    }

                    // 1.上传文件
                    FileUpload.uploadFile("/" + $scope.service.uploadPath, $scope.service.ftpInfo.user, $scope.service.ftpInfo.pwd);

                    // 2.查询进度
                    $scope.promise = $interval(function () {
                        var progress = FileUpload.getProgress();
                        if (progress >= 99) {
                            $scope.service.progress = 99;
                        } else {
                            $scope.service.progress = progress;
                        }

                        // 更新进度
                        $scope.$broadcast($scope.registSoftwareEvents.updateProgress, $scope.service.progress);

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
                            return;
                        } else if (uploadStatus == 1) {
                            $scope.clearTimer();

                            // 修改操作
                            $scope.modifySoftware();
                        } else {
                            $scope.uploadErrorHandle(uploadStatus);
                        }
                    }, 1000);
                };

                $scope.modifySoftware = function() {

                    $scope.service.model.installCommand = $.base64.encode($scope.service.model.installCommand, true);
                    $scope.service.model.unInstallCommand = $.base64.encode($scope.service.model.unInstallCommand, true);
                    $scope.service.model.stopCommand = $.base64.encode($scope.service.model.stopCommand, true);
                    $scope.service.model.startCommand = $.base64.encode($scope.service.model.startCommand, true);

                    var deferred = camel.put({
                        "url": {"s": constants.rest.SOFTWARE_MODIFY.url, "o": {"tenant_id": 1, "softwareid": $stateParams.id}},
                        "params": JSON.stringify($scope.service.model),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.complete(function (xmlHttpRequest, ts) {
                        if (xmlHttpRequest.status != "200" && xmlHttpRequest.status != "204") {
                            exception.doException(xmlHttpRequest, null);
                        } else {
                            $state.go("resources.templateSpec.software", {});
                        }
                    });
                };

                $scope.uploadErrorHandle = function(uploadStatus) {
                    $scope.clearTimer();

                    var action = $stateParams.action;
                    if (action === 'create') {
                        $timeout(function() {
                            $scope.$broadcast($scope.registSoftwareEvents.updateProgress, uploadStatus);
                        }, 100);
                        return;
                    }

                    // 修改操作，弹出异常
                    exception.doException({"status":"400","responseText":'{"code":"'+uploadStatus+'"}'}, null);
                };

                $scope.checkDuplicatedFile = function () {
                    var mainFile = $scope.service.model.softwareName;

                    var isDuplicated = false;
                    var duplicatedFile = "";

                    // 检查主文件是否和附加文件重名
                    for (var index in $scope.service.attachmentMap) {
                        if ($scope.service.attachmentMap[index] == mainFile) {
                            isDuplicated = true;
                            duplicatedFile = mainFile;
                            break;
                        }
                    }

                    // 检查附件文件之前是否重名
                    for (var index in $scope.service.attachmentMap) {
                        for (var indexCompare in $scope.service.attachmentMap) {
                            if (index == indexCompare) {
                                continue;
                            }
                            if ($scope.service.attachmentMap[index] == $scope.service.attachmentMap[indexCompare]) {
                                isDuplicated = true;
                                duplicatedFile = $scope.service.attachmentMap[index];
                                break;
                            }
                        }
                    }

                    // 检查新增附件和原有附件是否重名
                    for (var index in $scope.service.attachmentMap) {
                        for (var indexCompare in $scope.service.initFiles) {
                            var initFileName = $scope.service.initFiles[indexCompare];
                            if ($scope.service.attachmentMap[index] == initFileName) {
                                isDuplicated = true;
                                duplicatedFile = $scope.service.attachmentMap[index];
                                break;
                            }
                        }
                    }

                    if (isDuplicated) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.sprintf($scope.i18n.common_term_fileChooseRepeat_valid, duplicatedFile),
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();

                        return true;
                    }

                    return false;
                };

                $scope.heartbeat = function() {

                    camel.get({
                        "url": {"s": constants.rest.REST_HEART_BEAT.url},
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor":false
                    });
                };

                // 事件转发
                $scope.$on($scope.registSoftwareEvents.confirmed, function (event, msg) {
                    var action = $stateParams.action;
                    if (action != 'create') {
                        $scope.modifySoftwareHandle();
                    } else {
                        $scope.checkSpace($scope.registSoftwareHandle);
                    }

                });

                // 事件转发
                $scope.$on($scope.registSoftwareEvents.baseInfoChanged, function (event, msg) {
                    $scope.$broadcast($scope.registSoftwareEvents.baseInfoChangedFromParent, msg);
                });

                $scope.$on($scope.registSoftwareEvents.toConfirm, function (event, msg) {
                    $scope.$broadcast($scope.registSoftwareEvents.toConfirmFromParent, msg);
                });

                $scope.$on($scope.registSoftwareEvents.confirmed, function (event, msg) {
                    $scope.$broadcast($scope.registSoftwareEvents.confirmedFromParent, msg);
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

                $scope.init = function () {

                    FileUpload.init($scope.loadedCallBack,$scope.uploadCallBack, $scope.progressCallBack);

                    if(!FileUpload.checkJreVersion()) {
                        $scope.service.jreChecked = false;
                        return;
                    }

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

                    var action = $stateParams.action;
                    if (action === 'create') {
                        return;
                    }

                    $scope.service.title = $scope.i18n.template_term_modifySoftPacket_button;

                    // 修改时，页面初始化操作
                    $scope.service.step.values = [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_setCmd_label, $scope.i18n.common_term_basicInfo_label];

                    // 查询软件包信息
                    var deferred = camel.get({
                        "url": {"s": constants.rest.SOFTWARE_DETAIL.url, "o": {"tenant_id": 1, "softwareid": $stateParams.id}},
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        // 广播软件包信息
                        if (data && data.attachmentPaths) {
                            var initFiles = [];
                            for (var index in data.attachmentPaths) {
                                initFiles.push(data.attachmentPaths[index].fileName);
                            }
                        }

                        if (data) {
                            data.installCommand = (data.installCommand && data.installCommand != "") ? $.base64.decode(data.installCommand, true) : data.installCommand;
                            data.unInstallCommand = (data.unInstallCommand && data.unInstallCommand != "") ? $.base64.decode(data.unInstallCommand, true) : data.unInstallCommand;
                            data.startCommand = (data.startCommand && data.startCommand != "") ? $.base64.decode(data.startCommand, true) : data.startCommand;
                            data.stopCommand = (data.stopCommand && data.stopCommand != "") ? $.base64.decode(data.stopCommand, true) : data.stopCommand;
                        }
                        $scope.service.initFiles = initFiles;
                        $scope.$broadcast($scope.registSoftwareEvents.softwareInfoInit, data);
                    });
                    deferred.fail(function(data) {
                        exceptionService.doException(data);
                    });
                };

                // 清理定时器
                $scope.$on('$destroy', function () {
                    $scope.clearTimer();
                });

                $scope.init();
            }];

        return registSoftwareCtrl;
    });
