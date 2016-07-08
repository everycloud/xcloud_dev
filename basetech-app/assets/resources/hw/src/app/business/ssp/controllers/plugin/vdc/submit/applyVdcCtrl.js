/* global define */
define(["sprintf",
    "language/keyID",
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "app/services/httpService",
    'app/services/messageService',
    "app/services/tipMessageService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/plugin/commonService",
    "app/business/ssp/services/plugin/vdc/vdcService",
    "app/services/commonService",
    "app/services/cloudInfraService",
    "tiny-lib/encoder"
], function (sprintf,keyIDI18n,$, angular, _, http,messageService, tipMessageService, validatorService, UnifyValid, orderService, catalogService, commonService, vdcService, timeCommonService, cloudInfraService) {
    "use strict";

    var ctrl = ["$scope", "$compile", "$q", "$state", "camel", "exception", "$stateParams",
        function ($scope, $compile, $q, $state, camel, exception, $stateParams) {
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n  = $scope.i18n;

            var user = $scope.user;
            var isICT = user.cloudType === "ICT";

            //获取上个页面传来的参数，以此判定是修改，是创建还是查看详情
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            var validator = new validatorService();
            var orderServiceImpl = new orderService(exception, $q, camel);
            var catalogServiceImpl = new catalogService(exception, $q, camel);
            var cloudInfraServiceImpl = new cloudInfraService($q, camel);
            var vdcServiceImpl = new vdcService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);
            var messageServiceIns = new messageService();
            var tipMessage = new tipMessageService();

            // roleId，IT默认为6，ICT需要查询
            $scope.roleId = "6";

            // 服务详情
            $scope.detail = {};

            $scope.action = $stateParams.action;

            $scope.formsLabelWidth = 100;

            $scope.locak = 1;
            $scope.serviceDetail = {};
            //应用实例+后缀
            $scope.appTempName = "_" + user.name;

            $scope.name = {
                "label": i18n.common_term_name_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCName",
                validate: "maxSize(20):" + i18n.common_term_composition2_valid + i18n .sprintf(i18n.common_term_length_valid ,"1", "20"  ) + " ;regularCheck(" + validator.name + "):" + i18n.common_term_composition2_valid + i18n .sprintf(i18n.common_term_length_valid ,"1", "20"  ) + " ;",
                value: ""
            };

            $scope.area = {
                "label": i18n.common_term_section_label + ":",
                "mode": "multiple",
                "require": true,
                "width": 200,
                "id": "applyVDCArea",
                "validate": "regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_choose_label + " ;",
                values: [],
                value : []
            };

            $scope.cpu = {
                "label": i18n.common_term_vcpuNum_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCCpu",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "maxValue(80000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","80000") + ";",
                "value": ""
            };
            $scope.memory = {
                "label": i18n.common_term_memoryMB_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCMemory",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "maxValue(196608000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + " ;" +
                    "minValue(1024):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1024","196608000") + ";",
                "value": ""
            };
            $scope.storage = {
                "label": i18n.common_term_storageGB_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCStorage",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "maxValue(512000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","512000") + ";",
                "value": ""
            };
            $scope.ip = {
                "label": i18n.eip_term_eipNum_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCIP",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "maxValue(200):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","200") + ";",
                "value": ""
            };
            $scope.vpc = {
                "label": i18n.vpc_term_vpcNum_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCVPC",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "maxValue(20):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","20") + ";",
                "value": ""
            };
            $scope.group = {
                "label": i18n.org_term_secuGroupNum_label +  ":",
                "require": true,
                "width": 200,
                "id": "applyVDCGroup",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "maxValue(1000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","1000") + ";",
                "value": ""
            };
            $scope.vm = {
                "label": i18n.vm_term_vmNum_label + ":",
                "require": true,
                "width": 200,
                "id": "applyVDCVM",
                "validate": "integer:" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "maxValue(10000):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + " ;" +
                    "minValue(1):" + i18n.sprintf(i18n.common_term_rangeInteger_valid, "1","10000") + ";",
                "value": ""
            };
            $scope.time = {
                "label": i18n.common_term_overdueTime_label + ":",
                "require": true,
                "disable": false,
                "width": 200,
                "id": "applyVDCTime",
                "type": "date",
                "minDate": commonServiceIns.getCurrentTime(),
                "defaultDate": commonServiceIns.get30DaysDate(),
                "dateFormat": "yy-mm-dd",
                "timeFormat": "hh:mm:ss"
            };

            $scope.neverExpire = {
                "id": "applyVDCNeverExpire",
                "checked": false,
                "text": i18n.common_term_neverExpires_label,
                "change": function () {
                    $scope.time.disable = $("#" + $scope.neverExpire.id).widget().option("checked");
                }
            };

            $scope.confirmInfo = {
                sureBtn: {
                    "id": "create-network-selectres-sure",
                    "text": i18n.common_term_submit_button,
                    "click": function () {
                        var valid = UnifyValid.FormValid($(".applyVDC"));
                        if (!valid) {
                            return;
                        }
                        if ($scope.action === "edit") {
                            $scope.operate.editOrder();
                        } else {
                            $scope.operate.createOrder();
                        }
                    }
                },
                cancelBtn: {
                    "id": "create-network-selectres-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $state.go("ssp.catalog");
                    }
                },
                backBtn: {
                    "id": "view"
                }
            };

            $scope.description = {
                label: i18n.common_term_remark_label + ":",
                "id": "create-sureInfo-description",
                "type": "multi",
                "width": "644",
                "height": "60",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024),
                "value": ""
            };

            $scope.clickAreaHeading = function (id) {
                var head = $("#" + id + " .s-heading");
                var content = $("#" + id + " .s-content");

                if (head.hasClass("collapse")) {
                    var valid = UnifyValid.FormValid($("#" + id));
                    if (!valid) {
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

            $scope.initParam = function () {
                var name = $("#" + $scope.name.id).widget().getValue() + $scope.appTempName;
                var time = $("#" + $scope.time.id).widget().getDateTime() + " 23:59:59";
                var comments = $("#" + $scope.description.id).widget().getValue();

                var cpuNum = $("#applyVDCCpu").widget() ? $("#applyVDCCpu").widget().getValue() : $scope.serviceDetail.CPU.value;
                var memoryNum = $("#applyVDCMemory").widget() ? $("#applyVDCMemory").widget().getValue() : $scope.serviceDetail.MEMORY.value;
                var storageNum = $("#applyVDCStorage").widget() ? $("#applyVDCStorage").widget().getValue() : $scope.serviceDetail.STORAGE.value;
                var ipNum = $("#applyVDCIP").widget() ? $("#applyVDCIP").widget().getValue() : $scope.serviceDetail.EIP.value;
                var vpcNum = $("#applyVDCVPC").widget() ? $("#applyVDCVPC").widget().getValue() : $scope.serviceDetail.VPC.value;
                var groupNum = $("#applyVDCGroup").widget() ? $("#applyVDCGroup").widget().getValue() : $scope.serviceDetail.SEG.value;
                var vmNum = $("#applyVDCVM").widget() ? $("#applyVDCVM").widget().getValue() : $scope.serviceDetail.VM.value;
                var area = null;
                if($scope.serviceDetail.cloudInfra.lock === "0"){
                    area = $scope.serviceDetail.cloudInfra.value;
                }
                else if($scope.serviceDetail.cloudInfra.lock === "1"){
                    area = $("#" + $scope.area.id).widget().getSelectedId();
                }
                var azBaseInfos = [];
                _.each(area, function(item,inde){
                    var az = {"azId" : null,"cloudInfraId" : item};
                    azBaseInfos.push(az);
                });
                var paramsJson = {
                    "name": name,
                    "allQuota": false,
                    "area": area,
                    "quotaList": [{
                        "name": "CPU",
                        "limit": cpuNum
                    }, {
                        "name": "MEMORY",
                        "limit": memoryNum
                    }, {
                        "name": "STORAGE",
                        "limit": storageNum
                    }, {
                        "name": "VPC",
                        "limit": vpcNum
                    }, {
                        "name": "EIP",
                        "limit": ipNum
                    }, {
                        "name": "SEG",
                        "limit": groupNum
                    }, {
                        "name": "VM",
                        "limit": vmNum
                    }],
                    "azBaseInfos": azBaseInfos
                };
                var param = {};

                if ($scope.action === "edit") {
                    param = {
                        "user": user,
                        "id": orderId,
                        "params": {
                            tenancy: $("#" + $scope.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc(time),
                            "params": JSON.stringify(paramsJson),
                            "comments": comments
                        }
                    };
                } else {
                    param = {
                        "user": user,
                        "params": {
                            "apply": {
                                "serviceOfferingId": serviceId,
                                "params": JSON.stringify(paramsJson),
                                "tenancy": $("#" + $scope.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc(time)
                            },
                            "comments": comments
                        }
                    };
                }
                return param;
            };

            $scope.dealQueryOrderResponse = function (data) {
                var params = JSON.parse(data.params);
                $scope.name.value = params.name.substr(0,params.name.lastIndexOf($scope.appTempName));
                var quotas = params.quotaList;
                $scope.cpu.value = quotas[0].limit;
                $scope.memory.value = quotas[1].limit;
                $scope.storage.value = quotas[2].limit;
                $scope.vpc.value = quotas[3].limit;
                $scope.ip.value = quotas[4].limit;
                $scope.group.value = quotas[5].limit;
                $scope.vm.value = quotas[6].limit;

                $scope.area.value = params.area;

                $scope.description.value = data.comments;
                if (data.tenancy === "0") {
                    $scope.time.disable = true;
                    $scope.neverExpire.checked = true;
                } else {
                    var dateWidget = $("#" + $scope.time.id).widget();
                    if (data.tenancy && dateWidget) {
                        var localTime = timeCommonService.utc2Local(data.tenancy);
                        var dateTime = localTime.split(" ");
                        dateWidget.option("defaultTime", dateTime[1]);
                        dateWidget.option("defaultDate", dateTime[0]);
                    }
                }
                $scope.operate.queryLocations();
            };

            $scope.operate = {
                //创建订单
                "createOrder": function () {
                    var param = $scope.initParam();
                    var deferred = orderServiceImpl.createOrder(param);
                    deferred.then(function (data) {
                        if (data && data.orderId) {
                            tipMessage.sspAlert(data.orderId, function(){
                                $state.go("ssp.approvalVdcApply", {
                                    "orderId" : data.orderId,
                                    "action" : "view",
                                    "serviceId" : serviceId
                                });
                            });
                        }

                        //创建成功跳转至订单页面
                        $state.go("ssp.order.apply");
                    });
                },
                "editOrder": function () {
                    var param = $scope.initParam();
                    var deferred = orderServiceImpl.modifyOrder(param);
                    deferred.then(function (data) {
                        $state.go("ssp.order.apply");
                    });
                },
                "queryOrder": function () {
                    var param = {
                        "user": user,
                        "orderId": orderId
                    };
                    var deferred = orderServiceImpl.queryOrder(param);
                    deferred.then(function (data) {
                        if (!data || !data.orderId) {
                            return false;
                        }
                        $scope.dealQueryOrderResponse(data);
                    });
                },
                "queryServiceOffering": function () {
                    var param = {
                        "user": user,
                        "id": serviceId
                    };
                    var deferred = catalogServiceImpl.queryServiceOffering(param);
                    deferred.then(function (data) {
                        if (!data || !data.id) {
                            return false;
                        }
                        //再次加入相应的代码用来判断服务是否有锁定数据
                        // 服务详情
                        $scope.detail = data;
                        var params = JSON.parse(data.params);
                        $scope.lock = params.CPU.lock;
                        $scope.locationLock = params.cloudInfra.lock;
                        $scope.serviceDetail = params;
                    });
                },
                // 查询地域列表
                "queryLocations": function () {
                    var retDefer = $.Deferred();
                    var deferred = cloudInfraServiceImpl.queryCloudInfras(user.vdcId, user.id, null, "0");
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject();
                            return;
                        }
                        if (data.cloudInfras && data.cloudInfras.length > 0) {
                            if ($scope.area.value.length > 0) {
                                _.each(data.cloudInfras, function(cloudInfra,index){
                                    _.each($scope.area.value, function(item,index){
                                        if (cloudInfra.selectId === item) {
                                            data.cloudInfras[index].checked = true;
                                        }
                                    });
                                });
                            } else {
                                data.cloudInfras[0].checked = true;
                            }
                            $scope.area.values = data.cloudInfras;
                        }
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise();
                },
                // 查询roleId
                "queryRoleId": function () {
                    if (!isICT) {
                        return;
                    }

                    var deferred = vdcServiceImpl.queryRoles({
                        "name": "vdcServiceManager",
                        "type": "SERVICE_ROLE",
                        "user": user
                    });
                    deferred.then(function (data) {
                        if (data && data.roleList && data.roleList.length > 0) {
                            $scope.roleId = data.roleList[0].id;
                        }
                    });
                }
            };

            //初始化页面信息
            function init() {
                $scope.operate.queryServiceOffering();
                if ($scope.action === "edit") {
                    $scope.operate.queryOrder();
                } else {
                    $scope.operate.queryLocations();
                }
                $scope.operate.queryRoleId();
            }
            init();
        }
    ];
    return ctrl;
});
