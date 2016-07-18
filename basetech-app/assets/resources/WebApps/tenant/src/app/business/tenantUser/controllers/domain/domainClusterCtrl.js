/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-1-26
 */
/* global define */
define(["tiny-lib/jquery",
        "tiny-lib/angular",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-widgets/Window",
        'tiny-widgets/Message',
        "app/services/messageService",
        "app/services/commonService",
        "app/business/tenantUser/service/domainService",
        "app/business/tenantUser/service/userCommonService",
        "app/services/messageService",
        "tiny-widgets/Checkbox",
        "app/business/tenantUser/service/userDomainService",
        "app/services/cloudInfraService",
        "fixtures/userFixture",
        "tiny-directives/Searchbox",
        "bootstrap/bootstrap.min"
    ],
    function ($, angular,_,$encoder, Window, Message, messageService,CommonService, DomainService, UserCommonService, MessageService, Checkbox, userDomainService, cloudInfraService) {
        "use strict";
        var domainClusterCtrl = ["$scope", "$compile", "$state", "exception", "$q", "camel", "storage",
            function ($scope, $compile, $state, exception, $q, camel, storage) {
                var user = $("html").scope().user;
                var i18n = $scope.i18n;
                $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
                $scope.domainService = new DomainService();
                //公共服务实例
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                $scope.serviceInstance = new userDomainService(exception, $q, camel);
                var userCommonServiceIns = new UserCommonService();
                // 当前勾选的虚拟机
                $scope.selectedVm = [];

                //资源池ID，标识地域
                var cloudInfraId = "";

                //地址下拉框
                $scope.address = {
                    "id": "domainAddress",
                    "width": "150",
                    "height": "200",
                    "values": [],
                    "change": function () {
                        cloudInfraId = $("#domainAddress").widget().getSelectedId();
                        $scope.operator.getVMList();
                        storage.add("cloudInfraId", cloudInfraId);
                    }
                };

                //批量添加
                $scope.createBtn = {
                    "id": "createVMBtnId",
                    "text": i18n.domain_term_batchAdd_button,
                    "disable": true,
                    "iconsClass": "",
                    "click": function () {
                        var createWindow = new Window({
                            "winId": "addVMWindowId",
                            "roleType": "SYSTEM_ROLE",
                            "title": i18n.domain_term_batchAddVM_button,
                            "content-type": "url",
                            "content": "app/business/tenantUser/views/domain/addVM.html",
                            "start": ($scope.clusterTable.curPage.pageIndex - 1) * $scope.clusterTable.displayLength,
                            "limit": $scope.clusterTable.displayLength,
                            "cloudInfraId": cloudInfraId,
                            "domainId": $scope.domainId,
                            "exception": exception,
                            "height": 540,
                            "width": 640,
                            "buttons": [
                                null,
                                null
                            ],
                            "close": function (event) {
                                $scope.operator.getVMList();
                            }
                        }).show();
                    }
                };

                //删除
                $scope.deleteBtn = {
                    "id": "deleteVMBtnId",
                    "text": i18n.common_term_delete_button,
                    "disable": true,
                    "iconsClass": "",
                    "click": function () {
                        if(!$scope.selectedVm || !$scope.selectedVm.length)
                        {
                            new messageService().failMsgBox(i18n.vm_term_chooseVMbeforeOpt_msg);
                        }
                        else
                        {
                            showMessage($scope.selectedVm);
                        }
                    }
                };

                $scope.clusterTable = {
                    caption: "",
                    data: [],
                    id: "domainVMTableId",
                    columnsDraggable: true,
                    enablePagination: true, //此属性设置表格是否分页
                    paginationStyle: "full_numbers", //此属性设置表格分页的类型，可选值"simple","full_numbers"。
                    lengthChange: true, // 此属性设置是否显示每页数据条数按钮。
                    lengthMenu: [10, 20, 30], // 此属性设置每页显示数据长度选项，仅当length-change属性设置为true时有效。
                    displayLength: 10,
                    enableFilter: false, // 此属性设置表格是否具有过滤功能.
                    "curPage": {
                        "pageIndex": 1
                    },
                    totalRecords: 0,
                    hideTotalRecords: false,
                    showDetails: false,
                    columns: [{
                        "sTitle": "",
                        "bSortable": false,
                        "sWidth": "36px"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_type_label,
                        "mData": "type",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "status",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": "createTimeStr",
                        "bSortable": false,
                        "sWidth": "170px"
                    }, {
                        "sTitle":i18n.common_term_operation_label,
                        "mData": "opt",
                        "bSortable": false
                    }],
                    callback: function (evtObj) {
                        $scope.clusterTable.curPage.pageIndex = evtObj.currentPage;
                        $scope.clusterTable.displayLength = evtObj.displayLength;
                        $scope.operator.getVMList();
                    },
                    "changeSelect": function (evtObj) {
                        $scope.clusterTable.curPage.pageIndex = evtObj.currentPage;
                        $scope.clusterTable.displayLength = evtObj.displayLength;
                        $scope.operator.getVMList();
                    },
                    renderRow: function (nRow, aData, iDataIndex) {
                        // 复选框
                        var selBox = "<div><tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.data = aData;
                        selBoxScope.id = "domainVmsCheckboxId" + iDataIndex;
                        selBoxScope.checked = aData.checked;
                        selBoxScope.change = function () {
                            selectVm(aData.id, $("#" + selBoxScope.id).widget().option("checked"));
                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).append(selBoxNode);

                        // 操作栏
                        var optTemplates = "<div><a href='javascript:void(0)' ng-click='removeVM()'>"+i18n.common_term_move_button+"</a><span>&nbsp&nbsp&nbsp&nbsp</span>";
                        var opts = $compile($(optTemplates));
                        var optscope = $scope.$new(false);
                        optscope.removeVM = function () {
                            showMessage([aData.id]);
                        };
                        var optNode = opts(optscope);
                        $("td:eq(5)", nRow).html(optNode);
                    }
                };


                //生成一个checkbox放在表头处
                var tblHeadCheckbox = new Checkbox({
                    "id": "vmTableHeadCheckbox",
                    "checked": false,
                    "change": function () {
                        var vms = $scope.vmTable.data;
                        var isChecked = $("#vmTableHeadCheckbox").widget().option("checked");
                        for (var i = 0; i < vms.length; i++) {
                            $("#domainVmsCheckboxId" + i).widget().option("checked", isChecked);
                        }

                        // 将已勾选的虚拟机id保存到selectedVm
                        $scope.selectedVm = [];
                        if (isChecked && vms) {
                            _.each(vms, function (item) {
                                $scope.selectedVm.push(item.id);
                            });
                        }
                    }
                });

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
                }

                $scope.operator = {
                    "getVMList": function getVMList() {
                        var domainId = $scope.domainId;
                        var domainName = $scope.domainName;
                        $scope.createBtn.disable = true;
                        $scope.deleteBtn.disable = true;
                        if (!domainId || "domainParentId" === $scope.domainId || !domainName) {
                            var dom = document.getElementById($scope.clusterTable.id);
                            dom && $(dom).widget().option("data", []);
                            $scope.clusterTable.data = [];
                            return;
                        }

                        if(!$scope.inThisDomain){
                            return;
                        }
                        var params = {
                            "list": {
                                "start": ($scope.clusterTable.curPage.pageIndex - 1) * $scope.clusterTable.displayLength,
                                "limit": $scope.clusterTable.displayLength,
                                "domainId": domainId
                            }
                        };

                        var promise = $scope.serviceInstance.queryVmList({
                            "user": user,
                            "vpcId": "-1",
                            "params": params,
                            "cloudInfraId": cloudInfraId
                        });
                        promise.then(function (data) {
                            if (!data) {
                                return;
                            }
                            $scope.createBtn.disable = false;
                            $scope.deleteBtn.disable = false;

                            var vmList = [];
                            if (data.list.vms) {
                                vmList = data.list.vms;
                            }
                            var computing = [];
                            for (var i = 0; vmList && i < vmList.length; i++) {
                                var createTimeStr = CommonService.utc2Local(vmList[i].createTime);
                                vmList[i].createTimeStr = createTimeStr;
                                vmList[i].type = vmList[i].type;
                                vmList[i].status = getStatusStr(vmList[i].status);
                                computing.push(vmList[i]);
                            }
                                $scope.clusterTable.data = computing;
                                if (data.list) {
                                    $scope.clusterTable.totalRecords = data.list.total;
                                }
                                //清空已勾选虚拟机
                                $scope.selectedVm = [];
                        });
                    },
                    "deleteVM": function (vmId, removeUserMsg) {
                        var options = {
                            "user": user,
                            "cloudInfraId": cloudInfraId,
                            "vpcId": "-1",
                            "domain": {
                                "vmIds": vmId,
                                "inDomainId": null,
                                "outDomainId": $scope.domainId
                            }
                        };
                        var promise = $scope.serviceInstance.operateVM(options);
                        promise.then(function (data) {
                            removeUserMsg.destroy();
                            $scope.operator.getVMList();
                        });


                    }
                };

                //删除虚拟机提示用户
                function showMessage(vmId) {
                    var removeUserMsg = new Message({
                        "type": "prompt",
                        "title": i18n.common_term_confirm_label,
                        "content": i18n.domain_vm_move_info_confirm_msg,
                        "height": "150px",
                        "width": "350px",
                        "buttons": [{
                            label: i18n.common_term_ok_button,
                            accessKey: '2',
                            "key": "okBtn",
                            default: true,
                            majorBtn : true
                        }, {
                            label: i18n.common_term_cancle_button,
                            accessKey: '3',
                            "key": "cancelBtn",
                            'default': false
                        }]
                    });
                    removeUserMsg.setButton("okBtn", function () {
                        $scope.operator.deleteVM(vmId, removeUserMsg);
                    });
                    removeUserMsg.setButton("cancelBtn", function () {
                        removeUserMsg.destroy();
                    });
                    removeUserMsg.show();
                }

                //转换状态字符串
                function getStatusStr(status) {
                    var str = "";
                    switch (status) {
                    case "running":
                        str = i18n.common_term_running_value;
                        break;
                    case "stopped":
                        str = i18n.common_term_stoped_value;
                        break;
                    case "hibernated":
                        str = i18n.common_term_hibernated_value;
                        break;
                    case "creating":
                        str = i18n.common_term_creating_value;
                        break;
                    case "create_failed":
                        str = i18n.common_term_createFail_value;
                        break;
                    case "create_success":
                        str = i18n.common_term_createSucceed_value;
                        break;
                    case "starting":
                        str = i18n.common_term_startuping_value;
                        break;
                    case "stopping":
                        str = i18n.common_term_stoping_value;
                        break;
                    case "migrating":
                        str = i18n.common_term_migrating_value;
                        break;
                    case "shutting_down":
                        str = i18n.common_term_stoping_value;
                        break;
                    case "fault_resuming":
                        str = i18n.common_term_recoverying_value;
                        break;
                    case "hibernating":
                        str = i18n.common_term_hibernating_value;
                        break;
                    case "rebooting":
                        str = i18n.common_term_restarting_value;
                        break;
                    case "pause":
                        str = i18n.common_term_pause_value;
                        break;
                    case "recycling":
                        str = i18n.common_term_reclaiming_value;
                        break;
                    default:
                        str = "未知";
                        break;
                    }
                    return str;
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
                            cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                            $scope.address.values = data.cloudInfras;
                        }
                        retDefer.resolve();
                    }, function (rejectedValue) {
                        userCommonServiceIns.doException(rejectedValue, "");
                        retDefer.reject();
                    });
                    return retDefer.promise;
                }

                //获取初始化信息
                var promise = getLocations();
                promise.then(function () {
                    $scope.operator.getVMList();
                });


            }
        ];

        return domainClusterCtrl;
    });
