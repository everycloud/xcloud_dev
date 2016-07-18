/*global define*/
define(['tiny-lib/jquery',
    'tiny-lib/encoder',
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    'app/services/validatorService',
    "./topo/appTopo",
    "app/business/application/services/appCommonService",
    "app/business/application/controllers/constants",
    "app/business/ecs/services/vm/vmCommonService",
    "app/business/ecs/services/vm/updateVmService",
    "app/services/commonService",
    "tiny-widgets/Window",
    "bootstrap/bootstrap.min",
    "tiny-lib/underscore",
    "fixtures/appInstanceFixture"
], function ($, $encoder, angular, UnifyValid, validator, appTopo, service, constants, vmCommonService, updateVmService, commonService, Window, bootstrap, _) {
    "use strict";

    var ctrl = ["$rootScope", "$window", "$scope", "$compile", "$q", "camel", "exception", "message", "$timeout", "appCommonData", "$stateParams",
        function ($rootScope, $window, $scope, $compile, $q, camel, exception, message, $timeout, appCommonData, $stateParams) {
            var encoder = $.encoder;
            var i18n = $scope.i18n;
            $scope.serviceSrv = new service(exception, $q, camel);
            $scope.vmServiceSrv = new updateVmService(exception, $q, camel);
            $scope.vmCommonServiceSrv = new vmCommonService();
            $scope.viewTopoTips = i18n.app_term_currentNotSupportTopo_valid;
            $scope.appName = appCommonData.appName;
            $scope.isIT = ($scope.user.cloudType === "IT");

            $scope.params = {
                "cloudInfraId": $stateParams.cloudInfraId,
                "vpcId": $stateParams.vpcId,
                "appId": $stateParams.appId,
                "userId": $scope.user.id,
                "vdcId": $scope.user.vdcId,
                "canViewTopo": ($stateParams.canViewTopo === "true")
            };

            $scope.hasOperateInstanRight = _.contains($rootScope.user.privilegeList, constants.privileges.OPERATE_APP_INSTANCE);
            //整个JSON
            $scope.topoJSON = {};
            //应用节点的JSON
            $scope.appNodeJSON = {};
            //vlb节点的JSON
            $scope.vlbNodeJSON = {};
            //伸缩组节点的JSON
            $scope.sgNodeJSON = {};
            //虚拟机节点的JSON
            $scope.vmNodeJSON = {};
            //网络节点的JSON
            $scope.netNodeJSON = {};

            $scope.vlbsUI = null;

            //查询应用实例拓扑数据
            $scope.queryAppInstanceTopo = function () {
                var promise = $scope.serviceSrv.queryAppTopoResource({
                    "vdcId": $scope.params.vdcId,
                    "id": $scope.params.appId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "userId": $scope.params.userId,
                    "vpcId": $scope.params.vpcId
                });
                promise.then(function (data) {
                    $scope.topoJSON = data;
                    $scope.templateJSON = data.templateBody;
                    try {
                        var topoData = JSON.parse($scope.templateJSON);
                        if($("#appTopoDiv")){
                            $("#appTopoDiv").html("");
                        }
                        new appTopo("appTopoDiv", topoData, $scope);

                        $scope.currentNode = {
                            "appNode": false,
                            "vlbNode": false,
                            "netNode": false,
                            "sgNode": false,
                            "vmNode": false
                        };
                    }
                    catch (e) {
                    }
                });
            };
            $scope.operateVM = function (params) {
                var promise = $scope.vmServiceSrv.operateVm({
                    "user": $scope.user,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "userId": $scope.params.userId,
                    "vpcId": $scope.params.vpcId,
                    "params": params
                });
                promise.then(function (data) {
                    //TODO:
                });
            };
            //查询应用实例信息
            $scope.queryAppOverview = function () {
                var pram = {
                    "vdcId": $scope.params.vdcId,
                    "appId": $scope.params.appId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "userId": $scope.params.userId,
                    "vpcId": $scope.params.vpcId
                };
                var promise = "";
                if($scope.isIT){
                    promise = $scope.serviceSrv.queryAppOverviewResource(pram);
                }else{
                    promise = $scope.serviceSrv.queryBasicinfoResource(pram);
                }
                promise.then(function (data) {
                    $scope.appNodeJSON = data.appBasicInfo;
                    if (data.status === "Stopped" || data.status === "Stopping") {
                        $scope.stopBtn.disable = true;
                        $scope.startBtn.disable = false;
                    } else {
                        $scope.stopBtn.disable = false;
                        $scope.startBtn.disable = true;
                    }
                });
            };

            //修改应用实例名称和描述
            $scope.updateAppInstance = function (params) {
                var promise = $scope.serviceSrv.updateAppInstance({
                    "vdcId": $scope.params.vdcId,
                    "id": $scope.params.appId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "userId": $scope.params.userId,
                    "vpcId": $scope.params.vpcId,
                    "data": params
                });
                return promise;
            };

            //条件查询可用的vlb列表
            $scope.queryELBsByCondition = function () {
                var promise = $scope.serviceSrv.queryELBsByCondition({
                    "vdcId": $scope.params.vdcId,
                    "userId": $scope.params.userId,
                    "vpcId": $scope.params.vpcId,
                    "data": {
                        "cloud-infra": $scope.params.cloudInfraId,
                        "vpcid": $scope.params.vpcId,
                        "filterstatus": "ERROR"
                    }
                });
                promise.then(function (data) {
                    $scope.vlbsUI = data.lbInfos;
                });
                return promise;
            };

            $scope.queryScalingGroup = function (options) {
                var promise = $scope.serviceSrv.queryScalingGroup({
                    "vdcId": $scope.params.vdcId,
                    "id": $scope.params.appId,
                    "cloudInfraId": $scope.params.cloudInfraId,
                    "userId": $scope.params.userId,
                    "vpcId": $scope.params.vpcId,
                    "sgId": options.sgId
                });
                promise.then(function (data) {
                    $scope.sgNodeJSON = data;
                    $scope.sgNodeJSON.scalingGroupInfo.scalingStatusUI = appCommonData.getScalingGroupRunningStatus(data.scalingGroupInfo.scalingStatus);
                    //组内策略列表
                    var policies = data.policies;
                    var policiesUI = [];
                    var policy = null;
                    _.each(policies, function (item, index) {
                        policy = {};
                        policy.groupId = item.policyInfo.groupId;
                        policy.policyId = item.policyInfo.policyId;
                        policy.policyName = item.policyInfo.policyName;
                        policy.status = item.policyInfo.status;
                        policy.statusUI = appCommonData.getPolicyStatus(item.policyInfo.status);
                        policy.actionType = item.policyInfo.actionType;
                        policy.actionTypeUI = appCommonData.getPolicyActionType(item.policyInfo.actionType);
                        policy.opts = "";
                        policy.item = item;
                        policiesUI.push(policy);
                    });
                    $scope.sgNodeJSON.policiesUI = policiesUI;

                    //网卡VLB列表
                    var nics = data.scalingGroupInfo.nics;
                    var nicsUI = [];
                    var nic = null;
                    _.each(nics, function (item, index) {
                        nic = {};
                        nic.nicKey = item.nicKey;
                        nic.nicName = item.nicName;
                        if (item.vlbInfo) {
                            nic.vlbId = item.vlbInfo.id;
                            nic.vlbName = item.vlbInfo.name;
                        }
                        nic.opts = "";
                        nic.item = item;
                        nicsUI.push(nic);
                    });
                    $scope.sgNodeJSON.nicsUI = nicsUI;

                    // IT场景需要展现定时伸缩
                    if ($scope.isIT) {
                        var actionMaps = {
                            "SCALEOUT": i18n.common_term_expanding_button,
                            "SCALEIN": i18n.common_term_capacityReduction_button,
                            "SLEEP": i18n.common_term_hibernate_button,
                            "AWAKE": i18n.common_term_awaken_button,
                            "HALT": i18n.common_term_turnOff_button,
                            "POWER": i18n.common_term_startup_button,
                            "CREATE": i18n.common_term_create_button,
                            "REMOVE": i18n.common_term_delete_button
                        };
                        //网卡VLB列表
                        var scheduleTimeInfos = data.scalingGroupInfo.scheduleTimeInfo;
                        if (!scheduleTimeInfos) {
                            $scope.sgNodeJSON.scheduleTimeInfosUI = null;
                        }
                        else {
                            $scope.sgNodeJSON.scheduleTimeInfosUI = [
                                {
                                    "scheduleTime": commonService.utc2Local(scheduleTimeInfos.scheduleTime),
                                    "actionType": actionMaps[scheduleTimeInfos.actionType],
                                    "adjustStep": scheduleTimeInfos.adjustStep,
                                    "opts": ""
                                }
                            ];
                        }
                    }
                });

                return promise;
            };

            $scope.startBtn = {
                "id": "application-instance-topology-start",
                "text": i18n.common_term_startup_button,
                "click": function () {
                    message.warnMsgBox({
                        "content": i18n.app_app_startup_info_confirm_msg,
                        "callback": function () {
                            var deferred = $scope.serviceSrv.operateAppInstance({
                                "vdcId": $scope.params.vdcId,
                                "id": $scope.params.appId,
                                "cloudInfraId": $scope.params.cloudInfraId,
                                "userId": $scope.params.userId,
                                "vpcId": $scope.params.vpcId,
                                "operate": "Start"
                            });
                            deferred.then(function (resolvedValue) {
                                $scope.stopBtn.disable = false;
                                $scope.startBtn.disable = true;
                            });
                        }
                    });
                }
            };
            $scope.refreshBtn = {
                "id": "application-instance-topology-refresh",
                "text": i18n.common_term_fresh_button,
                "click": function () {
                    $scope.init();
                }
            };

            $scope.stopBtn = {
                "id": "application-instance-topology-stop",
                "text": i18n.common_term_stop_button,
                "click": function () {
                    message.warnMsgBox({
                        "content":i18n.app_app_stop_info_confirm_msg,
                        "callback": function () {
                            var deferred = $scope.serviceSrv.operateAppInstance({
                                "vdcId": $scope.params.vdcId,
                                "id": $scope.params.appId,
                                "cloudInfraId": $scope.params.cloudInfraId,
                                "userId": $scope.params.userId,
                                "vpcId": $scope.params.vpcId,
                                "operate": "Stop"
                            });
                            deferred.then(function (resolvedValue) {
                                $scope.stopBtn.disable = true;
                                $scope.startBtn.disable = false;
                            });
                        }
                    });
                }
            };

            $scope.returnBtn = {
                "id": "application-instance-topology-return",
                "text": i18n.common_term_return_button,
                "click": function () {
                    setTimeout(function () {
                        $window.history.back();
                    }, 0);
                }
            };

            //当前节点类型
            $scope.currentNode = {
                "appNode": false,
                "vlbNode": false,
                "netNode": false,
                "sgNode": false,
                "vmNode": false
            };
            $scope.setCurrentNode = function (type) {
                $scope.currentNode.appNode = false;
                $scope.currentNode.vlbNode = false;
                $scope.currentNode.netNode = false;
                $scope.currentNode.sgNode = false;
                $scope.currentNode.vmNode = false;

                if (type === "app") {
                    $scope.currentNode.appNode = true;
                }
                if (type === "vlb") {
                    $scope.currentNode.vlbNode = true;
                }
                if (type === "net") {
                    $scope.currentNode.netNode = true;
                }
                if (type === "sg") {
                    $scope.currentNode.sgNode = true;
                }
                if (type === "vm") {
                    $scope.currentNode.vmNode = true;
                }
            };
            $scope.applicationNode = {
                name: {
                    label: i18n.common_term_name_label+":",
                    modifying: false,
                    "id": "application-node-name-Id",
                    "clickModify": function () {
                        $scope.applicationNode.name.modifying = true;

                        $timeout(function () {
                            $("#application-node-name-Id input").focus().val($scope.appNodeJSON.appName);
                        }, 50);
                    },
                    "blur": function () {
                        $scope.applicationNode.name.modify();
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.applicationNode.name.modify();
                        }
                    },
                    "modify": function () {
                        var newName = $.trim($("#" + $scope.applicationNode.name.id).widget().getValue());
                        var promise = $scope.updateAppInstance({
                            "name": newName
                        });
                        promise.then(function () {
                            $scope.appNodeJSON.appName = newName;
                        });
                        $scope.applicationNode.name.modifying = false;
                    }
                },
                state: {
                    label: i18n.common_term_status_label+":"
                },
                tag: {
                    label: i18n.cloud_term_tag_label+":"
                },
                healthStatus: {
                    label: i18n.common_term_healthStatus_label+":"
                },
                vpc: {
                    label: i18n.vpc_term_vpc_label+":"
                },
                createUser: {
                    label: i18n.user_term_createUser_button+":"
                },
                createTime: {
                    label: i18n.common_term_createAt_label+":"
                },
                description: {
                    label: i18n.common_term_desc_label+":",
                    modifying: false,
                    "id": "application-node-desc-Id",
                    "clickModify": function () {
                        $scope.applicationNode.description.modifying = true;

                        $timeout(function () {
                            $("#application-node-desc-Id input").focus().val($scope.appNodeJSON.desc);
                        }, 50);
                    },
                    "blur": function () {
                        $scope.applicationNode.description.modify();
                    },
                    "keypressfn": function (event) {
                        if (event.keyCode === 13) {
                            $scope.applicationNode.description.modify();
                        }
                    },
                    "modify": function () {
                        var newDesc = $.trim($("#" + $scope.applicationNode.description.id).widget().getValue());
                        var promise = $scope.updateAppInstance({
                            "desc": newDesc
                        });
                        promise.then(function () {
                            $scope.appNodeJSON.desc = newDesc;
                        });
                        $scope.applicationNode.description.modifying = false;
                    }
                }
            };

            $scope.netNode = {
                name: {
                    label: i18n.common_term_name_label+":"
                },
                desc: {
                    label: i18n.common_term_desc_label+":"
                },
                type: {
                    label: i18n.vpc_term_netType_label+":"
                },
                vlan: {
                    label: i18n.resource_term_vlanID_label+":"
                },
                dhcp: {
                    label: i18n.vpc_term_DHCPisolation_label+":"
                },
                ipmacBind: {
                    label: i18n.common_term_IPbondMAC_label+":"
                },
                ipDes: {
                    label: i18n.common_term_IPassignMode_label+":"
                },
                subnetIP: {
                    label: i18n.common_term_SubnetIP_label+":"
                },
                subnetMask: {
                    label: i18n.common_term_SubnetMask_label+":"
                },
                subnetGateway: {
                    label: i18n.common_term_gateway_label+":"
                }
            };

            $scope.vlbNode = {
                name: {
                    label: i18n.common_term_name_label+":"
                },
                frontNet: {
                    label: i18n.common_term_FrontNet_label+":"
                },
                backNet: {
                    label: i18n.lb_term_backendNet_label+":"
                },
                protocol: {
                    "id": "vlb-node-protocol",
                    "label": i18n.common_term_protocolPort_label+":",
                    "columns": [
                        {
                            "sTitle": i18n.app_term_LBprotocol_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.FrontProtocol);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_LBport_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.FrontPort);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_instanceProtocol_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.BackEndProtocol);
                            }
                        },
                        {
                            "sTitle":i18n.app_term_instancePort_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.BackEndPort);
                            }
                        }
                    ]
                }
            };

            $scope.vmNode = {
                name: {
                    label: i18n.common_term_name_label+":"
                },
                ID: {
                    label: i18n.common_term_ID_label+":"
                },
                az: {
                    label: i18n.common_term_section_label+":"
                },
                flag: {
                    label: i18n.cloud_term_tag_label+":"
                },
                createTime: {
                    label: i18n.common_term_createAt_label+":"
                },
                domain: {
                    label: i18n.common_term_belongsToDomain_label+":"
                },
                desc: {
                    label: i18n.common_term_desc_label+":"
                },
                status: {
                    label: i18n.common_term_status_label+":"
                },
                startBtn: {
                    "id": "vmNode-start-btn",
                    "text":i18n.common_term_startup_button,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.vm_vm_startup_info_confirm_msg,
                            "callback": function () {
                                var params = $scope.vmCommonServiceSrv.getOperateParams("start", [$scope.vmNodeJSON.Rid]);
                                $scope.operateVM(params);
                            }
                        });
                    }
                },
                goVmList: function () {
                    var $state = $("html").injector().get("$state");
                    $state.go("ecs.vm");
                },
                stopBtn: {
                    "id": "vmNode-stop-btn",
                    "text": i18n.common_term_shut_button,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.vm_vm_shut_info_confirm_msg,
                            "callback": function () {
                                var operate = $scope.vmCommonServiceSrv.getOperateParams("stop", [$scope.vmNodeJSON.Rid], "force");
                                $scope.operateVM(operate);
                            }
                        });
                    }
                },
                rebootBtn: {
                    "id": "vmNode-reboot-btn",
                    "text":i18n.common_term_restart_button,
                    "click": function () {
                        message.warnMsgBox({
                            "content": i18n.vm_vm_forciblyRestart_info_confirm_msg,
                            "callback": function () {
                                var operate = $scope.vmCommonServiceSrv.getOperateParams("reboot", [$scope.vmNodeJSON.Rid], "force");
                                $scope.operateVM(operate);
                            }
                        });
                    }
                },
                updateBtn: {
                    "id": "vmNode-update-btn",
                    "text": i18n.common_term_update_button,
                    "click": function () {
                        var winParam = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vmId": $scope.vmNodeJSON.Rid,
                            "ostype": $scope.vmNodeJSON.OsType
                        };
                        var options = {
                            "winId": "vmNodeUpdateWinId",
                            "winParam": winParam,
                            title: i18n.app_term_updatVM_button,
                            width: "800px",
                            height: "500px",
                            "content-type": "url",
                            "content": "app/business/application/views/appInstance/updateVmNode.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                vlbs: {
                    "id": "vlb-vmnode-protocol",
                    "columns": [
                        {
                            "sTitle": "IP",
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.Ip);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_associateVLB_button,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.vlbName);
                            }
                        },
                        {
                            "sTitle":i18n.common_term_operation_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.opts);
                            }
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();
                        optScope.id = "vm-nic-binding-vlb" + iDataIndex;
                        var vlbs = [];
                        vlbs.push({
                            "selectId": "-",
                            "label": "——",
                            "checked": aData.Vlb === "false"
                        });
                        _.each($scope.vlbsUI, function (item, index) {
                            vlbs.push({
                                selectId: item.lbID,
                                label: encoder.encodeForHTML(item.lbName + "(" + transLbStatusToUiStatus(item.status) + ")"),
                                checked: item.lbID === aData.VlbId
                            });
                        });
                        optScope.vlbs = vlbs;

                        //select
                        var specsSel = "<div style='margin:0px 0 -10px 0;'><tiny-select id='id' values='vlbs' width='120' height='300'></tiny-select></div>";
                        var specsSelLink = $compile(specsSel);
                        var specsSelNode = specsSelLink(optScope);
                        $("td:eq(1)", nRow).html(specsSelNode);
                        optScope.refresh = function () {
                            message.warnMsgBox({
                                "content": i18n.app_app_refresh_info_confirm_msg,
                                "callback": function () {
                                    var promise = $scope.serviceSrv.refreshVlbInVm({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "id": $scope.params.appId,
                                        "vmId": $scope.vmNodeJSON.Id
                                    });
                                    promise.then(function () {
                                        $scope.queryAppInstanceTopo();
                                    });
                                }
                            });
                        };
                        //保存
                        optScope.save = function (type) {
                            message.warnMsgBox({
                                "content": i18n.common_term_saveConfirm_msg,
                                "callback": function () {
                                    var oldLB = aData.Vlb;
                                    var oldLBId = aData.VlbId;
                                    var newLBid = $("#vm-nic-binding-vlb" + iDataIndex).widget().getSelectedId();

                                    var vlbId = "";
                                    var operation = "";
                                    if (oldLB === "false" && newLBid !== "-") {
                                        operation = "ADD";
                                        vlbId = newLBid;
                                    } else if (oldLB !== "false" && newLBid === "-") {
                                        operation = "DEL";
                                        vlbId = oldLBId;
                                    } else if (oldLB !== "false" && newLBid !== "-") {
                                        operation = "MOD";
                                        vlbId = newLBid;
                                    } else {
                                        return;
                                    }

                                    var promise = $scope.serviceSrv.modifyVlbInVm({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "id": $scope.params.appId,
                                        "vmId": $scope.vmNodeJSON.Id,
                                        "params": {
                                            "bindVLBList": [
                                                {
                                                    "vlbId": vlbId,
                                                    "ip": aData.Ip,
                                                    "operation": operation
                                                }
                                            ]
                                        }
                                    });
                                    promise.then(function () {
                                        $scope.queryAppInstanceTopo();
                                    });
                                }
                            });
                        };
                        var opt = "<div><a class='btn-link' ng-click='refresh()'>"+i18n.common_term_fresh_button+"</a><a class='margin-left-beautifier btn-link' ng-click='save()'>"+i18n.common_term_save_label+"</a></div>";
                        var optLink = $compile(opt);
                        var optNode = optLink(optScope);
                        $("td:eq(2)", nRow).append(optNode);
                    }
                }
            };

            $scope.sgNode = {
                name: {
                    label: i18n.common_term_name_label+":"
                },
                desc: {
                    label: i18n.common_term_desc_label+":"
                },
                minVMS: {
                    label: i18n.app_term_vmMinNum_label+":"
                },
                maxVMS: {
                    label: i18n.app_term_vmMaxNum_label+":"
                },
                coolTime: {
                    label: i18n.app_term_coolingTimeMinu_label+":"
                },
                status: {
                    label: i18n.common_term_status_label+":"
                },
                totalVMS: {
                    label: i18n.app_term_vmNumTotal_label+":"
                },
                runVMS: {
                    label: i18n.perform_term_runningVMnum_label+":"
                },
                modBtn: {
                    "id": "sgnode-modify-btn",
                    "text": i18n.common_term_modify_button,
                    "click": function () {
                        var options = {
                            "winId": "sgnode-modify-window",
                            "params": $scope.params,
                            "nodeJSON": $scope.sgNodeJSON,
                            title: i18n.app_term_modifyBasicInfo_button,
                            width: "500px",
                            height: "400px",
                            "content-type": "url",
                            "content": "app/business/application/views/appInstance/modifySGBasicInfo.html",
                            "buttons": null,
                            "close": function () {
                                $scope.queryScalingGroup({
                                    "sgId": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                });
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                applyBtn: {
                    "id": "sgnode-apply-btn",
                    "text": i18n.app_term_triggerTelescopic_label,
                    "click": function () {
                        var options = {
                            "winId": "sgnode-apply-window",
                            "params": $scope.params,
                            "nodeJSON": $scope.sgNodeJSON,
                            title: i18n.app_term_triggerTelescopic_label,
                            width: "450px",
                            height: "300px",
                            "content-type": "url",
                            "content": "app/business/application/views/appInstance/applySG.html",
                            "buttons": null,
                            "close": function () {
                                $scope.queryScalingGroup({
                                    "sgId": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                });
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                manualSGBtn: {
                    "id": "sgnode-manualsg-btn",
                    "text": i18n.app_term_manualScale_label,
                    "click": function () {
                        var options = {
                            "winId": "sgnode-manualsg-window",
                            "param": $scope.sgNodeJSON,
                            title: i18n.app_term_manualScale_label,
                            width: "450px",
                            height: "250px",
                            "content-type": "url",
                            "content": "app/business/application/views/appInstance/manualSGInfo.html",
                            "buttons": null
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                addPolicyBtn: {
                    "id": "sgnode-addPolicy-btn",
                    "text":i18n.common_term_add_button,
                    "click": function () {
                        $scope.addScalingPolicyUI("create", $scope.sgNodeJSON, null);
                    }
                },
                policys: {
                    "id": "sgnode-policys-table",
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label,
                            "bSortable": false,
                            "sWidth":"5%",
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.policyName);
                            }
                        },
                        {
                            "sTitle":i18n.common_term_status_label,
                            "bSortable": false,
                            "sWidth":"5%",
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.statusUI);
                            }
                        },
                        {
                            "sTitle":i18n.common_term_actionType_label,
                            "bSortable": false,
                            "sWidth":"8%",
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.actionTypeUI);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "bSortable": false,
                            "sWidth":"10%",
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.opts);
                            }
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();
                        optScope.query = function () {
                            var options = {
                                "vdcId": $scope.params.vdcId,
                                "cloudInfraId": $scope.params.cloudInfraId,
                                "userId": $scope.params.userId,
                                "vpcId": $scope.params.vpcId,
                                "sgId": aData.groupId,
                                "policyId": aData.policyId
                            };
                            //该策略是否存在
                            var deferred = $scope.serviceSrv.queryPolicy(options);
                            deferred.then(function(data){
                                var title = i18n.app_term_checkIntraPolicy_button;
                                var options = {
                                    winId: "queryScalingPolicy",
                                    title: title,
                                    height: "700px",
                                    width: "850px",
                                    "policyJSON": aData,
                                    "content-type": "url",
                                    "content": "app/business/application/views/appInstance/topo/queryScalingPolicy.html",
                                    "buttons": null,
                                    "close": function (event) {
                                        $("#queryScalingPolicy").widget().destroy();
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            }, function(data){
                                $scope.queryScalingGroup({
                                    "sgId": aData.groupId
                                });
                            });
                        };
                        optScope.modify = function () {
                            $scope.addScalingPolicyUI("modify", $scope.sgNodeJSON, aData);
                        };
                        optScope.deleter = function () {
                            message.warnMsgBox({
                                "content": i18n.app_app_delInnerPolicy_info_confirm_msg,
                                "callback": function () {
                                    var promise = $scope.serviceSrv.deletePolicy({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "sgId": aData.groupId,
                                        "policyId": aData.policyId
                                    });
                                    promise.then(function (resolvedValue) {
                                        $scope.sgNodeJSON.policiesUI = _.reject($scope.sgNodeJSON.policiesUI, function (item, index) {
                                            return item.policyId === aData.policyId;
                                        });
                                    });
                                }
                            });
                        };
                        //启动、停止
                        optScope.actionPolicy = function (type) {
                            var content = null;
                            var action = null;
                            if (type === 0) {
                                content = i18n.app_app_enableInnerPolicy_info_confirm_msg;
                                action = "Start";
                            }
                            if (type === 1) {
                                content = i18n.app_app_disableInnerPolicy_info_confirm_msg;
                                action = "Stop";
                            }
                            message.warnMsgBox({
                                "content": content,
                                "callback": function () {
                                    var promise = $scope.serviceSrv.actionPolicy({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "sgId": aData.groupId,
                                        "policyId": aData.policyId,
                                        "action": action
                                    });
                                    promise.then(function (resolvedValue) {
                                        $scope.queryScalingGroup({
                                            "sgId": aData.groupId
                                        });
                                    });
                                }
                            });
                        };

                        //链接
                        var link = "<a class='btn-link' ng-click='query()'>" + encoder.encodeForHTML(aData.policyName) + "</a> ";
                        var nameLink = $compile(link);
                        var linkNode = nameLink(optScope);
                        $("td:eq(0)", nRow).html(linkNode);
                        $("td:eq(0)", nRow).addTitle();

                        var opt = "<div>";
                        if (aData.status === "STOPPED") {
                            opt = opt + "<a class='btn-link' ng-click='actionPolicy(0)'>"+i18n.common_term_startup_button+"</a><a class='margin-left-beautifier btn-link' ng-click='modify()'>"+i18n.common_term_modify_button+"</a>";
                        }
                        if (aData.status !== "STOPPED") {
                            opt = opt + "<a class='btn-link' ng-click='actionPolicy(1)'>"+i18n.common_term_stop_button+"</a>";
                        }
                        opt = opt + "<a class='margin-left-beautifier btn-link' ng-click='deleter()'>"+i18n.common_term_delete_button+"</a></div>";
                        var optLink = $compile(opt);

                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);
                    }
                },
                vlbs: {
                    "id": "vlb-node-protocol",
                    "columns": [
                        {
                            "sTitle": i18n.common_term_NICname_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.nicName);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_associateVLB_button,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.vlbName);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.opts);
                            }
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();
                        optScope.id = "sg-nic-binding-vlb" + iDataIndex;
                        var vlbs = [];
                        vlbs.push({
                            "selectId": "-",
                            "label": "——",
                            "checked": aData.vlbId ? false : true
                        });
                        _.each($scope.vlbsUI, function (item, index) {
                            vlbs.push({
                                selectId: item.lbID,
                                label: encoder.encodeForHTML(item.lbName + "(" + transLbStatusToUiStatus(item.status) + ")"),
                                checked: item.lbID === aData.vlbId
                            });
                        });
                        optScope.vlbs = vlbs;

                        var specsSel = "<div style='margin:0px 0 -10px 0;'><tiny-select id='id' values='vlbs' width='120' height='300'></tiny-select></div>";
                        var specsSelLink = $compile(specsSel);
                        var specsSelNode = specsSelLink(optScope);
                        $("td:eq(1)", nRow).html(specsSelNode);

                        optScope.refresh = function () {
                            message.warnMsgBox({
                                "content": i18n.app_app_refresh_info_confirm_msg,
                                "callback": function () {
                                    var promise = $scope.serviceSrv.refreshVlbInSG({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "id": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                    });
                                    promise.then(function () {
                                        $scope.queryScalingGroup({
                                            "sgId": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                        });
                                    });
                                }
                            });
                        };
                        //保存
                        optScope.save = function (type) {
                            message.warnMsgBox({
                                "content": i18n.common_term_saveConfirm_msg,
                                "callback": function () {
                                    var oldLBId = aData.vlbId;
                                    var newLBid = $("#sg-nic-binding-vlb" + iDataIndex).widget().getSelectedId();

                                    var vlbId = "";
                                    var operation = "";
                                    if (!oldLBId && newLBid !== "-") {
                                        operation = "ADD";
                                        vlbId = newLBid;
                                    } else if (oldLBId && newLBid === "-") {
                                        operation = "DEL";
                                        vlbId = oldLBId;
                                    } else if (oldLBId && newLBid !== "-") {
                                        operation = "MOD";
                                        vlbId = newLBid;
                                    } else {
                                        return;
                                    }

                                    var promise = $scope.serviceSrv.modifyVlbInSG({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "id": $scope.sgNodeJSON.scalingGroupInfo.groupId,
                                        "params": {
                                            "bindVLBList": [
                                                {
                                                    "nicKey": aData.nicKey,
                                                    "nicName": aData.nicName,
                                                    "vlbId": vlbId,
                                                    "operation": operation
                                                }
                                            ]
                                        }
                                    });
                                    promise.then(function () {
                                        $scope.queryScalingGroup({
                                            "sgId": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                        });
                                    });
                                }
                            });
                        };
                        var opt = "<div><a class='btn-link' ng-click='refresh()'>"+i18n.common_term_fresh_button+"</a><a class='margin-left-beautifier btn-link' ng-click='save()'>"+i18n.common_term_save_label+"</a></div>";
                        var optLink = $compile(opt);
                        var optNode = optLink(optScope);
                        $("td:eq(2)", nRow).append(optNode);
                    }
                },
                scheduleTimeInfo: {
                    "id": "scheduleTimeInfo-node",
                    "columns": [
                        {
                            "sTitle": i18n.app_term_triggerTime_label,
                            "bSortable": false,
                            "sWidth": "150px",
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.scheduleTime);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_actionType_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.actionType);
                            }
                        },
                        {
                            "sTitle": i18n.app_term_adjustOffset_button,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.adjustStep);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_operation_label,
                            "bSortable": false,
                            "mData": function (data) {
                                return encoder.encodeForHTML(data.opts);
                            }
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var optScope = $scope.$new();

                        optScope.remove = function () {
                            message.warnMsgBox({
                                "content": i18n.common_term_delConfirm_msg,
                                "callback": function () {
                                    var promise = $scope.serviceSrv.deleteScheduleTimeInfo({
                                        "vdcId": $scope.params.vdcId,
                                        "cloudInfraId": $scope.params.cloudInfraId,
                                        "userId": $scope.params.userId,
                                        "vpcId": $scope.params.vpcId,
                                        "id": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                    });
                                    promise.then(function () {
                                        $scope.queryScalingGroup({
                                            "sgId": $scope.sgNodeJSON.scalingGroupInfo.groupId
                                        });
                                    });
                                }
                            });
                        };
                        var opt = "<div><a class='btn-link' ng-click='remove()'>"+i18n.common_term_delete_button+"</a></div>";
                        var optLink = $compile(opt);
                        var optNode = optLink(optScope);
                        $("td:eq(3)", nRow).append(optNode);
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                    }
                }
            };

            $scope.addScalingPolicyUI = function (type, sgJSON, policyJSON) {
                var title = (type === "create" ? i18n.app_term_addIntraPolicy_button : i18n.app_term_modifyIntraPolicy_button);
                var options = {
                    "winId": "addScalingPolicy",
                    title: title,
                    height: "700px",
                    width: "850px",
                    "mode": type,
                    "scalingGroup": sgJSON,
                    "policyJSON": policyJSON,
                    "content-type": "url",
                    "params": $scope.params, //传输的数据
                    "content": "app/business/application/views/appInstance/topo/scalingPolicy.html",
                    "buttons": null
                };
                var win = new Window(options);
                win.show();
            };

            $scope.displayDetail = function () {
                $("#appTopoDetailDiv").hide().width($("#appTopoDiv").width()).show({
                    "duration": 400,
                    "queue": true
                });
            };
            $scope.closeDetail = function () {
                $("#appTopoDetailDiv").hide();
            };

            $scope.$on("addPolicySuccessEvent", function listener(event) {
                $scope.queryScalingGroup({
                    "sgId": $scope.sgNodeJSON.scalingGroupInfo.groupId
                });
            });

            $scope.init = function () {
                if(appCommonData.isVPCStack){
                    $scope.params.canViewTopo = false;
                }
                if (!$scope.params.canViewTopo) {
                    return;
                }
                $scope.queryAppInstanceTopo();
                if ($scope.user.cloudType === "IT") {
                    $scope.queryELBsByCondition();
                }
                $scope.queryAppOverview();
            };

            function transLbStatusToUiStatus(status) {
                if (status === "READY") {
                    return i18n.common_term_running_value;
                } else if (status === "DISABLE") {
                    return i18n.common_term_stoped_value;
                } else if (status === "FAULT") {
                    return i18n.common_term_trouble_label;
                } else if (status === "ERROR") {
                    return i18n.common_term_fail_label;
                } else if (status === "BUILD") {
                    return i18n.common_term_executing_value;
                } else {
                    return i18n.common_term_unknown_value;
                }
            }
            $scope.init();
        }
    ];
    return ctrl;
});
