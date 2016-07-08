/**
 * 提供菜单注册的所有服务
 */
define([
    "app/services/rightConfig",
    "app/services/competitionConfig",
    "language/keyID",
    "tiny-lib/underscore"], function (RIGHT_CONFIG, Competition, i18n, _) {
    "use strict";

    /*
     //节点说明
     var node = {
     text: "", //节点文案
     type: "", //节点文案
     state: "", //点击动作目的地，叶子节点包含
     openState: "", //只有根节点才会生效，该节点默认打开指定的子节点state
     children: [], //子节点（树枝节点包含）
     right: [], //该节点在哪些场景下可见，空数组表示，不需要场景控制，仅叶子节点需要设置该属性，父节点根据直接叶子节点是否可见来判定
     scene: [], //该节点显示需要的权限id数组，空数组表示，不需要权限控制，仅叶子节点需要设置改属性，父节点根据直接叶子节点是否有权限来判定
     hide: boolean  //可优先手动是否暂时不显示，比如开发中的，自动计算发现该节点不可见的时候也为true
     }
     */

    var SCENE_CONFIG = {
        itAllInOneTenant: {
            val: "FUSIONSPHERE_allInOne",
            desc: "it场景下,allinone部署方式，对应tenant"
        },
        itTopTenant: {
            val: "FUSIONSPHERE_top",
            desc: "it场景下,top部署方式，对应tenant"
        },
        ictAllInOneTenant: {
            val: "OPENSTACK_allInOne",
            desc: "ict场景下,allinone部署方式，对应tenant"
        },
        ictTopTenant: {
            val: "OPENSTACK_top",
            desc: "iCt场景下,top部署方式，对应tenant"
        },
        itServiceCenterTenant: {
            val: "FUSIONSPHERE_serviceCenter",
            desc: "it场景下,serviceCenter部署方式，对应tenant"
        },
        ictServiceCenterTenant: {
            val: "OPENSTACK_serviceCenter",
            desc: "iCt场景下,serviceCenter部署方式，对应tenant"
        }
    };

    var plugins = [
        {
            //首页
            "text": i18n.common_term_homePage_label || "首页",
            "state": "home",
            "openState": "home",
            right: [],
            scene: []
        },
        {
            //服务
            "text": i18n.service_term_service_label || "服务",
            "state": "ssp",
            "openState": "ssp.catalog",
            "children": [
                {
                    "text": i18n.service_term_service_label || "服务",
                    "children": [
                        {
                            "text": i18n.service_term_catalog_label || "服务目录",
                            "state": "ssp.catalog",
                            "right": [RIGHT_CONFIG.role_role_add_option_catalogView_value.id],
                            "scene": [
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.service_term_serviceInstance_label || "服务实例",
                            "state": "ssp.instance.myInstance",
                            "right": [RIGHT_CONFIG.role_role_add_option_serInstanceView_value.id],
                            "scene": [
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        }
                    ]
                },
                {
                    "text": i18n.common_term_apply_button || "申请",
                    "children": [
                        {
                            "text": i18n.service_term_doApproval_label || "待办审批",
                            "state": "ssp.order.approval",
                            "right": [RIGHT_CONFIG.role_role_add_option_orderApproval_value.id],
                            "scene": [
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.service_term_serviceApplicationWorkOrder_label || "申请单",
                            "state": "ssp.order.apply",
                            "right": [],
                            "scene": [
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //资源
            "text": i18n.common_term_resources_label || "资源",
            "state": "ecs",
            "openState": "ecs.navigate",
            "children": [
                {
                    //导航
                    text: i18n.common_term_navigation_label || "导航",
                    state: "ecs.navigate",
                    right: [
                        RIGHT_CONFIG.common_term_check_button.id,
                        RIGHT_CONFIG.common_term_create_button.id,
                        RIGHT_CONFIG.role_role_add_option_serverView_value.id,
                        RIGHT_CONFIG.role_role_add_option_diskView_value.id
                    ],
                    scene: []
                },
                {
                    "text": i18n.common_term_compute_label || "计算",
                    "children": [
                        {
                            "text": i18n.common_term_vms_label || "虚拟机",
                            "state": "ecs.vm",
                            "right": [RIGHT_CONFIG.common_term_vm_label.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.server_term_server_label,
                            "state": "ecs.host",
                            "right": [RIGHT_CONFIG.common_term_vm_label.id],
                            "scene": [
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        }
                    ]
                },
                {
                    "text": i18n.common_term_storage_label || "存储",
                    "children": [
                        {
                            "text": i18n.common_term_disks_label || "磁盘",
                            "state": "ecs.storage.disk",
                            "right": [RIGHT_CONFIG.role_role_add_option_diskView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.common_term_diskSnap_label || "磁盘快照",
                            "state": "ecs.storage.snapshot",
                            "right": [RIGHT_CONFIG.role_role_add_option_snapshotView_value.id],
                            "scene": [
                                SCENE_CONFIG.ictAllInOneTenant.val,
                    SCENE_CONFIG.ictTopTenant.val
                            ]
                        }
                    ]
                },
                {
                    "text": i18n.template_term_template_label || "模板",
                    "children": [
                        {
                            "text": i18n.template_term_template_label || "模板",
                            "state": "ecs.vmTemplateList",
                            "right": [RIGHT_CONFIG.template_term_vm_label.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                    SCENE_CONFIG.itTopTenant.val,
                                    SCENE_CONFIG.ictAllInOneTenant.val,
                                    SCENE_CONFIG.ictTopTenant.val,
                                    SCENE_CONFIG.itServiceCenterTenant.val,
                                    SCENE_CONFIG.ictServiceCenterTenant.val
                                ]
                        },
                        {
                            "text": i18n.template_term_softwares_label || "软件包",
                            "state": "ecs.commonPackageList",
                            "right": [RIGHT_CONFIG.role_role_add_option_softwareView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.template_term_script_label || "脚本",
                            "state": "ecs.commonScriptList",
                            "right": [RIGHT_CONFIG.role_role_add_option_scriptView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //VPC
            "text": i18n.vpc_term_vpc_label || "VPC",
            "state": "network",
            "openState": "network.manager.myVPClist",
            "children": [
                {
                    "text": i18n.vpc_term_vpcMgr_label || "VPC管理",
                    "children": [
                        {
                            "text": i18n.vpc_term_myVPC_label || "我的VPC",
                            "state": "network.manager.myVPClist",
                            "right": [RIGHT_CONFIG.vpc_term_vpc_label_view.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.common_term_shareVPC_label || "共享VPC",
                            "state": "network.manager.pubVPClist",
                            "right": [RIGHT_CONFIG.vpc_term_vpc_label_view.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.org_term_entrustedMgmtEntitlement_label || "代管授权",
                            "state": "network.manager.vpcAuth",
                            "right": [RIGHT_CONFIG.vpc_term_vpc_label_view.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //应用
            "text": i18n.app_term_app_label || "应用",
            "state": "application",
            "hide":!!Competition.isBaseOnVmware,
            "openState": "application.manager.overview",
            "children": [
                {
                    "text": i18n.app_term_appMgr_label || "应用管理",
                    "children": [
                        {
                            "text": i18n.app_term_appSummary_label || "应用概览",
                            "state": "application.manager.overview",
                            "right": [RIGHT_CONFIG["role_role_add_option_appTemplateView_value.302001"].id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.template_term_app_label || "应用模板",
                            "state": "application.manager.template",
                            "right": [RIGHT_CONFIG["role_role_add_option_appTemplateView_value.302001"].id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.app_term_appInstance_label || "应用实例",
                            "state": "application.manager.instance",
                            "right": [RIGHT_CONFIG.role_role_add_option_appInstanceView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        }
                    ]
                },
                {
                    "text": i18n.app_term_policy_label || "策略管理",
                    "children": [
                        {
                            "text": i18n.app_term_schedule_label || "计划任务",
                            "state": "application.manager.policy.plan",
                            "right": [RIGHT_CONFIG.app_term_schedule_label.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.app_term_policyLog_label || "策略日志",
                            "state": "application.manager.policy.log",
                            "right": [RIGHT_CONFIG.app_term_policyLog_label.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //监控
            "text": i18n.common_term_monitor_label || "监控",
            "state": "monitor",
            "openState": "monitor.alarmlist",
            "children": [
                {
                    "text": i18n.alarm_term_alarms_label || "告警",
                    "children": [
                        {
                            "text": i18n.common_term_alarmList_label || "告警列表",
                            "state": "monitor.alarmlist",
                            right: [RIGHT_CONFIG.role_role_add_option_alarmView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.common_term_alarmSet_label || "告警设置",
                            "state": "monitor.alarmsettings.mailConfig",
                            right: [RIGHT_CONFIG.role_role_add_option_alarmHandle_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.common_term_alarmStatistic_label || "告警统计",
                            "state": "monitor.alarmstat",
                            right: [RIGHT_CONFIG.role_role_add_option_alarmView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val
                            ]
                        }]
                },
                {
                    "text": i18n.perform_term_perform_label || "性能",
                    "hide": Competition.isBaseOnVmware,
                    "children": [{
                        "text": i18n.common_term_monitorView_label || "监控视图",
                        "state": "monitor.view",
                        right: [RIGHT_CONFIG.perform_term_monitor_label.id],
                        "scene": [
                            SCENE_CONFIG.itAllInOneTenant.val,
                            SCENE_CONFIG.itTopTenant.val,
                            SCENE_CONFIG.ictAllInOneTenant.val,
                            SCENE_CONFIG.ictTopTenant.val,
                            SCENE_CONFIG.itServiceCenterTenant.val,
                            SCENE_CONFIG.ictServiceCenterTenant.val
                        ]
                    }]
                },
                {
                    "text": i18n.task_term_taskAndLog_label || "任务与日志",
                    "children": [
                        {
                            "text": i18n.task_term_taskCenter_label || "任务中心",
                            "state": "monitor.taskcenter",
                            "right": [RIGHT_CONFIG.task_term_task_label_tenant.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            "text": i18n.log_term_operation_label || "操作日志",
                            "state": "monitor.oplog",
                            "right": [RIGHT_CONFIG.log_term_operation_label.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        }
                    ]
                }
            ]
        },
        {
            //用户
            "text": i18n.common_term_users_label || "用户",
            "state": "userMgr",
            "openState": "userMgr.user",
            children: [
                {
                    //用户
                    text: i18n.common_term_user_label || "用户",
                    children: [
                        {
                            //用户管理
                            text: i18n.user_term_user_label || "用户管理",
                            state: "userMgr.user",
                            right: [RIGHT_CONFIG.role_role_add_option_userView_value.id],
                            //all
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        }
                    ]
                },
                {
                    //分权分域
                    text: i18n.common_term_rightAndArea_label || "分权分域",
                    children: [
                        {
                            //角色管理
                            text: i18n.role_term_role_label || "角色管理",
                            state: "userMgr.role",
                            right: [RIGHT_CONFIG.role_role_add_option_roleView_value.id],
                            //all
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val,
                                SCENE_CONFIG.ictAllInOneTenant.val,
                                SCENE_CONFIG.ictTopTenant.val,
                                SCENE_CONFIG.itServiceCenterTenant.val,
                                SCENE_CONFIG.ictServiceCenterTenant.val
                            ]
                        },
                        {
                            //分域管理
                            text: i18n.domain_term_domain_label || "分域管理",
                            state: "userMgr.domain.user",
                            right: [RIGHT_CONFIG.role_role_add_option_domainView_value.id],
                            "scene": [
                                SCENE_CONFIG.itAllInOneTenant.val,
                                SCENE_CONFIG.itTopTenant.val
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    var hasRights = function (privilegeList, rights) {
        return !rights || !rights.length || _.intersection(privilegeList, rights).length;
    };
    var needInScene = function (sceneList, scene) {
        return !sceneList || !sceneList.length || _.contains(sceneList, scene);
    };

    var createNode = function (node, scene, privilegeList) {
        var children = node.children;
        if (children) {
            var hide = true;
            for (var i = 0, len = children.length; i < len; i++) {
                children[i] = createNode(children[i], scene, privilegeList);
                //只要有一个子节点hide不为true，父节点的hide就不为true
                !node.hide && (hide = !!(hide && children[i].hide));
                //数字节点需要state的时候，拿第一个子节点的state使用
                !node.state && !children[i].hide && (node.state = children[i].state);
            }
            node.hide = hide;
        } else {
            var rightList = node.right || [];
            var sceneList = node.scene || [];
            var showByScene = needInScene(sceneList, scene);
            var showByRight = showByScene && hasRights(privilegeList, rightList);
            //sc安装方式暂时这样添加上
            if (!(showByRight && showByScene)) {
                node.hide = true;
            }
        }

        return node;
    };

    function ServicePlugins() {
        this.plugins = function (icOrIct, deployMode, user) {
            var scene = icOrIct + "_" + deployMode;
            var plugin = null;
            var newPlugins = [];
            var i = 0;
            var length = 0;

            // SC自助申请VDC场景，不显示首页
            if (user.vdcId === "-1") {
                i = 1;
            }
            for (length = plugins.length; i < length; i = i + 1) {
                if (Competition.isBaseOnVmware && plugins[i].state === "application") {
                    continue;
                }
                plugin = createNode(plugins[i], scene, user.privilegeList);
                if (plugin) {
                    newPlugins.push(plugin);
                }
            }
            for(var i = 0;i<newPlugins.length;i++)
            {
                if(!newPlugins[i].hide && newPlugins[i].children)
                {
                    for(var j = 0;j<newPlugins[i].children.length;j++)
                    {
                        if(!newPlugins[i].children[j].hide)
                        {
                            newPlugins[i].openState = newPlugins[i].children[j].state;
                            break;
                        }
                    }
                }
            }

            return newPlugins;
        };
    }

    return ServicePlugins;
});
