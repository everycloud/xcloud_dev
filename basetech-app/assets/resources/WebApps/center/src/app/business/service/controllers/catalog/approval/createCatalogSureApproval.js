/**
 * Created by  on 14-2-13.
 */
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "tiny-widgets/Radio",
    "tiny-widgets/Select",
    "tiny-widgets/Textbox",
    "tiny-widgets/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/commonService",
    "tiny-common/UnifyValid",
    'app/services/validatorService',
    'app/services/messageService',
    "app/services/exceptionService",
    "app/services/httpService",
    "app/services/cloudInfraService",
    "app/business/service/services/service/createService",
    "app/business/service/services/order/orderService",
    'fixtures/catalogFixture'], function ($, angular, Checkbox, Radio, Select, Textbox, Button, Window, Message, commonService, UnifyValid, validatorService, messageService, ExceptionService, http, cloudInfraService, createService, orderService) {
    "use strict";

    var approvalCtrl = ["$rootScope", "$scope", "$stateParams", "camel", "$compile", "$state", "$q", "validator", "exception", function ($rootScope, $scope, $stateParams, camel, $compile, $state, $q, validator, exception) {
        var user = $("html").scope().user;
        var exception = new ExceptionService();
        $scope.action = $stateParams.action;
        var serviceId = $stateParams.serviceId;
        var createServiceIns = new createService(exception, $q, camel);
        var orderServiceIns = new orderService(exception, $q, camel);
        var cloudInfraServiceImpl = new cloudInfraService($q, camel);
        var orderId = $stateParams.orderId;
        var i18n = $scope.i18n;
        $scope.cloudType = $scope.user.cloudType == "OPENSTACK" ? "ICT" : "IT";
        $scope.areaIds = [];
        $scope.approval = {
            applyName: {
                "id": "applyName",
                "label": (i18n.common_term_applyBy_label || "申请人：") + ":",
                "value": ""
            },
            orderName: {
                "id": "orderName",
                "label": (i18n.common_term_name_label || "名称：") + ":",
                "value": ""
            },
            area: {
                "id": "area",
                "label": (i18n.common_term_section_label || "地域：") + ":",
                "value": ""
            },
            expiryTime: {
                "id": "expiryTime",
                "label": (i18n.common_term_overdueTime_label || "到期时间：") + ":",
                "value": ""
            },
            description: {
                "id": "description：",
                "label": (i18n.common_term_remark_label || "备注：") + ":",
                "value": ""
            },
            cpu: {
                "id": "cpu",
                "label": (i18n.common_term_vcpuNum_label || "vCPU个数：") + ":",
                "value": ""
            },
            memory: {
                "id": "memory",
                "label": (i18n.common_term_memoryMB_label || "内存(MB)") + ":",
                "value": ""
            },
            storage: {
                "id": "storage",
                "label": (i18n.vm_term_storageMaxGB_label || "存储上限(GB)：") + ":",
                "value": ""
            },
            vmNum: {
                "id": "vmNum",
                "label": (i18n.vm_term_vmNum_label || "虚拟机个数：") + ":",
                "value": ""
            },
            ipNum: {
                "id": "ipNum",
                "label": (i18n.eip_term_eipNum_label || "弹性IP地址个数：") + ":",
                "value": ""
            },
            vpcNum: {
                "id": "vpcNum",
                "label": (i18n.vpc_term_vpcNum_label || "VPC个数：") + ":",
                "value": ""
            },
            groupNum: {
                "id": "groupNum",
                "label": (i18n.org_term_secuGroupNum_label || "安全组个数：") + ":",
                "value": ""
            },
            //变更前资源数据
            oldcpu: {
                "id": "oldcpu",
                "label": (i18n.common_term_vcpuNum_label || "vCPU个数：") + ":",
                "value": ""
            },
            oldmemory: {
                "id": "oldmemory",
                "label": (i18n.common_term_memoryMB_label || "内存(MB)") + ":",
                "value": ""
            },
            oldstorage: {
                "id": "oldstorage",
                "label": (i18n.vm_term_storageMaxGB_label || "存储上限(GB)：") + ":",
                "value": ""
            },
            oldvmNum: {
                "id": "oldvmNum",
                "label": (i18n.vm_term_vmNum_label || "虚拟机个数：") + ":",
                "value": ""
            },
            oldipNum: {
                "id": "oldipNum",
                "label": (i18n.eip_term_eipNum_label || "弹性IP地址个数：") + ":",
                "value": ""
            },
            oldvpcNum: {
                "id": "oldvpcNum",
                "label": (i18n.vpc_term_vpcNum_label || "VPC个数：") + ":",
                "value": ""
            },
            oldgroupNum: {
                "id": "oldgroupNum",
                "label": (i18n.org_term_secuGroupNum_label || "安全组个数：") + ":",
                "value": ""
            },
            //变更后资源数据
            modifycpu: {
                "id": "modifycpu",
                "label": (i18n.common_term_vcpuNum_label || "vCPU个数：") + ":",
                "value": ""
            },
            modifymemory: {
                "id": "modifymemory",
                "label": (i18n.common_term_memoryMB_label || "内存(MB)") + ":",
                "value": ""
            },
            modifystorage: {
                "id": "modifystorage",
                "label": (i18n.vm_term_storageMaxGB_label || "存储上限(GB)：") + ":",
                "value": ""
            },
            modifyvmNum: {
                "id": "modifyvmNum",
                "label": (i18n.vm_term_vmNum_label || "虚拟机个数：") + ":",
                "value": ""
            },
            modifyipNum: {
                "id": "modifyipNum",
                "label": (i18n.eip_term_eipNum_label || "弹性IP地址个数：") + ":",
                "value": ""
            },
            modifyvpcNum: {
                "id": "modifyvpcNum",
                "label": (i18n.vpc_term_vpcNum_label || "VPC个数：") + ":",
                "value": ""
            },
            modifygroupNum: {
                "id": "modifygroupNum",
                "label": (i18n.org_term_secuGroupNum_label || "安全组个数：") + ":",
                "value": ""
            },
            azDirectory: {
                "id": "createDirectory",
                label: (i18n.org_term_chooseAZ_label || "选择AZ") + ":",
                "mode": "multiple",
                "require": true,
                "width": 200,
                "validate": "regularCheck(" + validator.notAllSpaceReg + "):请选择 ;",
                values: []
            },
            az: {
                "id": "az",
                "label": (i18n.resource_term_Azs_label || "可用分区：") + ":",
                "value": ""
            }
        };
        $scope.approvalInput = {
            vdcArea: {
                "id": "vdcArea",
                label: (i18n.common_term_section_label || "地域:") + ":",
                "mode": "multiple",
                "validate": "required:" + (i18n.common_term_null_valid || "不能为空。"),
                "require": true,
                "width": 200,
                "change": function () {
                    $scope.areaIds = $("#" + $scope.approvalInput.vdcArea.id).widget().getSelectedId();
                    $scope.operate.initCanSelectAZ();
                },
                values: []
            },
            cpuNumber: {
                "id": "cpuNumberId",
                "label": $scope.i18n.common_term_vcpuNum_label + ":",
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 80000),
                "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 80000) +
                    ";maxValue(80000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 80000)
            },
            memoryUpperLimit: {
                "id": "memoryUpperLimitId",
                "label": $scope.i18n.common_term_memoryMB_label + ":",
                "require": true,
                "value": "",
                "tooltip": i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000),
                "validate": "integer:" + i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000) +
                    ";maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, 1024, 196608000)
            },
            storage: {
                "id": "storageId",
                "label": $scope.i18n.common_term_storageGB_label + ":",
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000),
                "validate":"integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000) +
                    ";maxValue(512000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 512000)
            },
            eipNumber: {
                "id": "eipNumberId",
                "label": $scope.i18n.eip_term_eipNum_label + ":",
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 200),
                "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 200) +
                    ";maxValue(200):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 200)
            },
            vpcNumber: {
                "id": "vpcNumberId",
                "label": $scope.i18n.vpc_term_vpcNum_label + ":",
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 20),
                "validate":"integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 20) +
                    ";maxValue(20):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 20)
            },
            sgNumber: {
                "id": "sgNumberId",
                "label": $scope.i18n.org_term_secuGroupNum_label + ":",
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000),
                "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000) +
                    ";maxValue(1000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 1000)
            },
            vmNumber: {
                "id": "vmNumberId",
                "label": $scope.i18n.vm_term_vmNum_label + ":",
                "require": true,
                "value": "",
                "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10000),
                "validate": "integer:" + $scope.i18n.common_term_PositiveIntegers_valid +
                    ";minValue(1):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10000) +
                    ";maxValue(10000):" + $scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1, 10000)
            }
        };
        $scope.confirmInfo = {
            sureBtn: {
                "id": "create-network-selectres-sure",
                "text": i18n.common_term_submit_button || "提交",
                "disable": ($scope.cloudType == "IT" && $scope.action == "apply"),
                "click": function () {
                    var param = {};
                    var approvalResults = $("#" + $scope.quotaLimit.id).widget().opChecked("checked");
                    if ("noLimit" == approvalResults) {
                        param.action = "approve";
                    }
                    else if ("limit" == approvalResults) {
                        param.action = "return";
                    } else {
                        param.action = "reject";
                    }
                    var valid = UnifyValid.FormValid($("#approvalOrderPage"));
                    if (!valid && param.action =="approve") {
                        return;
                    }
                    var strParam = "";
                    if ($scope.action == "apply") {
                        var azData = $scope.selectedAz.azList;
                        var selectAzList = [];
                        for (var i = 0; i < azData.length; i++) {
                            var azstr = azData[i].id.split("_");
                            var list = {
                                "azId": azstr[0],
                                "cloudInfraId": azData[i].cloudInfraId
                            }
                            selectAzList.push(list);
                        }
                        if ($scope.resLock === "2") {
                            $scope.cpuval = parseInt($("#" + $scope.approvalInput.cpuNumber.id).widget().getValue());
                            $scope.memval = parseInt($("#" + $scope.approvalInput.memoryUpperLimit.id).widget().getValue());
                            $scope.storageval = parseInt($("#" + $scope.approvalInput.storage.id).widget().getValue());
                            $scope.eipval = parseInt($("#" + $scope.approvalInput.eipNumber.id).widget().getValue());
                            $scope.vpcval = parseInt($("#" + $scope.approvalInput.vpcNumber.id).widget().getValue());
                            $scope.segval = parseInt($("#" + $scope.approvalInput.sgNumber.id).widget().getValue());
                            $scope.vmval = parseInt($("#" + $scope.approvalInput.vmNumber.id).widget().getValue());
                        }
                        else {
                            $scope.cpuval = $scope.cpuNum;
                            $scope.memval = $scope.memoryNum;
                            $scope.storageval = $scope.storageNum;
                            $scope.vmval = $scope.vmNum;

                            $scope.eipval = $scope.eipNum;
                            $scope.vpcval = $scope.vpcNum;
                            $scope.segval = $scope.segNum;
                        }
                        if ($scope.areaLock == "2") {
                            $scope.areaId = $("#" + $scope.approvalInput.vdcArea.id).widget().getSelectedId();
                        }
                        var azBaseInfos = [];
                        if($scope.cloudType == "IT"){
                            azBaseInfos = selectAzList;
                        }else{
                            for(var i= 0,len=$scope.areaId.length;i<len;i++){
                                azBaseInfos.push({
                                    azId:"",
                                    cloudInfraId:$scope.areaId[i]
                                });
                            }
                        }
                        strParam = {
                            "name": $scope.name,
                            "allQuota": false,
                            "area": $scope.areaId,
                            "quotaList": [
                                {
                                    "name": "CPU",
                                    "limit": $scope.cpuval
                                },
                                {
                                    "name": "MEMORY",
                                    "limit": $scope.memval
                                },
                                {
                                    "name": "STORAGE",
                                    "limit": $scope.storageval
                                },
                                {
                                    "name": "VPC",
                                    "limit": $scope.vpcval
                                },
                                {
                                    "name": "EIP",
                                    "limit": $scope.eipval
                                },
                                {
                                    "name": "SEG",
                                    "limit": $scope.segval
                                },
                                {
                                    "name": "VM",
                                    "limit": $scope.vmval
                                }
                            ],
                            "azBaseInfos": azBaseInfos
                        };
                    }
                    param.comments = $("#" + $scope.approvalInfo.description.id).widget().getValue();
                    param.params = $scope.action == "apply" ? JSON.stringify(strParam) : $scope.params;
                    param.tenancy = $scope.expiryTime;
                    var options = {
                        "user": user,
                        "orderId": orderId,
                        "params": param
                    };
                    var deferred = orderServiceIns.orderAdminaction(options);
                    deferred.then(function (data) {
                        $state.go("service.order.approval");
                    });
                }
            },
            cancelBtn: {
                "id": "create-network-selectres-cancel",
                "text": i18n.common_term_cancle_button || "取消",
                "click": function () {
                    $state.go("service.order.approval");
                }
            }
        };
        $scope.quotaLimit = {
            "id": "quotaLimitId",
            "label": (i18n.common_term_approveResult_label || "审批结果:") + ":",
            "values": [
                {
                    "key": "noLimit",
                    "text": i18n.common_term_agree_button || "同意",
                    "checked": true
                },
                {
                    "key": "limit",
                    "text": i18n.service_term_rejectModify_button || "驳回修改",
                    "checked": false
                },
                {
                    "key": "closed",
                    "text": i18n.service_term_refuseClose_button || "拒绝并关闭",
                    "checked": false
                }
            ],
            "change": function () {
                var checked = $("#" + $scope.quotaLimit.id).widget().opChecked("checked");
                if ($scope.cloudType == "IT") {
                    if ("closed" == checked || "limit" == checked) {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                    }
                    else {
                        if ($scope.selectedAz.azList.length > 0) {
                            $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                        }
                        else {
                            $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", $scope.action == "apply");
                        }
                    }
                }
                else {
                    $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                }
                var param = {};
                if ("noLimit" == checked) {
                    param.action = "approve";
                }
                else if ("limit" == checked) {
                    param.action = "return";
                } else {
                    param.action = "reject";
                }
                $scope.applyStatus = param.action;
            }
        };
        $scope.approvalInfo = {
            description: {
                "label": (i18n.common_term_approveAdvice_label || "审批意见:") + ":",
                "id": "create-approval-description",
                "type": "multi",
                "require": false,
                "width": "500",
                "height": "60",
                "validate": "maxSize(1024):" + i18n.sprintf(i18n.common_term_length_valid, 1,1024)
            }
        };
        //数据绑定
        function setQuotaFromUser(quotaList, action) {
            quotaList = quotaList || [];
            var config = {
                "CPU": "cpu",
                "MEMORY": "memory",
                "STORAGE": "storage",
                "VM": "vmNum",
                "EIP": "ipNum",
                "VPC": "vpcNum",
                "SEG": "groupNum"
            };
            if (action == "modify") {
                for (var i = 0; i < quotaList.length; i++) {
                    var name = quotaList[i].name;
                    var key = config[name];
                    if (key) {
                        $scope.approval["old" + key].value = quotaList[i].oldLimit;
                        $scope.approval["modify" + key].value = quotaList[i].limit;
                    }
                }
            }
            else {
                for (var i = 0; i < quotaList.length; i++) {
                    if (quotaList[i].name === "CPU") {
                        $scope.cpuNum = quotaList[i].limit;
                    }
                    else if (quotaList[i].name === "MEMORY") {
                        $scope.memoryNum = quotaList[i].limit;
                    }
                    else if (quotaList[i].name === "STORAGE") {
                        $scope.storageNum = quotaList[i].limit;
                    }
                    else if (quotaList[i].name === "VPC") {
                        $scope.vpcNum = quotaList[i].limit;
                    }
                    else if (quotaList[i].name === "EIP") {
                        $scope.eipNum = quotaList[i].limit;
                    }
                    else if (quotaList[i].name === "SEG") {
                        $scope.segNum = quotaList[i].limit;
                    }
                    else if (quotaList[i].name === "VM") {
                        $scope.vmNum = quotaList[i].limit;
                    }
                }
                $scope.approval.cpu.value = $scope.cpuNum;
                $scope.approval.memory.value = $scope.memoryNum;
                $scope.approval.storage.value = $scope.storageNum;
                $scope.approval.vmNum.value = $scope.vmNum;
                $scope.approval.ipNum.value = $scope.eipNum;
                $scope.approval.vpcNum.value = $scope.vpcNum;
                $scope.approval.groupNum.value = $scope.segNum;
            }
        }

        // AZ页面
        $scope.selectAllAZ = true;
        $scope.azSelectModel = {
            "azSelectLabel": (i18n.org_term_chooseAZ_label || "选择可用分区") + ":",
            "canSelectAzLabel": i18n.common_term_waitChoose_value || "待选择",
            "azSelectedLabel": i18n.common_term_choosed_value || "已选择"
        };
        $scope.leftAzSearchBox = {
            "id": "leftAzSearchBoxId",
            "placeholder": "",
            "width": "150px",
            "suggest-size": 10,
            "maxLength": 64,
            "suggest": function (content) {
            },
            "search": function (searchString) {
                $scope.operate.initCanSelectAZ(searchString);
            }
        };

        $scope.canSelectAz = {
            "height": "28px",
            azList: []
        };
        $scope.selectedAz = {
            "height": "28px",
            width: "100px",
            azList: []
        };

        $scope.selectAzLeftBtn = {
            "click": function () {
                var azList = $scope.canSelectAz.azList;
                var len = azList.length;
                for (var index = len - 1; index >= 0; index--) {
                    if ($("#" + azList[index].id).widget().option("checked")) {
                        if (!createServiceIns.isExist(azList[index], $scope.selectedAz.azList)) {
                            $scope.selectedAz.azList.push(azList[index]);
                        }
                        azList.splice(index, 1);
                    }
                }
                if ($scope.selectedAz.azList.length > 0) {
                    $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                }
            }
        };
        $scope.selectAzRightBtn = {
            "click": function () {
                var azList = $scope.selectedAz.azList;
                var len = azList.length;
                for (var index = len - 1; index >= 0; index--) {
                    if ($("#" + azList[index].id).widget().option("checked")) {
                        if (!createServiceIns.isExist(azList[index], $scope.canSelectAz.azList)) {
                            $scope.canSelectAz.azList.push(azList[index]);
                        }
                        azList.splice(index, 1);
                    }
                }
                if ($scope.selectedAz.azList.length === 0) {
                    if ($scope.cloudType == "IT") {
                        if ($("#" + $scope.quotaLimit.id).widget().opChecked("checked") == "noLimit") {
                            $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", true);
                        }
                        else {
                            $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                        }
                    }
                    else {
                        $("#" + $scope.confirmInfo.sureBtn.id).widget().option("disable", false);
                    }
                }
            }
        };
        $scope.dealQueryOrderResponse = function (data) {
            var params = JSON.parse(data.params);
            var area = params.area;
            _.each(area, function (item) {
                $scope.areaIds.push(item);
            });
            $scope.operate.initCanSelectAZ();
        };
        $scope.operate = {
            "initCanSelectAZ": function () {
                var azList = [];
                $scope.canSelectAz.azList = [];
                _.each($scope.areaIds, function (areaId) {
                    if(!areaId){
                        return;
                    }
                    var deferred = cloudInfraServiceImpl.queryAzs(user.vdcId, user.id, areaId);
                    deferred.then(function (data) {
                        if (!data || !data.availableZones) {
                            return;
                        }
                        var azListRes = data.availableZones;

                        _.each(azListRes, function (item) {
                            if (!createServiceIns.isExist(item, $scope.selectedAz.azList)) {
                                azList.push({
                                    "id": item.id+"_"+item.cloudInfraId,
                                    "name": item.name,
                                    "cloudInfraId": item.cloudInfraId,
                                    "desc": item.description || ""
                                });
                            }
                        });
                        $scope.canSelectAz.azList = createServiceIns.constructAZList(azList, "left");
                    });
                });
            }
        };

        //查询订单详情
        function queryOrderList() {
            var options = {
                "user": user,
                "orderId": orderId
            };
            var deferred = orderServiceIns.queryOrder(options);
            deferred.then(function (data) {
                if (data == null || data == undefined) {
                    return;
                }
                $scope.detail = data;
                $scope.detail.param = JSON.parse(data.definationParams);
                $scope.approval.applyName.value = data.userName;
                $scope.resLock = $scope.detail.param.CPU.lock;
                $scope.areaLock = $scope.detail.param.cloudInfra.lock;
                $scope.expiryTime = data.tenancy;
                $scope.approval.expiryTime.value = $scope.expiryTime == "0" ? i18n.common_term_neverExpires_label : commonService.utc2Local($scope.expiryTime);
                $scope.approval.description.value = data.comments;
                var paramObj = JSON.parse(data.params);
                $scope.name = paramObj.name;
                $scope.approval.orderName.value = $scope.name;
                if ($scope.action == "apply") {
                    //资源配额
                    if ($scope.resLock != "2") {
                        var quotaList = paramObj.quotaList;
                        setQuotaFromUser(quotaList, $scope.action);
                    }
                    if ($scope.areaLock == "2") {
                        queryArea();
                    }
                    else {
                        $scope.areaId = paramObj.area;
                        queryRegion(paramObj.area);
                    }
                    $scope.dealQueryOrderResponse(data);
                }
                if ($scope.action == "modify") {
                    $scope.params = data.params;
                    var quotaList = paramObj.quotaList;
                    setQuotaFromUser(quotaList, $scope.action);
                    $scope.detail.param.CPU.lock = "1";
                    queryServiceInstancesName(paramObj.vdcId);
                }
                if ($scope.action == "extend") {
                    $scope.approval.orderName.value = data.orderName;
                }
            });
        };
        //获取服务实例名称
        function queryServiceInstancesName(resourceId){
            var param = {
                "user": user,
                "id": resourceId
            };
            var deferred = orderServiceIns.queryServiceInstancesName(param);
            deferred.then(function (data) {
                if (!data) {
                    return false;
                }
                $scope.approval.orderName.value = data.vdcInfo.name;
            });
        }
        //查询当前订单地域信息
        function queryRegion(cloudInfraId) {
            var deferred = createServiceIns.queryCloudInfras(user.orgId, user.id);
            deferred.then(function (data) {
                var areaList = data && data.cloudInfras || [];
                var areaAddress = [];
                for (var k = 0; k < cloudInfraId.length; k++) {
                    for (var i = 0; i < areaList.length; i++) {
                        if (areaList[i].id == cloudInfraId[k]) {
                            areaAddress.push(areaList[i].region);
                        }
                    }
                }
                $scope.approval.area.value = areaAddress.join(";");
            });
        }

        //查询地域
        function queryArea() {
            var deferred = createServiceIns.queryCloudInfras(user.orgId, user.id);
            deferred.then(function (data) {
                if (!data || !data.cloudInfras) {
                    return;
                }
                _.each(data.cloudInfras, function (item) {
                    _.extend(item, {
                        "selectId": item.id,
                        "label": item.region
                    });
                });
                $scope.approvalInput.vdcArea.values = data.cloudInfras;
            });
        }

        //订单类型为变更时查询AZ
        function queryAzlist() {
            var deferred = createServiceIns.queryAzs(user.vdcId, user.id, $scope.areaId);
            deferred.then(function (data) {
                if (!data || !data.availableZones) {
                    return;
                }
                $scope.queryAzList = data.availableZones;
            })
        }

        queryOrderList();
        if ($scope.action === "modify") {
            queryAzlist();
        }
    }];
    return approvalCtrl;
});