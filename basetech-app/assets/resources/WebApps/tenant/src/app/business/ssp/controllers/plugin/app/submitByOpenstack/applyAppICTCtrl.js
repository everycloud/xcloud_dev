/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/messageService',
    "app/services/tipMessageService",
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    "app/services/cloudInfraService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/plugin/commonService",
    "app/business/ssp/services/plugin/app/appCommonService",
    'app/services/commonService',
    'app/business/network/services/networkService',
    "app/business/ssp/services/plugin/app/desigerService",
    "app/business/ssp/controllers/plugin/app/constants",
    'bootstrap/bootstrap.min',
    'tiny-directives/RadioGroup',
    "fixtures/appFixture"
], function ($, angular, _,Window, UnifyValid, http, messageService, tipMessageService, validatorService, exceptionService, capacityService, cloudInfraService, catalogService, orderService, commonService,appCommonService, timeCommonService,networkService,desigerService,constants) {
    "use strict";

    var ctrl = ["$scope","$compile", "$state", "$stateParams","appUtilService", "$q", "camel", "exception",
        function ($scope,$compile, $state, $stateParams,appUtilService, $q, camel, exception) {
            var user = $scope.user;
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            var action = $stateParams.action;

            var i18n = $("html").scope().i18n;

            var validator = new validatorService();
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var catalogServiceIns = new catalogService(exception, $q, camel);
            var orderServiceIns = new orderService(exception, $q, camel);
            var commonServiceIns = new commonService(exception);
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var networkServiceIns = new networkService(exception, $q, camel);
            var messageServiceIns = new messageService();
            var desigerServiceIns = new desigerService(exception, $q, camel);
            var tipMessage = new tipMessageService();

            //应用实例+后缀
            $scope.appTempName = "_" + user.name;

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            var TYPE_TITLE_MAP = {
                "az": "AvailableZone",
                "network": "Subnet",
                "image": "Image",
                "instanceType": "Flavor"
            };

            // 服务详情
            $scope.detail = {};
            // 订单详情
            $scope.orderDetail = {};
            $scope.cloudInfra = {};
            $scope.vpcId = "";
            $scope.supportUserDefineConfig = false;

            /**
             * 基本参数定义 start
             */

                //选择模板
            $scope.serviceTemplateTable = {
                "data": []
            };

            //选择模板网络 网络列表数据
            $scope.templateNet = {
                "data": []
            };

            //参数当前分页数据和所有数据
            $scope.commonParams = {
                "data": [],
                "confirmData": [],
                "allData": []
            };

            //配置应用参数 网络列表数据
            $scope.confAppVmTemplates = {
                "data": []
            };

            //配置应用参数 网络列表数据
            $scope.confAppSoftPacks = {
                "data": []
            };

            //配置应用参数 shell数据
            $scope.confAppShells = {
                "data": []
            };

            //配置VLB  网络的ameId与网络实例的对应关系
            $scope.configVlbNetworkMap = {};
            $scope.confVlbVmTemplates = {
                "data": []
            };

            //配置软件等需要用到的临时数据,从模板中解析而来
            $scope.tmp = {
                "vmNameMap": {},
                "vmNicsMap": {},
                "vmTempInstanceMap": {}, //虚拟机模板的ameId与伸缩组里/外的虚拟机的映射
                "ameIdResourceMap": {}, //模板体中,ameId与所有资源的映射
                "ameIdVlbNetMap": {}, //vmTemplateId与vlbNet的映射
                "osTypeMap": {}
            };

            $scope.params = {
                "fromFlag": 0,
                "appTempBody": null,
                "selServiceTemplate": null,
                "serviceTemplate": {},
                "cloudInfraId": null,
                "selVpcId": null,
                "selVpcName": null,
                "resPoolFm": true,
                "appName": null,
                "curLogo": "buff01.jpg",
                "description": "",
                "logo": "",
                "networks": [],
                "commonParams": [],
                "templates": [],
                "softwares": [],
                "shells": [],
                "appData" : null
            };

            /**
             * 基本参数定义 end
             */

            // 基本信息
            $scope.base = {
                name: {
                    "label": i18n.common_term_name_label + ":",
                    "require": true,
                    "width": "220",
                    "value": "",
                    "id": "serviceApplyAppICTName",
                    "tooltip": i18n.common_term_composition4_valid + i18n.common_term_startWithEn_valid + i18n.sprintf(i18n.common_term_maxLength_valid, "255"),
                    "validate": "regularCheck(" + validator.appName4Ict + "):" + i18n.common_term_composition4_valid + i18n.common_term_startWithEn_valid + i18n.sprintf(i18n.common_term_maxLength_valid, "255") + ";" +
                        "maxSize(255):" + i18n.common_term_composition4_valid + i18n.common_term_startWithEn_valid + i18n.sprintf(i18n.common_term_maxLength_valid, "255") + ";"
                },

                "location": {
                    label: i18n.common_term_section_label + ":",
                    require: true,
                    "id": "applyAppICT-chooseLocation",
                    "width": 180,
                    'validate': 'required:' + i18n.common_term_null_valid,
                    "change": function () {
                        $("#" + $scope.base.vpc.id).widget().opChecked();
                        var resPoolId = $("#" + $scope.base.location.id).widget().getSelectedId();
                        if (!resPoolId) {
                            return;
                        }
                        _.each($scope.commonParams.allData, function (item, index) {
                            var type = item.rType;
                            if (type === "instanceType" || type === "image" || type === "network" || type === "az") {
                                $scope.commonParams.allData[index].selectId = "";
                                $scope.commonParams.allData[index].value = "";
                            }
                        });
                        rePaginationTable(false);
                        getVPCList(resPoolId);
                    },
                    "values": [],
                    "disable": "false"
                },

                "vpc": {
                    label: i18n.vpc_term_vpc_label + ":",
                    require: true,
                    "id": "applyAppICT-chooseVpc",
                    "width": 180,
                    'validate': 'required:' + i18n.common_term_null_valid,
                    "values": [],
                    "disable": false,
                    "change" : function() {
                        var vpcId = $("#" + $scope.base.vpc.id).widget().getSelectedId();
                        if (!vpcId) {
                            return;
                        }
                        _.each($scope.commonParams.allData, function (item, index) {
                            var type = item.rType;
                            if (type === "network") {
                                $scope.commonParams.allData[index].selectId = "";
                                $scope.commonParams.allData[index].value = "";
                            }
                        });
                        rePaginationTable(false);
                    }
                },

                // 到期时间
                expireTime: {
                    "label": i18n.common_term_overdueTime_label + ":",
                    "id": "serviceApplyAppICTExpireTime",
                    "width": "178",
                    "require": true,
                    "disable": false,
                    "type": "datetime",
                    "minDate": commonServiceIns.getCurrentTime(),
                    "defaultDate": commonServiceIns.get30DaysDate(),
                    //"defaultTime": "23:59",
                    "dateFormat": "yy-mm-dd",
                    "timeFormat": "hh:mm:ss"
                },

                neverExpire: {
                    "id": "serviceApplyAppICTNeverExpire",
                    "checked": false,
                    "text": i18n.common_term_neverExpires_label,
                    "change": function () {
                        $scope.base.expireTime.disable = $("#" + $scope.base.neverExpire.id).widget().option("checked");
                    }
                }
            };

            $scope.info = {
                "commonParams": {
                    "id": "apply-app-ict-commonParams",
                    "enablePagination": true,
                    "draggable": true,
                    "paginationStyle": "full_numbers",
                    "displayLength": 10,
                    "totalRecords": 0,
                    "lengthMenu": [10, 20, 30],
                    "columnsVisibility": {
                        "activate": "click", //"mouseover"/"click"
                        "aiExclude": [0],
                        "bRestore": false,
                        "fnStateChange": function (index, state) {
                        }
                    },

                    "columns": [
                        {
                            "sTitle": i18n.common_term_paraName_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_limitRule_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.allowedPattern);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_limitDesc_label,
                            "sWidth": "15%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.constraintDescription);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_paraDesc_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_paraValue_label,
                            "sWidth": "27%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.selectId);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_resourceName_label,
                            "sWidth": "10%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.value);
                            }
                        },
                        {
                            "sTitle": i18n.common_term_setPara_label,
                            "sWidth": "8%",
                            "bSortable": false,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.description);
                            }
                        }
                    ],
                    "data": [],
                    "renderRow": function (nRow, aData, iDataIndex) {
                        $("td:eq(0)", nRow).addTitle();
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(3)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();

                        var paramInputBox;
                        if (!aData.NoEcho) {
                            paramInputBox = "<div><tiny-textbox id='id' value='value'  validate='validate' change='change()' width='100' blur='blur()'></tiny-textbox></div>";
                        } else {
                            paramInputBox = "<div><tiny-textbox id='id' value='value'  type='type' validate='validate' change='change()' width='100' blur='blur()'></tiny-textbox></div>";
                        }
                        var paramInputLink = $compile(paramInputBox);
                        var paramInputScope = $scope.$new();
                        paramInputScope.id = "applyAppInputCommonParams" + iDataIndex;
                        paramInputScope.value = aData.selectId;
                        if (aData.allowedPattern && (aData.allowedPattern !== "")) {
                            paramInputScope.validate = "required:" + i18n.common_term_null_valid + ";" + generateCheckRules(aData);
                        } else {
                            paramInputScope.validate = "required:" + i18n.common_term_null_valid + ";";
                        }
                        if (aData.NoEcho) {
                            paramInputScope.type = "password";
                        }
                        paramInputScope.change = function () {
                            var paramValue = $("#applyAppInputCommonParams" + iDataIndex).widget().getValue();
                            $scope.commonParams.data[iDataIndex].selectId = paramValue;
                            $scope.commonParams.data[iDataIndex].value = "";
                            rebuildTableWithoutApply();
                        };
                        paramInputScope.blur = function () {
                        };
                        var paramInputNode = paramInputLink(paramInputScope);
                        $("td:eq(4)", nRow).html(paramInputNode);

                        //注:此处行间样式为归避"列表中的tiny-button的样式问题"
                        var paramSelect;
                        if ((aData.rType === "az") || (aData.rType === "network") || (aData.rType === "image") || (aData.rType === "instanceType")) {
                            paramSelect = "<div><div style='margin-top: 8px;margin-bottom: 8px;'><tiny-button id='btnId' text='btnText' click='btnClick(vmTemplateId)' ></tiny-button></div></div>";
                        } else {
                            paramSelect = "<div style='height: 43px;'></div>";
                        }
                        var paramSelectLink = $compile(paramSelect);
                        var paramSelectScope = $scope.$new();
                        paramSelectScope.btnId = "applyAppInputCommonParamsBtn" + iDataIndex;
                        paramSelectScope.btnText = i18n.common_term_choose_label;
                        paramSelectScope.btnClick = function () {
                            var rType = aData.rType;
                            var cloudInfraId = $scope.detail.param.lock.locationLock === '1' ?  $("#" + $scope.base.location.id).widget().getSelectedId() : $scope.params.cloudInfraId;
                            if (cloudInfraId === null || cloudInfraId === "" || cloudInfraId === undefined) {
                                return;
                            }
                            var vpcId = $scope.detail.param.lock.vpcLock === '1' ? $("#" + $scope.base.vpc.id).widget().getSelectedId() : $scope.params.selVpcId;
                            if (vpcId === null || vpcId === "" || vpcId === undefined) {
                                return;
                            }
                            var vpcName = $scope.detail.param.lock.vpcLock === '1' ? $("#" + $scope.base.vpc.id).widget().getSelectedLabel() : $scope.params.selVpcName;
                            var options = {
                                "winId": "applyByOpenstack_configParamWin",
                                "resourceType": rType,
                                "resPoolId": cloudInfraId,
                                "vpcId": vpcId,
                                "vpcName": vpcName,
                                "curParamTableData": $scope.commonParams.data[iDataIndex],
                                "title": i18n.common_term_choose_label,
                                "width": "900px",
                                "height": "600px",
                                "content-type": "url",
                                "content": null,
                                "buttons": null,
                                "close": function (event) {
                                    rebuildTable();
                                }
                            };
                            options.title = getTitleByResourceType(aData.rType);
                            //仅对于以下四种资源可以选择,不识别的只能输入
                            if ("az" === rType) {
                                options.content = "app/business/ssp/views/plugin/app/submitByOpenstack/selAvailableZone.html";
                            } else if ("network" === rType) {
                                options.content = "app/business/ssp/views/plugin/app/submitByOpenstack/selNetwork.html";
                            } else if ("image" === rType) {
                                options.content = "app/business/ssp/views/plugin/app/submitByOpenstack/selImage.html";
                            } else if ("instanceType" === rType) {
                                options.content = "app/business/ssp/views/plugin/app/submitByOpenstack/selInstanceType.html";
                            } else {
                                options.content = null;
                            }
                            if (options.content !== null) {
                                var win = new Window(options);
                                win.show();
                            }
                        };
                        var paramSelectNode = paramSelectLink(paramSelectScope);
                        $("td:eq(6)", nRow).html(paramSelectNode);
                    },
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        rePaginationTable(true);
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        rePaginationTable(true);
                    }
                }
            };

            // 备注
            $scope.remark = {
                "label": i18n.common_term_remark_label + ":",
                "id": "sspApplyAppICTRemark",
                "value": "",
                "type": "multi",
                "width": "220",
                "height": "57",
                "validate": "regularCheck(" + validator.descriptionReg + "):" + i18n.sprintf(i18n.common_term_maxLength_valid, 1024)
            };

            $scope.okBtn = {
                "id": "serviceApplyAppICTOkBtn",
                "text": i18n.common_term_submit_button,
                "tooltip": "",
                "click": function () {
                    // 校验
                    if (!$scope.okBtn.valid()) {
                        return;
                    }
                    if (action === "apply") {
                        $scope.operate.applyApp();
                    } else {
                        $scope.operate.editApp();
                    }

                },
                "valid": function () {
                    if (!saveCommonParams()){
                        return false;
                    }
                    return true;
                }
            };
            $scope.cancelBtn = {
                "id": "serviceApplyAppICTCancelBtn",
                "text": i18n.common_term_cancle_button,
                "tooltip": "",
                "click": function () {
                    $state.go("ssp.catalog");
                }
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
                        $scope.params.appData = JSON.parse($.base64.decode($scope.detail.param.appData, true));
                        $scope.params.cloudInfraId = $scope.detail.param.cloudInfraId;
                        $scope.params.selVpcId = $scope.detail.param.vpcId;
                        $scope.params.selServiceTemplate = {"id" : $scope.detail.param.templateId,"type" : "OpenStack"};
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

                        $scope.params.appData = JSON.parse($.base64.decode($scope.orderDetail.param.appData, true));
                        retDefer.resolve();
                    });
                    return retDefer.promise();
                },

                // 查询地域列表
                "queryLocations": function () {
                    var retDefer = $.Deferred();
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
                            getVPCList(data.cloudInfras[0].selectId);
                        }
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exception.doException(rejectedValue);
                        retDefer.reject();
                    });
                    return retDefer.promise();
                },

                "queryServiceTemplateContent" : function () {
                    var options = {
                        "vdcId": user.vdcId,
                        "id": $scope.params.selServiceTemplate.id,
                        "userId": user.id
                    };
                    var deferred = desigerServiceIns.queryAppTemplate(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }

                        var jsonBody = data.body;
                        if (!jsonBody || "" === jsonBody) {
                            messageServiceIns.errorMsgBox("10004",i18n.common_term_innerError_label);
                            return;
                        }

                        var jsonObj = null;
                        try {
                            jsonObj = JSON.parse($.base64.decode(jsonBody, true));
                        } catch (e) {
                            messageServiceIns.errorMsgBox("10004",i18n.common_term_innerError_label);
                            return;
                        }
                        $scope.params.appTempBodyObj = jsonObj;

                        parseAppTemplate(jsonObj);

                        $scope.params.appTempBody = jsonObj;
                    });
                },
                "applyApp" : function() {
                    var comments = $("#" + $scope.remark.id).widget().getValue();
                    var time = $("#" + $scope.base.expireTime.id).widget().getDateTime();

                    var templateBodyStr = $scope.detail.param.templateBody;
                    var cloudInfraId = null;
                    if ($scope.detail.param.lock.locationLock === '1') {
                        cloudInfraId = $("#" + $scope.base.location.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.locationLock === '0') {
                        cloudInfraId = $scope.detail.param.cloudInfraId;
                    } else {
                        cloudInfraId = "";
                    }

                    var vpcId = "";
                    if ($scope.detail.param.lock.vpcLock === '1') {
                        vpcId = $("#" + $scope.base.vpc.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.vpcLock === '0') {
                        vpcId = $scope.detail.param.vpcId;
                    } else {
                        vpcId = "";
                    }
                    $scope.params.appData.commonParams = $scope.commonParams;

                    var parametersHead = generateParameters();
                    var paramsJson = {
                        "appData" : $.base64.encode(JSON.stringify($scope.params.appData), true),
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "appName" :  $("#" + $scope.base.name.id).widget().getValue() + $scope.appTempName,
                        "desc" : $("#" + $scope.remark.id).widget().getValue(),
                        "picture": $scope.detail.param.picture,
                        "templateId": $scope.detail.param.templateId,
                        "templateBody": templateBodyStr,
                        "parameters" : parametersHead
                    };
                    var options = {
                        "user": user,
                        "params" : {
                            "apply": {
                                "serviceOfferingId": serviceId,
                                "params": JSON.stringify(paramsJson),
                                "tenancy": $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc(time)
                            },
                            "comments" : comments
                        }
                    };

                    var deferred = orderServiceIns.createOrder(options);
                    deferred.then(function (data) {
                        if (!data || !data.orderId) {
                            return false;
                        }
                        tipMessage.sspAlert(data.orderId, function(){
                            $state.go("ssp.approvalAppApply", {
                                "orderId" : data.orderId,
                                "action" : "view",
                                "serviceId" : serviceId
                            });
                        });
                        //创建成功跳转至服务页面
                        $state.go("ssp.order.apply");
                    });
                },
                "editApp" : function() {
                    var comments = $("#" + $scope.remark.id).widget().getValue();
                    var time = $("#" + $scope.base.expireTime.id).widget().getDateTime();

                    var templateBodyStr = $scope.detail.param.templateBody;
                    var cloudInfraId = null;
                    if ($scope.detail.param.lock.locationLock === '1') {
                        cloudInfraId = $("#" + $scope.base.location.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.locationLock === '0') {
                        cloudInfraId = $scope.detail.param.cloudInfraId;
                    } else {
                        cloudInfraId = "";
                    }

                    var vpcId = "";
                    if ($scope.detail.param.lock.vpcLock === '1') {
                        vpcId = $("#" + $scope.base.vpc.id).widget().getSelectedId();
                    } else if ($scope.detail.param.lock.vpcLock === '0') {
                        vpcId = $scope.detail.param.vpcId;
                    } else {
                        vpcId = "";
                    }

                    var parametersHead = generateParameters();

                    $scope.params.appData.commonParams = $scope.commonParams;
                    var paramsJson = {
                        "appData" : $.base64.encode(JSON.stringify($scope.params.appData), true),
                        "cloudInfraId": cloudInfraId,
                        "vpcId": vpcId,
                        "appName" : $("#" + $scope.base.name.id).widget().getValue() + $scope.appTempName,
                        "desc" : $("#" + $scope.remark.id).widget().getValue(),
                        "picture": $scope.detail.param.picture,
                        "templateId": $scope.detail.param.templateId,
                        "templateBody": $.base64.encode(JSON.stringify(templateBodyStr), true),
                        "parameters" : parametersHead
                    };

                    var options = {
                        "user" : user,
                        "id" : orderId,
                        "params" : {
                            "params" : JSON.stringify(paramsJson),
                            "tenancy" : $("#" + $scope.base.neverExpire.id).widget().option("checked") ? "0" : timeCommonService.local2Utc(time),
                            "comments" : comments
                        }
                    };
                    var deferred = orderServiceIns.modifyOrder(options);
                    deferred.then(function (data) {
                        //修改成功跳转至服务页面
                        $state.go("ssp.order.apply");
                    });
                }

            };

            function saveCommonParams () {
                var valid = UnifyValid.FormValid($("#applyAppICT"));
                if (!valid) {
                    return false;
                }
                //校验所有分页的params均是否已填
                if (!checkAllCommonParam()) {
                    tipMessage.alert("error", i18n.app_app_create_info_publicVariableNoCfg_msg);
                    return;
                }

                //触发确认页面的更新
                var confirmParams = [];
                _.each($scope.commonParams.data, function (item, index) {
                    confirmParams.push(item);
                });
                $scope.commonParams.data = confirmParams;
                return true;
            }

            function generateParameters() {
                var parameters = $scope.detail.param.parameters;
                var tmpParam = null;
                _.each($scope.commonParams.allData, function (item, index) {
                    //只有不是灰化的textbox才用值
                    tmpParam = {};
                    tmpParam.name = item.name;
                    tmpParam.value = item.selectId;
                    tmpParam.type = item.type;
                    tmpParam.desc = item.description;
                    tmpParam.rule = item.allowedPattern;
                    parameters.push(tmpParam);
                });
                return parameters;
            }

            function parseAppTemplate(jsonObj) {
                //公共参数
                var parameterMap = {};
                $scope.params.selDescription = jsonObj.Description;
                var parameters = jsonObj.Parameters;
                var resources = jsonObj.Resources;
                if (!resources) {
                    messageServiceIns.errorMsgBox("10004", i18n.common_term_innerError_label);
                    return;
                }

                //首先依次解析出资源中关于AZ,网络,Image,InstanceType   以MAP形式存 key/value都对应名称
                var azs = {};
                var networks = {};
                var images = {};
                var instanceTypes = {};
                var vpcs = [];
                var tmpResource = null;
                _.each(resources, function (item, index) {
                    tmpResource = resources[index];
                    if (!tmpResource) {
                        return;
                    }
                    //NetworkInterface节点
                    if ("AWS::EC2::NetworkInterface" === tmpResource.Type) {
                        if (tmpResource.Properties && tmpResource.Properties.SubnetId && tmpResource.Properties.SubnetId.Ref && (tmpResource.Properties.SubnetId.Ref !== "")) {
                            networks[tmpResource.Properties.SubnetId.Ref] = tmpResource.Properties.SubnetId.Ref;
                        }
                        return;
                    }

                    //Instance节点
                    if ("AWS::EC2::Instance" === tmpResource.Type) {
                        if (!tmpResource.Properties) {
                            return;
                        }
                        if (tmpResource.Properties.AvailabilityZone && tmpResource.Properties.AvailabilityZone.Ref && (tmpResource.Properties.AvailabilityZone.Ref !== "")) {
                            azs[tmpResource.Properties.AvailabilityZone.Ref] = tmpResource.Properties.AvailabilityZone.Ref;
                        }
                        if (tmpResource.Properties.ImageId && tmpResource.Properties.ImageId.Ref && (tmpResource.Properties.ImageId.Ref !== "")) {
                            images[tmpResource.Properties.ImageId.Ref] = tmpResource.Properties.ImageId.Ref;
                        }
                        if (tmpResource.Properties.InstanceType && tmpResource.Properties.InstanceType.Ref && (tmpResource.Properties.InstanceType.Ref !== "")) {
                            instanceTypes[tmpResource.Properties.InstanceType.Ref] = tmpResource.Properties.InstanceType.Ref;
                        }
                        if (tmpResource.Properties.NetworkInterfaces && tmpResource.Properties.NetworkInterfaces.length && (tmpResource.Properties.NetworkInterfaces.length > 0)) {
                            _.each(tmpResource.Properties.NetworkInterfaces, function (item, index) {
                                if (item && item.NetworkInterfaceId && item.NetworkInterfaceId.Ref && (item.NetworkInterfaceId.Ref !== "")) {
                                    networks[item.NetworkInterfaceId.Ref] = item.NetworkInterfaceId.Ref;
                                }
                            });
                        }
                        return;
                    }

                    //Instance节点
                    if ("AWS::AutoScaling::LaunchConfiguration" === tmpResource.Type) {
                        if (!tmpResource.Properties) {
                            return;
                        }
                        if (tmpResource.Properties.ImageId && tmpResource.Properties.ImageId.Ref && (tmpResource.Properties.ImageId.Ref !== "")) {
                            images[tmpResource.Properties.ImageId.Ref] = tmpResource.Properties.ImageId.Ref;
                        }
                        if (tmpResource.Properties.InstanceType && tmpResource.Properties.InstanceType.Ref && (tmpResource.Properties.InstanceType.Ref !== "")) {
                            instanceTypes[tmpResource.Properties.InstanceType.Ref] = tmpResource.Properties.InstanceType.Ref;
                        }
                        return;
                    }

                    //AutoScalingGroup节点
                    if ("AWS::AutoScaling::AutoScalingGroup" === tmpResource.Type) {
                        if (!tmpResource.Properties) {
                            return;
                        }
                        if (tmpResource.Properties.AvailabilityZones && tmpResource.Properties.AvailabilityZones.length && (tmpResource.Properties.AvailabilityZones.length > 0)) {
                            _.each(tmpResource.Properties.AvailabilityZones, function (item, index) {
                                if (item && item.Ref && (item.Ref !== "")) {
                                    azs[item.Ref] = item.Ref;
                                }
                            });
                        }
                        if (tmpResource.Properties.VPCZoneIdentifier && tmpResource.Properties.VPCZoneIdentifier.length && (tmpResource.Properties.VPCZoneIdentifier.length > 0)) {
                            _.each(tmpResource.Properties.VPCZoneIdentifier, function (item, index) {
                                if (item && item.Ref && (item.Ref !== "")) {
                                    networks[item.Ref] = item.Ref;
                                }
                            });
                        }
                    }
                });

                //逐个将公共变量组合到table的data中 分为几下必种类型az/network/image/instanceType/unknown
                var tmpTableData = [];
                if (!parameters) {
                    return;
                }
                var tmpParameter = null;
                var tmpData = null;
                _.each(parameters, function (item, index) {
                    tmpParameter = parameters[index];
                    if (!tmpParameter) {
                        return;
                    }
                    tmpData = {
                        "rType": null,
                        "type": tmpParameter.Type,
                        "name": index,
                        "default": tmpParameter.Default,
                        "NoEcho": (tmpParameter.NoEcho === "true" ? true : false),
                        "description": tmpParameter.Description,
                        "allowedPattern": tmpParameter.AllowedPattern,
                        "constraintDescription": tmpParameter.ConstraintDescription
                    };
                    tmpData.selectId = tmpData["default"];

                    if (azs[index]) {
                        tmpData.rType = "az";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (networks[index]) {
                        tmpData.rType = "network";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (images[index]) {
                        tmpData.rType = "image";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    if (instanceTypes[index]) {
                        tmpData.rType = "instanceType";
                        tmpTableData.push(tmpData);
                        return;
                    }
                    tmpData.rType = "unknown";
                    tmpTableData.push(tmpData);
                });


                var params = $scope.params.appData.commonParams.allData;
                _.each(params, function(item,index){
                    if (item.inputType === "1") {
                        $scope.commonParams.allData.push(item);
                    }
                });

                rePaginationTable(false);
                $scope.info.commonParams.totalRecords = $scope.commonParams.allData.length;
            }

            //根据订单详情，初始化页面基本信息
            function initBaseByOrderDetail() {
                var param = $scope.orderDetail.param || {};
                // 名称
                $scope.base.name.value = param.appName ? param.appName.substr(0,param.appName.lastIndexOf($scope.appTempName)) : "app001";

                $scope.remark.value = $scope.orderDetail.comments;

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
            }

            function getVPCList(cloudInfraId) {
                if (!cloudInfraId) {
                    return;
                }
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfraId
                };
                var deferred = appCommonServiceIns.queryVpcList(options);
                deferred.then(function (data) {
                    if (!data || !data.vpcs) {
                        return;
                    }

                    if (data.vpcs.length <= 0) {
                        $("#applyApp-chooseVpc").widget().opChecked();
                        $scope.params.selVpcId = null;
                        $scope.base.vpc.values = [];
                    }

                    //适配下拉框
                    var availableVpcs = [];
                    var tmpVpc = null;
                    _.each(data.vpcs, function (item, index) {
                        tmpVpc = {
                            "selectId": item.vpcID,
                            "label": item.name
                        };
                        if ($scope.params.selVpcId) {
                            if ($scope.params.selVpcId === tmpVpc.selectId) {
                                tmpVpc.checked = true;
                            } else {
                                tmpVpc.checked = false;
                            }
                        } else {
                            if (index === 0) {
                                tmpVpc.checked = true;
                                $scope.params.selVpcId = tmpVpc.selectId;
                            }
                        }
                        availableVpcs.push(tmpVpc);
                    });
                    $scope.base.vpc.values = availableVpcs;
                });
            }

            function generateCheckRules(rowData) {
                var allowedPattern = rowData.allowedPattern;
                var constraintDesc = rowData.constraintDescription || "";
                return "regularCheck(/" + allowedPattern + "/):" + constraintDesc + ";";
            }

            //重新组合data触发表格刷新
            function rebuildTable() {
                var newParamTable = [];
                _.each($scope.commonParams.data, function (item, index) {
                    newParamTable.push(item);
                });
                $scope.$apply(function () {
                    $scope.commonParams.data = newParamTable;
                });
            }

            function rebuildTableWithoutApply() {
                var newParamTable = [];
                _.each($scope.commonParams.data, function (item, index) {
                    newParamTable.push(item);
                });
                $scope.commonParams.data = newParamTable;
            }

            function getTitleByResourceType(type) {
                if (!type) {
                    return i18n.common_term_choose_label;
                }
                if (TYPE_TITLE_MAP[type]) {
                    return i18n.common_term_choose_label + TYPE_TITLE_MAP[type];
                }
                return i18n.common_term_choose_label;
            }

            //isApply是否主动apply
            function rePaginationTable(isApply) {
                var allEndIndex = $scope.commonParams.allData.length;
                if (allEndIndex <= 0) {
                    return;
                }
                var start = page.getStart();
                var end = start + page.displayLength;
                end = (end <= allEndIndex ? end : allEndIndex);
                var pageParamTableData = $scope.commonParams.allData.slice(start, end);
                if (isApply) {
                    $scope.$apply(function () {
                        $scope.commonParams.data = pageParamTableData;
                    });
                } else {
                    $scope.commonParams.data = pageParamTableData;
                }
            }

            function checkAllCommonParam() {
                if ($scope.commonParams.allData.length <= 0) {
                    return true;
                }

                var tmp = null;
                for (var i = 0; i < $scope.commonParams.allData.length; i++) {
                    //锁定的情况下不用校验
                    if ($scope.commonParams.allData[i].inputType !== "1") {
                        continue;
                    }
                    if (!$scope.commonParams.allData[i] || !$scope.commonParams.allData[i].selectId) {
                        return false;
                    }
                    tmp = $scope.commonParams.allData[i].selectId;
                    tmp = $.trim(tmp);
                    if (!tmp || ("" === tmp)) {
                        return false;
                    }
                }
                return true;
            }

            // 初始化页面信息
            function init() {
                var deferred = $scope.operate.queryServiceDetail();
                $.when(deferred).done(function(){
                    var deferred2 = $scope.operate.queryOrderDetail();
                    $.when(deferred2).done(function () {
                        //根据订单详情，初始化基本信息部分
                        initBaseByOrderDetail();
                        $scope.operate.queryServiceTemplateContent();
                        var deferred3 = $scope.operate.queryLocations();
                    });
                });
            }

            init();
        }
    ];

    return ctrl;
});
