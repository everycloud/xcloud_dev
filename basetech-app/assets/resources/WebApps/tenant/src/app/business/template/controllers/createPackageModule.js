/* global define */
define([
    'sprintf',
    'tiny-lib/jquery',
    "tiny-lib/jquery.base64",
    'tiny-lib/angular',
    'tiny-lib/angular-sanitize.min',
        "app/services/mask",
    'language/keyID',
    "ui-router/angular-ui-router",
    'app/business/template/controllers/createPackage/basicCtrl',
    'app/business/template/controllers/createPackage/commandConfigCtrl',
    'app/business/template/controllers/createPackage/confirmCtrl',
    'app/business/template/controllers/createPackage/uploadFileCtrl',
    "app/services/httpService",
        "app/services/exceptionService",
    "app/business/template/services/createPackageService",
    "app/business/template/controllers/constants",
    'upload/FileUpload',
    "app/services/messageService",
    'app/services/userService',
    "app/business/template/services/templateService",
    "bootstrap/bootstrap.min",
    "tiny-directives/Textbox",
    "tiny-directives/Step",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-directives/Step",
    "tiny-directives/Table",
    "tiny-directives/RadioGroup",
    "tiny-directives/Select"
],
    function (sprintf, $, $jBase, angular, ngSanitize, mask, keyIDI18n, router, basicCtrl, commandConfigCtrl, confirmCtrl, uploadFileCtrl, http, exceptionService, monkey, constants, FileUpload, messageService, UserService, templateService) {
        "use strict";

        var ctrl = ["$rootScope", "monkey", "$scope", "$compile", '$stateParams', "camel", "$interval", "$timeout", "$q",
            function ($rootScope, monkey, $scope, $compile, $stateParams, camel, $interval, $timeout, $q) {
                var $state = $("html").injector().get("$state");
                var user = $("html").scope().user;
                var action = $stateParams.action;
                var exception = new exceptionService();
                var templateServiceIns = new templateService(exception, $q, camel);
                var userService = new UserService(exception, $q, camel);
                $rootScope.monkey = monkey;
                $scope.action = action;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n =  $scope.i18n;
                //定义一个变量判断目标路径，安装命令是否可选
                //$scope.flag = true ;
                $rootScope.close = function () {
                    $state.go("ecs.commonPackageList");
                };
                $rootScope.step = {
                    "id": "create-package-step",
                    "values": [i18n.common_term_basicInfo_label, i18n.common_term_setCmd_label, i18n.common_term_confirmInfo_label, i18n.common_term_uploadFile_label],
                    "width": 592,
                    "jumpable": false
                };

                $rootScope.service = {
                    action: $stateParams.action,
                    name: "",
                    OSType: "",
                    OSTypes: [],
                    softwareType: "",
                    softwareTypes: [],
                    desc: "",
                    packageFile: "",
                    version: "",
                    range: "1",
                    icon: "../theme/default/images/softwarePackage/icon_software_1.png",
                    installCmd: "",
                    unInstallCmd: "",
                    startCmd: "",
                    stopCmd: "",
                    filePath: "",
                    attachmentFile: [],
                    progress: 0,
                    ftpAppletLoaded: false,
                    jreChecked: true,
                    uploadPath: new Date().getMilliseconds(),
                    attachmentMap: {},
                    deletedFiles: [],
                    initFiles: [],
                    mainFilePath: "",
                    attachmentPaths: "",
                    attachments: "",
                    removedFilePaths: "",
                    addedFilePaths: ""
                };

                /**
                 * 事件定义
                 * @type {{confirmedFromParent: string, confirmed: string}}
                 */
                $scope.addPackageEvents = {
                    "softwareInfoInit": "softwareInfoInit",
                    "baseInfoChanged": "baseInfoChanged",
                    "confirmedFromParent": "confirmedFromParent",
                    "confirmed": "confirmed",
                    "updateProgress": "updateProgress"
                };

                // 定时器句柄
                $scope.promise = undefined;

                /**
                 * applet超时机制
                 * @type {number}
                 */
                $scope.checkLoadTimeOut = 0;
                $scope.checkUploadTimeOut = 0;

                $scope.checkFtpResponseTimeOut = 0;

                // 安全清除定时器
                $scope.clearTimer = function () {
                    try {
                        $interval.cancel($scope.promise);
                    } catch (e) {
                        // do nothing
                    }
                };

                // 修改时显示mask
                var showMask = function () {
                    if (action === "modify") {
                        mask.show();
                    }
                };

                // 修改时隐藏mask
                var hideMask = function () {
                    if (action === "modify") {
                        mask.hide();
                    }
                };


                // 事件转发
                $scope.$on($scope.addPackageEvents.confirmed, function (event, msg) {
                    var promise = userService.queryMachineAccount({
                        "type": "FTP",
                        "userId": user.id,
                        "vdcId": user.vdcId
                    });
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var info = data.machineAccountInfo;
                        if (!info) {
                            return;
                        }
                        // 1.上传文件
                        FileUpload.uploadFile("/" + $scope.service.uploadPath, info.userName, $scope.service.ftpInfo.pwd);

                        // 清除掉之前定时器
                        $scope.clearTimer();

                        showMask();

                        // 2.查询进度
                        $scope.promise = $interval(function () {
                            var progress = FileUpload.getProgress();
                            if (progress >= 99) {
                                $scope.service.progress = 99;
                            } else {
                                $scope.service.progress = progress;
                            }

                            //progress等于100 $scope.checkUploadTimeOut ==0 时 不发送心跳
                            if (progress !== 100) {
                                // 发送心跳
                                if ($scope.checkUploadTimeOut % 30 === 0) {
                                    $scope.heartbeat();
                                }
                            }
                            $scope.checkUploadTimeOut++;
                            // 更新进度
                            $scope.$broadcast($scope.addPackageEvents.updateProgress, $scope.service.progress);
                            // 上传精度为99后，查询上传状态
                            var uploadStatus = 0;
                            try {
                                uploadStatus = FileUpload.checkUploadStatus();
                            } catch (e) {
                                $scope.uploadErrorHandle();
                            }

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
                                return;
                            } else if (uploadStatus === 1) {
                                $scope.uploadSuccess();
                            }else {
                                $scope.uploadErrorHandle(uploadStatus);
                                $scope.clearTimer();
                            }
                        }, 1000);
                    });
                });

                // 清理定时器
                $scope.$on('$destroy', function () {
                    try {
                        $scope.clearTimer();
                    } catch (e) {
                        // do nothing
                    }
                });
                $scope.uploadSuccess = function () {
                    $scope.clearTimer();
                    // 调用注册ISO接口
                    $scope.service.mainFilePath = "/" + $scope.service.uploadPath + "/" + $scope.service.packageFile;
                    if ($scope.service.version instanceof Array) {
                        $scope.service.version = $scope.service.version[0];
                    }
                    if ($scope.service.OSType instanceof Array) {
                        $scope.service.OSType = $scope.service.OSType[0];
                    }
                    if ($scope.service.softwareType instanceof Array) {
                        $scope.service.softwareType = $scope.service.softwareType[0];
                    }
                    //创建或修改软件包
                    var promise = createOrUpdatePackage();
                    promise.then(function (data) {
                        $scope.service.progress = 100;
                        if (action === "modify") {
                            $scope.close();
                            return;
                        }
                        // 更新进度
                        $scope.$broadcast($scope.addPackageEvents.updateProgress, $scope.service.progress);
                    });
                };

                //创建或修改软件包
                function createOrUpdatePackage() {
                    var params = JSON.stringify({
                        "name": $scope.service.name,
                        "osType": $scope.service.OSType,
                        "fileType": $scope.service.softwareType,
                        "description": $scope.service.desc,
                        "mainFilePath": $scope.service.mainFilePath,
                        "version": $scope.service.version,
                        "range": $scope.service.range,
                        "picture": $scope.service.icon,
                        "installCommand": $.base64.encode($scope.service.installCmd, true),
                        "unInstallCommand": $.base64.encode($scope.service.unInstallCmd, true),
                        "startCommand": $.base64.encode($scope.service.startCmd, true),
                        "stopCommand": $.base64.encode($scope.service.stopCmd, true),
                        "destinationPath": $scope.service.filePath,
                        "addedFilePaths": $scope.service.addedFilePaths,
                        "attachmentPaths": $scope.service.addedFilePaths,
                        "removedFilePaths": $scope.service.removedFilePaths
                    });

                    var promise = null;
                    if (action === "create") {
                        var options = {
                            "user": user,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "params": params
                        };
                        promise = templateServiceIns.createSoftPackage(options);
                    }
                    if (action === "modify") {
                        var modifyOptions = {
                            "user": user,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "id": $stateParams.id,
                            "params": params
                        };
                        promise = templateServiceIns.updateSoftPackage(modifyOptions);

                    }
                    return promise;
                }

                //异常处理
                $scope.uploadErrorHandle = function (uploadStatus) {

                    hideMask();

                    $scope.clearTimer();

                    var errorCode = uploadStatus ? uploadStatus : "5100003";
                    var action = $stateParams.action;
                    if (action === 'create') {
                        $timeout(function () {
                            $scope.$broadcast($scope.addPackageEvents.updateProgress, errorCode);
                        }, 100);
                        return;
                    }

                    // 修改操作，弹出异常
                    exception.doException({
                        "status": "400",
                        "responseText": '{"code":"'+errorCode+'"}'
                    }, "");
                };

                //心跳
                $scope.heartbeat = function () {
                    camel.get({
                        "url": {
                            "s": constants.rest.REST_HEART_BEAT.url
                        },
                        "userId": $("html").scope().user && $("html").scope().user.id,
                        "monitor": false
                    });
                };

                $scope.getSoftwareTypes = function (ostype, type) {
                    var softwareTypes = [];
                    if (ostype === "Linux") {
                        softwareTypes = [
                            {
                                "selectId": "unknown",
                                "label": "unknown",
                                "checked": type === "unknown"
                            },
                            {
                                "selectId": "rpm",
                                "label": "rpm",
                                "checked": type === "rpm"
                            }
                        ];
                    }
                    else {
                        softwareTypes = [
                            {
                                "selectId": "unknown",
                                "label": "unknown",
                                "checked": type === "unknown"
                            },
                            {
                                "selectId": "msi",
                                "label": "msi",
                                "checked": type === "msi"
                            }
                        ];
                    }

                    return softwareTypes;
                };

                function getOSTypes(type) {
                    var OSTypes = [
                        {
                            "selectId": "Linux",
                            "label": "Linux",
                            "checked": type === "Linux"
                        },
                        {
                            "selectId": "Windows",
                            "label": "Windows",
                            "checked": type === "Windows"
                        }
                    ];
                    return OSTypes;
                }

                //根据ID查询软件包详情
                function findById() {
                    if (action === "create") {
                        var osType = "Linux";
                        $scope.service.OSTypes = getOSTypes(osType);
                        $scope.service.softwareTypes = $scope.getSoftwareTypes(osType, "rpm");
                        return;
                    } else if (action === "modify") {
                        // 修改时，页面初始化操作
                        $scope.step.values = [i18n.common_term_basicInfo_label, i18n.common_term_setCmd_label, i18n.common_term_confirmInfo_label];
                        //查询软件包信息
                        var options = {
                            "user": user,
                            "softwareid": $stateParams.id,
                            "cloudInfraId": $stateParams.cloudInfraId
                        };
                        var promise = templateServiceIns.querySoftwarePackageById(options);
                        promise.then(function (data) {
                            if (!data) {
                                return;
                            }
                            // 广播软件包信息
                            $scope.service.initFiles = data && data.attachmentPaths;
                            var installCommand = data.installCommand;
                            data.installCommand = $.base64.decode(installCommand || "", true);
                            var unInstallCommand = data.unInstallCommand;
                            data.unInstallCommand = $.base64.decode(unInstallCommand || "", true);
                            var startCommand = data.startCommand;
                            data.startCommand = $.base64.decode(startCommand || "", true);
                            var stopCommand = data.stopCommand;
                            data.stopCommand = $.base64.decode(stopCommand || "", true);

                            $scope.service.name = data.name;
                            $scope.service.mainFilePath = data.mainFilePath;
                            $scope.service.packageFile = data.mainFilePath;
                            $scope.service.OSType = data.osType;
                            $scope.service.OSTypes = getOSTypes(data.osType);
                            $scope.service.softwareType = data.fileType;
                            $scope.service.softwareTypes = $scope.getSoftwareTypes(data.osType, data.fileType);
                            $scope.service.icon = data.picture;
                            $scope.service.range = data.range;
                            $scope.service.version = data.version;
                            $scope.service.desc = data.description;

                            $scope.service.destinationPath = data.destinationPath;
                            $scope.service.installCommand = data.installCommand;
                            $scope.service.unInstallCommand = data.unInstallCommand;
                            $scope.service.startCommand = data.startCommand;
                            $scope.service.stopCommand = data.stopCommand;
                        });
                    }
                }

                /**
                 * 初始化操作
                 * 加载applet
                 */
                $scope.init = function () {
                    $scope.service.filePath = new Date().getMilliseconds();
                    FileUpload.loadFtpApplet(constants.config.SERVICE);
                    $scope.promise = $interval(function () {
                        var isLoaded = 0;
                        try {
                            isLoaded = FileUpload.checkIsAppletLoaded();
                        } catch (e) {
                            $scope.clearTimer();
                        }

                        if (isLoaded === 1) {
                            $scope.clearTimer();
                            $scope.service.ftpAppletLoaded = true;
                        } else if (isLoaded === 2) {
                            // TODO:applet加载失败处理
                            $scope.clearTimer();
                        }
                    }, 1000);
                    //根据ID查询软件包详情
                    findById();
                };

                //加载applet
                $scope.init();
            }
        ];

        var summary = function () {
            return {
                templateUrl: 'app/business/template/views/package/create/createPackageContainer.html',
                restrict: "EA",
                scope: false,
                controller: ctrl
            };
        };

        var dependency = [
            "ng",
            "wcc",
            "ngSanitize",
            "ui.router",
            'ui.bootstrap'
        ];
        var createPackage = angular.module("createPackage", dependency);
        createPackage.controller("basicCtrl", basicCtrl);
        createPackage.controller("commandConfigCtrl", commandConfigCtrl);
        createPackage.controller("confirmCtrl", confirmCtrl);
        createPackage.controller("uploadFileCtrl", uploadFileCtrl);
        createPackage.directive("myContainer", summary);
        createPackage.service("camel", http);
        createPackage.service("monkey", monkey);
        return createPackage;
    });
