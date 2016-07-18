/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/exceptionService"
], function ($,angular,Radio,Message,httpService, Exception) {
    "use strict";
    var repairVmCtrl = ["$scope","camel","$sce",
        function ($scope,camel,$sce) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var $state = $("html").injector().get("$state");
            var window = $("#repairVmWindow").widget();
            var hypervisorId = window.option("hypervisorId");
            var vmId = window.option("vmId");
            $scope.vm_vm_restor_info_noTemplate_msg = $sce.trustAsHtml($scope.i18n.vm_vm_restor_info_noTemplate_msg);
            var searchInfo = {
                "start": 0,
                "limit": 10
            };
            $scope.templateTable = {
                "id": "repairVmTemplateTable",
                "data": null,
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "columnsDraggable": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        },
                        "bSortable": false,
                        "sWidth":40
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vmtName);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle":$scope.i18n.common_term_type_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_OStype_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osType);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_OSversion_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osVersion);
                        },
                        "bSortable": false,
                        "sWidth": 300
                    }
                ],
                "callback": function (evtObj) {
                    searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                    getTemplates();
                },
                "changeSelect": function (pageInfo) {
                    searchInfo.start = 0;
                    $scope.templateTable.curPage = {
                        "pageIndex": 1
                    };
                    searchInfo.limit = pageInfo.displayLength;
                    $scope.templateTable.displayLength = pageInfo.displayLength;
                    getTemplates();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).addTitle();
                    $('td:eq(2)', nRow).addTitle();
                    $('td:eq(3)', nRow).addTitle();
                    $('td:eq(4)', nRow).addTitle();
                    //单选框
                    var options = {
                        "id" : "templateRadio_" + iDataIndex,
                        "checked" : false,
                        "change" : function() {
                            var index = 0;
                            while($("#templateRadio_" + index).widget()){
                                if(index != iDataIndex){
                                    $("#templateRadio_" + index).widget().option("checked",false);
                                }
                                index ++;
                            }
                        }
                    };
                    var radio = new Radio(options);
                    $('td:eq(0)', nRow).html(radio.getDom());
                }
            };
            //确定按钮
            $scope.okButton = {
                "id": "repairVmOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click":function(){
                    var data = $scope.templateTable.data;
                    var index = 0;
                    var selectedTemplate = null;
                    while ($("#templateRadio_" + index).widget()) {
                        var checked = $("#templateRadio_" + index).widget().option("checked");
                        if (checked) {
                            selectedTemplate = data[index].vmtId;
                            break;
                        }
                        index++;
                    }
                    if (selectedTemplate) {
                        repairVm(selectedTemplate);
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "repairVmCancelButton",
                "text":$scope.i18n.common_term_cancle_button,
                "click":function(){
                    window.destroy();
                }
            };
            function getTemplates() {
                var deferred = camel.get({
                    url: {
                        s: "/goku/rest/v1.5/sr/1/vmtemplates?limit={limit}&start={start}&virtualenvid={virtualenvid}",
                        o: {
                            virtualenvid: hypervisorId,
                            limit: searchInfo.limit,
                            start: searchInfo.start
                        }
                    },
                    "params": null,
                    "userId": user.id
                });
                deferred.success(function (data) {
                    var vmtemplates = data.vmtemplates || [];
                    $scope.$apply(function () {
                        $scope.templateTable.totalRecords = data.totalNum;
                        $scope.templateTable.data = vmtemplates;
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function repairVm(templateId) {
                var params = {
                    repairOs: {
                        vmTemplateId:templateId
                    }
                };
                var deferred = camel.post({
                    "url": {s: "/goku/rest/v1.5/irm/1/vms/{id}/action", o: {id: vmId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    goToTaskCenter();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function goToTaskCenter() {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.task_view_task_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            majorBtn : true,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                                $state.go("system.taskCenter");
                            }
                        },
                        {
                            label: $scope.i18n.common_term_cancle_button,
                            default: false,
                            handler: function (event) {
                                msg.destroy();
                                window.destroy();
                            }
                        }
                    ]
                };
                var msg = new Message(options);
                msg.show();
            }
            getTemplates();
        }];

    var repairVmModule = angular.module("resources.vm.repairVm", ["ng"]);
    repairVmModule.service("camel",httpService);
    repairVmModule.controller("resources.vm.repairVm.ctrl", repairVmCtrl);
    return repairVmModule;
});