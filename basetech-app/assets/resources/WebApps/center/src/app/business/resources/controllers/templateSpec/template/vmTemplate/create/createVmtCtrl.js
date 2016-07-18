define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    "app/business/resources/controllers/constants",
    "language/sr-rpool-exception",
    "language/irm-rpool-exception"],
    function ($, angular, UnifyValid, constants, ameException, irmException) {
        "use strict";

        var createVmtCtrl = ["$scope", "$timeout","$state", "camel", function ($scope, $timeout, $state, camel) {

            $scope.errorCode = 5100003;

            $scope.errorMsg = $scope.i18n.common_term_sysAbnormal_label;

            $scope.createStatus = 0;

            $scope.progress = 0;

            /**
             * 清除定时器
             */
            $scope.clearTimer = function () {
                try {
                    window.clearTimeout($scope.promise);
                }
                catch(e) {
                    // do nothing
                }
            };

            $scope.preBtn = {
                id: "createVmtPreID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button,
                tip: "",
                pre: function () {
                    try {
                        $scope.clearTimer();
                    }
                    catch (e) {
                        // do nothing
                    }

                    $scope.service.show = "specInfo";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "createVmtNextID",
                disabled: true,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    if ($scope.progress < 100) {
                        return;
                    }
                    $scope.clearTimer();

                    // 触发事件
                    $scope.$emit($scope.createVmtEvents.createVmtSuccess, $scope.service.model);

                    $scope.service.show = "installSoftware";
                    $("#"+$scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "createVmtCancelID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $scope.clearTimer();
                    $state.go("resources.templateSpec.vmTemplateResources.vmTemplate", {});
                }
            };

            // 定时查询进度
            var getProgress = function () {
                var deferred = camel.get({
                    "url": {"s":constants.rest.VM_TEMPLATE_QUERY.url,"o":{"tenant_id":1}},
                    "params": {
                        "start":"0",
                        "limit":"10",
                        "vmtid":$scope.service.model.id
                    },
                    "userId": $("html").scope().user && $("html").scope().user.id,
                    "monitor":false
                });
                deferred.success(function (data) {
                    $scope.$apply(function () {
                        if (data && data.vmtemplates && data.vmtemplates[0]) {
                            if (data.vmtemplates[0].status === "FINISHED" || data.vmtemplates[0].status === "UNFINISHED") {
                                $scope.clearTimer();
                                $scope.progress = 100;
                                $scope.createStatus = 1;
                            } else  if (data.vmtemplates[0].status === "FAILED"){
                                $scope.clearTimer();
                                $scope.createStatus = -1;
                                $scope.errorCode = data.vmtemplates[0].errorCode || 5100003;

                                var errorMsg = "";
                                if (irmException && irmException[$scope.errorCode] && irmException[$scope.errorCode].desc) {
                                    errorMsg = irmException[$scope.errorCode].desc;
                                } else if (ameException && ameException[$scope.errorCode] && ameException[$scope.errorCode].desc) {
                                    errorMsg = ameException[$scope.errorCode].desc;
                                } else {
                                    errorMsg = $scope.i18n.common_term_sysAbnormal_label;
                                }
                                $scope.errorMsg = errorMsg;
                            } else {
                                // do nothing
                            }
                        }
                    });

                    if ($scope.progress >= 100) {
                        $scope.clearTimer();
                        $scope.createStatus = 1;
                        $("#"+$scope.nextBtn.id).widget().option("disable",false);
                    }
                });

                if ($scope.progress < 99) {
                    $scope.progress += 1;
                }
            };

            // 事件处理
            $scope.$on($scope.createVmtEvents.createRequestDoneFromParent, function (event, msg) {
                if (msg && msg.code == "0") {
                    $scope.promise = window.setInterval(getProgress, 3000);

                    return;
                } else {
                    $scope.$apply(function() {
                        $scope.createStatus = -1;
                        $scope.errorCode = msg && msg.code;
                        var errorMsg = "";
                        if (irmException && irmException[$scope.errorCode] && irmException[$scope.errorCode].desc) {
                            errorMsg = irmException[$scope.errorCode].desc;
                        } else if (ameException && ameException[$scope.errorCode] && ameException[$scope.errorCode].desc) {
                            errorMsg = ameException[$scope.errorCode].desc;
                        } else {
                            errorMsg = $scope.i18n.common_term_sysAbnormal_label;
                        }
                        $scope.errorMsg = errorMsg;
                    });
                }
            });

            // 清理定时器
            $scope.$on('$destroy', function () {
                $scope.clearTimer();
            });
        }];

        return createVmtCtrl;
    });
