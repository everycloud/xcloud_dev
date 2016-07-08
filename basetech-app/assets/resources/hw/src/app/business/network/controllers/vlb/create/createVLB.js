/* global define*/
define(["language/keyID", "fixtures/network/vlb/vlbFixture"], function (i18n) {
    "use strict";
    var createVlbCtrl = ["$scope", "$stateParams",
        function ($scope, $stateParams) {
            $scope.service = {
                "step": {
                    "id": "create-vlb-step",
                    "values": [i18n.common_term_basicInfo_label, i18n.lb_term_addListen_button, i18n.lb_term_setListen_button, i18n.org_term_bondVM_button, i18n.common_term_confirmInfo_label],
                    "width": 592,
                    "jumpable": false
                },
                "show": "basic",

                // 公共服务
                "user": $scope.user,

                // 仅仅添加监听器
                "onlyAddListener": false,

                // 保存公共数据
                "cloudInfraId": $stateParams.cloud_infras,
                "vpcId": $stateParams.vpcId,

                "vlbName": "", // vlb名称
                "maxSession": 100, // 最大会话数
                "throughPut": 50000, // 吞吐量
                "workingMode": {}, //负载均衡类型

                // 可供选择的前后端网络列表
                "frontNetwork": [], //前端网络
                "backNetwork": [], //后端网络

                "monitors": [], //监听器数据
                "totalMonitors": [], //用于构建创建参数的监控器

                // 选中的前后端网络
                "selectedFrontNetwork": {},
                "selectedBackNetwork": {},

                "httpMonitorConfigTable": [], //http监听器配置
                "httpsMonitorConfigTable": [], //https监听器配置
                "tcpMonitorConfigTable": [], //tcp监听器配置

                "httpBackPorts": [], //http监听器配置
                "httpsBackPorts": [], //https监听器配置
                "tcpBackPorts": [], //tcp监听器配置
                "backPortsInfos": [] //汇总信息
            };

            // 添加监听器
            if ($stateParams.lbID && $stateParams.workingMode) {
                $scope.service.step.values = [i18n.lb_term_addListen_button, i18n.lb_term_setListen_button, i18n.org_term_bondVM_button];
                $scope.service.show = "addMonitor";
                $scope.service.lbID = $stateParams.lbID;
                $scope.service.onlyAddListener = true;
                $scope.service.workingMode = {
                    "value": $stateParams.workingMode
                };
            }
        }
    ];

    return createVlbCtrl;
});
