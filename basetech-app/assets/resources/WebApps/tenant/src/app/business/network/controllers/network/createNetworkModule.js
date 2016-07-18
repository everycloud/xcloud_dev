/*global define*/
define([
        'tiny-lib/jquery',
        'tiny-directives/Step'
    ],
    function ($) {
        "use strict";
        var createNetworkCtrl = ["$scope", "$stateParams",
            function ($scope, $stateParams) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n;
                // 事件定义 IPSec类型 基本的下一步需要查询相关路由信息
                $scope.events = {
                    "networkTypeChange": "networkTypeChange",
                    "networkTypeChangeFromParent": "networkTypeChangeFromParent"
                };

                // 事件转发
                $scope.$on($scope.events.networkTypeChange, function (event, msg) {
                    $scope.$broadcast($scope.events.networkTypeChangeFromParent, msg);
                });

                //公共数据
                $scope.service = {
                    "step": {
                        "id": "create-network-step",
                        "values": [i18n.common_term_basicInfo_label, i18n.vpc_term_setNet_button, i18n.common_term_confirmInfo_label],
                        "width": 592,
                        "jumpable": false
                    },
                    "show": "basicInfo",
                    "user": user,
                    "cloudInfraId": $stateParams.cloud_infras,
                    "vpcId": $stateParams.vpcId,
                    "azId": $stateParams.azId,
                    "name": "",
                    "description": "",
                    "connectionType": "subnet", // 链接方式  子网vlan、vlan、子网vxlan、vxlan
                    "isSubnetSelected": true, // 是否选择了子网
                    "iPTypeValue": 1, //IP分配方式 后台接口字段
                    "ipType": "", //ip分配方式 前台UI显示字段
                    "networkType": "0", //枚举值 0--直连  1--内部，2--路由
                    "isHardwareRoute" :false,
                    "networkTypeUI": i18n.vpc_term_directConnectNet_label,
                    "extNetworkId": null,
                    "vlan": "",
                    "directId": "",
                    "ouNetworkInfo": "",
                    "subnetAddr": "", //子网
                    "subnetPrefix": "", //掩码
                    "gateway": "", //网关
                    "availableIPRanges": "", //预留IP
                    "startIP": "", //开始IP
                    "endIP": "", //结束IP
                    "domainName": "", //域名
                    "primaryDNS": "", //首选DNS
                    "secondaryDNS": "", //备选DNS
                    "primaryWINS": "", //主WINS
                    "secondaryWINS": "" //备WINS
                };
            }
        ];
        return createNetworkCtrl;
    });
