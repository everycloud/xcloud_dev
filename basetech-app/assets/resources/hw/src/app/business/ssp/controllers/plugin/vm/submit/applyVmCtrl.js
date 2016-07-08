/* global define */
define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    "app/services/cloudInfraService",
    "app/services/tipMessageService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/plugin/ecs/ecsService",
    "app/business/ssp/services/plugin/commonService",
    'app/services/commonService',
    'bootstrap/bootstrap.min',
    'tiny-directives/RadioGroup'
], function (sprintf,keyIDI18n,$, angular, _, UnifyValid, http, validatorService, exceptionService, capacityService, cloudInfraService, tipMessageService, catalogService, orderService, ecsService, commonService, timeCommonService) {
    "use strict";

    // 自定义CPU框
    $.fn.userDefCpu = function (userDef, unit) {
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
    $.fn.userDefMem = function (userDef) {
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

    var ctrl = ["$scope", "$state", "$stateParams", "$q", "camel", "exception",
        function ($scope, $state, $stateParams, $q, camel, exception) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;

            var user = $scope.user;
            $scope.ICT = user.cloudType === "ICT";
            var VLAN_MAX_ID = 4095;
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            var action = $stateParams.action;

            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var ecsServiceIns = new ecsService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);
            var tipMessageIns = new tipMessageService();

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
                name: {
                    "label": i18n.common_term_name_label + ":",
                    "width": "220",
                    "value": "",
                    "id": "serviceApplyEcsName",
                    "extendFunction": ["nameValid"],
                    "validate": "nameValid():" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, 1, 56)
                },

                location: {
                    "id": "serviceApplyEcsRegion",
                    "label": i18n.common_term_section_label + ":",
                    "require": true,
                    "width": "180",
                    "values": [],
                    "validate": "required:" + i18n.common_term_null_valid,
                    "change": function () {
                        $scope.cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.base.location.values, $("#" + $scope.base.location.id).widget().getSelectedId());
                        $scope.vpcId = "";
                        queryRelatedInfo();
                    }
                },

                az: {
                    "label": i18n.resource_term_AZ_label + ":",
                    "id": "serviceApplyEcsAz",
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

                vmNum: {
                    "label": i18n.vm_term_vmNum_label + ":",
                    "require": true,
                    "id": "serviceApplyEcsVmNum",
                    "width": "180",
                    "value": "1",
                    "min": "1",
                    "max": "30",
                    "step": "1",
                    "change": function () {
                        for (var i = 0, length = $scope.network.nics.length; i < length; i++) {
                            queryNetworkDetailAndUpdateIpStatus(null, i, null);
                        }
                    }
                },

                // 到期时间
                expireTime: {
                    "label": i18n.common_term_overdueTime_label + ":",
                    "id": "serviceApplyEcsExpireTime",
                    "width": "178",
                    "require": true,
                    "disable": false,
                    "type": "datetime",
                    "minDate": commonServiceIns.getCurrentTime(),
                    "defaultDate": commonServiceIns.get30DaysDate(),
                    "dateFormat": "yy-mm-dd",
                    "timeFormat": "hh:mm:ss"
                },

                neverExpire: {
                    "id": "serviceApplyEcsNeverExpire",
                    "checked": false,
                    "text": i18n.common_term_neverExpires_label,
                    "change": function () {
                        $scope.base.expireTime.disable = $("#" + $scope.base.neverExpire.id).widget().option("checked");
                    }
                }
            };

            // 备注
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspApplyEcsRemark",
                "value": "",
                "type": "multi",
                "width": "220",
                "height": "57",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            // 选择虚拟机模板
            $scope.template = {
                values: [],
                curValue: {},
                selectedId: "",
                select: function (templateId) {
                    //先清空已有数据
                    $scope.template.clearSelectedTemplate();

                    var dom = $(".service_apply_ecs_template_bk_color");
                    if (dom.length > 0) {
                        dom.each(function () {
                            if ($(this).data("value") === templateId) {
                                $(this).addClass("service_apply_ecs_selected_template");
                                $scope.template.selectedId = templateId;

                                setTimeout(function(){
                                    $scope.$apply(function(){
                                        $scope.template.curValue = getSelectedTemplate(templateId);
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
                                    });
                                }, 0);
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
                    $scope.template.curValue = {};
                },

                "nameLabel": i18n.common_term_templateNmae_label + ":",
                "osLabel": i18n.common_term_OStype_label + ":",
                "osVersionLabel": i18n.common_term_OSversion_label + ":"
            };

            // 规格信息
            $scope.config = {
                "configType": {
                    "id": "serviceApplyEcsConfigType",
                    "layout": "horizon",
                    "selected": "",
                    "values": [{
                        "key": "system",
                        "text": i18n.spec_term_sysSpec_label,
                        "checked": true
                    }, {
                        "key": "userDef",
                        "text": i18n.common_term_customSpec_label
                    }],
                    "change": function () {
                        $scope.config.configType.selected = $("#" + $scope.config.configType.id).widget().opChecked("checked");
                    }
                },
                "configTem": {
                    id: "serviceApplyEcsSelectConfigTem",
                    label: i18n.common_term_name_label + ":",
                    width: "180",
                    height: "215",
                    detail: {},
                    values: [],
                    validate: "required:" + i18n.common_term_null_valid,
                    "change": function () {
                        var id = $("#" + $scope.config.configTem.id).widget().getSelectedId();
                        $scope.config.configTem.detail = _.find($scope.config.configTem.values, function (item) {
                            return item.flavorId === id;
                        });
                        var detail = $scope.config.configTem.detail;
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
                    "label": "SLA:",
                    "values": [],
                    "curr": "",
                    "colors": ["#6cbfe8", "#39a8e0", "#1e8ac0", "#16658d", "#0e405a"]
                },
                ictSla: {
                    "id": "sspApplyEcsSLATable",
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
                    "id": "serviceApplyEcsNetworkType",
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

                basicNetwork: {
                    "label": i18n.vpc_term_net_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "serviceApplyEcsBasicAz",
                    "width": "220",
                    "curLabel": "",
                    "data": [],
                    "change": function () {
                        $scope.network.basicNetwork.curLabel = $("#" + $scope.network.basicNetwork.id).widget().getSelectedLabel();
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
                    "label": i18n.vpc_term_vpc_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "serviceApplyEcsVpcId",
                    "width": "320",
                    "class": "ssp_vm_vpc_label",
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
                    "curLabel": "",
                    "data": [],
                    "change": function (index) {
                        var networkWidget = $("#" + $scope.network.privateNetwork.id + index).widget();
                        if (networkWidget) {
                            if (index === 0) {
                                $scope.network.privateNetwork.curLabel = networkWidget.getSelectedLabel();
                            }
                            var network = getSpecNetwork($scope.network.privateNetwork.data, networkWidget.getSelectedId());
                            enhanceNetworkDetailCallBack(network, index, null, queryNetworkDetailAndUpdateIpStatus);
                        }
                    }
                },

                privateIpv4: {
                    "label": i18n.common_term_IPv4_label + ":",
                    "id": "serviceApplyEcsIpv4",
                    "type": "ipv4",
                    "width": "200",
                    "value": "",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "isIPv4Check():" + i18n.common_term_formatIP_valid
                },

                privateIpv6: {
                    "label": i18n.common_term_IPv6_label + ":",
                    "id": "serviceApplyEcsIpv6",
                    "type": "ipv6",
                    "width": "260",
                    "value": "",
                    "extendFunction": ["isIPv6Check"],
                    "validate": "isIPv6Check():" + i18n.common_term_formatIP_valid
                },

                addNic: {
                    "id": "serviceApplyEcsAddNic",
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

            $scope.okBtn = {
                "id": "serviceApplyEcsOkBtn",
                "text": i18n.common_term_submit_button,
                "tooltip": "",
                "click": function () {
                    // 校验
                    if (!$scope.okBtn.valid()) {
                        return;
                    }
                    $scope.operate.applyEcs();
                },
                "valid": function () {
                    if (!validLocation() || !validTemplate() || !validConfig() || !validNetwork() || !validBasic()) {
                        return false;
                    }
                    return true;
                }
            };
            $scope.cancelBtn = {
                "id": "serviceApplyEcsCancelBtn",
                "text": i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    setTimeout(function () {
                        window.history.back();
                    }, 0);
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
                    if (id === "sspApplyVmLocationArea" && !validLocation()) {
                        return;
                    } else if (id === "sspApplyVmTemplateArea" && !validTemplate()) {
                        return;
                    } else if (id === "sspApplyVmConfigArea" && !validConfig()) {
                        return;
                    } else if (id === "sspApplyVmNetworkArea" && !validNetwork()) {
                        return;
                    } else if (id === "sspApplyVmBasicArea" && !validBasic()) {
                        return;
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
                // 查询服务详情
                "queryServiceDetail": function () {
                    var retDefer = $.Deferred();
                    var options = {
                        "user": user,
                        "id": serviceId
                    };
                    var deferred = catalogServiceIns.queryServiceOffering(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        $scope.detail = data;
                        $scope.detail.param = JSON.parse(data.params);
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询订单详情
                "queryOrderDetail": function () {
                    if (action !== "edit") {
                        return {};
                    }
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
                        $scope.orderDetail = data;
                        $scope.orderDetail.param = JSON.parse(data.params);
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
                            if (action === "edit") {
                                data.cloudInfras[0].checked = false;
                                var selectedCloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $scope.orderDetail.param.cloudInfraId);
                                if (selectedCloudInfra) {
                                    selectedCloudInfra.checked = true;
                                }
                                $scope.cloudInfra = selectedCloudInfra;
                            } else {
                                $scope.cloudInfra = data.cloudInfras[0];
                            }
                            $scope.base.location.values = data.cloudInfras;
                            retDefer.resolve();
                        }
                    });
                    return retDefer.promise;
                },

                // 查询地域详情
                "queryLocationDetail": function (id) {
                    var retDefer = $q.defer();
                    var deferred = cloudInfraServiceIns.queryCloudInfra(user.vdcId, user.id, id);
                    deferred.then(function (data) {
                        if (data && data.cloudInfra) {
                            $scope.cloudInfra = data.cloudInfra;
                            retDefer.resolve();
                        }
                    });
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
                            var selectAz;
                            if (action === "edit") {
                                data.availableZones[0].checked = false;
                                selectAz = cloudInfraServiceIns.getSpecAz(data.availableZones, $scope.orderDetail.param.availableZoneId);
                            }

                            if (!selectAz) {
                                selectAz = data.availableZones[0];
                            }

                            selectAz.checked = true;
                            $scope.base.az.curr = selectAz;
                            $scope.base.az.values = data.availableZones;
                            retDefer.resolve(data);
                        }
                    });
                    return retDefer.promise();
                },

                // 查询虚拟机模板
                "queryVmTemplates": function () {
                    var retDefer = $q.defer();
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

                        $scope.template.curValue = data;
                        _.extend($scope.template.curValue, {
                            "vmtName": data.name,
                            "vmtId": templateId,
                            "osVersion": data.osOption ? data.osOption.osVersion : "",
                            "osType": data.osOption ? data.osOption.osType : ""
                        });
                    });
                },

                // 查询虚拟机规格模板信息
                "queryConfigTemplates": function () {
                    var options = {
                        "user": user,
                        "cloudInfraId": $scope.cloudInfra.id
                    };
                    var deferred = ecsServiceIns.queryConfigTemplates(options);
                    deferred.then(function (data) {
                        if (!data) {
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
                            data.vmFlavors = $scope.ICT ? dealFlavors(data.vmFlavors) : data.vmFlavors;

                            var curFlavor;
                            var serviceParamVmSpec = $scope.detail.param.vmSpec || {};
                            var flavor = serviceParamVmSpec.flavor || {};
                            if (flavor.lock === "0") {
                                curFlavor = _.find(data.vmFlavors, function (item) {
                                    return item.flavorId === flavor.id;
                                });
                            } else if (action === "edit" && $scope.orderDetail.param && $scope.orderDetail.param.vmSpec && $scope.orderDetail.param.vmSpec.id) {
                                curFlavor = _.find(data.vmFlavors, function (item) {
                                    return item.flavorId === $scope.orderDetail.param.vmSpec.id;
                                });
                            } else {
                                curFlavor = data.vmFlavors[0];
                            }

                            if (curFlavor) {
                                curFlavor.checked = true;
                            }
                            detail = curFlavor;
                        }
                        $scope.config.configTem.detail = detail;
                        $scope.config.configTem.values = data.vmFlavors || [];
                        $scope.cupCount = data.vmFlavors[0] && data.vmFlavors[0].cpuCount;
                        $scope.memSize = data.vmFlavors[0] && data.vmFlavors[0].memSize;
                        $scope.diskTotalSize = data.vmFlavors[0] && data.vmFlavors[0].diskTotalSize;
                    });
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
                            // 如果是修改，将老的SLA标签选上
                            if (action === "edit") {
                                var orderParam = $scope.orderDetail.param || {};
                                if (orderParam.tags && orderParam.tags.length > 0) {
                                    var tag = orderParam.tags[0];
                                    var slaDom = $(".createvm-types .types-item[data-value=" + tag.value + "]");
                                    if (slaDom.length > 0) {
                                        slaDom.trigger("click");
                                    }
                                }
                            }
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

                            var param = $scope.orderDetail.param || {};
                            if (action === "edit" && param.vmSpec && param.vmSpec.nics && param.vmSpec.nics.length > 0) {
                                $scope.network.networkType.selected = param.vmSpec.nics[0].networkType;
                                var basicNetwork = param.vmSpec.nics[0].networkType === "basic";
                                $scope.network.networkType.values = [{
                                    "key": "basic",
                                    "text": i18n.common_term_basicNet_label,
                                    "checked": basicNetwork
                                }, {
                                    "key": "private",
                                    "text": i18n.common_term_privateNet_label,
                                    "checked": !basicNetwork
                                }];
                            }

                            var curVpc;
                            if (action === "edit" && param.vmSpec && param.vmSpec.nics && param.vmSpec.nics.length > 0 && param.vmSpec.nics[0].networkType === "private") {
                                curVpc = _.find(data.vpcs, function (item) {
                                    return item.vpcID === param.vpcId;
                                });
                            }
                            if (!curVpc) {
                                curVpc = data.vpcs[0];
                            }

                            curVpc.checked = true;
                            $scope.vpcId = curVpc.vpcID;
                            $scope.vpcName = curVpc.name;
                        }
                        $scope.network.vpc.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
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

                            var network;
                            var param = $scope.orderDetail.param;
                            if (action === "edit" && param && param.vmSpec && param.vmSpec.nics && param.vmSpec.nics.length > 0 && param.vmSpec.nics[0].networkType === "basic") {
                                network = _.find(data.sharedNetworks, function (item) {
                                    return item.network && (item.network.networkID === param.vmSpec.nics[0].networkID);
                                });
                            } else {
                                network = data.sharedNetworks[0];
                            }

                            if (network) {
                                network.checked = true;
                                $scope.network.basicNetwork.curLabel = network.label;
                            }
                        }

                        $scope.network.basicNetwork.data = data.sharedNetworks;
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
                        }
                        retDefer.resolve();
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
                        }
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 提交申请云主机
                "applyEcs": function () {
                    var ecsParam = {
                        "cloudInfraId": $scope.cloudInfra.id,
                        "availableZoneId": $scope.base.az.curr.id,
                        "availableZoneName": $scope.base.az.curr.name,
                        "templateId": getTemplateId(),
                        "templateInfo":{
                            "vmtName":$scope.template.curValue.vmtName,
                            "osType":$scope.template.curValue.osType,
                            "osVersion":$scope.template.curValue.osVersion
                        },
                        "vpcId": getVpcId(),
                        "vpcName":getVpcName(),
                        "count": $("#" + $scope.base.vmNum.id).widget().option("value"),
                        "vmSpec": {
                            "id": getFlavorId(),
                            "name":getFlavorName(),
                            "diskTotalSize":$scope.diskTotalSize,
                            "nics": getNics()
                        },
                        "vmUniqueInfo": [{
                            "customNic": getIpInfo()
                        }],
                        "tags": getTags()
                    };

                    var name = $.trim($("#" + $scope.base.name.id).widget().getValue());
                    if (name) {
                        ecsParam.name = name;
                    }

                    var cpu = getCpuMemCount($scope.detail.param.vmSpec.spec.cpu, $scope.config.userDef.cpu,"cpu");
                    if (cpu) {
                        ecsParam.vmSpec.cpu = {
                            "count": cpu
                        };
                    }

                    var mem = getCpuMemCount($scope.detail.param.vmSpec.spec.memory, $scope.config.userDef.mem,"memory");
                    if (mem) {
                        ecsParam.vmSpec.memory = {
                            "count": mem
                        };
                    }

                    var options;
                    var deferred;
                    var tenancy = $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc($("#" + $scope.base.expireTime.id).widget().getDateTime());
                    var comments = $("#" + $scope.remark.id).widget().getValue();
                    if (action === "edit") { // 修改订单
                        options = {
                            "user": user,
                            "id": orderId,
                            "params": {
                                "params": JSON.stringify(ecsParam),
                                "tenancy": tenancy,
                                "comments": comments
                            }
                        };
                        deferred = orderServiceIns.modifyOrder(options);
                    } else { // 申请订单
                        options = {
                            "user": user,
                            "params": {
                                "apply": {
                                    "serviceOfferingId": serviceId,
                                    "params": JSON.stringify(ecsParam),
                                    "tenancy": tenancy
                                },
                                "comments": comments
                            }
                        };
                        deferred = orderServiceIns.createOrder(options);
                    }

                    deferred.then(function (data) {
                        if (data && data.orderId) {
                            tipMessageIns.sspAlert(data.orderId, function(){
                                $state.go("ssp.approvalVmApply", {
                                    "orderId" : data.orderId,
                                    "action" : "view",
                                    "serviceId" : serviceId
                                });
                            });
                        }
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
                    if(item.memSize >= $scope.template.curValue.minRam && item.systemDiskSize >= $scope.template.curValue.minDisk){
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

                    if (action === "apply") {
                        var network = data[0];
                        network.checked = true;
                        $scope.network.privateNetwork.curLabel = network.label;
                        enhanceNetworkDetailCallBack(network, null, flag, vpcChangeIpStatusCallBack);
                    }
                }
                $scope.network.privateNetwork.data = data;

                // 修改时，将申请时输入的私有网络和IP填上(延时一会，等下拉框内容先填上)
                setTimeout(function () {
                    var param = $scope.orderDetail.param || {};
                    var vmSpec = param.vmSpec || {};
                    var nics = vmSpec.nics;

                    if (action === "edit" && flag === "init" && nics && nics.length > 0 && nics[0].networkType === "private") {

                        // 获取第一个网络的名称（收起来时，只显示第一个，太多了显示不下）
                        var firstNetwork = getSpecNetwork(data, nics[0].networkID);
                        if (firstNetwork) {
                            $scope.$apply(function () {
                                $scope.network.privateNetwork.curLabel = firstNetwork.label;
                            });
                        }

                        var customIps;
                        var networkWidget;
                        var ipv4Widget;
                        var ipv6Widget;
                        if (param.vmUniqueInfo && param.vmUniqueInfo.length > 0) {
                            customIps = param.vmUniqueInfo[0].customNic;
                        }

                        _.each(nics, function (item, index) {
                            networkWidget = $("#" + $scope.network.privateNetwork.id + index).widget();
                            if (networkWidget) {
                                networkWidget.opChecked(item.networkID);
                            }

                            if (customIps && customIps[index]) {
                                ipv4Widget = $("#" + $scope.network.privateIpv4.id + index).widget();
                                ipv6Widget = $("#" + $scope.network.privateIpv6.id + index).widget();

                                if (ipv4Widget) {
                                    ipv4Widget.option("value", customIps[index].ip);
                                }

                                if (ipv6Widget && customIps[index].ips6 && customIps[index].ips6.length > 0) {
                                    ipv6Widget.option("value", customIps[index].ips6[0]);
                                }
                            }
                            queryNetworkDetailAndUpdateIpStatus(null, index, null);
                        });
                    }
                }, 50);
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

            // 提交时获取模板ID
            function getTemplateId() {
                var value = null;
                var template = $scope.detail.param.vmTemplate;
                if (template.lock === "0") {
                    value = template.id;
                } else if (template.lock === "1") {
                    value = $scope.template.selectedId;
                }
                return value;
            }

            // 提交时获取VPC ID
            function getVpcId() {
                var value = null;
                var nic = $scope.detail.param.vmNetwork.nics[0];
                if (nic.lock === "0") {
                    value = nic.vpcId;
                } else if (nic.lock === "1") {
                    if ($scope.network.networkType.selected === "private") {
                        value = $scope.vpcId;
                    } else {
                        value = getSharedNetworkVpc($("#" + $scope.network.basicNetwork.id).widget().getSelectedId());
                    }
                }
                return value;
            }

            //提交时获取VPC name
            function getVpcName(){
                var vname = null;
                var nic = $scope.detail.param.vmNetwork.nics[0];
                if(nic.lock === "0"){
                    vname = nic.vpcName;
                }else if(nic.lock === "1"){
                    if ($scope.network.networkType.selected === "private") {
                        vname = $scope.vpcName;
                    } else {
                        vname = getSharedNetworkVpc($("#" + $scope.network.basicNetwork.id).widget().getSelectedLabel());
                    }
                }
                return vname;
            }

            // 提交时获取规格flavor ID
            function getFlavorId() {
                var value = null;
                var flavor = $scope.detail.param.vmSpec.flavor;
                if (flavor.lock === "0") {
                    value = flavor.id;
                } else if (flavor.lock === "1" && $scope.config.configType.selected === "system") {
                    value = $("#" + $scope.config.configTem.id).widget().getSelectedId();
                }
                return value;
            }
            // 提交时获取规格flavor name
            function getFlavorName(){
                var fname = null;
                var flavor = $scope.detail.param.vmSpec.flavor;
                if (flavor.lock === "0") {
                    fname = $scope.config.configTem.detail.name;
                } else if (flavor.lock === "1" && $scope.config.configType.selected === "system") {
                    fname = $("#" + $scope.config.configTem.id).widget().getSelectedLabel();
                }
                return fname;
            }

            // 提交时获取CPU、内存
            function getCpuMemCount(lockObj, applyInputValue,type) {
                var value = null;
                if (lockObj.lock === "0") {
                    value = lockObj.value;
                } else if (lockObj.lock === "1" && $scope.config.configType.selected === "userDef") {
                    value = applyInputValue;
                }else{
                    if (type === "cpu"){
                        value = $scope.cupCount;
                    }else{
                        value = $scope.memSize;
                    }
                }
                return value;
            }

            // 提交时获取Tags
            function getTags(){
                var value = null;
                var vmSpec = $scope.detail.param.vmSpec || {};
                var sla = vmSpec.sla || {};
                if (sla.lock === "0" && sla.value) {
                    value = [{
                         "name": "SLA",
                         "value": sla.value
                     }];
                } else if (sla.lock === "1") {
                    var curr = $scope.config.sla.curr;
                    if (curr) {
                        value = [{
                             "name": "SLA",
                             "value": curr
                        }];
                    }
                }
                return value;
            }

            // 提交时获取网卡
            function getNics() {
                var value = null;
                var nics = $scope.detail.param.vmNetwork.nics;
                var lock = nics[0].lock;
                if (lock === "0") {
                    value = [{
                        "networkID": nics[0].networkId,
                        "networkViewName":$("#" + $scope.network.basicNetwork.id).widget().getSelectedLabel(),
                        "networkType": "basic"
                    }];
                } else if (lock === "1") {
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
                            "networkID": $("#" + $scope.network.basicNetwork.id).widget().getSelectedId(),
                            "networkViewName":$("#" + $scope.network.basicNetwork.id).widget().getSelectedLabel(),
                            "networkType": "basic"
                        }];
                    }
                }
                return value;
            }

            // 提交时获取IP信息
            function getIpInfo() {
                var value = null;
                var nic = $scope.detail.param.vmNetwork.nics[0];
                if (nic.lock === "1" && $scope.network.networkType.selected === "private") {
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
                var sharedNetwork = _.find($scope.network.basicNetwork.data, function (item) {
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
            function updateIpStatus(network, idx, flag) {
                var vmNum = parseInt($("#" + $scope.base.vmNum.id).widget().option("value"), 10);
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

            // 校验地域
            function validLocation() {
                var param = $scope.detail.param;
                if (param.cloudInfra && param.cloudInfra.lock === '1') {
                    if (!UnifyValid.FormValid($("#sspApplyVmLocationArea"))) {
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
                if (param.vmTemplate && param.vmTemplate.lock === '1') {
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
                if ((param.vmSpec.flavor && param.vmSpec.flavor.lock === '1') || (param.vmSpec.spec && (param.vmSpec.spec.cpu.lock === '1' || param.vmSpec.spec.memory.lock === '1'))) {
                    if ($scope.config.configType.selected === "system") {
                        if (!UnifyValid.FormValid($("#serviceApplyEcsSysConfig"))) {
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
                if (param.vmNetwork.nics && param.vmNetwork.nics.length > 0 && param.vmNetwork.nics[0].lock === '1') {
                    var networkWidget;
                    if ($scope.network.networkType.selected === "basic") {
                        if (!UnifyValid.FormValid($("#serviceApplyEcsNetworkBase"))) {
                            return false;
                        }

                        networkWidget = $("#" + $scope.network.basicNetwork.id).widget();
                        if (!networkWidget || !networkWidget.getSelectedId()) {
                            tipMessageIns.alert("error", i18n.service_term_chooseNet_msg);
                            return false;
                        }
                    } else {
                        if (!UnifyValid.FormValid($("#serviceApplyEcsNetworkVpc"))) {
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

            // 校验基本信息
            function validBasic() {
                var param = $scope.detail.param;
                if (!UnifyValid.FormValid($("#sspApplyVmBasicArea"))) {
                    return false;
                }

                var vmNum = $("#" + $scope.base.vmNum.id).widget().option("value");
                if (!vmNum || vmNum < 1) {
                    tipMessageIns.alert("error", i18n.service_term_chooseVMnum_msg);
                    return false;
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

            //校验名称是否合法
            UnifyValid.nameValid = function () {
                var input = $("#" + $scope.base.name.id).widget().getValue();
                if ($.trim(input) === "") {
                    return true;
                }
                var nameReg = /^[ ]*[A-Za-z0-9-_ \u4e00-\u9fa5]{1,56}[ ]*$/;
                return nameReg.test(input);
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

            //根据订单详情，初始化页面基本信息
            function initBaseByOrderDetail() {
                var param = $scope.orderDetail.param || {};
                // 名称
                $scope.base.name.value = param.name;

                // 备注
                $scope.remark.value = $scope.orderDetail.comments;

                // 虚拟机个数
                $scope.base.vmNum.value = param.count || "1";

                // 到期时间
                if ($scope.orderDetail.tenancy) {
                    if ($scope.orderDetail.tenancy === "0") {
                        $scope.base.expireTime.disable = true;
                        $scope.base.neverExpire.checked = true;
                    } else {
                        var dateWidget = $("#" + $scope.base.expireTime.id).widget();
                        if (dateWidget) {
                            var localTime = timeCommonService.utc2Local($scope.orderDetail.tenancy);
                            var dateTime = localTime.split(" ");
                            dateWidget.option("defaultTime", dateTime[1]);
                            dateWidget.option("defaultDate", dateTime[0]);
                        }
                    }
                }

                // 网卡个数
                if (param.vmSpec) {
                    var nics = [];
                    _.each(param.vmSpec.nics, function(item){
                        nics.push({
                            "networkID": "",
                            "networkViewName": "",
                            "ipv4": "",
                            "ipv6": ""
                        });
                    });
                    $scope.network.nics = nics;
                }
            }

            //根据订单详情，初始化自定义规格页面
            function initUserDefSpecByOrderDetail() {
                if (action === "apply") {
                    return;
                }

                var orderParam = $scope.orderDetail.param || {};
                if (orderParam.vmSpec && !orderParam.vmSpec.id) {
                    // 显示自定义规格
                    $scope.config.configType.selected = "userDef";
                    $scope.config.configType.values = [{
                        "key": "system",
                        "text": i18n.spec_term_sysSpec_label
                    }, {
                        "key": "userDef",
                        "text": i18n.common_term_customSpec_label,
                        "checked": true
                    }];

                    var cpu = orderParam.vmSpec.cpu.count;
                    var cpuDom = $(".createvm-cpu .cpu-options[data-value=" + cpu + "]");
                    if (cpuDom.length > 0) {
                        cpuDom.trigger("click");
                    } else {
                        cpuDom = $(".createvm-cpu .cpu-options[self-defined]");
                        cpuDom.html(cpu + i18n.common_term_core_label);
                        $scope.config.userDef.cpu = cpu;
                        $scope.config.userDef.cpuInput = true;
                        $(".createvm-cpu div.cpu-options").removeClass("selected");
                        cpuDom.addClass("selected");
                    }

                    var mem = orderParam.vmSpec.memory.count;
                    var memDom = $(".createvm-memory .memory-options[data-value=" + mem + "]");
                    if (memDom.length > 0) {
                        memDom.trigger("click");
                    } else {
                        memDom = $(".createvm-memory .memory-options[self-defined]");
                        memDom.html(mem / 1024 + "G");
                        $scope.config.userDef.mem = mem;
                        $scope.config.userDef.memInput = true;
                        $(".createvm-memory div.memory-options").removeClass("selected");
                        memDom.addClass("selected");
                    }
                }
            }

            // AZ变化时重新查询模板、规格、网络信息
            function onSelectAz() {
                var param = $scope.detail.param || {};

                // 查询模板
                if (param.vmTemplate.lock === "1") {
                    var vmTempDefer = $scope.operate.queryVmTemplates();
                    vmTempDefer.then(function (data) {
                        setTimeout(function () {
                            var templates = $scope.template.values;
                            if (templates && templates.length > 0) {
                                var curId = action === "edit" ? $scope.orderDetail.param.templateId : templates[0].vmtId;
                                $scope.template.select(curId);
                            }
                        }, 20);
                    });
                } else if (param.vmTemplate.lock === "0") {
                    $scope.operate.queryVmTemplateDetail(param.vmTemplate.id);
                }

                // 查询规格
                var vmSpec = param.vmSpec || {};
                if ((vmSpec.flavor && vmSpec.flavor.lock === "1") || (vmSpec.spec && (vmSpec.spec.cpu.lock === "1" || param.vmSpec.spec.memory.lock === "1"))) {
                    if ($scope.supportUserDefineConfig) {
                        $scope.operate.querySLAs();
                    } else {
                        $scope.operate.queryConfigTemplates();
                    }

                    // 初始化自定义规格颜色块
                    setTimeout(function () {
                        initCpuMemAnimal();
                        $(".createvm-cpu .cpu-options[self-defined]").userDefCpu($scope.config.userDef, i18n.common_term_core_label);
                        $(".createvm-memory .memory-options[self-defined]").userDefMem($scope.config.userDef);

                        initUserDefSpecByOrderDetail();
                    }, 20);
                } else if ((vmSpec.flavor && vmSpec.flavor.lock === "0") || (vmSpec.spec && (vmSpec.spec.cpu.lock === "0" || param.vmSpec.spec.memory.lock === "0"))) {
                    if ($scope.supportUserDefineConfig) {
                        $scope.config.userDef.cpu = vmSpec.spec.cpu.value;
                        $scope.config.userDef.mem = vmSpec.spec.memory.value;
                        $scope.config.sla.curr = vmSpec.sla.value;
                    } else {
                        $scope.operate.queryConfigTemplates();
                    }
                }

                // 查询网络
                var network = param.vmNetwork;
                if (network && network.nics && network.nics.length > 0 && network.nics[0].lock === "1") {
                    var vpcDefer = $scope.operate.queryVpcs();
                    vpcDefer.then(function (data) {
                        $scope.operate.queryPrivateNetworks("init");
                    });
                    if ($scope.supportUserDefineConfig) {
                        $scope.operate.queryBasicNetworks();
                    }
                }
            }

            // 查询ecs需要的模板、规格、网络信息
            function queryRelatedInfo() {
                // 查询能力差异
                $scope.operate.queryCapacity();
                $scope.config.configType.selected =  $scope.supportUserDefineConfig ? "userDef" : "system";

                // 查询AZ
                var azDefer = {};
                var param = $scope.detail.param || {};
                var az = param.availableZone || {};
                if (az.lock === "1") {
                    azDefer = $scope.operate.queryAzs();
                } else if (az.lock === "0") {
                    _.extend($scope.base.az.curr, {
                        "id": az.id
                    });
                }
                $.when(azDefer).done(function (data) {
                    onSelectAz();
                });
            }

            // 初始化页面信息
            function init() {
                var deferred1 = $scope.operate.queryServiceDetail();
                var deferred2 = $scope.operate.queryOrderDetail();
                $.when(deferred1, deferred2).done(function () {
                    //根据订单详情，初始化基本信息部分
                    initBaseByOrderDetail();

                    // 查询资源池
                    var deferred3;
                    var location = $scope.detail.param.cloudInfra || {};
                    if (location.lock === "1") {
                        deferred3 = $scope.operate.queryLocations();
                    } else if (location.lock === "0") {
                        deferred3 = $scope.operate.queryLocationDetail(location.id);
                    } else {
                        return;
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
