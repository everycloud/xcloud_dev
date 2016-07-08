/*global define*/
define(["tiny-lib/angular",
    "tiny-lib/jquery",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/business/network/services/router/routerService",
    "fixtures/network/router/routerFixture"
], function (angular, $, UnifyValid, validatorService, routerService) {
    "use strict";

    var basicCtrl = ["$scope", "camel", "$q", "exception",
        function ($scope, camel, $q, exception) {
            var i18n = $scope.i18n;
            $scope.serviceInstance = new routerService(exception, $q, camel);
            $scope.baseInfoRadiogroupName = "direct";
            var validator = new validatorService();

            //硬件路由器
            var HARDWARE_ROUTER = 1;

            $scope.baseInfo = {
                name: {
                    "id": "create-network-basicInfo-name",
                    label: i18n.common_term_name_label + ":",
                    require: true,
                    "value": "",
                    validate: "required: " + i18n.common_term_null_valid + ";regularCheck(" + validator.name + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid + ";",
                    "tooltip": i18n.common_term_composition2_valid,
                    "tipPosition": "right"
                },
                description: {
                    label: i18n.common_term_desc_label + ":",
                    "id": "create-network-basicInfo-description",
                    "type": "multi",
                    "width": "400",
                    "height": "60",
                    "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, "0", "1024")
                },
                type: {
                    "label": i18n.vpc_term_netType_label + ":",
                    "id": "create-network-basicInfo-type",
                    "require": true
                },
                radiogroup: {
                    name: "radiogroup",
                    inner: i18n.vpc_term_innerNet_label,
                    direct: i18n.vpc_term_directConnectNet_label,
                    router: i18n.vpc_term_routerNet_label,
                    disable: true
                },
                nextBtn: {
                    "id": "create-network-basicInfo-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var nameDom = $("#create-network-basicInfo-name");
                        var descDom = $("#create-network-basicInfo-description");
                        //校验是否输入
                        var valid = UnifyValid.FormValid(nameDom, undefined);
                        var des = UnifyValid.FormValid(descDom, undefined);
                        if (!valid || !des) {
                            return;
                        }

                        $scope.service.name = nameDom.widget().getValue();
                        $scope.service.description = descDom.widget().getValue();

                        $scope.service.show = "selectRes";
                        $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_setNet_button, i18n.common_term_confirmInfo_label];
                        if ($scope.service.networkType !== "0") {
                            $scope.service.step.values = [i18n.common_term_basicInfo_label, i18n.vpc_term_chooseVLAN_label, i18n.common_term_confirmInfo_label];
                        }
                        $("#" + $scope.service.step.id).widget().next();
                        $scope.$emit($scope.events.networkTypeChange);
                    }
                },
                cancelBtn: {
                    "id": "create-network-basicInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    }
                }
            };

            //选择网络类型触发的事件
            $scope.click = function (evt) {
                $scope.service.networkType = evt;
                var types = {
                    "1": i18n.vpc_term_innerNet_label,
                    "0": i18n.vpc_term_directConnectNet_label,
                    "2": i18n.vpc_term_routerNet_label
                };
                $scope.service.networkTypeUI = types[evt];
            };

            //创建路由网络时，先要申请路由器
            $scope.isCreateRouter = function () {
                var promise = $scope.serviceInstance.queryRouter({
                    "vdcId": $scope.service.user.vdcId,
                    "vpcId": $scope.service.vpcId,
                    "cloudInfraId": $scope.service.cloudInfraId,
                    "azId": $scope.service.azId,
                    "userId": $scope.service.user.id
                });
                promise.then(function (resolvedValue) {
                    if (!resolvedValue || resolvedValue.routers.length <= 0) {
                        $scope.baseInfo.radiogroup.disable = true;
                        return;
                    }
                    //请求成功
                    $scope.baseInfo.radiogroup.disable = (resolvedValue.routers[0].status !== "READY");
                    $scope.service.isHardwareRoute = (HARDWARE_ROUTER === resolvedValue.routers[0].routerType && resolvedValue.routers[0].status === 'READY')
                }, function () {
                    $scope.baseInfo.radiogroup.disable = true;
                });
            };
            $scope.isCreateRouter();
        }
    ];
    return basicCtrl;
});
