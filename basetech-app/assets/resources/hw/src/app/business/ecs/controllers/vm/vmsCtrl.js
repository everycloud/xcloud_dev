define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'tiny-lib/underscore',
        "app/services/cloudInfraService",
        'app/services/capacityService',
        'app/services/messageService',
        "app/services/exceptionService",
        'app/services/competitionConfig',
        "app/business/ecs/services/vm/vmCommonService",
        "app/business/ecs/services/vm/queryVmService",
        "app/business/ecs/services/vm/updateVmService",
        "app/business/ecs/services/vm/vmNicService",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "tiny-widgets/Checkbox",
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-directives/Progressbar",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "fixtures/ecsFixture"
    ],
    function ($, angular, _, cloudInfraService, capacityService, messageService, exceptionService, competitionConfig, vmCommonService, queryVmService, updateVmService, vmNicService, Window, Message, Checkbox) {
        "use strict";
        var vmLstCtrl = ["$rootScope", "$scope", "$compile", "$state", "$q", "camel", "exception", "storage", "$stateParams",
            function ($rootScope, $scope, $compile, $state, $q, camel, exception, storage, $stateParams) {
                $scope.jumpVmId = $stateParams.jumpVmId;

                // 公共服务实例
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var capacityServiceIns = new capacityService($q, camel);
                var exceptionServiceIns = new exceptionService();
                var vmCommonServiceIns = new vmCommonService();
                var queryVmServiceIns = new queryVmService(exception, $q, camel);
                var updateVmServiceIns = new updateVmService(exception, $q, camel);
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var messageIns = new messageService();

                $scope.fromPerformance = $stateParams.fromPerformance;
                $scope.performanceVmName = $stateParams.vmName;
                $scope.performanceVmId = $stateParams.vmId;
                $scope.performanceCloudInfra = $stateParams.cloudInfraId;
                $scope.performanceVpcId = $stateParams.vpcId;

                // 用户信息
                var user = $rootScope.user;
                var i18n = $rootScope.i18n || {};
                var locale = $rootScope.urlParams.lang === "en" ? "en_US" : "zh_CN";
                // 资源池，标识地域
                var cloudInfra = {
                    "id":$scope.fromPerformance?$scope.performanceCloudInfra:""
                };
                var vpcId = $scope.fromPerformance?($scope.performanceVpcId?$scope.performanceVpcId:-1):"-1";

                // 差异化能力字段
                var supportSafeDelete = "false";
                var supportRepairVm = "false";
                var supportConvertToTemplate = "false";
                var supportAddToDomain = "false";
                $scope.supportSelectVpc = "false";
                $scope.ICT = user.cloudType === "ICT";

                // 权限控制
                $scope.hasVmAdvanceOperateRight = _.contains(user.privilegeList, "615000"); // 休眠、修复、转为模板、加入域、快照管理
                $scope.hasVmBasicOperateRight = _.contains(user.privilegeList, "616000"); // 启动、重启、关闭、强制重启、强制关闭、修改
                $scope.hasVmCreateRight = _.contains(user.privilegeList, "617000");
                $scope.hasVmDeleteRight = _.contains(user.privilegeList, "618000");
                $scope.hasVmVncRight = _.contains(user.privilegeList, "620000");

                // 搜索字符串
                var searchString = "";
                if($scope.fromPerformance)
                {
                    if($scope.performanceVmName){
                        searchString = $scope.performanceVmName;
                    }
                    else if($scope.performanceVmId){
                        searchString = $scope.performanceVmId;
                    }
                }

                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };

                //ICT 场景下的分页
                $scope.page = page;
                $scope.hasPrePage = false;
                $scope.hasNextPage = false;
                var markers = [];
                $scope.prePage = function () {
                    if (!$scope.hasPrePage) {
                        return;
                    }
                    markers.pop();
                    if (markers.length === 0) {
                        $scope.hasPrePage = false;
                    }
                    page.currentPage--;
                    getVmData();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    var item = $scope.vmTable.data[page.displayLength - 1] || {};
                    markers.push(item.id);
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    getVmData();
                };
                $scope.pageSize = {
                    "id": "vms-searchSizeSelector",
                    "width": "80",
                    "values": [
                        {
                            "selectId": "10",
                            "label": "10",
                            "checked": true
                        },
                        {
                            "selectId": "20",
                            "label": "20"
                        },
                        {
                            "selectId": "50",
                            "label": "50"
                        }
                    ],
                    "change": function () {
                        page.currentPage = 1;
                        page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                        markers = [];
                        $scope.hasPrePage = false;
                        getVmData();
                    }
                };

                // VNC登录参数
                var loadVNCAppletOptions = {
                    "id": "",
                    "sessionId": "",
                    "path": "./",
                    "vncIp": "",
                    "vmPort": "",
                    "vncPwd": "",
                    "shaEncFlag": "",
                    "vmID": "",
                    "vmTitle": "",
                    "cdRomStatus": "",
                    "canMountCdRom": "",
                    "status": "",
                    "toolInstallStatus": "",
                    "cloudInfraId": ""
                };

                // 当前勾选的虚拟机
                $scope.selectedVm = [];

                $scope.help = {
                    "helpKey": "drawer_vm",
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
		
                $scope.exportButton = {
                    "id": "vmExportButton",
                    "text": $scope.i18n.common_term_exportList_button,
                    "click": function () {
                        var newWindow = new Window({
                            "winId": "exportVmsListWindow",
                            "title":$scope.i18n.common_term_exportList_button,
                            "totalRecords":$scope.vmTable.totalRecords,
                            "locale":locale,
                            "limit":page.displayLength,
                            "status":$("#ecsVmsSearchStatus").widget().getSelectedId().length > 0 ? [$("#ecsVmsSearchStatus").widget().getSelectedId()] : [],
                            "condition":searchString,
                            "cloudInfraId":cloudInfra.id,
                            "vpcId": vpcId,
                            "content-type": "url",
                            "buttons": null,
                            "content": "app/business/ecs/views/vm/exportVmList.html",
                            "height": 220,
                            "width": 510,
                            "close": function () {
                            }
                        });
                        newWindow.show();
                    }
                };
		
                // 以下是页面控件的model对象
                $scope.createBtn = {
                    "id": "ecs_vms_create_id",
                    "text": i18n.common_term_create_button,
                    "click": function () {
                        var param = {
                            "cloudInfra": cloudInfra.id,
                            "vpcId": vpcId
                        };
                        $state.go("ecsVmCreate.navigate", param);
                    }
                };

                $scope.vncBtn = {
                    "id": "ecsVmsVncId",
                    "text": i18n.vm_term_vnc_button,
                    "disable": true,
                    "click": function () {
                        var id = $scope.selectedVm[0];
                        if(user.cloudType && (user.cloudType === "IT")){
                            vncLoginByIT(id);
                        }
                        else{
                            var options = {
                                "user": user,
                                "vmId": id,
                                "cloudInfraId": cloudInfra.id,
                                "vpcId": vpcId
                            };
                            var deferred = queryVmServiceIns.queryVmVncInfo(options);
                            deferred.then(function (data) {
                                if (!data || !data.vncAcessInfo) {
                                    return;
                                }

                                vncLoginByICT(data.vncAcessInfo.url);
                            });
                        }
                    }
                };

                $scope.searchLocation = {
                    "id": "ecsVmsSearchLocation",
                    "width": "100",
                    "values": [],
                    "change": function () {
                        cloudInfra = cloudInfraServiceIns.getCloudInfra($scope.searchLocation.values, $("#ecsVmsSearchLocation").widget().getSelectedId());
                       if($scope.ICT){
                           page.currentPage = 1;
                           page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                       }
                        markers = [];
                        $scope.hasPrePage = false;
                        queryCapacity();
                        if ($scope.supportSelectVpc === "true") {
                            var defer = queryVpc();
                            defer.then(function () {
                                getVmData();
                            });
                        } else {
                            getVmData();
                        }
                        storage.add("cloudInfraId", cloudInfra.id);
                    }
                };

                $scope.searchVpc = {
                    "id": "ecsVmsSearchVpc",
                    "width": "100",
                    "values": [],
                    "change": function () {
                        vpcId = $("#" + $scope.searchVpc.id).widget().getSelectedId();
                        page.currentPage = 1;
                        getVmData();
                        storage.add("vpcId", vpcId);
                    }
                };

                $scope.searchStatus = {
                    "id": "ecsVmsSearchStatus",
                    "width": "100",
                    "values": [{
                            "selectId": "",
                            "label": i18n.common_term_allStatus_value,
                            "checked": true
                        }, {
                            "selectId": "running",
                            "label": i18n.common_term_running_value
                        }, {
                            "selectId": "stopped",
                            "label": i18n.common_term_stoped_value
                        }, {
                            "selectId": "hibernated",
                            "label": i18n.common_term_hibernated_value
                        },
                        {
                            "selectId": "creating",
                            "label": i18n.common_term_creating_value
                        }, {
                            "selectId": "migrating",
                            "label": i18n.common_term_migrating_value
                        }, {
                            "selectId": "error",
                            "label": i18n.common_term_trouble_label
                        }
                    ],
                    "change": function () {
                        page.currentPage = 1;
                        getVmData();
                    }
                };

                $scope.searchBox = {
                    "id": "ecsVmsSearchBox",
                    "placeholder": $scope.ICT?i18n.common_term_findName_prom:i18n.vm_term_findVMnameIPglobeID_prom,
                    "width": "300",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "suggest": function (content) {},
                    "search": function (content) {
                        searchString = content;
                        page.currentPage = 1;
                        getVmData();
                    }
                };

                $scope.refresh = {
                    "id": "ecsVmsRefresh",
                    "click": function () {
                        getVmData();
                    }
                };

                $scope.moreBtn = {
                    "canStart": undefined,
                    "canStop": undefined,
                    "canReboot": undefined,
                    "canForceStop": undefined,
                    "canForceReboot": undefined,
                    "canHibernate": undefined,
                    "canDelete": undefined,
                    "start": function () {
                        operateVmConfirm("start", $scope.selectedVm);
                    },
                    "stop": function () {
                        operateVmConfirm("stop", $scope.selectedVm, "safe");
                    },
                    "reboot": function () {
                        operateVmConfirm("reboot", $scope.selectedVm, "safe");
                    },
                    "forceStop": function () {
                        operateVmConfirm("stop", $scope.selectedVm, "force");
                    },
                    "forceReboot": function () {
                        operateVmConfirm("reboot", $scope.selectedVm, "force");
                    },
                    "hibernate": function () {
                        operateVmConfirm("hibernate", $scope.selectedVm);
                    },
                    "transfer": function () {
                        transfer($scope.selectedVm);
                    },
                    "delete": function () {
                        if (supportSafeDelete === "true") {
                            deleteVm($scope.selectedVm);
                        } else {
                            operateVmConfirm("delete", $scope.selectedVm);
                        }
                    },
                    "export2Excel": function () {
                        messageIns.confirmMsgBox({
                            "content": i18n.vm_vm_exportList_info_confirm_msg,
                            "callback": function () {
                                export2Excel(null);
                            }
                        });
                    },
                    "click": function () {
                        // 判断各按钮是否可点击
                        var selectVmStatus = getVmStatus($scope.selectedVm);
                        $scope.moreBtn.canStart = $scope.hasVmBasicOperateRight ? _.intersection(selectVmStatus, allowStatus.start).length > 0 : undefined;
                        $scope.moreBtn.canStop = $scope.hasVmBasicOperateRight ? _.intersection(selectVmStatus, allowStatus.stop).length > 0 : undefined;
                        if(competitionConfig.isBaseOnVmware){
                            $scope.moreBtn.canStop = undefined;
                        }
                        $scope.moreBtn.canReboot = $scope.hasVmBasicOperateRight ? _.intersection(selectVmStatus, allowStatus.reboot).length > 0 : undefined;
                        $scope.moreBtn.canForceStop = $scope.hasVmBasicOperateRight ? _.intersection(selectVmStatus, allowStatus.forceStop).length > 0 : undefined;
                        $scope.moreBtn.canForceReboot = $scope.hasVmBasicOperateRight ? _.intersection(selectVmStatus, allowStatus.forceReboot).length > 0 : undefined;
                        $scope.moreBtn.canHibernate = $scope.hasVmAdvanceOperateRight ? _.intersection(selectVmStatus, allowStatus.hibernate).length > 0 : undefined;
                        $scope.moreBtn.canTransfer = $scope.hasVmAdvanceOperateRight ? selectVmStatus.length > 0 : undefined;
                        $scope.moreBtn.canDelete = $scope.hasVmDeleteRight ? _.intersection(selectVmStatus, allowStatus["delete"]).length > 0 : undefined;
                    }
                };

                // 存储当前下钻的虚拟机信息
                $scope.currentItem = undefined;

                $scope.vmTable = {
                    "id": "ecsVmsTable",
                    "captain": "vmCaptain",
                    "paginationStyle": "full_numbers",
                    "enablePagination": !$scope.ICT,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "totalRecords": 0,
                    "showDetails": {
                        "colIndex": 0,
                        "domPendType": "append"
                    },
                    "draggable": true,
                    "columns": [{
                        "sTitle": "",
                        "mData": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "80px"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.visiableId ? data.visiableId : data.id);
                        }
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "statusStr"
                    }, {
                        "sTitle": "IP",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.allIp);
                        }
                    }, {
                        "sTitle": i18n.common_term_spec_label,
                        "sWidth": "28%",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.config);
                        }
                    }, {
                        "sTitle": i18n.resource_term_AZ_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.availableZoneName);
                        }
                    }, {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "",
                        "bSortable": false
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getVmData();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        getVmData();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        if(aData.taskStatus === "deleting" || aData.taskStatus === "soft-deleting"){
                            $("td:eq(3)", nRow).text(i18n.common_term_deleting_value);
                        }
                        //tips提示
                        $("td:eq(1)", nRow).addTitle();
                        $("td:eq(2)", nRow).addTitle();
                        $("td:eq(4)", nRow).addTitle();
                        $("td:eq(5)", nRow).addTitle();
                        $("td:eq(6)", nRow).addTitle();

                        //下钻时传递参数
                        $("td:eq(0)", nRow).bind("click", function () {
                            aData.cloudInfra = cloudInfra;
                            aData.vpcId = vpcId;
                            $scope.currentItem = aData;
                        });

                        // 复选框
                        var selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.id = "ecsVmsCheckboxId" + iDataIndex;
                        selBoxScope.checked = aData.checked;
                        selBoxScope.change = function () {
                            selectVm(aData.id, $("#" + selBoxScope.id).widget().option("checked"));
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);

                        // 操作列
                        addOperateColumn(aData, nRow);
                        $scope.fromPerformance && ($scope.vmTable.data.length - iDataIndex == 1) && expansionDetail();
                    }
                };
                var expansionDetail = function () {
                    setTimeout(function () {
                        $(".btn_detail_switch").first().click();
                    }, 100);
                };
                // 操作列添加更多操作
                var addOperateColumn = function (aData, nRow) {
                    if (!$scope.hasVmBasicOperateRight && !$scope.hasVmAdvanceOperateRight && !$scope.hasVmDeleteRight) {
                        return;
                    }

                    var menus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right vmOptWidth" role="menu" aria-labelledby="dLabel">';
                    if ($scope.hasVmBasicOperateRight) {
                        menus += getSupportOpt(aData.status, "start") ? "<li><a class='btn-link' ng-click='start()'>" + i18n.common_term_startup_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_startup_button + "</a></li>";
                        if(!competitionConfig.isBaseOnVmware){
                            menus += getSupportOpt(aData.status, "stop") ? "<li><a class='btn-link' ng-click='stop()'>" + i18n.common_term_turnOff_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_turnOff_button + "</a></li>";
                        }
                        menus += getSupportOpt(aData.status, "reboot") ? "<li><a class='btn-link' ng-click='reboot()'>" + i18n.common_term_restart_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_restart_button + "</a></li>";
                        menus += getSupportOpt(aData.status, "forceStop") ? "<li><a class='btn-link' ng-click='forceStop()'>" + i18n.common_term_forciblyShut_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_forciblyShut_button + "</a></li>";
                        menus += getSupportOpt(aData.status, "forceReboot") ? "<li><a class='btn-link' ng-click='forceReboot()'>" + i18n.common_term_forciblyRestart_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_forciblyRestart_button + "</a></li>";
                    }
                    if ($scope.hasVmAdvanceOperateRight) {
                        menus += getSupportOpt(aData.status, "hibernate") ? "<li><a class='btn-link' ng-click='hibernate()'>" + i18n.common_term_hibernate_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_hibernate_button + "</a></li>";
                    }
                    if ($scope.hasVmAdvanceOperateRight && !$scope.ICT && $scope.deployMode !== 'serviceCenter') {
                        menus += "<li><a class='btn-link' ng-click='transfer()'>" + i18n.common_term_allocate_button + "</a></li>";
                    }
                    if ($scope.hasVmDeleteRight &&  $scope.deployMode !== 'serviceCenter') {
                        menus += getSupportOpt(aData.status, "delete") ? "<li><a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_delete_button + "</a></li>";
                    }
                    if ($scope.hasVmAdvanceOperateRight) {
                        if (supportAddToDomain === "true" && $scope.deployMode !== 'serviceCenter') {
                            menus += "<li class='divider-line'></li>";
                            menus += !aData.domainId ? "<li><a class='btn-link' ng-click='addToDomain()'>" + i18n.vm_term_addToDomain_button + "</a></li>" : "<li class='disabled'><a>" + i18n.vm_term_addToDomain_button + "</a></li>";
                        }
                        if (supportConvertToTemplate === "true") {
                            menus += getSupportOpt(aData.status, "convert2Template") ? "<li><a class='btn-link' ng-click='convert2Template()'>" + i18n.vm_term_convertToTemplate_button + "</a></li>" : "<li class='disabled'><a>" + i18n.vm_term_convertToTemplate_button + "</a></li>";
                        }
                        if (supportRepairVm === "true") {
                            menus += getSupportOpt(aData.status, "repair") ? "<li><a class='btn-link' ng-click='repair()'>" + i18n.vm_term_restoreVM_button + "</a></li>" : "<li class='disabled'><a>" + i18n.vm_term_restoreVM_button + "</a></li>";
                        }
                    }
                    menus += '</ul></span>';

                    var optColumn = "<div>&nbsp;" + menus + "</div>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.start = function () {
                        operateVmConfirm("start", [aData.id]);
                    };
                    optScope.stop = function () {
                        operateVmConfirm("stop", [aData.id], "safe");
                    };
                    optScope.reboot = function () {
                        operateVmConfirm("reboot", [aData.id], "safe");
                    };
                    optScope.forceStop = function () {
                        operateVmConfirm("stop", [aData.id], "force");
                    };
                    optScope.forceReboot = function () {
                        operateVmConfirm("reboot", [aData.id], "force");
                    };
                    optScope.hibernate = function () {
                        operateVmConfirm("hibernate", [aData.id]);
                    };
                    optScope["delete"] = function () {
                        if (supportSafeDelete === "true") {
                            deleteVm([aData.id]);
                        } else {
                            operateVmConfirm("delete", [aData.id]);
                        }
                    };
                    optScope.addToDomain = function () {
                        addToDomain(aData.id, aData.name);
                    };
                    optScope.convert2Template = function () {
                        convert2Template(aData.id);
                    };
                    optScope.repair = function () {
                        repairVm(aData.id);
                    };
                    optScope.transfer = function () {
                        transfer([aData.id]);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(7)", nRow).html(optNode);
                    optNode.find('.dropdown').dropdown();
                };

                // 删除虚拟机
                function deleteVm(vms) {
                    var winParam = {
                        "vms": vms,
                        "needRefresh": false,
                        "cloudInfraId": cloudInfra.id
                    };
                    var options = {
                        "winId": "ecsVmDeleteWinId",
                        "winParam": winParam,
                        title: i18n.common_term_delete_button,
                        width: "370px",
                        height: "200px",
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/deleteVm.html",
                        "buttons": null,
                        "close": function (event) {
                            if (winParam.needRefresh) {
                                getVmData();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 勾选、去勾选虚拟机
                function selectVm(vmId, checked) {
                    var selected = $scope.selectedVm;
                    if (checked) {
                        selected.push(vmId);
                    } else {
                        for (var i = 0; i < selected.length; i++) {
                            if (selected[i] === vmId) {
                                selected.splice(i, 1);
                            }
                        }
                    }

                    var headCheck = $("#vmTableHeadCheckbox").widget();
                    if ( !! headCheck) {
                        if (selected.length < $("#ecsVmsTable").widget().options.data.length) {
                            headCheck.option("checked", false);
                        } else {
                            headCheck.option("checked", true);
                        }
                    }

                    // 处理VNC登录按钮的灰化状态
                    procVncBtnState();
                }

                // 处理VNC登录按钮的灰化状态
                function procVncBtnState() {
                    var selected = $scope.selectedVm;
                    var disableVnc = true;
                    if (selected && selected.length === 1) {
                        var vm = findSpecVm(selected[0]);
                        if (vm && vm.status === "running") {
                            disableVnc = false;
                        }
                    }

                    $("#" + $scope.vncBtn.id).widget().option("disable", disableVnc);
                }

                // 找到指定VM
                function findSpecVm(id) {
                    var vms = $scope.vmTable.data;
                    var vm;
                    if (vms && vms.length > 0) {
                        vm = _.find(vms, function (item) {
                            return item.id === id;
                        });
                    }
                    return vm;
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
                        }
                        $scope.searchLocation.values = data.cloudInfras;
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        exceptionServiceIns.doException(rejectedValue);
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
                    var deferred = vmNicServiceIns.queryVpcs(options);
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
                        }else{
                            vpcId = "";
                        }
                        $scope.searchVpc.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                }

                //生成一个checkbox放在表头处
                var tblHeadCheckbox = new Checkbox({
                    "id": "vmTableHeadCheckbox",
                    "checked": false,
                    "change": function () {
                        var vms = $scope.vmTable.data;
                        var isChecked = $("#vmTableHeadCheckbox").widget().option("checked");
                        for (var i = 0; i < vms.length; i++) {
                            $("#ecsVmsCheckboxId" + i).widget().option("checked", isChecked);
                        }

                        // 将已勾选的虚拟机id保存到selectedVm
                        $scope.selectedVm = [];
                        if (isChecked && vms) {
                            _.each(vms, function (item) {
                                $scope.selectedVm.push(item.id);
                            });
                        }

                        // 处理VNC登录按钮的灰化状态
                        procVncBtnState();
                    }
                });

                // 查询虚拟机列表信息
                function getVmData() {
                    if (!cloudInfra.id || ($scope.supportSelectVpc === "true" && (!vpcId || vpcId === "-1"))) {
                        initVMTableData();
                        return;
                    }

                    var startIndex;
                    if(!$scope.ICT) {
                        startIndex = page.getStart();
                    }
                    else {
                        var length = markers.length;
                        startIndex = markers[length-1] || "";
                    }

                    var deferred = camel.post({
                        "url": {
                            s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}",
                            o: {
                                "vdc_id": user.vdcId,
                                "vpc_id": vpcId,
                                "cloud_infra_id": cloudInfra.id
                            }
                        },
                        "params": JSON.stringify({
                            "list": {
                                "condition": searchString,
                                "start": startIndex,
                                "limit": page.displayLength,
				                "detail": 0,
                                "status": $("#ecsVmsSearchStatus").widget().getSelectedId().length > 0 ? [$("#ecsVmsSearchStatus").widget().getSelectedId()] : []
                            }
                        }),
                        "userId": user.id,
                        "timeout": 120000
                    });
                    deferred.success(function (data) {
                        _.each(data.list.vms, function (item) {
                            _.extend(item, {
                                "showDetail": "",
                                "opts": "",
                                "detail": {
                                    contentType: "url",
                                    content: "app/business/ecs/views/vm/vmDetail.html"
                                },
                                "allIp": vmCommonServiceIns.getIpFromVm(item),
                                "config": getConfig(item),
                                "statusStr": vmCommonServiceIns.getStatusStr(item.status)
                            });
                        });
                        if($scope.fromPerformance && !!data.list.vms)
                        {
                            var accurateFilter = data.list.vms.filter(function(item,index,array){
                                return item.id == $scope.performanceVmId;
                            });
                            data.list.vms = accurateFilter;
                            data.list.total = accurateFilter.length;
                        }
                        $scope.$apply(function () {
                            $scope.vmTable.totalRecords = data.list.total;
                            $scope.vmTable.data = data.list.vms;
                            $scope.vmTable.displayLength = page.displayLength;
                            if (!data.list.vms || data.list.vms.length < page.displayLength) {
                                $scope.hasNextPage = false;
                            }
                            else {
                                $scope.hasNextPage = true;
                            }
                            $("#ecsVmsTable").widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                        });

                        //清空已勾选虚拟机
                        $scope.selectedVm = [];
                        var vncWidget = $("#" + $scope.vncBtn.id).widget();
                        if (vncWidget) {
                            vncWidget.option("disable", true);
                        }

                        //将checkbox放在表头处，在这里放是因为上面设置totalRecords或cur-page后，会将表头的checkbox清掉
                        tblHeadCheckbox.option("checked", false);
                        $('#ecsVmsTable th:eq(0)').html(tblHeadCheckbox.getDom());
                    });
                    deferred.fail(function (response) {
                        exceptionServiceIns.doException(response);
                    });
                }

                function initVMTableData() {
                    page.currentPage = 1;
                    $scope.vmTable.totalRecords = 0;
                    $scope.vmTable.data = [];
                    $scope.vmTable.displayLength = page.displayLength;

                    $scope.hasNextPage = false;
                    $("#ecsVmsTable").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                }

                // 操作虚拟机确认框
                function operateVmConfirm(operate, vms, mode) {
                    messageIns.confirmMsgBox({
                        "content": getOperateTips(operate, mode),
                        "callback": function () {
                            doOperateVm(operate, vms, mode);
                        }
                    });
                }

                // 执行操作虚拟机动作
                function doOperateVm(operate, vms, mode) {
                    var params = vmCommonServiceIns.getOperateParams(operate, vms, mode);
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfra.id,
                        "vpcId": vpcId,
                        "params": params
                    };

                    var deferred = updateVmServiceIns.operateVm(options);
                    deferred.then(function (data) {
                        getVmData();
                    });
                }

                // 导出虚拟机列表
                function export2Excel(marker) {
                    var options = {
                        "user": user,
                        "cloudInfraId": cloudInfra.id,
                        "locale": locale,
                        "params": {
                            detail:0,
                            marker:marker
                        },
                        "vpcId": vpcId
                    };
                    var deferred = queryVmServiceIns.exportVms2Excel(options);
                    deferred.then(function (data) {
                        if (data.exportFilePath) {
                            var exportUrl = "/goku/rest/v1.5/file/" + data.exportFilePath + "?type=export";
                            $("#ecsVmsExport").attr("src", exportUrl);
                        }
                        if(data.nextMarker){
                            var options = {
                                type: "confirm",
                                content: i18n.sprintf(i18n.vm_vm_exportICT_info_total_msg,1000,1000),
                                height: "150px",
                                width: "350px",
                                "buttons": [
                                    {
                                        label:  $scope.i18n.common_term_ok_button,
                                        default: true,
                                        majorBtn : true,
                                        handler: function (event) {
                                            msg.destroy();
                                            export2Excel(data.nextMarker);
                                        }
                                    },
                                    {
                                        label: $scope.i18n.common_term_cancle_button,
                                        default: false,
                                        handler: function (event) {
                                            msg.destroy();
                                        }
                                    }
                                ]
                            };
                            var msg = new Message(options);
                            msg.show();
                        }
                    });
                }

                // 加入域
                function addToDomain(vmId, vmName) {
                    var options = {
                        "winParam": {
                            "vmId": vmId,
                            "cloudInfraId": cloudInfra.id,
                            "domainId": "",
                            "refreshType": ""
                        },
                        "winId": "ecsVmsDetailDomainWinId",
                        "title": "<b>" + i18n.vm_term_addToDomain_button + "</b> - " + vmCommonServiceIns.trimToLength(vmName, 10),
                        "width": "400px",
                        "height": "300px",
                        "modal": true,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/editDomain.html",
                        "buttons": null,
                        "close": function (event) {
                            if ( !! options.winParam.refreshType) {
                                getVmData();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }

                // 转为模板
                function convert2Template(vmId) {
                    messageIns.confirmMsgBox({
                        "content": i18n.vm_vm_convertToTemplate_info_confirm_msg,
                        "callback": function () {
                            var deferred = updateVmServiceIns.modifyVm({
                                "user": user,
                                "vmId": vmId,
                                "cloudInfraId": cloudInfra.id,
                                "vpcId": vpcId,
                                "isTemplate": true
                            });
                            deferred.then(function (data) {
                                getVmData();
                            });
                        }
                    });
                }

                // 修复虚拟机
                function repairVm(vmId) {
                    messageIns.confirmMsgBox({
                        "content": i18n.vm_vm_restore_info_confirm_msg,
                        "callback": function () {
                            var deferred = updateVmServiceIns.repairVm({
                                "user": user,
                                "vmId": vmId,
                                "cloudInfraId": cloudInfra.id,
                                "vpcId": vpcId,
                                "repairOs": {}
                            });
                            deferred.then(function (data) {
                                getVmData();
                            });
                        }
                    });
                }

                //过户虚拟机
                function transfer(vmIds) {
                    var newWindow = new Window({
                        "winId": "transferVmWindow",
                        "title": $scope.i18n.common_term_allocate_button,
						"options":{
                            "selectedVm": vmIds,
							"cloudInfraId": cloudInfra.id,
                            "vpcId": vpcId
						},
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/ecs/views/vm/transfer.html",
                        "height": 500,
                        "width": 700,
                        "close": function () {
                            getVmData();
                        }
                    });
                    newWindow.show();
                }

                //从查询得到的VM信息中获取规格
                function getConfig(vm) {
                    var config = "";
                    if (vm && vm.vmSpecInfo) {
                        config += vm.vmSpecInfo.memoryRebootCount + "MB " + i18n.common_term_memory_label + " | ";
                        config += vm.vmSpecInfo.cpuRebootCount + i18n.common_term_vCPU_label;

                        var volumes = vm.vmSpecInfo.volumes;
                        var size = 0;
                        _.each(volumes, function (item) {
                            size += item.size;
                        });
                        config += " | " + size + "GB " + i18n.common_term_disk_label;

                        if (vm.vmSpecInfo.memoryRebootCount !== vm.vmSpecInfo.memoryCount || vm.vmSpecInfo.cpuRebootCount !== vm.vmSpecInfo.cpuCount) {
                            config += i18n.vm_vm_modifySpecs_info_restart_label;
                        }
                    }
                    return config;
                }

                // 获取操作提示信息
                function getOperateTips(operate, mode) {
                    var str = "";
                    switch (operate) {
                    case "start":
                        str = i18n.vm_vm_startup_info_confirm_msg;
                        break;
                    case "stop":
                        str = mode === "safe" ? i18n.vm_vm_shut_info_confirm_msg : i18n.vm_vm_forciblyShut_info_confirm_msg;
                        break;
                    case "reboot":
                        str = mode === "safe" ? i18n.common_term_restartConfirm_msg : i18n.vm_vm_forciblyRestart_info_confirm_msg;
                        break;
                    case "hibernate":
                        str = i18n.vm_vm_hibernate_info_confirm_msg;
                        break;
                    case "delete":
                        str = i18n.vm_vm_del_info_confirm_msg;
                        break;
                    default:
                    }
                    return str;
                }

                // 获取指定虚拟机的状态
                function getVmStatus(vmIds) {
                    var status = [];
                    if (vmIds && $scope.vmTable.data) {
                        var vm;
                        _.each(vmIds, function (id) {
                            vm = _.find($scope.vmTable.data, function (item) {
                                return item.id === id;
                            });
                            if (vm) {
                                status.push(vm.status);
                            }
                        });
                    }
                    return status;
                }

                // 判断当前虚拟机状态是否支持某操作
                var allowStatus = {
                    "start": ["stopped", "hibernated"],
                    "stop": ["running"],
                    "reboot": ["running"],
                    "forceStop": ["running", "stopping", "pause", "fault_resuming", "hibernated", "unknown", "error"],
                    "forceReboot": ["running", "rebooting"],
                    "hibernate": ["running"],
                    "delete": ["running", "stopped", "hibernated", "recycling", "unknown", "error"],
                    "convert2Template": ["stopped"],
                    "repair": ["running", "stopped"]
                };

                function getSupportOpt(status, opt) {
                    return _.contains(allowStatus[opt], status);
                }

                function vncLoginByICT(url) {
                    window.open(url);
                }

                function vncLoginByIT(id) {

                    var winParam = {
                        "cloudInfraId":cloudInfra.id,
                        "vpcId": vpcId,
                        "vmId":id
                    };
                    var newWindow = new Window({
                        "winId": "ecsVmLoginSelectWinId",
                        "title":$scope.i18n.vm_vm_vncLogin_desc_label || "请选择VNC登录方式",
                        "winParam":winParam,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/vmLoginSelect.html",
                        "resizable": true,
                        "maximizable":false,
                        "minimizable": false,
                        "buttons": null,
                        "height": locale === "en_US"? 300:270,
                        "width": 510,
                        "close": function () {
                        }
                    });
                    newWindow.show();
                }

                //查询支持的能力字段
                function queryCapacity() {
                    var capacity = capacityServiceIns.querySpecificCapacity($("html").scope().capacities, cloudInfra.type, cloudInfra.version);
                    if (capacity) {
                        supportSafeDelete = capacity.vm_support_safe_delete;
                        supportRepairVm = capacity.vm_support_repair_vm;
                        supportConvertToTemplate = capacity.vm_support_convert_to_template;
                        supportAddToDomain = capacity.vm_support_add_to_domain;
                        $scope.supportSelectVpc = capacity.vpc_support_select;
                    }
                }

                //获取初始化信息
                $scope.$on("$viewContentLoaded", function () {
                    var promise = getLocations();
                    promise.then(function () {
                        queryCapacity();

                        // 是否按指定条件搜索
                        if ($stateParams.condition) {
                            searchString = $stateParams.condition;
                            $("#" + $scope.searchBox.id).widget().setValue(searchString);
                        }

                        if ($scope.supportSelectVpc === "true") {
                            var defer = queryVpc();
                            defer.then(function () {
                                getVmData();
                            });
                        } else {
                            getVmData();
                        }
                    });
                });

                // 刷新VM表格的事件
                $scope.$on("refreshVmTableEvent", function listener(event) {
                    getVmData();
                });

            }
        ];

        return vmLstCtrl;
    }
);
