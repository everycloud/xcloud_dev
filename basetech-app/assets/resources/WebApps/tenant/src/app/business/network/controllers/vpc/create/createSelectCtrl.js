/*global define*/
define(["jquery",
    'app/services/competitionConfig'], function ($, competitionConfig) {
    "use strict";
    var selectCtrl = ["$scope", function ($scope) {
        var i18n = $scope.i18n;
        var user = $scope.user;
        $scope.isICT = user.cloudType === "ICT";
        $scope.snapshot = "../theme/default/images/vpc_direct.png";
        $scope.vmwareICT = competitionConfig.isBaseOnVmware;
        $scope.info = {
            "radiogroup": {
                "name": "vpcTypeSelectRadios",
                "directnet_vpc": i18n.vpc_vpc_add_para_type_option_direct_label,
                "directnet_router_vpc": i18n.vpc_vpc_add_para_type_option_directRouter_label,
                "directnet_router_innernet_vpn_vpc": i18n.vpc_vpc_add_para_type_option_all_label,
                "innernet_vpc": i18n.vpc_vpc_add_para_type_option_inner_label, //ICT场景
                "custom": i18n.common_term_custom_label
            },
            preBtn: {
                "id": "create-vpc-step2-pre",
                "text": i18n.common_term_back_button,
                "click": function () {
                    if($scope.isICT){
                        $scope.service.show = "vpcQuota";
                    }else{
                        $scope.service.show = "basicInfo";
                    }
                    $("#" + $scope.service.step.id).widget().pre();
                }
            },
            nextBtn: {
                "id": "create-vpc-step2-next",
                "text": i18n.common_term_next_button,
                "click": function () {
                    $scope.service.show = "networkInfo";

                    // 自定义类型
                    if ($scope.service.type === $scope.VPC_TYPE.CUSTOM) {
                        $scope.service.show = "confirm";
                        if($scope.isICT){
                            $scope.service.step.values = [
                                i18n.common_term_basicInfo_label,
                                i18n.org_term_quotaMgt_button,
                                i18n.vpc_vpc_add_para_cfg_label,
                                i18n.common_term_confirmInfo_label];
                        }else{
                            $scope.service.step.values = [
                                i18n.common_term_basicInfo_label,
                                i18n.vpc_vpc_add_para_cfg_label,
                                i18n.common_term_confirmInfo_label];
                        }
                    } else {
                        if($scope.isICT){
                            $scope.service.step.values = [
                                i18n.common_term_basicInfo_label,
                                i18n.org_term_quotaMgt_button,
                                i18n.vpc_vpc_add_para_cfg_label,
                                i18n.vpc_term_setNet_button,
                                i18n.common_term_confirmInfo_label];
                        }else{
                            $scope.service.step.values = [
                                i18n.common_term_basicInfo_label,
                                i18n.vpc_vpc_add_para_cfg_label,
                                i18n.vpc_term_setNet_button,
                                i18n.common_term_confirmInfo_label];
                        }
                    }
                    if ($scope.service.type === $scope.VPC_TYPE.DIRECT || $scope.service.type === $scope.VPC_TYPE.DIRECT_ROUTER || $scope.service.type === $scope.VPC_TYPE.DIRECT_ROUTER_EXTEND_VPN) {
                        $scope.$emit($scope.events.selectDirectNet);
                    }
                    $("#" + $scope.service.step.id).widget().next();
                }
            },
            cancelBtn: {
                "id": "create-vpc-step2-cancel",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
            }
        };

        $scope.click = function (type) {
            $scope.service.type = type;
        };

        $scope.$watch("service.type", function (newVal) {
            $scope.service.type = newVal;
            if (newVal === "0") {
                $scope.snapshot = "../theme/default/images/vpc_direct.png";
            } else if (newVal === "1") {
                $scope.snapshot = "../theme/default/images/vpc_direct_router.png";
            } else if (newVal === "3") {
                $scope.snapshot = "../theme/default/images/vpc_direct_inner_router.png";
            } else if (newVal === "5") {
                $scope.snapshot = "../theme/default/images/vpc_inner.png";
            } else {
                $scope.snapshot = false;
            }
        });
    }
    ];
    return selectCtrl;
});
