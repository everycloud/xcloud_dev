/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    'app/services/httpService',
    'app/services/messageService',
    "app/services/tipMessageService",
    'app/services/validatorService',
    'app/services/commonService',
    'app/services/capacityService',
    'app/services/cloudInfraService',
    'app/business/ssp/services/order/orderService',
    'app/business/ssp/services/plugin/ecs/ecsService',
    'app/business/ssp/services/plugin/commonService',
    'bootstrap/bootstrap.min',
    'tiny-directives/RadioGroup'
], function ($, angular, _, UnifyValid, http, messageService, tipMessageService, validatorService, timeCommonService, capacityService, cloudInfraService, orderService, ecsService, commonService) {
    "use strict";

    // 自定义CPU框
    $.fn.userDefCpuApprovalVm = function (userDef, unit) {
        var dom = this;
        this.bind("click", function (evt) {
            evt.stopPropagation();
            if (dom.find("input").length > 0) {
                return;
            }

            var oldValue = userDef.cpuInput ? userDef.cpu : "";
            var input = $("<input type='text' value='" + oldValue + "'>");
            input.css({
                "width": dom.css("width"),
                "height": dom.css("height")
            });

            var confirmInput = function () {
                var value = input.val();
                var reg = /^([1-9]|[1-5]\d|6[0-4])$/;
                if (!reg.test(value)) {
                    $(".createvm-cpu .input-tip").css("display", "inline-block");
                    return;
                }
                $(".createvm-cpu .input-tip").css("display", "none");

                dom.html(value + unit);
                userDef.cpu = value;
                userDef.cpuInput = true;
            };

            input.bind("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    confirmInput();
                }
            });
            input.bind("blur", function () {
                confirmInput();
            });
            dom.html(input);
            input.focus();
        });
        return this;
    };

    // 自定义内存框
    $.fn.userDefMemApprovalVm = function (userDef) {
        var dom = this;
        this.bind("click", function (evt) {
            evt.stopPropagation();
            if (dom.find("input").length > 0) {
                return;
            }

            var oldValue = userDef.memInput ? Math.ceil(userDef.mem / 1024) : "";
            var input = $("<input type='text' value='" + oldValue + "'>");
            input.css({
                "width": dom.css("width"),
                "height": dom.css("height")
            });

            var confirmInput = function () {
                var value = input.val();
                var reg = /^([1-9]|[1-9]\d|[1-9]\d\d|10[0-1]\d|102[0-4])$/;
                if (!reg.test(value)) {
                    $(".createvm-memory .input-tip").css("display", "inline-block");
                    return;
                }
                $(".createvm-memory .input-tip").css("display", "none");

                dom.html(value + "G");
                userDef.mem = value * 1024;
                userDef.memInput = true;
            };

            input.bind("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    confirmInput();
                }
            });
            input.bind("blur", function () {
                confirmInput();
            });
            dom.html(input);
            input.focus();
        });
        return this;
    };

    var ctrl = ["$scope", "$stateParams", "$q","$state", "camel", "exception",
        function ($scope, $stateParams, $q,$state, camel, exception) {
            // 公共参数和服务
            var i18n  = $scope.i18n;
            var user = $scope.user;
            $scope.ICT = user.cloudType === "ICT";
            var VLAN_MAX_ID = 4095;
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            $scope.from = $stateParams.from;

            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var ecsServiceIns = new ecsService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);
            var messageServiceIns = new messageService();
            var tipMessageIns = new tipMessageService();

            $scope.action = $stateParams.action;
            // 服务详情
            $scope.detail = {};
            // 订单详情
            $scope.orderDetail = {};
            $scope.cloudInfra = {};
            $scope.vpcId = "";
            $scope.vpcName = "";
            $scope.cupCount = "";
            $scope.memSize = "";
            $scope.diskTotalSize = "";
            $scope.supportUserDefineConfig = false;

            //ICT场景下的VPC网络和直连网络
            $scope.totalNets = [];
            //ICT场景下所有的虚拟机规格
            $scope.totalVmFlavors = [];

            // 基本信息
            $scope.base = {
                location: {
                    "id": "serviceApprovalEcsRegion",
                    "label": i18n.common_term_section_label + ":",
                    "require": true,
                    "width": "180",
                    "values": [],
                    "validate": "required:" + i18n.common_term_null_valid,
                    "change": function () {
                        $scope.cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.base.location.values, $("#" + $scope.base.location.id).widget().getSelectedId());
                        queryRelatedInfo();
                    }
                },
                az: {
                    "label": i18n.resource_term_AZ_label + ":",
                    "id": "serviceApprovalEcsAz",
                    "width": "180",
                    "values": [],
                    "curr": {},
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "change": function () {
                        var azId = $("#" + $scope.base.az.id).widget().getSelectedId();
                        $scope.base.az.curr = cloudInfraServiceIns.getSpecAz($scope.base.az.values, azId);
                        onSelectAz();
                    }
                },
                applyUser: {
                    "label": i18n.common_term_applyBy_label + ":"
                },
                currApprover: {
                    "label": i18n.common_term_currentProcessor_label + ":"
                },
                name: {
                    "label": i18n.vm_term_vmName_label + ":"
                },
                vmNum: {
                    "label": i18n.vm_term_vmNum_label + ":"
                },
                submitTime: {
                    "label": i18n.common_term_submitTime_label + ":"
                },
                expireTime: {
                    "label": i18n.common_term_overdueTime_label + ":"
                },
                remark: {
                    "label": i18n.common_term_remark_label + ":"
                }
            };

            // 选择虚拟机模板
            $scope.template = {
                values: [],
                selectedId: "",
                curTemplate: {},

                select: function (templateId) {
                    //先清空已有数据
                    $scope.template.clearSelectedTemplate();

                    var dom = $(".service_apply_ecs_template_bk_color");
                    if (dom.length > 0) {
                        dom.each(function () {
                            if ($(this).data("value") === templateId) {
                                $(this).addClass("service_apply_ecs_selected_template");
                                $scope.template.selectedId = templateId;
                                $scope.template.curTemplate = getSelectedTemplate(templateId);
                                if($scope.ICT){
                                    var availableFlavors = dealFlavors($scope.totalVmFlavors);
                                    $scope.config.configTem.detail = availableFlavors[0] || {};
                                    if(_.isEmpty($scope.config.configTem.detail)){
                                        $scope.config.configTem.detail.slaLabels = [];
                                    }
                                    $scope.config.configTem.values = availableFlavors || [];
                                    $scope.cupCount = availableFlavors[0] && availableFlavors[0].cpuCount;
                                    $scope.memSize = availableFlavors[0] && availableFlavors[0].memSize;
                                    $scope.diskTotalSize = availableFlavors[0] && availableFlavors[0].diskTotalSize;
                                }
                            }
                        });
                    }
                },

                // 清除选中的模板
                clearSelectedTemplate: function () {
                    var dom = $(".service_apply_ecs_selected_template");
                    if (dom) {
                        dom.each(function () {
                            $(this).removeClass("service_apply_ecs_selected_template");
                        });
                    }
                    $scope.template.selectedId = "";
                },

                "nameLabel": i18n.common_term_templateNmae_label + ":",
                "osLabel": i18n.common_term_OStype_label + ":",
                "osVersionLabel": i18n.common_term_OSversion_label + ":"
            };

            // 规格信息
            $scope.config = {
                "configType": {
                    "id": "serviceApprovalEcsConfigType",
                    "layout": "horizon",
                    "selected": "system",
                    "values": [ {
                        "key": "system",
                        "text": i18n.spec_term_sysSpec_label,
                        "checked": true
                    }, {
                        "key": "userDef",
                        "text": i18n.common_term_customSpec_label
                    } ],
                    "change": function () {
                        $scope.config.configType.selected = $("#" + $scope.config.configType.id).widget().opChecked("checked");
                    }
                },
                "configTem": {
                    id: "serviceApprovalEcsSelectConfigTem",
                    label: i18n.common_term_name_label + ":",
                    width: "180",
                    height: "215",
                    detail: {},
                    values: [],
                    validate: "required:" + i18n.common_term_null_valid,
                    "change": function () {
                        var id = $("#" + $scope.config.configTem.id).widget().getSelectedId();
                        var detail = _.find($scope.config.configTem.values, function (item) {
                            return item.flavorId === id;
                        });
                        $scope.config.configTem.detail = detail;
                        $scope.cupCount = detail.cpuCount;
                        $scope.memSize = detail.memSize;
                        $scope.diskTotalSize = detail.diskTotalSize;
                    }
                },
                // 用户自定义规格值
                userDef: {
                    "cpu": 1,
                    "mem": 512,
                    "cpuInput": false, //是否是用户输入的CPU
                    "memInput": false //是否是用户输入的CPU
                },
                // 切换是系统规格还是用户自定义规格
                changeConfigType: function (type) {
                    $scope.config.configType.selected = type;
                },
                cpuNum: {
                    label: "CPU:",
                    label2: i18n.common_term_vcpuNum_label + ":"
                },
                memory: {
                    label: i18n.common_term_memory_label + ":",
                    label2: i18n.common_term_memory_label + "(MB):"
                },
                disk: {
                    label: i18n.common_term_disks_label + ":",
                    label2: i18n.common_term_disks_label + "(GB):"
                },
                sla: {
                    label: "SLA:",
                    "values": [],
                    "curr": "",
                    "colors": ["#6cbfe8", "#39a8e0", "#1e8ac0", "#16658d", "#0e405a"]
                },
                ictSla: {
                    "id": "sspApprovalEcsSLATable",
                    "label": "SLA:",
                    "columns": [
                        {
                            "sTitle": i18n.common_term_name_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.labelKey);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_value_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.labelValue);
                            }
                        }
                    ],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                    }
                }
            };

            // 网络信息
            $scope.network = {
                networkType: {
                    "id": "serviceApprovalEcsNetworkType",
                    "label": i18n.vpc_term_netType_label + ":",
                    "layout": "horizon",
                    "selected": "private",
                    "values": [{
                        "key": "basic",
                        "text": i18n.common_term_basicNet_label,
                        "checked": false
                    }, {
                        "key": "private",
                        "text": i18n.common_term_privateNet_label,
                        "checked": true
                    }],
                    "change": function () {
                        $scope.network.networkType.selected = $("#" + $scope.network.networkType.id).widget().opChecked("checked");
                    }
                },

                basicAz: {
                    "label": i18n.vpc_term_net_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "serviceApprovalEcsBasicAz",
                    "width": "220",
                    "class": "height45",
                    "curLabel": "",
                    "data": [],
                    "change": function () {
                        $scope.network.basicAz.curLabel = $("#" + $scope.network.basicAz.id).widget().getSelectedLabel();
                    }
                },

                nics: [
                    {
                        "networkID": "",
                        "networkViewName": "",
                        "ipv4": "",
                        "ipv6": ""
                    }
                ],

                vpc: {
                    "label": "VPC:",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "serviceApprovalEcsVpcId",
                    "width": "320",
                    "class": "ssp_vm_vpc_label",
                    "curVpc": {},
                    "values": [],
                    "change": function () {
                        $scope.vpcId = $("#" + $scope.network.vpc.id).widget().getSelectedId();
                        $scope.vpcName = $("#" + $scope.network.vpc.id).widget().getSelectedLabel();
                        $scope.operate.queryPrivateNetworks("vpcChange");
                    }
                },

                privateNetwork: {
                    "label": i18n.vpc_term_net_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "ecsVmCreatePrivateNetwork",
                    "width": "320",
                    "height": "305",
                    "class": "height45",
                    "curLabel": "",
                    "data": [],
                    "change": function (index) {
                        var networkWidget = $("#" + $scope.network.privateNetwork.id + index).widget();
                        if (networkWidget) {
                            if (index === 0) {
                                $scope.network.privateNetwork.curLabel = networkWidget.getSelectedLabel();
                                $scope.vpcName =  $scope.network.privateNetwork.curLabel;
                            }
                            var network = getSpecNetwork($scope.network.privateNetwork.data, networkWidget.getSelectedId());
                            enhanceNetworkDetailCallBack(network, index, null, queryNetworkDetailAndUpdateIpStatus);
                        }
                    }
                },

                privateIpv4: {
                    "label": "IPv4:",
                    "id": "serviceApprovalEcsIpv4",
                    "type": "ipv4",
                    "width": "200",
                    "class2": "height27",
                    "value": "",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "isIPv4Check():" + i18n.common_term_formatIP_valid
                },

                privateIpv6: {
                    "label": "IPv6:",
                    "id": "serviceApprovalEcsIpv6",
                    "type": "ipv6",
                    "width": "260",
                    "value": "",
                    "extendFunction": ["isIPv6Check"],
                    "validate": "isIPv6Check():" + i18n.common_term_formatIP_valid
                },

                addNic: {
                    "id": "serviceApprovalEcsAddNic",
                    "text": i18n.vm_term_addNIC_button,
                    "click": function () {
                        var length = $scope.network.nics.length;
                        if (length > 7) {
                            return;
                        }

                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.network.nics.push({
                                    "networkID": "",
                                    "networkViewName": "",
                                    "ipv4": "",
                                    "ipv6": ""
                                });
                            });
                            var network = $scope.network.privateNetwork.data[0];
                            enhanceNetworkDetailCallBack(network, length, null, queryNetworkDetailAndUpdateIpStatus);
                        }, 0);
                    }
                },

                delNic: {
                    "text": i18n.vm_term_delNIC_button,
                    "click": function (idx) {
                        $scope.network.nics.splice(idx, 1);
                    }
                }

            };

            $scope.approvalResult = {
                "label": i18n.common_term_approveResult_label + ":",
                "require": "true",
                "id": "serviceApprovalEcsResult",
                "spacing": {
                    "width": "50px",
                    "height": "30px"
                },
                "values": orderServiceIns.approvalOptions
            };

            $scope.approvalOpinion = {
                "label": i18n.common_term_approveAdvice_label + ":",
                "id": "serviceApprovalEcsOpinion",
                "type": "multi",
                "width": "644",
                "height": "60",
                "value": "",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.okBtn = {
                "id": "serviceApprovalEcsOkBtn",
                "text": i18n.common_term_submit_button,
                "tooltip": "",
                "click": function () {
                    // 校验
                    if (!$scope.okBtn.valid()) {
                        return;
                    }
                    $scope.operate.approvalEcs();
                },
                "valid": function () {
                    // 查看订单不校验
                    if ($scope.action === "approval") {
                        // 审批意见
                        if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                            return false;
                        }

                        // 如果是审批通过才校验
                        if ($("#" + $scope.approvalResult.id).widget().opChecked("checked") === "approve"){
                            if (!validLocation() || !validTemplate() || !validConfig() || !validNetwork()) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            };

            $scope.cancelBtn = {
                "id": "serviceApprovalEcsCancelBtn",
                "text": i18n.common_term_cancle_button,
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
            };

            $scope.closeBtn = {
                "id": "serviceApprovalEcsCloseBtn",
                "text": i18n.common_term_return_button,
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
                }
            };

            $scope.modifyBtn = {
                "id": "serviceApprovalEcsModifyBtn",
                "text": i18n.common_term_modify_button,
                "click": function () {
                    $state.go($scope.orderDetail.applyUrl, {
                        "action": "edit",
                        "orderId": $scope.orderDetail.orderId,
                        "serviceId": $scope.orderDetail.serviceOffingId
                    });
                }
            };

            $scope.doCancelBtn = {
                "id": "serviceApprovalEcsDoCancelBtn",
                "text": i18n.common_term_undo_button,
                "click": function () {
                    messageServiceIns.confirmMsgBox({
                        "content": i18n.service_service_drawBack_info_confirm_msg,
                        "callback": function () {
                            $scope.operate.actionOrder({
                                "action": "cancel"
                            });
                        }
                    });
                }
            };

            // 查询SLA颜色块的背景色
            $scope.getSlaStyle = function (index) {
                return {
                    "background-color": $scope.config.sla.colors[index % 5]
                };
            };

            $scope.clickAreaHeading = function (id) {
                var head = $("#" + id + " .s-heading");
                var content = $("#" + id + " .s-content");

                if (head.hasClass("collapse")) {
                    // 收起来前，校验一下
                    if ($scope.action === "approval") {
                        if (id === "sspApprovalEcsLocation" && !validLocation()){
                            return;
                        } else if (id === "sspApprovalEcsTempList" && !validTemplate()){
                            return;
                        } else if (id === "sspApprovalEcsConfig" && !validConfig()){
                            return;
                        } else if (id === "sspApprovalEcsNetwork" && !validNetwork()){
                            return;
                        } else if (id === "sspApprovalEcsApproval") {
                            if (!UnifyValid.FormValid($("#" + $scope.approvalOpinion.id))) {
                                return;
                            }
                        }
                    }

                    head.removeClass("collapse");
                    head.addClass("expand");
                    content.css("display", "none");
                } else {
                    head.removeClass("expand");
                    head.addClass("collapse");
                    content.css("display", "block");
                }
            };

            $scope.operate = {
                // 查询订单详情
                "queryOrderDetail": function () {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": user,
                        "orderId": orderId
                    };
                    var deferred = orderServiceIns.queryOrder(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }

                        // 处理订单信息
                        commonServiceIns.processOrderDetail(data);

                        $scope.detail.param = JSON.parse(data.definationParams) || {};

                        $scope.orderDetail = data;
                        $scope.orderDetail.formatDate = $scope.orderDetail.tenancy !== "0" ? timeCommonService.utc2Local($scope.orderDetail.tenancy) : i18n.common_term_neverExpires_label;
                        $scope.orderDetail.param = JSON.parse(data.params) || {};
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询地域列表
                "queryLocations": function () {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            $scope.cloudInfra = data.cloudInfras[0];
                            $scope.base.location.values = data.cloudInfras;
                        }
                        retDefer.resolve();
                    });
                    return retDefer.promise;
                },

                // 查询地域详情
                "queryLocationDetail": function () {
                    var retDefer = $q.defer();
                    if ($scope.orderDetail.param.cloudInfraId) {
                        var deferred = cloudInfraServiceIns.queryCloudInfra(user.vdcId, user.id, $scope.orderDetail.param.cloudInfraId);
                        deferred.then(function (data) {
                            if (!data || !data.cloudInfra) {
                                retDefer.reject();
                                return;
                            }
                            $scope.cloudInfra = data.cloudInfra;
                            retDefer.resolve();
                        });
                    }
                    return retDefer.promise;
                },

                // 查询支持的能力字段
                "queryCapacity": function () {
                    var capacity = capacityServiceIns.querySpecificCapacity($scope.capacities, $scope.cloudInfra.type, $scope.cloudInfra.version);
                    if (capacity) {
                        $scope.supportUserDefineConfig = capacity.vm_support_user_define_config === "true";
                    }
                },

                //查询AZ列表
                "queryAzs": function () {
                    var retDefer = $.Deferred();
                    var promise = cloudInfraServiceIns.queryAzs(user.vdcId, user.id, $scope.cloudInfra.id);
                    promise.then(function (data) {
                        if (!data) {
                            retDefer.reject(data);
                            return;
                        }
                        if (data.availableZones && data.availableZones.length > 0) {
                            $scope.base.az.curr = data.availableZones[0];
                            $scope.base.az.values = data.availableZones;
                            retDefer.resolve(data);
                        }
                    });
                    return retDefer.promise();
                },

                // 查询虚拟机模板
                "queryVmTemplates": function () {
                    var retDefer = $q.defer();
                    if ($scope.cloudInfra.id) {
                        var options = {
                            "user": user,
                            "cloudInfraId": $scope.cloudInfra.id,
                            "azId": $scope.base.az.curr.id
                        };
                        var deferred = ecsServiceIns.queryVmTemplates(options);
                        deferred.then(function (data) {
                            if (!data || !data.vmtemplates) {
                                retDefer.reject(data);
                                return;
                            }

                            //先清空已选数据
                            $scope.template.clearSelectedTemplate();

                            _.each(data.vmtemplates, function (item) {
                                item.type = item.vdcId > 1 ? i18n.org_term_VDCtemplate_label : i18n.template_term_sysTemplate_label;
                                if (!item.picture) {
                                    item.picture = "../theme/default/images/vmTemplate/icon_vmtemplate_1.png";
                                }
                            });
                            $scope.template.values = data.vmtemplates;
                            retDefer.resolve(data);
                        });
                    }
                    return retDefer.promise;
                },

                // 查询单个虚拟机模板详情
                "queryVmTemplateDetail": function (templateId) {
                    if (!templateId) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "templateId": templateId
                    };
                    var deferred = ecsServiceIns.queryVmTemplateDetail(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        $scope.template.curTemplate = data;
                        _.extend($scope.template.curTemplate, {
                            "vmtName": data.name,
                            "vmtId": templateId,
                            "osType": data.osOption ? data.osOption.osType : "",
                            "osVersion": data.osOption ? data.osOption.osVersion : ""
                        });
                    });
                },

                // 查询虚拟机规格模板信息
                "queryConfigTemplates": function () {
                    var retDefer = $q.defer();
                    if ($scope.cloudInfra.id){
                        var options = {
                            "user": user,
                            "cloudInfraId": $scope.cloudInfra.id
                        };
                        var deferred = ecsServiceIns.queryConfigTemplates(options);
                        deferred.then(function (data) {
                            if (!data) {
                                retDefer.reject(data);
                                return;
                            }
                            var detail = {};
                            if (data.vmFlavors && data.vmFlavors.length > 0) {
                                _.each(data.vmFlavors, function (item) {
                                    _.extend(item, {
                                        "diskTotalSize": getDiskTotalSize(item.disks, "diskSize"),
                                        "selectId": item.flavorId,
                                        "label": item.name
                                    });
                                    if (item.systemDiskSize) {
                                        item.diskTotalSize += item.systemDiskSize;
                                    }
                                });

                                $scope.totalVmFlavors = data.vmFlavors;
                                // ICT场景根据模板的限制 最小磁盘，最小内存过滤规格
                                if($scope.ICT && $scope.action === "approval" && $scope.detail.param.vmTemplate.lock === '2'){
                                    data.vmFlavors = dealFlavors(data.vmFlavors);
                                }

                                if(!_.isEmpty(data.vmFlavors)){
                                    data.vmFlavors[0].checked = true;
                                    detail = data.vmFlavors[0];
                                }
                            }
                            $scope.config.configTem.detail = detail;
                            $scope.config.configTem.values = data.vmFlavors || [];
                            $scope.cupCount = data.vmFlavors[0] && data.vmFlavors[0].cpuCount;
                            $scope.memSize = data.vmFlavors[0] && data.vmFlavors[0].memSize;
                            $scope.diskTotalSize = data.vmFlavors[0] && data.vmFlavors[0].diskTotalSize;
                            retDefer.resolve(data);
                        });
                    }
                    return retDefer.promise;
                },

                // 查询SLA信息
                "querySLAs": function () {
                    var options = {
                        "user": user,
                        "azId": $scope.base.az.curr.id,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var deferred = ecsServiceIns.querySlaTags(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        $scope.config.sla.values = data.slas;
                        $scope.config.sla.curr = "";

                        // 初始化颜色块
                        setTimeout(function () {
                            initSlaAnimal();
                        }, 50);

                    });
                },

                // 查询vpc列表
                "queryVpcs": function () {
                    var retDefer = $q.defer();
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "azIds": $scope.base.az.curr ? [$scope.base.az.curr.id] : null
                    };
                    var deferred = ecsServiceIns.queryVpcByAz(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject(data);
                            return;
                        }
                        if (data.vpcs && data.vpcs.length > 0) {
                            _.each(data.vpcs, function (item) {
                                _.extend(item, {
                                    "label": item.name,
                                    "selectId": item.vpcID
                                });
                            });

                            data.vpcs[0].checked = true;
                            $scope.vpcId = data.vpcs[0].vpcID;
                            $scope.vpcName = data.vpcs[0].name;
                        }
                        $scope.network.vpc.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                },

                // 查询单个vpc详情
                "queryVpcDetail": function (vpcId) {
                    if (!vpcId) {
                        return;
                    }
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "vpcId": vpcId
                    };
                    var deferred = ecsServiceIns.queryVpcDetail(options);
                    deferred.then(function (data) {
                        if (data) {
                            data.label = data.name;
                            $scope.network.vpc.curVpc = data;
                        }
                    });
                },

                // 查询私有网络列表
                "queryPrivateNetworks": function (flag) {
                    if (!$scope.vpcId) {
                        return;
                    }
                    $scope.totalNets = [];
                    if ($scope.ICT) {
                        var deferred1 = $scope.operate.queryICTDirectNets();
                        var deferred2 = $scope.operate.queryVpcNets();
                        $.when(deferred1, deferred2).done(function () {
                            queryPrivateNetworksCallBack(flag);
                        });
                    }
                    else {
                        var deferred = $scope.operate.queryVpcNets();
                        $.when(deferred).then(function () {
                            queryPrivateNetworksCallBack(flag);
                        });
                    }
                },

                // 查询基础网络列表
                "queryBasicNetworks": function () {
                    var options = {
                        "user": $scope.user,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var deferred = ecsServiceIns.querySharedNetworks(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.sharedNetworks && data.sharedNetworks.length > 0) {
                            _.each(data.sharedNetworks, function (item) {
                                _.extend(item, {
                                    "selectId": item.network.networkID,
                                    "label": item.network.name
                                });
                            });

                            data.sharedNetworks[0].checked = true;
                            $scope.network.basicAz.curLabel = data.sharedNetworks[0].label;
                        }

                        $scope.network.basicAz.data = data.sharedNetworks;
                    });
                },

                // 查询ICT场景VPC网络 或者是 IT场景下的网络列表
                "queryVpcNets": function () {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": $scope.user,
                        "vpcId": $scope.vpcId,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var deferred = ecsServiceIns.queryNetworks(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if(data.networks){
                            $scope.totalNets = _.union($scope.totalNets, data.networks);
                            retDefer.resolve();
                        }
                    });
                    return retDefer.promise();
                },

                // 查询ICT下VPC直连网络
                "queryICTDirectNets": function () {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": $scope.user,
                        "vpcId": $scope.vpcId,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var deferred = ecsServiceIns.queryICTDirectNetworks(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if(data.externalNetworks){
                            $scope.totalNets = _.union($scope.totalNets, data.externalNetworks);
                            retDefer.resolve();
                        }
                    });
                    return retDefer.promise();
                },

                // 审批云主机
                "approvalEcs": function () {
                    var approvalResult = $("#" + $scope.approvalResult.id).widget().opChecked("checked");
                    var options = {
                        "user": user,
                        "id": $scope.orderDetail.orderId,
                        "params": {
                            "action": approvalResult,
                            "comments": $("#" + $scope.approvalOpinion.id).widget().getValue(),
                            "tenancy": $scope.orderDetail.tenancy
                        }
                    };

                    if (approvalResult === "approve"){
                        var ecsParam = {
                            "cloudInfraId": $scope.cloudInfra.id,
                            "availableZoneId": $scope.base.az.curr.id,
                            "availableZoneName": $scope.base.az.curr.name,
                            "templateId": getTemplateId(),
                            "templateInfo": getTemplateInfo(),
                            "vpcId": getVpcId(),
                            "vpcName":getVpcName(),
                            "count": $scope.orderDetail.param.count,
                            "name": $scope.orderDetail.param.name,
                            "vmSpec": {
                                "id": getFlavorId(),
                                "name":getFlavorName(),
                                "diskTotalSize":getTotalDisk(),
                                "nics": getNics()
                            },
                            "vmUniqueInfo": [{
                                 "customNic": getIpInfo()
                             }],
                            "tags": getTags()
                        };

                        var cpu = getCpuMemCount("cpu");
                        if (cpu) {
                            ecsParam.vmSpec.cpu = {
                                "count": cpu
                            };
                        }

                        var mem = getCpuMemCount("memory");
                        if (mem) {
                            ecsParam.vmSpec.memory = {
                                "count": mem
                            };
                        }

                        options.params.params = JSON.stringify(ecsParam);
                    }

                    var deferred = orderServiceIns.adminActionOrder(options);
                    deferred.then(function (data) {
                        setTimeout(function () {
                            window.history.back();
                        }, 0);
                    });
                },
                "actionOrder": function (param) {
                    var options = {
                        "id": orderId,
                        "user": user,
                        "params": param
                    };
                    var deferred = orderServiceIns.userActionOrder(options);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                }
            };

            var networkTypeView = {
                "1": i18n.vpc_term_directConnectNet_label,
                "2": i18n.vpc_term_innerNet_label,
                "3": i18n.vpc_term_routerNet_label
            };

            /**
             * 根据模板的最小内存和最小磁盘过滤flavor
             * @param vmFlavors
             */
            function dealFlavors(vmFlavors){
                if(!vmFlavors){
                    return [];
                }

                // ICT场景模板查详情没有minRam 和 minDisk字段，做规避
                if(!$scope.template.curValue || !$scope.template.curValue.minRam || !$scope.template.curValue.minDisk){
                    return vmFlavors;
                }

                var availableFlavors = [];
                _.each(vmFlavors, function(item){
                    if(item.memSize >= $scope.template.curTemplate.minRam && item.systemDiskSize >= $scope.template.curTemplate.minDisk){
                        availableFlavors.push(item);
                    }
                });
                if(!_.isEmpty(availableFlavors)){
                    availableFlavors[0].checked = true;
                }
                return availableFlavors;
            }

            // 查询私有网络（IT的网络列表，ICT的直连网络+路由网络）回调函数
            function queryPrivateNetworksCallBack(flag) {
                var data = $scope.totalNets;
                if (!data) {
                    return;
                }
                if (data.length > 0) {
                    var net;
                    var type;
                    _.each(data, function (item) {
                        if (!item.networkID) {
                            item.networkID = item.exnetworkID;
                        }
                        net = {
                            "selectId": item.networkID || item.exnetworkID,
                            "label": item.name + " ("
                        };
                        if (!$scope.ICT) {
                            type = networkTypeView[item.networkType];
                            if (type) {
                                net.label += type;
                            }
                        }
                        if (item.ipv4Subnet && item.ipv4Subnet.subnetAddr) {
                            net.label += " / " + item.ipv4Subnet.subnetAddr;
                        }
                        if (item.ipv6Subnet && item.ipv6Subnet.subnetAddr) {
                            net.label += " / " + item.ipv6Subnet.subnetAddr;
                        }
                        if (item.vlan) {
                            net.label += " / " + (item.vlan > VLAN_MAX_ID ? "VXLAN ID: " : "VLAN ID: ") + item.vlan;
                        }
                        if (item.vlans) {
                            net.label += " / VLAN ID: " + item.vlans;
                        }
                        net.label += ")";
                        net.label = net.label.replace("( / ", "(").replace(" ()", "");
                        _.extend(item, net);
                    });

                    var network = data[0];
                    network.checked = true;
                    $scope.network.privateNetwork.curLabel = network.label;
                    enhanceNetworkDetailCallBack(network, null, flag, vpcChangeIpStatusCallBack);
                }
                $scope.network.privateNetwork.data = data;
            }

            // 更新IP状态回调
            function vpcChangeIpStatusCallBack(network, index, flag) {
                if ("vpcChange" === flag) {
                    for (var i = 0, length = $scope.network.nics.length; i < length; i++) {
                        queryNetworkDetailAndUpdateIpStatus(network, i, flag);
                    }
                }
                else {
                    queryNetworkDetailAndUpdateIpStatus(network, 0, flag);
                }
            }

            function enhanceNetworkDetailCallBack(network, index, flag, fn) {
                if ($scope.ICT) {
                    var promise = ecsServiceIns.queryNetworkDetail({
                        "user": $scope.user,
                        "vpcId": $scope.vpcId,
                        "cloudInfraId": $scope.cloudInfra.id,
                        "networkId": network.networkID
                    });
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        network.ipv4Subnet = data.ipv4Subnet;
                        network.ipv6Subnet = data.ipv6Subnet;

                        fn.call(null, network, index, flag);
                    });
                }
                else {
                    fn.call(null, network, index, flag);
                }
            }

            // 提交时获取模板ID
            function getTemplateId() {
                var value = null;
                var template = $scope.detail.param.vmTemplate;
                if (template.lock === "2") {
                    value = $scope.template.selectedId;
                } else {
                    value = $scope.orderDetail.param.templateId;
                }
                return value;
            }

            // 提交时获取模板Info
            function getTemplateInfo() {
                var value = {};
                var template = $scope.detail.param.vmTemplate;
                if (template.lock === "2") {
                    value = {
                        "vmtName": $scope.template.curTemplate.vmtName,
                        "osType": $scope.template.curTemplate.osType,
                        "osVersion": $scope.template.curTemplate.osVersion
                    };
                } else {
                    value = $scope.orderDetail.param.templateInfo;
                }
                return value;
            }

            // 提交时获取VPC ID
            function getVpcId() {
                var value = null;
                var nic = $scope.detail.param.vmNetwork.nics[0];
                if (nic.lock === "2") {
                    if ($scope.network.networkType.selected === "private") {
                        value = $scope.vpcId;
                    } else {
                        value = getSharedNetworkVpc($("#" + $scope.network.basicAz.id).widget().getSelectedId());
                    }
                } else {
                    value = $scope.orderDetail.param.vpcId;
                }
                return value;
            }

            //提交时获取VPC name
            function getVpcName(){
                var vname = null;
                var nic = $scope.detail.param.vmNetwork.nics[0];
                if(nic.lock === "0" || nic.lock === "1"){
                    vname = $scope.orderDetail.param.vpcName;
                }else if(nic.lock === "2"){
                    if ($scope.network.networkType.selected === "private") {
                        vname = $scope.vpcName;
                    } else {
                        vname = getSharedNetworkVpc($("#" + $scope.network.privateNetwork.id).widget().getSelectedLabel());
                    }
                }
                return vname;
            }

            // 提交时获取规格flavor ID
            function getFlavorId() {
                var value = null;
                var flavor = $scope.detail.param.vmSpec.flavor;
                if (flavor.lock === "0" || flavor.lock === "1") {
                    value = $scope.orderDetail.param.vmSpec.id;
                } else if (flavor.lock === "2" && $scope.config.configType.selected === "system") {
                    value = $("#" + $scope.config.configTem.id).widget().getSelectedId();
                }
                return value;
            }

            // 提交时获取规格flavor name
            function getFlavorName(){
                var fname = null;
                var flavor = $scope.detail.param.vmSpec.flavor;
                if (flavor.lock === "0" || flavor.lock === "1") {
                    fname = $scope.orderDetail.param.vmSpec.name;
                } else if (flavor.lock === "2" && $scope.config.configType.selected === "system") {
                    fname = $("#" + $scope.config.configTem.id).widget().getSelectedLabel();
                }
                return fname;
            }

            // 提交时获取规格total disk
            function getTotalDisk(){
                var totalDisk = null;
                var flavor = $scope.detail.param.vmSpec.flavor;
                if (flavor.lock === "0" || flavor.lock === "1") {
                    totalDisk = $scope.orderDetail.param.vmSpec.diskTotalSize;
                } else if (flavor.lock === "2") {
                    totalDisk = $scope.diskTotalSize;
                }
                return totalDisk;
            }

            // 提交时获取CPU、内存
            function getCpuMemCount(type) {
                var value = null;
                var serviceDetail;
                var orderDetail;
                var userInputValue;
                var choiseValue;
                if (type === "cpu") {
                    serviceDetail = $scope.detail.param.vmSpec.spec.cpu || {};
                    orderDetail = $scope.orderDetail.param.vmSpec.cpu || {};
                    userInputValue = $scope.config.userDef.cpu;
                    choiseValue = $scope.cupCount;
                } else if (type === "memory") {
                    serviceDetail = $scope.detail.param.vmSpec.spec.memory || {};
                    orderDetail = $scope.orderDetail.param.vmSpec.memory || {};
                    userInputValue = $scope.config.userDef.mem;
                    choiseValue = $scope.memSize;
                }

                if (serviceDetail.lock === "0" || serviceDetail.lock === "1") {
                    value = orderDetail.count;
                } else if (serviceDetail.lock === "2" && $scope.config.configType.selected === "userDef") {
                    value = userInputValue;
                }else{
                    value = choiseValue;
                }
                return value;
            }

            // 提交时获取Tags
            function getTags(){
                var value = null;
                var sla = $scope.detail.param.vmSpec.spec.cpu;
                if (sla.lock === "2") {
                    var curr = $scope.config.sla.curr;
                    if (curr) {
                        value = [{
                             "name": "SLA",
                             "value": curr
                         }];
                    }
                } else {
                    value = $scope.orderDetail.param.tags;
                }
                return value;
            }

            // 提交时获取网卡
            function getNics() {
                var value = null;
                var lock = $scope.detail.param.vmNetwork.nics[0].lock;
                if (lock === "2") {
                    if ($scope.network.networkType.selected === "private") {
                        value = [];
                        var networkWidget;
                        _.each($scope.network.nics, function(item, index){
                            networkWidget = $("#" + $scope.network.privateNetwork.id + index).widget();
                            value.push({
                                "networkID": networkWidget.getSelectedId(),
                                "networkViewName": networkWidget.getSelectedLabel(),
                                "networkType": "private"
                            });
                        });

                    } else {
                        value = [{
                            "networkID": $("#" + $scope.network.basicAz.id).widget().getSelectedId(),
                            "networkViewName":$("#" + $scope.network.basicAz.id).widget().getSelectedLabel(),
                            "networkType": "basic"
                        }];
                    }
                } else {
                    value = $scope.orderDetail.param.vmSpec.nics;
                }
                return value;
            }

            // 提交时获取IP信息
            function getIpInfo() {
                var value = null;
                var nic = $scope.detail.param.vmNetwork.nics[0];
                if (nic.lock === "2" && $scope.network.networkType.selected === "private") {
                    value = [];
                    var ipv4;
                    var ipv6;
                    var tmp;

                    _.each($scope.network.nics, function(item, index){
                        ipv4 = $("#" + $scope.network.privateIpv4.id + index).widget().getValue();
                        ipv6 = $("#" + $scope.network.privateIpv6.id + index).widget().getValue();
                        tmp = {};
                        if (ipv4) {
                            tmp.ip = ipv4;
                        }
                        if (ipv6) {
                            tmp.ips6 = [ipv6];
                        }
                        value.push(tmp);
                    });

                } else if ($scope.orderDetail.param.vmUniqueInfo && $scope.orderDetail.param.vmUniqueInfo.length > 0) {
                    value = $scope.orderDetail.param.vmUniqueInfo[0].customNic;
                }

                return value;
            }

            // 计算磁盘的总大小
            function getDiskTotalSize(disks, sizeName) {
                var total = 0;
                if (disks && disks.length > 0) {
                    _.each(disks, function (item) {
                        total += parseInt(item[sizeName], 10);
                    });
                }
                return total;
            }

            // 从模板列表中，搜索指定模板
            function getSelectedTemplate(templateId) {
                var selected = _.find($scope.template.values, function (item) {
                    return item.vmtId === templateId;
                });
                return selected || {};
            }

            // 在网络列表中查找指定网络
            function getSpecNetwork(networks, id) {
                var network = {};
                if (networks && networks.length > 0 && id) {
                    network = _.find(networks, function (item) {
                        return item.networkID === id;
                    });
                }
                return network;
            }

            // 找到共享网络中某网络的VPC
            function getSharedNetworkVpc(networkId) {
                var vpcId = "";
                var sharedNetwork = _.find($scope.network.basicAz.data, function (item) {
                    return item.network.networkID === networkId;
                });

                if (sharedNetwork) {
                    vpcId = sharedNetwork.network.vpcID;
                }
                return vpcId;
            }

            // 查询网络详情，并更新ip输入框
            function queryNetworkDetailAndUpdateIpStatus(network, idx, flag) {
                if (!network) {
                    network = getSpecNetwork($scope.network.privateNetwork.data, $("#" + $scope.network.privateNetwork.id + idx).widget().getSelectedId());
                    enhanceNetworkDetailCallBack(network, idx, null, updateIpStatus);
                }
                else {
                    updateIpStatus(network, idx, null);
                }
            }


            // 刷新ipv4和ipv6输入框的状态
            function updateIpStatus(network,  idx) {
                var vmNum = parseInt($scope.orderDetail.param.count, 10);
                var ipv4Dom = $("#" + $scope.network.privateIpv4.id + idx).widget();
                if(ipv4Dom) {
                    if (vmNum === 1 && (network.ipv4Subnet && network.ipv4Subnet.subnetAddr && (network.ipv4Subnet.ipAllocatePolicy === 1 || network.ipv4Subnet.ipAllocatePolicy === 3))) {
                        ipv4Dom.setDisable(false);
                    } else {
                        ipv4Dom.setDisable(true);
                        ipv4Dom.option("value", "");
                    }
                }

                var ipv6Dom =  $("#" + $scope.network.privateIpv6.id + idx).widget();
                if (ipv6Dom) {
                    if (vmNum === 1 && (network.ipv6Subnet && network.ipv6Subnet.subnetAddr && (network.ipv6Subnet.ipAllocatePolicy === 1 || network.ipv6Subnet.ipAllocatePolicy === 3))) {
                        ipv6Dom.option("disable", false);
                    } else {
                        ipv6Dom.option("disable", true);
                        ipv6Dom.option("value", "");
                    }
                }
            }

            // 校验地域
            function validLocation() {
                var param = $scope.detail.param;
                if (param.cloudInfra && param.cloudInfra.lock === '2') {
                    if (!UnifyValid.FormValid($("#sspApprovalEcsLocation"))) {
                        return false;
                    }
                    if (!$scope.cloudInfra.id) {
                        tipMessageIns.alert("error", i18n.service_term_chooseRegion_msg);
                        return false;
                    }
                }
                return true;
            }

            // 校验模板
            function validTemplate() {
                var param = $scope.detail.param;
                if (param.vmTemplate && param.vmTemplate.lock === '2') {
                    if (!$scope.template.selectedId) {
                        tipMessageIns.alert("error", i18n.service_term_chooseTemplate_msg);
                        return false;
                    }
                }
                return true;
            }

            // 校验规格
            function validConfig() {
                var param = $scope.detail.param;
                if ((param.vmSpec.flavor && param.vmSpec.flavor.lock === '2') || (param.vmSpec.spec && (param.vmSpec.spec.cpu.lock === '2' || param.vmSpec.spec.memory.lock === '2'))) {
                    if ($scope.config.configType.selected === "system") {
                        if (!UnifyValid.FormValid($("#serviceApprovalEcsSysConfig"))) {
                            return false;
                        }

                        var configWidget = $("#" + $scope.config.configTem.id).widget();
                        if (!configWidget || !configWidget.getSelectedId()) {
                            tipMessageIns.alert("error", i18n.service_term_chooseSpec_msg);
                            return false;
                        }
                    } else {
                        if ($(".createvm-cpu .cpu-options[self-defined] input").length > 0 || $(".createvm-memory .memory-options[self-defined] input").length > 0) {
                            return false;
                        }
                    }
                }
                return true;
            }

            // 校验网络
            function validNetwork() {
                var param = $scope.detail.param;
                if (param.vmNetwork.nics && param.vmNetwork.nics.length > 0 && param.vmNetwork.nics[0].lock === '2') {
                    var networkWidget;
                    if ($scope.network.networkType.selected === "basic") {
                        if (!UnifyValid.FormValid($("#serviceApprovalEcsNetworkBase"))) {
                            return false;
                        }

                        networkWidget = $("#" + $scope.network.basicAz.id).widget();
                        if (!networkWidget || !networkWidget.getSelectedId()) {
                            tipMessageIns.alert("error", i18n.service_term_chooseNet_msg);
                            return false;
                        }
                    } else {
                        if (!UnifyValid.FormValid($("#serviceApprovalEcsNetworkVpc"))) {
                            return false;
                        }

                        var vpcWidget = $("#" + $scope.network.vpc.id).widget();
                        if (!vpcWidget || !vpcWidget.getSelectedId()) {
                            tipMessageIns.alert("error", i18n.service_term_chooseNet_msg);
                            return false;
                        }

                        networkWidget = $("#" + $scope.network.privateNetwork.id + "0").widget();
                        if (!networkWidget || !networkWidget.getSelectedId()) {
                            tipMessageIns.alert("error", i18n.service_term_chooseNet_msg);
                            return false;
                        }
                    }
                }
                return true;
            }

            //校验IPv4是否合法
            UnifyValid.isIPv4Check = function () {
                var element = this;
                var ipValue = element.val();
                if ($.trim(ipValue) === "") {
                    return true;
                }
                return validator.ipValidator(ipValue);
            };

            //校验IPv6是否合法
            UnifyValid.isIPv6Check = function () {
                var element = this;
                var ipValue = element.val();
                if ($.trim(ipValue) === "") {
                    return true;
                }
                return validator.ipv6Check(ipValue);
            };

            // 初始化CPU、内存颜色块事件
            function initCpuMemAnimal() {
                $(".createvm-cpu div.cpu-options").bind("click", function (evt) {
                    if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                        $(".createvm-cpu .cpu-options[self-defined]").html(i18n.common_term_custom_label);
                        $(".createvm-cpu .input-tip").css("display", "none");
                        $scope.config.userDef.cpu = $(evt.currentTarget).data("value");
                        $scope.config.userDef.cpuInput = false;
                    }
                    $(".createvm-cpu div.cpu-options").removeClass("selected");
                    $(evt.currentTarget).addClass("selected");
                });

                $(".createvm-memory div.memory-options").bind("click", function (evt) {
                    if (typeof ($(evt.currentTarget).attr("self-defined")) === "undefined") {
                        $(".createvm-memory .memory-options[self-defined]").html(i18n.common_term_custom_label);
                        $(".createvm-memory .input-tip").css("display", "none");
                        $scope.config.userDef.mem = $(evt.currentTarget).data("value");
                        $scope.config.userDef.memInput = false;
                    }
                    $(".createvm-memory div.memory-options").removeClass("selected");
                    $(evt.currentTarget).addClass("selected");
                });
            }

            // 初始化SLA颜色块事件
            function initSlaAnimal() {
                $(".createvm-types").undelegate(".types-item", "click");
                $(".createvm-types").delegate(".types-item", "click", function (evt) {
                    var value = "";

                    if ($(evt.currentTarget).hasClass("selected")) {
                        $(evt.currentTarget).removeClass("selected").find("i").removeClass("icon-ok");
                    } else {
                        $(".createvm-types .types-item").removeClass("selected").find("i").removeClass("icon-ok");
                        $(evt.currentTarget).addClass("selected").find("i").addClass("icon-ok");
                        value = $(evt.currentTarget).data("value");
                    }

                    $scope.config.sla.curr = value;
                });
            }

            // AZ变化时重新查询模板、规格、网络信息
            function onSelectAz() {
                var param = $scope.detail.param || {};

                // 查询模板(没有锁定时才查询)
                if (param.vmTemplate) {
                    if ($scope.action === "approval" && param.vmTemplate.lock === '2') {
                        var vmTempDefer = $scope.operate.queryVmTemplates();
                        vmTempDefer.then(function (data) {
                            setTimeout(function () {
                                var templates = $scope.template.values;
                                if (templates && templates.length > 0) {
                                    $scope.template.select(templates[0].vmtId);
                                }
                            }, 20);
                        });
                    } else {
                      $scope.template.curTemplate = $scope.orderDetail.param.templateInfo;
                    }
                }

                // 查询规格(没有锁定时才查询)
                var vmSpec = param.vmSpec || {};
                if ($scope.action === "approval" && ((vmSpec.flavor && vmSpec.flavor.lock === '2') || (vmSpec.spec && (vmSpec.spec.cpu.lock === '2' || vmSpec.spec.memory.lock === '2')))) {
                    if (!$scope.supportUserDefineConfig){
                        $scope.operate.queryConfigTemplates();
                    } else {
                        $scope.operate.querySLAs();
                        setTimeout(function () {
                            // 初始化自定义规格颜色块
                            initCpuMemAnimal();
                            $(".createvm-cpu .cpu-options[self-defined]").userDefCpuApprovalVm($scope.config.userDef, i18n.common_term_core_label);
                            $(".createvm-memory .memory-options[self-defined]").userDefMemApprovalVm($scope.config.userDef);
                        }, 20);
                    }
                } else {
                    if ($scope.orderDetail.param.vmSpec.id) {
                        if($scope.action !== "view"){
                            // 目前没有查询单个规格详情的接口，先查列表，后面有了再改
                            var vmConfigDefer = $scope.operate.queryConfigTemplates();
                            vmConfigDefer.then(function (data) {
                                var detail = _.find($scope.config.configTem.values, function (item) {
                                    return item.flavorId === $scope.orderDetail.param.vmSpec.id;
                                });

                                $scope.config.configTem.detail = detail || {};
                            });
                        }else{
                            $scope.config.configTem.detail.name = $scope.orderDetail.param.vmSpec.name;
                            $scope.config.configTem.detail.cpuCount = $scope.orderDetail.param.vmSpec.cpu.count;
                            $scope.config.configTem.detail.memSize = $scope.orderDetail.param.vmSpec.memory.count;
                            $scope.config.configTem.detail.diskTotalSize = $scope.orderDetail.param.vmSpec.diskTotalSize;
                        }

                    } else {
                        var spec = $scope.orderDetail.param.vmSpec;
                        if (spec.cpu){
                            $scope.config.configTem.detail.cpuCount = spec.cpu.count;
                        }
                        if (spec.memory){
                            $scope.config.configTem.detail.memSize = spec.memory.count;
                        }
                    }
                }

                // 查询网络(没有锁定时才查询)
                var vmNetwork = param.vmNetwork || {};
                if (vmNetwork.nics && vmNetwork.nics.length > 0 && vmNetwork.nics[0].lock !== "0") {
                    if ($scope.action === "approval" && vmNetwork.nics[0].lock === "2") {
                        var vpcDefer = $scope.operate.queryVpcs();
                        vpcDefer.then(function (data) {
                            $scope.operate.queryPrivateNetworks();
                        });
                        if ($scope.supportUserDefineConfig) {
                            $scope.operate.queryBasicNetworks();
                        }
                    } else {
                       $scope.network.vpc.curVpc.label = $scope.orderDetail.param.vpcName;
                    }
                }
            }

            // 查询ecs需要的模板、规格、网络信息
            function queryRelatedInfo() {
                // 查询能力差异
                $scope.operate.queryCapacity();
                $scope.config.configType.selected = $scope.supportUserDefineConfig ? "userDef" : "system";

                // 查询AZ
                var azDefer = {};
                var param = $scope.detail.param || {};
                if ($scope.action === "approval" && param.availableZone && param.availableZone.lock === "2") {
                    azDefer = $scope.operate.queryAzs();
                } else {
                    var orderParam = $scope.orderDetail.param || {};
                    _.extend($scope.base.az.curr, {
                        "id": orderParam.availableZoneId,
                        "name": orderParam.availableZoneName
                    });
                }
                $.when(azDefer).done(function (data) {
                    onSelectAz();
                });
            }

            // 初始化页面信息
            function init() {
                var deferred = $scope.operate.queryOrderDetail();
                $.when(deferred).done(function () {
                    var deferred3;
                    if ($scope.detail.param.cloudInfra.lock === "2" && $scope.action === "approval") {
                        deferred3 = $scope.operate.queryLocations();
                    } else {
                        deferred3 = $scope.operate.queryLocationDetail();
                    }

                    deferred3.then(function () {
                        queryRelatedInfo();
                    });
                });
            }

            init();
        }
    ];

    return ctrl;
});
