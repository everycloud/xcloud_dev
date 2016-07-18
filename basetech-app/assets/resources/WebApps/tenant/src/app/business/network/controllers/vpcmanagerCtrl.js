/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/underscore",
    "tiny-widgets/Layout",
    "app/business/network/services/router/routerService",
    'app/services/competitionConfig',
    "app/business/network/services/vpc/vpcService",
    "fixtures/network/router/routerFixture"
], function ($, _, layout, routerService, competitionConfig, vpcService) {
    "use strict";

    var vpcmanagerCtrl = ["$timeout", "$scope", "$state", "camel", "$rootScope", "$q", "networkCommon", "$stateParams", "exception",
        function ($timeout, $scope, $state, camel, $rootScope, $q, networkCommon, $stateParams, exception) {
            var i18n = $scope.i18n;

            var HARDWARE_ROUTER = 1;
            var routerServiceIns = new routerService(exception, $q, camel);
            var vpcServiceIns = new vpcService(exception, $q, camel);

            if (!networkCommon.vpcId) {
                networkCommon.vpcId = $stateParams.vpcId;
            }
            if (!networkCommon.cloudInfraId) {
                networkCommon.cloudInfraId = $stateParams.cloud_infras;
            }
            if (!networkCommon.azId) {
                networkCommon.azId = $stateParams.azId;
            }
            if(!networkCommon.vpcName){
                networkCommon.vpcName = $stateParams.vpcName;
            }

            //url输入直接访问,获取vpc类型
            var vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;
            if(null === vpcTypeShared){
                getVPC();
            }else{
                $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;
            }

            //ICT场景下是否开启acls与vpn服务
            $scope.isSDN = competitionConfig.isSDN;
            $scope.ICT = $scope.user.cloudType === "ICT";
            $scope.IT = $scope.user.cloudType === "IT";
            $scope.id = "network-vpcmanager-layout";
            $scope.hasHardwareRouter = false;
            $scope.vpcName = networkCommon.vpcName;

            var isSC = ($scope.deployMode === 'serviceCenter');
            $scope.displayConf.summary = (isSC && $scope.displayConf.summary == 'false' ? 'false' : 'true');
            $scope.displayConf.router = (isSC && $scope.displayConf.router == 'false' ? 'false' : 'true');
            $scope.displayConf.vlb = (isSC && $scope.displayConf.vlb == 'false' ? 'false' : 'true');
            $scope.displayConf.deploymentService = (isSC && $scope.displayConf.deploymentService == 'false' ? 'false' : 'true');
            $scope.displayConf.network = (isSC && $scope.displayConf.network == 'false' ? 'false' : 'true');
            $scope.displayConf.shareVpcEip = (isSC && $scope.displayConf.shareVpcEip == 'false' ? 'false' : 'true');
            $scope.displayConf.security = (isSC && $scope.displayConf.security == 'false' ? 'false' : 'true');
            $scope.displayConf.vpn = (isSC && $scope.displayConf.vpn == 'false' ? 'false' : 'true');

            // 没有部署服务权限不显示
            var PVM_OPERATE = "557000";
            var privilegeList = $scope.user.privilegeList;
            $scope.hasPVMOperateRight = _.contains(privilegeList, PVM_OPERATE);

            $scope.id = "network-vpcmanager-layout";
            var lay = new layout({
                "id": $scope.id,
                "subheight": 50 + 58
            });
            $timeout(function() {
                var $headDom = $("#network-vpcmanager-layout").find(".tiny-layout-head");
                $headDom.prepend($('<span class="ui-icon"></span>'));
            }, 0);

            $scope.$on("$stateChangeSuccess", function () {
                if ($state.includes('network.vpcmanager.acls')) {
                    lay.opActive($("a[ui-sref='network.vpcmanager.acls']").last());
                }
                else if ($state.includes('network.vpcmanager.ictnetwork')) {
                    lay.opActive($("a[ui-sref='network.vpcmanager.ictnetwork']").last());
                }
                else {
                    if (($scope.ICT || $scope.vpcTypeShared) && $state.includes('network.vpcmanager.securitygroup')) {
                        lay.opActive($("a[ui-sref='network.vpcmanager.securitygroup']"));
                    } else {
                        var cur = $("#"+$scope.id + " .tiny-layout-west").find("a[ui-sref='" + $state.$current.name + "']").last();
                        if (cur.length > 0) {
                            lay.opActive(cur);
                        }
                    }
                }
                if ($scope.vpcTypeShared) {
                    if ($state.includes('network.vpcmanager.eip')) {
                        lay.opActive($("a[ui-sref='network.vpcmanager.eip']"));
                    }
                }
            });

            $scope.deleteBtn = {
                "id": "network-vpcmanager-delete",
                "text": i18n.common_term_delete_button,
                "click": function () {}
            };
            $scope.vpcSelect = {
                id: "network-vpcmanager-vpcSelect",
                "dftLabel": "",
                "width": "120px",
                "dftId": "",
                "values": [],
                "change": function () {
                    networkCommon.vpcId = $("#network-vpcmanager-vpcSelect").widget().getSelectedId();
                }

            };
            //判断是否有硬件路由器，没有的话将“应用层包过滤”过滤掉
            function getHardwareRouter() {
                var options = {
                    "cloudInfraId": networkCommon.cloudInfraId,
                    "azId": networkCommon.azId,
                    "vpcId": networkCommon.vpcId,
                    "vdcId": $rootScope.user.vdcId,
                    "userId": $rootScope.user.id
                };
                var deferred = routerServiceIns.queryRouter(options);
                deferred.then(function (data) {
                    if (data && data.routers && data.routers.length > 0 && data.routers[0].routerType === HARDWARE_ROUTER && data.routers[0].status === 'READY') {
                        $scope.hasHardwareRouter = true;
                    }else{
                        $scope.hasHardwareRouter = false;
                    }
                });
            }
            function getVPC() {
                var options = {
                    "cloudInfraId": networkCommon.cloudInfraId,
                    "vpcId": networkCommon.vpcId,
                    "vdcId": $rootScope.user.vdcId,
                    "userId": $rootScope.user.id
                };
                var deferred = vpcServiceIns.getVpc(options);

                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    networkCommon.vpcTypeShared = data.shared;
                    $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;

                });
            }

            $scope.$on("$viewContentLoaded", function () {
                getHardwareRouter();
            });
        }
    ];
    return vpcmanagerCtrl;
});
