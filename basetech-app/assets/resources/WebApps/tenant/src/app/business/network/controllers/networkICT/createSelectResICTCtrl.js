/*global define*/
define(["tiny-lib/jquery",
    "language/keyID",
    "tiny-common/UnifyValid",
    "fixtures/network/network/createNetworkFixture"
], function ($, i18n,UnifyValid) {
    "use strict";

    var ctrl = ["$rootScope", "$scope",
        function ($rootScope, $scope) {
            $scope.num = [];
            $rootScope.selConnectType = "subnet";
            $scope.outNet = {};
            $scope.i18n = i18n;
            var ipType = ""; //IP分配方式
            $scope.typeClick = function (type) {
                $rootScope.selConnectType = type;
                $rootScope.isSubChecked = ("subnet" === type);
            };
            $scope.info = {
                connectType: {
                    "id": "create-network-connecttype",
                    label: i18n.common_term_linkMode_label + ":",
                    require: true,
                    name: "radiogroup-connecttype",
                    subnet: i18n.common_term_Subnet_label,
                    vlan: "VLAN/VXLAN",
                    subNetRadioId: "subnet-radio-id"
                },
                setting: {
                    segmentationId1:"create-netWork-segmentationId1",
                    segmentationId2:"create-netWork-segmentationId2",
                    networkSelectId:"create-netWork-netSelectId",
                    phyNetworkSelectId:"create-phyNetwork-netSelectId",
                    label: {
                        type: i18n.vpc_term_netType_label + ":",
                        phyNetwork: i18n.resource_term_physiNet_label + ":",
                        segmentation: "VLAN/VXLAN ID:",
                        operator:i18n.common_term_advancedSet_label
                    },
                    validate: {
                        phyNetworkValidate: "required: " + i18n.common_term_null_valid,
                        vlanValidate:"required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                            ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 4094) || "范围为1-4094" ) +
                            ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 4094) || "范围为1-4094" ) +
                            ";maxValue(4094):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 4094) || "范围为1-4094" ),
                        vxlanValidate:"required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                            ";integer:" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 4096, 16777215) || "范围为1-16777215" ) +
                            ";minValue(4096):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 4096, 16777215) || "范围为1-16777215" ) +
                            ";maxValue(16777215):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 4096, 16777215) || "范围为1-16777215" )

                    },
                    tip: {
                        vlanTip:$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 4094),
                        vxlanTip:$scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 4096, 16777215)
                    },
                    add: function(){
                        $rootScope.service.paraSetting.show=(true == $rootScope.service.paraSetting.show)?false:true;
                    },
                    change: function(){
                        $rootScope.service.paraSetting.typeName=  $("#create-netWork-netSelectId").widget().getSelectedId();
                    }


                },
                preBtn: {
                    "id": "create-network-selectres-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.step.show = "basicInfoICT";
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "create-network-selectres-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($("#infoSelectInnerOrRouter"));
                        if (!valid) {
                            return;
                        }

                        if ($rootScope.isSubChecked) {
                            $scope.step.show = "subnetInfoICT";
                            $("#isShow").css("display", "block");
                        } else {
                            $scope.step.show = "directConfirmICT";
                            $("#isShow").css("display", "none");
                        }

                        //保存页面信息
                        $rootScope.service.ipType = ipType;
                        //创建时获取输入信息
                        if(!$rootScope.isModifyMode){
                            if($rootScope.service.paraSetting.show){
                                if('vlan' == $rootScope.service.paraSetting.typeName){
                                    $rootScope.service.paraSetting.phyNetwork =  $("#create-phyNetwork-netSelectId").widget().getSelectedId();
                                    $rootScope.service.vlan=  $("#create-netWork-segmentationId1").widget().getValue();
                                }else{
                                    $rootScope.service.paraSetting.phyNetwork =  "";
                                    $rootScope.service.vlan=  $("#create-netWork-segmentationId2").widget().getValue();
                                }
                            }else{
                                $rootScope.service.paraSetting.phyNetwork =  "";
                                $rootScope.service.vlan=  "";
                            }
                        }else{
                            ;
                        }

                        $("#" + $scope.step.id).widget().next();
                        $("#showConfirmInfo").css('display', 'block');
                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };

            //IP分配方式单选按钮事件
            $scope.ipTypeclick = function (evt) {
                if ("auto" === evt) {
                    $scope.reserveIP = false;
                    ipType = $scope.info.ipType.auto;
                } else {
                    if ("inject" === evt) {
                        ipType = $scope.info.ipType.inject;
                    } else {
                        ipType = $scope.info.ipType.inner;
                    }
                    $scope.reserveIP = true;
                }
            };
        }
    ];
    return ctrl;
});
