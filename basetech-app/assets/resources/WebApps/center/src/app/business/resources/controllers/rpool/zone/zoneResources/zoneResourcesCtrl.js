/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Layout",
    "app/services/rightConfig",
    "app/services/sceneConfig"
], function ($, angular, Layout, RIGHT_CONFIG, SCENE_CONFIG) {
    "use strict";

    var zoneResourcesCtrl = ["$scope", "$state", "$stateParams", "camel", "$rootScope", function ($scope, $state, $stateParams, camel, $rootScope) {
        var i18n = $scope.i18n;
        var DEFAULT_ZONE_SCENE = [
            SCENE_CONFIG.itAllInOne.val,
            SCENE_CONFIG.itLocal.val,
            SCENE_CONFIG.ictAllInOne.val,
            SCENE_CONFIG.ictLocal.val
        ];
        $scope.layoutInfo = {
            "zoneID": $stateParams.id,
            "zoneName": $stateParams.name
        };
        $scope.right = {
            hasNetPoolOperateRight: $rootScope.user.privilege.role_role_add_option_netPoolHandle_value,
            hasServiceVMOperateRight: $rootScope.user.privilege.role_role_add_option_ServiceVMHandle_value,
            hasDeviceViewRight: $rootScope.user.privilege.role_role_add_option_deviceView_value
        };
        $scope.leftTree = {
            //资源分区
            children: [],
            text: i18n.resource_term_zone_label
        };
        var zonePlugins = [
            {
                //概览
                text: i18n.common_term_overview_label || "概览",
                state: "resources.zoneResources.summary.zoneSummary",
                right: [RIGHT_CONFIG.role_role_add_option_zoneView_value.id],
                scene: DEFAULT_ZONE_SCENE
            },
            {
                //可用分区
                text: i18n.resource_term_Azs_label || "可用分区",
                state: "resources.zoneResources.availableZone",
                right: [RIGHT_CONFIG["role_role_add_option_AZView_value.601001"].id],
                scene: DEFAULT_ZONE_SCENE
            },
            {
                //计算资源池
                text: i18n.resource_term_computePools_label || "计算资源池",
                state: "resources.zoneResources.computing",
                right: [RIGHT_CONFIG.role_role_add_option_clusterView_value.id],
                scene: DEFAULT_ZONE_SCENE
            },
            {
                //物理资源池
                text: i18n.resource_term_serverPool_label || "物理资源池",
                hide: true,
                state: "resources.zoneResources.physical.dedicatedServers",
                right: [RIGHT_CONFIG.role_role_add_option_serverPoolView_value.id],
                scene: DEFAULT_ZONE_SCENE
            },
            {
                //存储资源池
                text: i18n.resource_term_storagePools_label || "存储资源池",
                state: "resources.zoneResources.storage.mainStorage",
                right: [RIGHT_CONFIG.role_role_add_option_storagePoolView_value.id],
                scene: DEFAULT_ZONE_SCENE
            },
            {
                //网络资源池
                text: i18n.resource_term_netPools_label || "网络资源池",
                children: [
                    {
                        //概览
                        text: i18n.common_term_overview_label || "概览",
                        state: "resources.zoneResources.networkSummary",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //DVS
                        text: i18n.resource_term_dvses_label || "DVS",
                        state: "resources.zoneResources.dvs",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //VLAN池
                        text: i18n.resource_term_vlanPools_label || "VLAN池",
                        state: "resources.zoneResources.vlanPool.vlan",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //外部网络
                        text: i18n.resource_term_externalNets_label || "外部网络",
                        state: "resources.zoneResources.externalNetwork.extNetwork",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //公网IP
                        text: i18n.vpc_term_publicIPpool_label || "公网IP",
                        state: "resources.zoneResources.publicIP",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //VSA网络
                        text: i18n.resource_term_VSAnetworks_label || "VSA网络",
                        state: "resources.zoneResources.vsaNetwork.vsaManagerNetwork",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //虚拟防火墙
                        text: i18n.resource_term_vFWs_label || "虚拟防火墙",
                        state: "resources.zoneResources.virtualFirewall.hardwareFirewall",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    },
                    {
                        //VLB
                        text: i18n.lb_term_vlb_label || "VLB",
                        state: "resources.zoneResources.vlbPool",
                        right: [RIGHT_CONFIG.role_role_add_option_netPoolView_value.id],
                        scene: DEFAULT_ZONE_SCENE
                    }
                ]
            },
            {
                //系统服务虚拟机
                text: i18n.resource_term_ServiceVM_label || "系统服务虚拟机",
                state: "resources.zoneResources.systemVms",
                right: [RIGHT_CONFIG.common_term_check_button.id],
                scene: DEFAULT_ZONE_SCENE
            }
        ];

        $scope.leftTree.children = $("html").scope().getLeftTree(zonePlugins);
        $scope.icon = "../theme/default/images/resource-partitions.png";

    }];
    return zoneResourcesCtrl;
});
