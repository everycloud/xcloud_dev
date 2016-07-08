/*global define*/
define(["tiny-lib/jquery",
    'tiny-common/UnifyValid',
    'app/services/validatorService',
    "app/business/network/services/router/routerService",
    "language/keyID",
    "fixtures/network/router/routerFixture"
], function ($, UnifyValid, validatorService, routerService, i18n) {
    "use strict";

    var basicICTCtrl = ["$rootScope", "$scope", "camel", "$q", "exception",
        function ($rootScope, $scope, camel, $q, exception) {
            var validator = new validatorService();
            $scope.serviceInstance = new routerService(exception, $q, camel);
            var user = $("html").scope().user;
            $rootScope.isRouted = false; //是否关联router
            $rootScope.service.type = i18n.vpc_term_innerNet_label;
            $scope.i18n = i18n;

            $scope.baseInfo = {
                name: {
                    "id": "create-network-basicInfo-name",
                    label: i18n.common_term_name_label + ":",
                    require: true,
                    "value": "",
                    validate: "required: " + i18n.common_term_null_valid + ";regularCheck(" + validator.name + "): " + i18n.common_term_format_valid + "; regularCheck(" + validator.notAllSpaceReg + "): " + i18n.common_term_format_valid + ";",
                    "tooltip": i18n.common_term_composition2_valid + i18n.sprintf(i18n.common_term_length_valid, "1", "64"),
                    "tipPosition": "right"
                },
                type: {
                    "label": i18n.vpc_term_netType_label + ":",
                    "id": "create-network-basicInfo-type",
                    "require": true
                },
                radiogroup: {
                    name: "radiogroup",
                    inner: i18n.vpc_term_innerNet_label,
                    router: i18n.vpc_term_routerNet_label,
                    disable: true
                },
                nextBtn: {
                    "id": "create-network-basicInfo-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var nameDom = $("#create-network-basicInfo-name");
                        var valid = UnifyValid.FormValid(nameDom, undefined);
                        if (!valid) {
                            return;
                        }
                        $scope.step.show = "selectResICT"
                        //保存页面信息
                        $rootScope.service.name = nameDom.widget().getValue();

                        $("#" + $scope.step.id).widget().next();
                    }
                },
                cancelBtn: {
                    "id": "create-network-basicInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            //选择网络类型触发的事件
            $scope.click = function (evt) {
                if ("inner" === evt) {
                    $rootScope.isRouted = false;
                    $("#vlanSelectRadio").css('display', 'block');
                    $rootScope.service.type = i18n.vpc_term_innerNet_label;
                } else {
                    $rootScope.isRouted = true;
                    $("#vlanSelectRadio").css('display', 'none');
                    $rootScope.service.type = i18n.vpc_term_routerNet_label;
                }
                $rootScope.showIPV6();
            };

            //创建路由网络时，先要申请路由器
            $scope.isCreateRouter = function () {
                var promise = $scope.serviceInstance.queryRouter({
                    "vdcId": user.vdcId,
                    "vpcId": $rootScope.service.vpcId,
                    "cloudInfraId": $rootScope.service.cloudInfraId,
                    "azId": $rootScope.service.azId,
                    "userId": user.id
                });
                promise.then(function (resolvedValue) {
                    if (!resolvedValue || resolvedValue.routers.length <= 0) {
                        $scope.baseInfo.radiogroup.disable = true;
                        return;
                    }
                    $scope.baseInfo.radiogroup.disable = (resolvedValue.routers[0].status !== "READY");
                }, function () {
                    $scope.baseInfo.radiogroup.disable = true;
                });
            };
            $scope.isCreateRouter();
        }
    ];
    return basicICTCtrl;
});
