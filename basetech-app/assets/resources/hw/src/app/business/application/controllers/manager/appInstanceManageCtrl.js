/**
 * Created on 14-2-23.
 */
/* global define */
define([
    'tiny-lib/jquery',
    'tiny-lib/encoder',
    'tiny-lib/angular',
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    'app/services/cloudInfraService',
    "app/services/messageService",
    "app/business/application/services/appCommonService",
    "app/services/capacityService",
    "tiny-lib/underscore",
    "app/business/application/controllers/constants",
    "app/business/ecs/services/vm/vmNicService",
    "fixtures/appFixture"
], function ($, encoder, angular, Textbox, Button, Window, Progressbar, Checkbox, Table, cloudInfraService, messageService, appCommonService, capacityService, _, constants, vmNicService) {
    "use strict";

    var appListCtrl = ["$scope", "$compile", "$state", "$stateParams", "camel", "$q", "exception", "appCommonData", "$interval", "storage","message",
        function ($scope, $compile, $state, $stateParams, camel, $q, exception, appCommonData, $interval, storage, message) {
            var cloudInfra = {};
            var vpcId = "";
            var user = $scope.user;
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var messageServiceIns = new messageService();
            var appCommonServiceIns = new appCommonService(exception, $q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var vmNicServiceIns = new vmNicService(exception, $q, camel);
            var searchString = "";
            var isCustom = false;
            var i18n = $scope.i18n;
            var isVPCStack = false;    //是否是创建VPC时，自动生成的实例
            $scope.hasInstanceOperateRight = _.contains(user.privilegeList, constants.privileges.OPERATE_APP_INSTANCE);
            $scope.hasTransferOperateRight = _.contains(user.privilegeList, constants.privileges.TRANSFER_APP_INSTANCE);

            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 4,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };
            $scope.isIT = (user.cloudType === "IT");
            $scope.supportSelectVpc = "false";

            $scope.promise = null;
            /**
             * 初始化操作  加了保护,可以重复起
             */
            $scope.start = function () {
                if (!$scope.promise) {
                    $scope.promise = $interval(function () {
                        getApp();
                    }, 60000);
                }
            };

            $scope.help = {
                "helpKey": "drawer_app_instance",
                "tips": i18n.common_term_help_label,
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            /**
             * 清除定时器  加了保护,可以重复停
             */
            $scope.stop = function () {
                if ($scope.promise) {
                    try {
                        $interval.cancel($scope.promise);
                    } catch (e) {
                    }
                }

                $scope.promise = null;
            };

            $scope.createBtn = {
                "id": "app_manager_create_id",
                "text": i18n.common_term_create_button,
                "click": function () {
                    if (user.cloudType === "IT") {
                        if ($scope.deployMode === "serviceCenter") {
                            $state.go("appCreateByCustom.navigate", {
                                "templateId": null,
                                "fromFlag": constants.fromFlag.FROM_APP_LIST
                            });
                        }
                        else {
                            $state.go("application.createAppHome", {
                                "templateId": null
                            });
                        }
                    } else {
                        $state.go("createByOpenstack.navigate", {
                            "templateId": null,
                            "fromFlag": constants.fromFlag.FROM_APP_LIST
                        });
                    }
                },
                "tooltip": "",
                "disable": false
            };

            $scope.location = {
                label: i18n.common_term_section_label + ":",
                require: true,
                "id": "createApp-chooseLocation",
                "width": "149",
                'validate': 'required:"+i18n.common_term_null_valid+";',
                "values": [],
                "change": function () {
                    page.currentPage = 1;
                    var selectId = $("#" + $scope.location.id).widget().getSelectedId();
                    var selectCloudInfr = null;
                    _.each($scope.location.values, function (item, index) {
                        if (selectId === item.selectId) {
                            selectCloudInfr = item;
                        }
                    });
                    cloudInfra = selectCloudInfr;
                    queryCapacity();
                    if ($scope.supportSelectVpc === "true") {
                        var defer = queryVpc();
                        defer.then(function () {
                            //避免同一页面定时器和用户触发 两条同时去查
                            $scope.stop();
                            getApp();
                            $scope.start();
                        });
                    } else {
                        $scope.stop();
                        getApp();
                        $scope.start();
                    }

                    storage.add("cloudInfraId", selectId);
                }
            };

            $scope.searchVpc = {
                "id": "ecsVmsSearchVpc",
                "width": "100",
                "values": [],
                "change": function () {
                    vpcId = $("#" + $scope.searchVpc.id).widget().getSelectedId();
                    page.currentPage = 1;
                    $scope.stop();
                    getApp();
                    $scope.start();

                    storage.add("vpcId", vpcId);
                }
            };

            $scope.searchStatus = {
                "id": "app_apps_searchStatus",
                "width": "100",
                "display": true,
                "map": {
                    "Started": i18n.common_term_enable_value,
                    "ToBeProcessed": i18n.common_term_waitDeal_value,
                    "Creating": i18n.common_term_creating_value,
                    "CreationFailed": i18n.common_term_createFail_value,
                    "Starting": i18n.common_term_startuping_value,
                    "StartFailed": i18n.common_term_startupFail_value,
                    "Stopped": i18n.common_term_stop_button,
                    "Stopping": i18n.common_term_stoping_value,
                    "StopFailed": i18n.common_term_stopFail_value,
                    "Deleting": i18n.common_term_deleting_value,
                    "DeleteFailed": i18n.common_term_deleteFail_value,
                    "Exception": i18n.common_term_abnormal_value,
                    "UPDATE_IN_PROGRESS": i18n.common_term_updating_value,
                    "UPDATE_COMPLETE": i18n.common_term_updatComplete_value,
                    "UPDATE_FAILED": i18n.common_term_updatFail_value,
                    "Repairing": i18n.common_term_restoring_value,
                    "RepaireFailed": i18n.common_term_restorFail_value
                },
                "values": null,
                "change": function () {
                    page.currentPage = 1;
                    $scope.stop();
                    getApp();
                    $scope.start();
                },
                "init": function () {
                    var newValues = [
                        {
                            "selectId": "",
                            "label": i18n.common_term_allStatus_value,
                            "checked": true
                        }
                    ];
                    var tmpSel = null;
                    _.each($scope.searchStatus.map, function (item, index) {
                        tmpSel = {};
                        tmpSel.selectId = index;
                        tmpSel.label = $scope.searchStatus.map[index];
                        newValues.push(tmpSel);
                    });
                    $scope.searchStatus.values = newValues;
                }
            };
            $scope.searchStatus.init();

            $scope.searchBox = {
                "id": "app_apps_searchBoxId",
                "placeholder": i18n.app_term_findAppName_prom,
                "width": "260",
                "suggestSize": 10,
                "maxLength": 64,
                "display": true,
                "suggest": function (content) {
                },
                "search": function (searchName) {
                    page.currentPage = 1;
                    searchString = searchName;
                    $scope.stop();
                    getApp();
                    $scope.start();
                }
            };
            $scope.refresh = {
                "id": "app_apps_refreshId",
                "tips": i18n.common_term_fresh_button,
                "click": function () {
                    $scope.stop();
                    getApp();
                    $scope.start();
                }
            };

            $scope.moreBtn = {
                "id": "",
                "text": i18n.common_term_more_button,
                "type": "button"
            };

            var transferShareData = {
                "curApplicationId": null,
                "curCloudInfraId": null,
                "curVpcId": null,
                "needRefresh": false
            };
            var allMoreBtnContents = {
                "canTransfer": {
                    title: "<div class='msg-info'><img src='../theme/default/images/gm/appImage/iam_org_assign.png'><span class='customMoreItemMargin'>" + i18n.app_term_ownershipTransfer_button + "</span></div>",
                    click: function (evt, item, widgetThis) {
                        $scope.stop();
                        var curApp = getAppById(widgetThis.options.id) || {};
                        var curVpcId = curApp.vpcId;
                        transferShareData.needRefresh = false;
                        transferShareData.curApplicationId = widgetThis.options.id;
                        transferShareData.curVpcId = curVpcId;
                        transferShareData.curCloudInfraId = $("#createApp-chooseLocation").widget().getSelectedId();
                        var options = {
                            "winId": "appListTransferAppWindId",
                            "transferShareData": transferShareData,
                            "title": i18n.app_term_ownershipTransfer_button,
                            "width": "800px",
                            "height": "600px",
                            "modal": true,
                            "content-type": "url",
                            "content": "app/business/application/views/appInstance/transferApp.html",
                            "buttons": null,
                            "close": function (event) {
                                if (transferShareData.needRefresh) {
                                    getApp();
                                }
                                $scope.start();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    }
                },
                "disableTransfer": {
                    title: "<div class='msg-info imageDisabled'><img src='../theme/default/images/gm/appImage/iam_org_assign.png'><span class='customMoreItemMargin'>" + i18n.app_term_ownershipTransfer_button + "</span></div>",
                    click: function (evt, item, widgetThis) {
                    }
                },
                "canModify": {
                    title: "<div class='msg-info'><img src='../theme/default/images/gm/appImage/ssp_common_mod.png'><span class='customMoreItemMargin'>" + i18n.common_term_modify_button + "</span></div>",
                    click: function (evt, item, widgetThis) {
                        var curApp = getAppById(widgetThis.options.id);
                        if (!curApp) {
                            return;
                        }
                        var curVpc = curApp.vpcId;

                        if (user.cloudType === "IT") {
                            //自定义应用的修改流程 appId传入非空识别为修改
                            if (curApp.typeKey === "CUSTOMER") {
                                $state.go("appCreateByCustom.navigate", {
                                    "appId": widgetThis.options.id,
                                    "fromFlag": constants.fromFlag.FROM_APP_LIST,
                                    "cloudInfraId": $("#createApp-chooseLocation").widget().getSelectedId(),
                                    "selVpcId": curVpc
                                });
                                return;
                            }

                            //模板应用的修改
                            $scope.stop();
                            var options = {
                                "winId": "appListModifyAppWindId",
                                "curApplicationId": widgetThis.options.id,
                                "curVpcId": curVpc,
                                "curCloudInfraId": $("#createApp-chooseLocation").widget().getSelectedId(),
                                "title": i18n.app_term_modifyApp_button,
                                "width": "600px",
                                "height": "450px",
                                "modal": true,
                                "content-type": "url",
                                "content": "app/business/application/views/appInstance/modifyApp.html",
                                "buttons": null,
                                "close": function (event) {
                                    getApp();
                                    $scope.start();
                                }
                            };
                            var win = new Window(options);
                            win.show();
                        } else {
                            $state.go("createByOpenstack.navigate", {
                                "appId": widgetThis.options.id,
                                "fromFlag": constants.fromFlag.FROM_APP_LIST,
                                "cloudInfraId": $("#createApp-chooseLocation").widget().getSelectedId(),
                                "vpcId": curVpc
                            });
                        }
                    }
                },
                "disableModify": {
                    title: "<div class='msg-info imageDisabled'><img src='../theme/default/images/gm/appImage/ssp_common_mod.png'><span class='customMoreItemMargin'>" + i18n.common_term_modify_button + "</span></div>",
                    click: function (evt, item, widgetThis) {
                    }
                },
                "canDelete": {
                    title: "<div class='msg-info'><img src='../theme/default/images/gm/appImage/ssp_delete.png'><span class='customMoreItemMargin'>" + i18n.common_term_delete_button + "</span></div>",
                    click: function (evt, item, widgetThis) {
                        message.warnMsgBox({
                            "content": i18n.app_app_del_info_confirm_msg || "确实要删除该应用？",
                            "callback": function () {
                                deleteApp(widgetThis.options.id);
                            }
                        });
                    }
                },
                "disableDelete": {
                    title: "<div class='msg-info imageDisabled'><img src='../theme/default/images/gm/appImage/ssp_delete.png'><span class='customMoreItemMargin'>" + i18n.common_term_delete_button + "</span></div>",
                    click: function (evt, item, widgetThis) {
                    }
                }
            };

            $scope.viewDetail = function (appId, vpcId, resPoolFm) {
                if (!appId) {
                    return;
                }

                $scope.stop();
                var options = {
                    "user": user,
                    "id": appId,
                    "cloudInfraId": $("#createApp-chooseLocation").widget().getSelectedId(),
                    "vpcId": vpcId
                };
                var deferred = appCommonServiceIns.queryAppBasicInfoResource(options);
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }

                    var options = {
                        "winId": "viewApp_Detail_winId",
                        "deployBasicInfo": data,
                        "curAppId": appId,
                        "curCloudInfraId": $("#createApp-chooseLocation").widget().getSelectedId(),
                        "curVpcId": vpcId,
                        "resPoolFm": resPoolFm,
                        title: i18n.app_term_checkDeployDetail_button,
                        width: "1000px",
                        height: "750",
                        "content-type": "url",
                        "content": "app/business/application/views/manager/deployMgr.html",
                        "buttons": null,
                        "close": function (event) {
                            $scope.start();
                        }
                    };

                    var win = new Window(options);
                    win.show();
                });
            };

            $scope.repair = function (appId, vpcId) {
                $scope.actOnApp(appId, vpcId, 'Repair');
            };

            $scope.showFailDetail = function (appId) {
                if (!appId) {
                    return;
                }
                var appInfo = getAppById(appId);
                if (!appInfo) {
                    return;
                }
                $scope.stop();
                var options = {
                    "winId": "show_createAppFail_Detail_winId",
                    "curAppInfo": appInfo,
                    title: i18n.common_term_failDesc_label,
                    width: "450px",
                    height: "250px",
                    "content-type": "url",
                    "content": "app/business/application/views/manager/showFailDetail.html",
                    "buttons": null,
                    "close": function (event) {
                        $scope.start();
                    }
                };

                var win = new Window(options);
                win.show();
            };

            $scope.view = function (appId, vpcId,isVPCStack) {
                var curApp = getAppById(appId) || {};
                var cloudInfraId = $("#createApp-chooseLocation").widget().getSelectedId();
                appCommonData.cloudInfraId = cloudInfraId;
                appCommonData.vpcId = vpcId;
                appCommonData.appId = appId;
                appCommonData.appName = curApp.name;
                appCommonData.canViewTopo = curApp.canViewTopo;
                appCommonData.isVPCStack = isVPCStack;
                $state.go("application.navigate.topo", {
                    "cloudInfraId": cloudInfraId,
                    "vpcId": vpcId,
                    "appId": appId,
                    "canViewTopo": curApp.canViewTopo,
                    "appName": curApp.name
                });
            };

            $scope.appPagination = {
                "id": "paginationId",
                "prevText": "prev",
                "nextText": "next",
                "type1": "full_numbers",
                "curPage": {
                    "pageIndex": 1
                },
                "display": true,
                "options": [4],
                "hideTotalRecords": false,
                "hideDisplayLength": false,
                "displayLength": 4,
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.stop();
                    getApp();
                    $scope.start();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    $scope.stop();
                    getApp();
                    $scope.start();
                }
            };

            function getAppById(appId) {
                if (!appId) {
                    return null;
                }
                if ($scope.appList) {
                    for (var i = 0; i < $scope.appList.length; i++) {
                        if ($scope.appList[i] && ($scope.appList[i].id === appId)) {
                            return $scope.appList[i];
                        }
                    }
                }
                return null;
            }


            //查询当前租户可见的地域列表
            function getLocations() {
                var retDefer = $q.defer();
                var deferred = cloudInfraServiceIns.queryCloudInfras(user.vdcId, user.id);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        if ($stateParams.cloudInfraId) {
                            cloudInfra = cloudInfraServiceIns.getCloudInfra(data.cloudInfras, $stateParams.cloudInfraId);
                            if (!cloudInfra || !cloudInfra.id) {
                                cloudInfra = data.cloudInfras[0];
                            }
                            data.cloudInfras[0].checked = false;
                            cloudInfra.checked = true;
                        } else {
                            cloudInfra = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras);
                        }

                        $scope.location.values = data.cloudInfras;
                    }
                    retDefer.resolve();
                }, function (rejectedValue) {
                    exception.doException(rejectedValue);
                    retDefer.reject();
                });
                return retDefer.promise;
            }

            // 查询VPC列表，只有ICT才需要
            function queryVpc() {
                var retDefer = $q.defer();
                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id,
                    "start": 0,
                    "limit": 100
                };
                var deferred = appCommonServiceIns.queryVpcs(options);
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

                        var curr;
                        if ($stateParams.vpcId) {
                            curr = vmNicServiceIns.getSpecVpc(data.vpcs, $stateParams.vpcId);
                            if (!curr || !curr.vpcID) {
                                curr = data.vpcs[0];
                            }
                        } else {
                            curr = vmNicServiceIns.getUserSelVpc(data.vpcs);
                        }

                        curr.checked = true;
                        vpcId = curr.vpcID;
                    }
                    $scope.searchVpc.values = data.vpcs;
                    retDefer.resolve(data);
                });

                return retDefer.promise;
            }

            //查询支持的能力字段
            function queryCapacity() {
                var capacity = capacityServiceIns.querySpecificCapacity($("html").scope().capacities, cloudInfra.type, cloudInfra.version);
                if (capacity) {
                    $scope.supportSelectVpc = capacity.vpc_support_select;
                }
            }

            //act取Start, Stop, Repair
            $scope.actOnApp = function (appId, vpcId, act) {
                if (!appId) {
                    return;
                }

                $scope.stop();
                var cloudInfraId = $("#createApp-chooseLocation").widget().getSelectedId();
                var options = {
                    "vdcId": user.vdcId,
                    "id": appId,
                    "vpcId": vpcId,
                    "cloudInfraId": cloudInfraId,
                    "userId": user.id,
                    "operate": act
                };
                var deferred = appCommonServiceIns.operateAppInstance(options);
                deferred.then(function (data) {
                    getApp();
                    $scope.start();
                }, function (data) {
                    $scope.start();
                });
            };

            function deleteApp(appId) {
                if (!appId) {
                    return;
                }

                $scope.stop();
                var curApp = getAppById(appId);
                var curVpcId = curApp && curApp.vpcId;
                var cloudInfraId = $("#createApp-chooseLocation").widget().getSelectedId();
                var deferred = camel["delete"]({
                    "url": {
                        "s": "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/apps/{id}?cloud-infra={cloud_infra_id}",
                        "o": {
                            "vdc_id": user.vdcId,
                            "id": appId,
                            "cloud_infra_id": cloudInfraId,
                            "vpc_id": curVpcId
                        }
                    },
                    "userId": user.id,
                    "params": {}
                });

                deferred.success(function (data) {
                    getApp();
                    $scope.start();
                });
                deferred.fail(function (data) {
                    if (!exception.isException(data)) {
                        exception.doFaultPopUp();
                        $scope.start();
                        return;
                    }
                    exception.doException(data);
                    $scope.start();
                });
            }

            function getApp() {
                if (!cloudInfra.id || ($scope.supportSelectVpc === "true" && !vpcId)) {
                    return;
                }

                var options = {
                    "user": user,
                    "cloudInfraId": cloudInfra.id,
                    "status": $("#app_apps_searchStatus").widget().getSelectedId(),
                    "searchName": searchString,
                    "displayLength": page.displayLength,
                    "start": page.getStart(),
                    "vpcId": vpcId
                };
                var deferred = appCommonServiceIns.queryAppList(options);
                deferred.then(function (data) {
                    if (!data || !data.appInstances) {
                        return;
                    }
                    if (data.appInstances.length <= 0) {
                        $scope.appList = [];
                        $scope.appPagination.totalRecords = data.total || 0;
                        return;
                    }
                    var appArray = [];
                    var tmpApp = null;
                    var tmpDistableStatus = null;
                    _.each(data.appInstances, function (item, index) {
                        tmpApp = {};
                        tmpApp.id = item.appId;
                        tmpApp.name = item.appName;
                        tmpApp.nameShorten = appCommonServiceIns.genSerialName(item.appName, 49);
                        tmpApp.healthStatus = "";
                        tmpApp.statusKey = item.status;
                        tmpApp.status = $scope.searchStatus.map[item.status];
                        tmpApp.resPoolFm = (user.cloudType === "IT");
                        tmpApp.typeKey = item.type;
                        if (item.type) {
                            if (item.type === "TEMPLATE") {
                                tmpApp.type = i18n.app_app_create_para_mode_option_template_label;
                                isCustom = false;
                            } else {
                                tmpApp.type = i18n.common_term_custom_label;
                                isCustom = true;
                            }
                        }
                        tmpApp.idLabel = i18n.common_term_ID_label + ":";
                        tmpApp.typeLabel = i18n.common_term_type_label + ":";
                        tmpApp.statusLabel = i18n.common_term_status_label + ":";
                        tmpApp.vpcLabel = i18n.vpc_term_vpc_label + ":";
                        tmpApp.vpcName = item.vpcName;
                        tmpApp.vpcId = item.vpcId;
                        if(item.picture === null){
                            tmpApp.picture = "../theme/default/images/gm/appImage/buff01.jpg";
                            isVPCStack = true;
                        }else{
                            tmpApp.picture = item.picture;
                            isVPCStack = false;
                        }
                        item.isVPCStack = isVPCStack;
                        tmpApp.isVPCStack = item.isVPCStack;
                        tmpApp.progress = getProgressPercent(item.createPercent);
                        tmpApp.canShowFail = checkCanShowFailReason(item.status);
                        tmpApp.stackStatusReason = item.stackStatusReason;
                        tmpDistableStatus = getDisableStatus(item.status, isCustom);
                        _.extend(tmpApp, {
                            "canStart": (!$scope.hasInstanceOperateRight ? undefined : tmpDistableStatus.canStart),
                            "canStop": (!$scope.hasInstanceOperateRight ? undefined : tmpDistableStatus.canStop),
                            "canViewTopo": tmpDistableStatus.canViewTopo,
                            "content": getContentByStatus(tmpDistableStatus,item.isVPCStack)
                        });
                        appArray.push(tmpApp);
                    });
                    $scope.appList = appArray;
                    $scope.appPagination.totalRecords = data.total;
                });
            }

            function checkCanShowFailReason(status) {
                if (!status) {
                    return false;
                }
                var canShowMatrix = {
                    "CreationFailed": "true",
                    "StartFailed": "true",
                    "StopFailed": "true",
                    "DeleteFailed": "true",
                    "RepaireFailed": "true"
                };
                return "true" === canShowMatrix[status];
            }

            function getProgressPercent(createPercent) {
                if (!createPercent) {
                    return "0%";
                }
                var seperatorIndex = createPercent.lastIndexOf("/");
                if (seperatorIndex < 0) {
                    return "0%";
                }
                var percent = createPercent.substring(0, seperatorIndex) + "%";
                return $.encoder.encodeForHTML(percent);
            }

            //注:这里的tiny-moreBut的内容动态的刷新,无权限时滤掉,状态不允许时灰掉
            function getContentByStatus(diableStatus,isVPCStack) {
                if (!diableStatus) {
                    return [];
                }
                if (!$scope.hasInstanceOperateRight) {
                    return [];
                }
                var curAppContent = [];
               if(!isVPCStack && $scope.hasTransferOperateRight && $scope.deployMode !== "serviceCenter"){
                    if (diableStatus.canTransfer) {
                        curAppContent.push(allMoreBtnContents.canTransfer);
                    } else {
                        curAppContent.push(allMoreBtnContents.disableTransfer);
                    }
                }
                if (diableStatus.canModify) {
                    curAppContent.push(allMoreBtnContents.canModify);
                } else {
                    curAppContent.push(allMoreBtnContents.disableModify);
                }
                if (diableStatus.canDelete) {
                    curAppContent.push(allMoreBtnContents.canDelete);
                } else {
                    curAppContent.push(allMoreBtnContents.disableDelete);
                }
                return curAppContent;
            }

            //isCustom  是否自定义应用true/false
            function getDisableStatus(status, isCustom) {
                if (!status) {
                    return {};
                }

                var statusMatrix = {};
                if (status === "UPDATE_IN_PROGRESS") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": false,
                        "canViewTopo": false
                    };
                }
                if (status === "UPDATE_COMPLETE") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": true,
                        "canTransfer": true,
                        "canModify": true,
                        "canDelete": true,
                        "canViewTopo": true
                    };
                }
                if (status === "UPDATE_FAILED") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": true,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": false
                    };
                }
                if (status === "Started") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": true,
                        "canTransfer": true,
                        "canModify": true,
                        "canDelete": true,
                        "canViewTopo": true
                    };
                }
                if (status === "ToBeProcessed") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": false,
                        "canViewTopo": false
                    };
                }
                if (status === "Creating") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": false,
                        "canViewTopo": false
                    };
                }
                if (status === "CreationFailed") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": false
                    };
                }
                if (status === "Starting") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": false,
                        "canViewTopo": true
                    };
                }
                if (status === "StartFailed") {
                    statusMatrix = {
                        "canStart": true,
                        "canStop": false,
                        "canTransfer": true,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": true
                    };
                }
                if (status === "Stopped") {
                    statusMatrix = {
                        "canStart": true,
                        "canStop": false,
                        "canTransfer": ($scope.isIT ? true : false),
                        "canModify": ($scope.isIT? true : false),
                        "canDelete": true,
                        "canViewTopo": true
                    };
                }
                if (status === "Stopping") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": false,
                        "canViewTopo": true
                    };
                }
                if (status === "StopFailed") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": true,
                        "canTransfer": true,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": true
                    };
                }
                if (status === "Deleting") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": false,
                        "canViewTopo": false
                    };
                }
                if (status === "DeleteFailed") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": false
                    };
                }
                if (status === "Exception") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": false
                    };
                }
                if (status === "RepaireFailed") {
                    statusMatrix = {
                        "canStart": false,
                        "canStop": false,
                        "canTransfer": false,
                        "canModify": false,
                        "canDelete": true,
                        "canViewTopo": false
                    };
                }

                //ICT场景,对于所有状态的应用删除均放开,而IT维持C10
                if (!$scope.isIT) {
                    statusMatrix.canDelete = true;
                }
                return statusMatrix;
            }

            //获取初始化信息
            $scope.$on("$viewContentLoaded", function () {
                var promise = getLocations();
                promise.then(function () {
                    queryCapacity();

                    if (!$scope.isIT) {
                        $scope.searchStatus.display = false;
                        $scope.searchBox.display = false;
                    } else {
                        // 是否按指定条件搜索
                        if ($stateParams.condition) {
                            searchString = $stateParams.condition;
                            $("#" + $scope.searchBox.id).widget().setValue(searchString);
                        }
                    }

                    if ($scope.supportSelectVpc === "true") {
                        var defer = queryVpc();
                        defer.then(function () {
                            $scope.start();
                            getApp();
                        });
                    } else {
                        $scope.start();
                        getApp();
                    }
                });
            });

            // 清理定时器
            $scope.$on('$destroy', function () {
                $scope.stop();
            });
        }
    ];

    return appListCtrl;
});
