define(['tiny-lib/jquery',
        'tiny-lib/underscore',
        "app/business/network/services/networkService",
        "app/business/network/services/router/routerService",
        'tiny-directives/Step'
    ],
    function ($, _, networkService, routerService) {
        "use strict";

        var createLinkVpnCtrl = ["$rootScope", "$scope", "$compile", "$stateParams", "$q", "camel", "exception",
            function ($rootScope, $scope, $compile, $stateParams, $q, camel, exception) {
                var i18n = $scope.i18n;
                var networkServiceIns = new networkService(exception, $q, camel);
                var routerServiceIns = new routerService(exception, $q, camel);
                var user = $("html").scope().user;

                $scope.service = {
                    "step": {
                        "id": "create-linkvpn-step",
                        "values": [i18n.common_term_basicInfo_label, i18n.vpn_term_setTunnelInfo_button, i18n.vpn_term_setLinkNegotiation_button, i18n.common_term_confirmInfo_label],
                        "width": 592,
                        "jumpable": false
                    },
                    "show": "basic",

                    // 公共服务
                    "user": $rootScope.user,
                    "cloudInfraId": $stateParams.cloudInfra,
                    "azId": $stateParams.azId,
                    "vpcId": $stateParams.vpcId,
                    "isModifyMode": ($stateParams.opt === "modify") ? true : false,
                    "type": $stateParams.type,
                    "id": $stateParams.id ? $stateParams.id : "", //修改时保存的vpn id

                    // 基本参数
                    "name": "",
                    "description": "",
                    "vpnType": $stateParams.type === "1" ? "1" : "0", //VPN类型：Vpn类型 0-Ipsec VPN (默认值) 1-L2TP over IPSEC
                    "vpnTypeUI": "",

                    /**
                     * l2tp类型公共参数
                     */
                    "l2tpInfo": {
                        "subnetAddr": "", //L2tp client可以使用的IP子网
                        "subnetMask": "", //L2tp client可以使用的IP子网掩码，范围23-28，即可用的IP地址大小13-509个
                        "oldTunnelKey": "",
                        "tunnelKey": "", //隧道加密密码，必须包含以下四类字符中的三类：大写字母、小写字母、数字、除？外的特殊字符，长度范围是8~16。 , 创建和更新VPN连接时为密文,查询不返回该字段，采用RSA加密算法
                        "vpnUsers": [] //允许接入的用户列表  "name":L2TP client登陆时的用户名，由字母字符、数字、下划线组成，长度范围是1~16。注：用户名在一个物理防火墙上要唯一，不允许重名。
                        // "password":L2TP client登陆时的密码，必须包含字母、数字、除？外的特殊字符，长度范围是8~16。, 创建和更新VPN连接时为密文,查询不返回该字段，采用RSA加密算法
                    },

                    "ikeSharedKey": "", //预共享密码 (鉴权方式=0时密码)，密码长度1-127字节，由字母字符、数字、除‘, ", \, ?外的特殊字符(注：不支持单引号‘，双引号“，斜杠\，问号？)组成
                    "oldIkeSharedKey": "",
                    /**
                     * IPSec 类型公共参数
                     */
                    "customerGw": {
                        "ipAddr": "",
                        "customerSubnets": [{
                            "subnetAddr": "",
                            "subnetMask": "",
                            "subnetAddrId": "subnetAddr0",
                            "subnetMaskId": "subnetMask0"
                        }]
                    }, //远端网关信息
                    "networkIDs": [], //本端网络ID列表
                    "selectedNets": [], //选中的网络列表
                    "pfsGroup": "DH2", //ESP策略DH算法，可用的有：”DH2”，”DH5”，默认算法为DH2
                    "lifeTime": "3600", // ESP SA生命周期，重新协商周期，单位秒，默认3600S（1H），范围<480~86400（24H）>

                    "totalSubnetNum": 1, //累计添加的子网数

                    // 接入用户信息
                    "users": [{
                        "userName": "",
                        "pwd": "",
                        "oldPwd": "",
                        "repwd": "",
                        "userNameId": "userNameId0",
                        "pwdId": "pwdId0",
                        "oldPwdId": "oldPwdId0",
                        "pwdConfirmId": "pwdConfirmId0",
                        "texttype": "password",
                        "pwdChangeBoxId": "pwdChangeBoxId0",
                        "pwdChangeBoxText": i18n.vpn_connect_add_para_modifyPsw_label,
                        "canChangeUserPwd": true
                    }],
                    "totalUserNum": 1 //累计添加用户数
                };

                // 事件定义 IPSec类型 基本的下一步需要查询相关路由信息
                $scope.events = {
                    "ipSecBasicNext": "ipSecBasicNex",
                    "ipSecBasicNextFromParent": "ipSecBasicNexFromParent"
                };

                // 事件转发
                $scope.$on($scope.events.ipSecBasicNext, function (event, msg) {
                    $scope.$broadcast($scope.events.ipSecBasicNextFromParent, msg);
                });

                // 对于创建链接VPN，软件类型的路由器只能创建IPSEC类型的VPN
                if (!$scope.service.isModifyMode) {
                    var params = {
                        "cloudInfraId": $scope.service.cloudInfraId,
                        "vpcId": $scope.service.vpcId,
                        "azId": $scope.service.azId,
                        "vdcId": user.vdcId,
                        "userId": user.id
                    };
                    var deferred = routerServiceIns.queryRouter(params);
                    deferred.then(function (data) {
                        if (!data || !data.routers || data.routers.length <= 0) {
                            return;
                        }
                        // 对于软件类型的路由器，只能创建IPSEC类型的VPN
                        if (data.routers[0].routerType === 2) {
                            $scope.service.type = 0;
                        }
                    });
                }
                //对于修改需要查询好初始参数并展现在页面上
                if ($scope.service.isModifyMode) {
                    var options = {
                        "cloudInfraId": $scope.service.cloudInfraId,
                        "vpcId": $scope.service.vpcId,
                        "vdcId": user.vdcId,
                        "id": $scope.service.id,
                        "userId": user.id
                    };
                    var deferred2 = networkServiceIns.querySingleVpnConnection(options);
                    deferred2.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var vpnLinkDetail = data;
                        $scope.service.name = vpnLinkDetail.name;
                        $scope.service.description = vpnLinkDetail.description;
                        $scope.service.vpnType = vpnLinkDetail.vpnType;
                        $scope.service.l2tpInfo = vpnLinkDetail.l2tpInfo;
                        if ($scope.service.l2tpInfo && $scope.service.l2tpInfo.vpnUsers) {
                            var users = $scope.service.l2tpInfo.vpnUsers;
                            for (var i = 0; i < users.length; i++) {
                                users[i].userName = users[i].name;
                                _.extend(users[i], {
                                    "userNameId": "userNameId" + i,
                                    "pwdId": "pwdId" + i,
                                    "oldPwdId": "oldPwdId" + i,
                                    "pwdConfirmId": "pwdConfirmId" + i,
                                    "texttype": "password",
                                    "isDefault": true,
                                    "pwdChangeBoxId": "pwdChangeBoxId" + i,
                                    "pwdChangeBoxText": i18n.vpn_connect_add_para_modifyPsw_label,
                                    "canChangeUserPwd": false
                                });
                            }
                            $scope.service.totalUserNum = users.length;
                            $scope.service.users = users;
                        }
                        $scope.service.customerGw = vpnLinkDetail.customerGw;
                        if ($scope.service.customerGw && $scope.service.customerGw.customerSubnets) {
                            var subnets = $scope.service.customerGw.customerSubnets;
                            for (var k = 0; k < subnets.length; k++) {
                                _.extend(subnets[k], {
                                    "subnetAddrId": "subnetAddr" + k,
                                    "subnetMaskId": "subnetMask" + k
                                });
                            }
                            $scope.service.totalSubnetNum = subnets.length;
                        }
                        $scope.service.networkIDs = vpnLinkDetail.networkIDs;
                        $scope.service.pfsGroup = vpnLinkDetail.pfsGroup;
                        $scope.service.lifeTime = vpnLinkDetail.lifeTime;
                    });
                }
            }
        ];

        return createLinkVpnCtrl;
    }
);
