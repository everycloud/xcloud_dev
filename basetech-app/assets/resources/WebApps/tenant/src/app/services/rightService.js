/**
 * @for 菜单权限配置
 * @date 14-04-29
 * @description 键名与servicePlungins中各个节点的state一致；对于父节点跟子节点的state相同，一般子节点的键名加1以区分
 * @description 键值为该节点显示需要获得的权限，空数组表示不需要权限。
 */
define(["app/services/rightConfig"], function (RIGHT_CONFIG) {
    "use strict";

    //查看app/services/rightConfig.js 中的权限字典配置各菜单的显示需要具备的权限

    var rightService = {
        //首页
        "home": [],

        //服务
        "service": [],
        //云资源
        "serviceMgr.multiPool": [],
        //云资源池
        "serviceMgr.multiPool1": [],
        //标签管理
        "serviceMgr.label": [],
        //FusionSphere级联
        "multiPool.cascade": [],

        //资源
        "resources": [],
        //导航
        "resources.navigation": [],
        //设备
        "resources.device.host": [],
        //计算设备
        "resources.device.host1": [],
        //网络设备
        "resources.device.switch": [],
        //存储设备
        "resources.device.san": [],
        //虚拟化
        "resources.hypervisor.environment": [],
        //虚拟化环境
        "resources.hypervisor.environment1": [],
        //资源集群
        "resources.hypervisor.cluster": [],
        //虚拟机
        "resources.hypervisor.vm": [],
        //磁盘
        "resources.hypervisor.disk": [],
        //资源池
        "resources.rpool.zone": [],
        //资源池管理
        "resources.rpool.manager": [],
        //云存储
        "resources.rpool.cloudStorage": [],
        //资源分区
        "resources.rpool.zone1": [],
        //模板和规格
        "resources.templateSpec.vmTemplateResources.vmTemplate": [],
        //虚拟机模板
        "resources.templateSpec.vmTemplateResources.vmTemplate1": [],
        //ISO
        "resources.templateSpec.iso": [],
        //应用模板
        "resources.templateSpec.appTemplate": [],
        //软件包
        "resources.templateSpec.software": [],
        //脚本
        "resources.templateSpec.script": [],
        //虚拟机规格
        "resources.templateSpec.vmSpec": [],
        //规格
        "resources.spec.vmSpec": [],
        //虚拟机规格
        "resources.spec.vmSpec1": [],
        //VPC规格
        "resources.spec.vpcSpec": [],

        //VDC
        "vdcMgr": [],
        //VDC
        "vdcMgr.vdc.vdcList": [],
        //VDC管理
        "vdcMgr.vdc.vdcList1": [],
        //创建VDC
        "vdcMgr.createVdc": [],
        //虚拟机
        "vdcMgr.vdc.vm": [],
        //IP带宽模板
        "vdcMgr.vdc.ipBW": [],
        //VPC
        "vdcMgr.network.summary": [],
        //网络资源
        "vdcMgr.network.list": [],
        //部署服务
        "vdcMgr.network.deployservice": [],
        //VPC规格
        "vdcMgr.vdc.vpcSpec": [],

        //用户
        "userMgr": [
            RIGHT_CONFIG.user_term_pswPolicy_label.id,
            RIGHT_CONFIG.user_term_AD_label.id,
            RIGHT_CONFIG.role_term_role_label.id,
            RIGHT_CONFIG.user_term_user_label.id,
            RIGHT_CONFIG.user_term_pswPolicy_label.id,
            RIGHT_CONFIG.domain_term_domain_label.id
        ],
        //用户
        "userMgr.user": [RIGHT_CONFIG.user_term_user_label.id],
        //创建用户
        "userMgr.createUser": [RIGHT_CONFIG.role_role_add_option_userHandle_value.id],
        //用户管理
        "userMgr.user1": [RIGHT_CONFIG.user_term_user_label.id],
        //分权分域
        "userMgr.role": [RIGHT_CONFIG.role_term_role_label.id, RIGHT_CONFIG.domain_term_domain_label.id],
        //创建角色
        "userMgr.createRole": [RIGHT_CONFIG.role_role_add_option_roleHandle_value.id],
        //角色管理
        "userMgr.role1": [RIGHT_CONFIG.role_term_role_label.id],
        //分域管理
        "userMgr.domain.user": [RIGHT_CONFIG.domain_term_domain_label.id],
        //安全认证
        "userMgr.passwordPolicy": [RIGHT_CONFIG.user_term_pswPolicy_label.id, RIGHT_CONFIG.user_term_AD_label.id],
        //密码策略
        "userMgr.passwordPolicy1": [RIGHT_CONFIG.user_term_pswPolicy_label.id],
        //第三方认证
        "userMgr.thirdParty": [RIGHT_CONFIG.user_term_AD_label.id],
        //keystone配置
        "userMgr.keystoneConfig": [],


        //监控
        "monitor": [],
        //告警
        "monitor.alarmlist": [],
        //告警列表
        "monitor.alarmsettings1": [],
        //告警设置
        "monitor.alarmsettings.mailConfig": [],
        //告警统计
        "monitor.alarmstat": [],
        //性能
        "monitor.view": [],
        //监控视图
        "monitor.view1": [],
        //报表
        "monitor.systemReport": [],
        //系统报表
        "monitor.systemReport1": [],
        //自定义报表
        "monitor.customReport": [],

        //系统
        "system": [],
        //系统配置
        "system.timeManage": [],
        //系统超时时间
        "system.systemTime": [],
        //SNMP管理站
        "system.snpManage": [],
        //备份设定
        "system.backupSetting": [],
        //系统LOGO
        "system.systemLogo": [],
        //License管理
        "system.licenseManage": [],
        //时间管理
        "system.timeManage1": [],
        //容灾管理IP
        "system.disasterManageIp": [],
        //物理机安装子网
        "system.phyNet": [],
        //部件通讯密码
        "system.sectionPassword": [],
        //计量配置
        "system.measureConfig": [],
        //桌面云地址
        "system.deskCloudAddress": [],
        //任务与日志
        "system.taskCenter": [],
        //任务中心
        "system.taskCenter1": [],
        //操作日志
        "system.operatorLog": [],
        //运行日志
        "system.runningLog": [],
        //日志配置
        "system.logConfig": []
    };


    return rightService;
});