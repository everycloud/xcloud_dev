/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改时间：14-3-4

 */
define(['jquery',
    'tiny-lib/angular',
    "tiny-common/UnifyValid",
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService"],
    function ($, angular, UnifyValid, constants, deviceConstants, ExceptionService) {
        "use strict";

        var addLoadBalancerCtrl = ["$scope", "$compile", "$state", "camel", "validator", "$rootScope", function ($scope, $compile, $state, camel, validator, $rootScope) {
            $scope.cloudType = $rootScope.user.cloudType;
            $scope.showBasicInfoPage = true;
            $scope.showBusinessConfigPage = false;
            $scope.showConfirmInfoPage = false;

            $scope.addLoadBalancerStep1 = {
                "url": "../src/app/business/resources/views/device/balance/addLoadBalancer/basicInfo.html"
            };
            $scope.addLoadBalancerStep2 = {
                "url": "../src/app/business/resources/views/device/balance/addLoadBalancer/businessConfig.html"
            };
            $scope.addLoadBalancerStep3 = {
                "url": "../src/app/business/resources/views/device/balance/addLoadBalancer/confirmInfo.html"
            };

            $scope.addLoadBalancerStep = {
                "id": "addLoadBalancerStepId",
                "jumpable": "true",
                "values": [$scope.i18n.common_term_basicInfo_label, $scope.i18n.common_term_serviceCfg_label, $scope.i18n.common_term_confirmInfo_label],
                "width": "600"
            };
            $scope.formfieldWidth ="215px";

            UnifyValid.infoPwdEqual = function () {
                if ($("#" + $scope.basicInfo.password.id).widget().getValue() === $("#" + $scope.basicInfo.passwordConfirm.id).widget().getValue()) {
                    return true;
                } else {
                    return false;
                }
            };

            //冲突检测数据模型
            $scope.checkModel = {
                "deviceType": 4,
                "roomName": "",
                "rackId": "",
                "subRackId": ""
            };

            $scope.createInfo = {
                "deviceIp": "",
                "peerIp": "",
                "portName": "",
                "zoneName": "",
                "roomName": "",
                "rackName": "",
                "subRackName": "",
                "description": "",
                "accessPara": {},
                "businessCfg": {}
            };
            //基本信息页面
            $scope.basicInfo = {
                ip: {
                    "id": "ip",
                    "label": $scope.i18n.common_term_IP_label + ":",
                    "require": "true",
                    "value": "",
                    "width": "215px",
                    "tips": $scope.i18n.device_lb_connect_para_IP_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                peerIp: {
                    "id": "peerIp",
                    "label": $scope.i18n.common_term_pairIP_label + ":",
                    "require": "false",
                    "value": "",
                    "tips": $scope.i18n.device_lb_connect_para_pairIP_mean_tip,
                    "width": "215px"
                },
                protocol: {
                    "id": "protocol",
                    "width": "215px",
                    "label": $scope.i18n.device_term_connectProtocol_label + ":",
                    "require": false,
                    "value": "HTTPS"
                },
                portId: {
                    "id": "portId",
                    "label": $scope.i18n.common_term_port_label + ":",
                    "require": "true",
                    "value": "443",
                    "width": "215px",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid +
                        ";maxValue(65535):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535}) + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, {1: '0', 2: 65535})
                },
                zone: {
                    "label": $scope.i18n.resource_term_zone_label + ":",
                    "require": "true",
                    "values": [],
                    "value": "",
                    "width": "215px",
                    "height": 290,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                room: {
                    "id": "room",
                    "label": $scope.i18n.device_term_room_label + ":",
                    "values": [],
                    "valuesFrom": "local",
                    "matchMethod": "any-nocap",
                    "width": "215px",
                    "tooltip": $scope.i18n.device_term_inputOrSelectRoomName_label,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}),
                    "require": "true",
                    "select": function () {
                        var selectRoomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $("#" + $scope.basicInfo.cabinet.id).widget().option("value", "");
                        $scope.operate.getCabinet(selectRoomName);
                    }
                },
                cabinet: {
                    "id": "cabinet",
                    "label": $scope.i18n.device_term_cabinet_label + ":",
                    "require": "true",
                    "values": [],
                    "valuesFrom": "local",
                    "matchMethod": "any-nocap",
                    "width": "215px",
                    "height": 290,
                    "tooltip": $scope.i18n.device_term_inputOrSelectCabName_label,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                },
                subrack: {
                    "id": "subrack",
                    "label": $scope.i18n.device_term_subrack_label + ":",
                    "require": "true",
                    "value": "",
                    "width": "215px",
                    "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256}) + $scope.i18n.common_term_composition2_valid,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";regularCheck(" + validator.deviceName + "):" +
                        $scope.i18n.common_term_composition2_valid + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: 1, 2: 256})
                },
                username: {
                    "id": "username",
                    "label": $scope.i18n.common_term_userName_label + ":",
                    "require": "true",
                    "value": "",
                    "width": "215px",
                    "tips": $scope.i18n.device_lb_connect_para_userName_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                password: {
                    "label": $scope.i18n.common_term_psw_label + ":",
                    "require": "true",
                    "id": "password",
                    "type": "password",
                    "value": "",
                    "width": "215px",
                    "tips": $scope.i18n.device_lb_connect_para_psw_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                },
                passwordConfirm: {
                    "label": $scope.i18n.common_term_PswConfirm_label + ":",
                    "require": "true",
                    "id": "pwdConfirm",
                    "type": "password",
                    "value": "",
                    "width": "215px",
                    "extendFunction": ["infoPwdEqual"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";infoPwdEqual:" + $scope.i18n.common_term_pswDifferent_valid
                },
                description: {
                    "id": "description",
                    "label": $scope.i18n.common_term_desc_label + ":",
                    "type": "multi",
                    "width": "215px",
                    "height": "40px",
                    "require": "false",
                    "value": "",
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 1024})
                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //信息校验
                        var result = UnifyValid.FormValid($("#addLoadBalancerBasicInfo"));
                        if (!result) {
                            return;
                        }
                        //基本信息
                        $scope.createInfo.deviceIp = $("#" + $scope.basicInfo.ip.id).widget().getValue();
                        $scope.createInfo.peerIp = $("#" + $scope.basicInfo.peerIp.id).widget().getValue();
                        $scope.createInfo.roomName = $("#" + $scope.basicInfo.room.id).widget().getValue();
                        $scope.checkModel.roomName = $scope.createInfo.roomName;
                        $scope.createInfo.rackName = $("#" + $scope.basicInfo.cabinet.id).widget().getValue();
                        $scope.checkModel.rackId = $scope.createInfo.rackName;
                        $scope.createInfo.subRackName = $("#" + $scope.basicInfo.subrack.id).widget().getValue();
                        $scope.checkModel.subRackId = $scope.createInfo.subRackName;
                        $scope.createInfo.accessPara.protocol = "3";
                        $scope.createInfo.accessPara.port = $("#" + $scope.basicInfo.portId.id).widget().getValue();
                        $scope.createInfo.accessPara.userName = $("#" + $scope.basicInfo.username.id).widget().getValue();
                        $scope.createInfo.accessPara.passWord = $("#" + $scope.basicInfo.password.id).widget().getValue();
                        $scope.createInfo.description = $("#" + $scope.basicInfo.description.id).widget().getValue();
                        $scope.operate.checkCollision($scope.checkModel);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.balance")
                    }
                }
            };
            //业务配置页面
            $scope.businessConfig = {
                interfaceType: {
                    "label": $scope.i18n.device_term_servicePortType_label + ":",
                    "require": "false",
                    "id": "interfaceType",
                    "values": [
                        {
                            selectId: 'Interface',
                            label: 'Interface',
                            checked: true
                        },
                        {
                            selectId: 'Trunk',
                            label: 'Trunk'
                        }
                    ],
                    "width": "215px",
                    "tips": $scope.i18n.device_lb_connect_para_servicePortType_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                interfaceName: {
                    "id": "interfaceName",
                    "label": $scope.i18n.device_term_servicePortName_label + ":",
                    "require": "true",
                    "value": "",
                    "tips": $scope.i18n.device_lb_connect_para_servicePortName_mean_tip,
                    "validate": "required:" + $scope.i18n.common_term_null_valid
                },
                maxThroughput: {
                    "id": "maxThroughput",
                    "label": $scope.i18n.device_term_resourcePoolMaxThroughput_label + "(Kbps):",
                    "require": "true",
                    "value": "1000000",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(0):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: '0', 2: 10000000}) + ";maxValue(10000000):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: '0', 2: 10000000})
                },
                threshold: {
                    "id": "threshold",
                    "label": $scope.i18n.device_term_LBresourceAlarmThreshold_label + "(%)：",
                    "require": "true",
                    "value": "",
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";integer:" + $scope.i18n.common_term_invalidNumber_valid + ";minValue(1):" +
                        $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 100}) + ";maxValue(100):" + $scope.i18n.sprintf($scope.i18n.common_term_range_valid, {1: 1, 2: 100})
                },
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = true;
                        $scope.showBusinessConfigPage = false;
                        $scope.showConfirmInfoPage = false;
                        $("#addLoadBalancerStepId").widget().pre();
                    }

                },
                nextBtn: {
                    "id": "nextBtn",
                    "text": $scope.i18n.common_term_next_button,
                    "click": function () {
                        //信息校验
                        var result = UnifyValid.FormValid($("#addLoadBalancerBusinessConfig"));
                        if (!result) {
                            return;
                        }
                        //基本信息
                        $scope.createInfo.businessCfg.businessInterfaceType = $("#" + $scope.businessConfig.interfaceType.id).widget().getSelectedId();
                        $scope.createInfo.businessCfg.businessInterfaceName = $("#" + $scope.businessConfig.interfaceName.id).widget().getValue();
                        $scope.createInfo.businessCfg.maxConcurrentConnect = 200;
                        $scope.createInfo.businessCfg.maxThroughutCapacity = $("#" + $scope.businessConfig.maxThroughput.id).widget().getValue();
                        $scope.createInfo.businessCfg.resouceAlarmThreshold = $("#" + $scope.businessConfig.threshold.id).widget().getValue();

                        $scope.showBasicInfoPage = false;
                        $scope.showBusinessConfigPage = false;
                        $scope.showConfirmInfoPage = true;
                        $("#addLoadBalancerStepId").widget().next();
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.balance")
                    }
                }

            };

            //确认页面
            $scope.confirmInfo = {
                preBtn: {
                    "id": "preBtn",
                    "text": $scope.i18n.common_term_back_button,
                    "click": function () {
                        $scope.showBasicInfoPage = false;
                        $scope.showBusinessConfigPage = true;
                        $scope.showConfirmInfoPage = false;
                        $("#addLoadBalancerStepId").widget().pre();
                    }
                },
                okBtn: {
                    "id": "okBtn",
                    "text": $scope.i18n.common_term_complete_label,
                    "click": function () {
                        $scope.operate.addLoadBalancer($scope.createInfo);
                    }
                },
                cancelBtn: {
                    "id": "cancelBtn",
                    "text": $scope.i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("resources.device.balance")
                    }
                }
            };
            $scope.operate = {
                initZone: function () {
                    //查询构造zone信息
                    var queryConfig = constants.rest.ZONE_QUERY;
                    var deferred = camel.get({
                        url: {s: queryConfig.url, o: {"tenant_id": "1"}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var zones = response.zones;
                        var availableZones = [];
                        for (var index in zones) {
                            var availableZone = {
                                "id": zones[index].name,
                                "name": zones[index].name,
                                "checked": index == 0
                            };
                            availableZones.push(availableZone);
                        }
                        $scope.basicInfo.zone.values = availableZones;
                        $scope.$digest();
                    })
                },
                initRoom: function () {
                    //查询构造机房信息
                    var config = deviceConstants.rest.ROOM_QUERY;
                    var deferred = camel.get({
                        url: {s: config.url, o: {"start": "", "limit": "", "room_name": ""}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var rooms = response.roomList;
                        var availableRooms = [];
                        for (var index in rooms) {
                            availableRooms.push(rooms[index].roomName);
                        }
                        //延时一会，防止控件还没有生产
                        setTimeout(function () {
                            $("#" + $scope.basicInfo.room.id).widget().option("values", availableRooms);
                        }, 1000);
                    });
                },
                getCabinet: function (roomName) {
                    var config = deviceConstants.rest.CABINET_QUERY_BY_ROOM;
                    var deferred = camel.get({
                        "url": {s: config.url, o: {"room_name": roomName, "start": "", "limit": "", "sort": "", "order": ""}},
                        "userId": $rootScope.user.id
                    });
                    deferred.done(function (response) {
                        var racks = response.rackList;
                        var availableRacks = [];
                        for (var index in racks) {
                            availableRacks.push(racks[index].rackName);
                        }
                        $("#" + $scope.basicInfo.cabinet.id).widget().option("values", availableRacks);
                    });
                },
                //检查设备冲突
                checkCollision: function (params) {
                    var checkConfig = deviceConstants.rest.DEVICE_COLLISION
                    var deferred = camel.post({
                        "url": checkConfig.url,
                        "type": checkConfig.type,
                        "userId": $rootScope.user.id,
                        "params": JSON.stringify(params)
                    });
                    deferred.done(function (response) {
                        $scope.$apply(function () {
                            $scope.showBasicInfoPage = false;
                            $scope.showBusinessConfigPage = true;
                            $scope.showConfirmInfoPage = false;
                            $("#addLoadBalancerStepId").widget().next();
                        })
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                },
                addLoadBalancer: function (params) {
                    var addConfig = deviceConstants.rest.LOAD_BALANCER_ADD;
                    var deferred = camel.post({
                        "url": addConfig.url,
                        "type": addConfig.type,
                        "userId": $rootScope.user.id,
                        "params": JSON.stringify(params),
                        "timeout": 60000
                    });
                    deferred.done(function (response) {
                        $state.go("resources.device.balance")
                    });
                    deferred.fail(function (response) {
                        new ExceptionService().doException(response);
                    });
                }
            }
            $scope.operate.initZone();
            $scope.operate.initRoom();
        }];
        return addLoadBalancerCtrl;
    }
);
