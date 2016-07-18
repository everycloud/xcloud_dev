/* global define */
define([
        'tiny-lib/jquery',
        "tiny-lib/jquery.base64",
        'tiny-lib/angular',
        "ui-router/angular-ui-router",
        'app/business/template/controllers/createScript/basicCtrl',
        'app/business/template/controllers/createScript/commandConfigCtrl',
        'app/business/template/controllers/createScript/confirmCtrl',
        'app/business/template/controllers/createScript/uploadFileCtrl',
        "app/services/httpService",
        "app/business/template/services/createScriptService",
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
    function ($, $jBase, angular, router, basicCtrl, commandConfigCtrl, confirmCtrl, uploadFileCtrl, http, monkey, constants, FileUpload, messageService, UserService, templateService) {
        "use strict";

        var ctrl = ["$rootScope", "monkey", "$scope", "$compile", "camel", "$q", "$interval", "$stateParams", "$timeout",
            function ($rootScope, monkey, $scope, $compile, camel, $q, $interval, $stateParams, $timeout) {
                var $state = $("html").injector().get("$state");
                var user = $("html").scope().user;
                var action = $stateParams.action;
                var exception = $("#createScript").scope.exception;
                var templateServiceIns = new templateService(exception, $q, camel);
                var userService = new UserService(exception, $q, camel);
                $rootScope.monkey = monkey;
                var i18n = $scope.i18n;
                $scope.action = action;
                $rootScope.close = function () {
                    $state.go("ecs.commonScriptList");
                };
                $rootScope.step = {
                    "id": "create-plan-step",
                    "values": [i18n.common_term_basicInfo_label, i18n.common_term_setCmd_label, i18n.common_term_confirmInfo_label, i18n.common_term_uploadFile_label],
                    "width": 592,
                    "jumpable": false
                };
                $rootScope.service = {
                    name: "",
                    OSType: "",
                    OSTypes: [], //默认
                    softwareType: "",
                    icon: "../theme/default/images/softwarePackage/icon_software_1.png",
                    desc: "",
                    scriptFile: "",
                    version: "",
                    command: "",
                    filePath: "",
                    progress: 0,
                    ftpAppletLoaded: false,
                    jreChecked: true,
                    uploadPath: new Date().getMilliseconds(),
                    mainFilePath: ""
                };

                /**
                 * applet超时机制
                 * @type {number}
                 */
                $scope.checkLoadTimeOut = 0;
                $scope.checkUploadTimeOut = 0;

                /**
                 * 事件定义
                 * @type {{confirmedFromParent: string, confirmed: string}}
                 */
                $scope.addScriptEvents = {
                    "scriptInfoInit": "scriptInfoInit",
                    "confirmedFromParent": "confirmedFromParent",
                    "confirmed": "confirmed",
                    "updateProgress": "updateProgress"
                };

                // 定时器句柄
                $scope.promise = undefined;
                $scope.promise2 = undefined;

                // 安全清除定时器
                $scope.clearTimer = function (promise) {
                    try {
                        $interval.cancel(promise);
                    } catch (e) {
                        // do nothing
                    }
                };

                // 事件转发
                $scope.$on($scope.addScriptEvents.confirmed, function (event, msg) {
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

                        // 2.查询进度
                        $scope.promise2 = $interval(function () {
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
                            $scope.$broadcast($scope.addScriptEvents.updateProgress, $scope.service.progress);

                            // 上传精度为99后，查询上传状态
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
                            } else if (uploadStatus === 2) {
                                $scope.uploadErrorHandle(uploadStatus);
                                $scope.clearTimer($scope.promise2);
                            } else {
                                $scope.uploadErrorHandle(uploadStatus);
                                $scope.clearTimer($scope.promise2);
                            }
                        }, 1000);
                    });
                });

                // 清理定时器
                $scope.$on('$destroy', function () {
                    try {
                        $scope.clearTimer($scope.promise2);
                        $scope.clearTimer($scope.promise);
                    } catch (e) {
                        // do nothing
                    }
                });

                //异常处理
                $scope.uploadErrorHandle = function (uploadStatus) {
                    $scope.clearTimer();

                    var action = $stateParams.action;
                    if (action === 'create') {
                        $timeout(function () {
                            $scope.$broadcast($scope.addScriptEvents.updateProgress, uploadStatus);
                        }, 100);
                        return;
                    }

                    // 修改操作，弹出异常
                    exception.doException({"status": "400", "responseText": '{"code":"' + uploadStatus + '"}'}, null);
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

                //上传成功
                $scope.uploadSuccess = function () {
                    $scope.clearTimer($scope.promise2);
                    // 调用注册ISO接口
                    $scope.service.mainFilePath = "/" + $scope.service.uploadPath + "/" + $scope.service.scriptFile;
                    if ($scope.service.version instanceof Array) {
                        $scope.service.version = $scope.service.version[0];
                    }
                    if ($scope.service.OSType instanceof Array) {
                        $scope.service.OSType = $scope.service.OSType[0];
                    }
                    //创建或修改脚本
                    var promise = createOrUpdateScript();
                    promise.then(function (data) {
                        $scope.service.progress = 100;
                        // 更新进度
                        $scope.$broadcast($scope.addScriptEvents.updateProgress, $scope.service.progress);
                    });
                };

                //创建或修改脚本
                function createOrUpdateScript() {
                    var params = JSON.stringify({
                        "name": $scope.service.name,
                        "osType": $scope.service.OSType,
                        "picture": $scope.service.icon,
                        "description": $scope.service.desc,
                        "mainFilePath": $scope.service.mainFilePath,
                        "range": "1",
                        "version": $scope.service.version,
                        "installCommand": $.base64.encode($scope.service.command, true),
                        "destinationPath": $scope.service.filePath
                    });

                    var promise = null;
                    if (action === "create") {
                        var options = {
                            "user": user,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "params": params
                        };
                        promise = templateServiceIns.createScript(options);
                    } else if (action === "modify") {
                        var modifyOptions = {
                            "user": user,
                            "id": $stateParams.id,
                            "cloudInfraId": $stateParams.cloudInfraId,
                            "params": params
                        };
                        promise = templateServiceIns.updateScript(modifyOptions);
                    }
                    return promise;
                }

                function getOSTypes (type) {
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

                //根据ID查询脚本详情
                function findById() {
                    if (action === "create") {
                        $scope.service.OSTypes = getOSTypes("Linux");
                        return;
                    } else if (action === "modify") {
                        // 修改时，页面初始化操作
                        $scope.step.values = [i18n.common_term_basicInfo_label, i18n.common_term_setCmd_label, i18n.common_term_confirmInfo_label];
                        //查询脚本信息
                        var options = {
                            "user": user,
                            "scriptId": $stateParams.id,
                            "cloudInfraId": $stateParams.cloudInfraId
                        };
                        var promise = templateServiceIns.queryScriptById(options);
                        promise.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var installCommand = data.installCommand;
                            data.installCommand = $.base64.decode(installCommand || "", true);
                            $scope.service.name = data.name;
                            $scope.service.mainFilePath = data.mainFilePath;
                            $scope.service.scriptFile = data.mainFilePath;
                            $scope.service.OSType = data.osType;
                            $scope.service.OSTypes = getOSTypes(data.osType);
                            $scope.service.icon = data.picture;
                            $scope.service.range = data.range;
                            $scope.service.version = data.version;
                            $scope.service.desc = data.description;
                            $scope.service.filePath = data.destinationPath;
                            $scope.service.command = data.installCommand;
                        });
                    }
                }


                /**
                 * 初始化操作
                 * 加载applet
                 */
                $scope.init = function () {
                    FileUpload.loadFtpApplet(constants.config.SERVICE);
                    $scope.promise = $interval(function () {
                        var isLoaded = 0;
                        try {
                            isLoaded = FileUpload.checkIsAppletLoaded();

                        } catch (e) {
                            $scope.clearTimer($scope.promise);
                        }

                        if (isLoaded === 1) {
                            $scope.clearTimer($scope.promise);
                            $scope.service.ftpAppletLoaded = true;
                        } else if (isLoaded === 2) {
                            $scope.clearTimer($scope.promise);
                        }
                    }, 1000);

                    //根据ID查询脚本详情
                    findById();
                };

                //加载applet
                $scope.init();
            }
        ];

        var summary = function () {
            return {
                templateUrl: 'app/business/template/views/script/create/createScriptContainer.html',
                restrict: "EA",
                scope: false,
                controller: ctrl
            };
        };

        var dependency = [
            "ng",
            "wcc",
            "ui.router"
        ];
        var createScript = angular.module("createScript", dependency);
        createScript.controller("basicCtrl", basicCtrl);
        createScript.controller("commandConfigCtrl", commandConfigCtrl);
        createScript.controller("confirmCtrl", confirmCtrl);
        createScript.controller("uploadFileCtrl", uploadFileCtrl);
        createScript.directive("myContainer", summary);
        createScript.service("camel", http);
        createScript.service("monkey", monkey);
        return createScript;
    });
