/* global define */
define(['jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-lib/encoder",
    'tiny-common/UnifyValid',
    'upload/FileUpload',
    'tiny-widgets/Message',
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "app/business/template/services/templateService"
], function ($, angular, _, $encoder, UnifyValid, FileUpload, Message, Window, Checkbox, templateService) {
    "use strict";
    var ctrl = ["$rootScope", "$scope", "monkey", "$compile", "camel", "$stateParams", "$q",
        function ($rootScope, $scope, monkey, $compile, camel, $stateParams, $q) {
            //存储当前已选择的告警
            $scope.checkboxData = [];
            var user = $("html").scope().user;
            var i18n = $scope.i18n;
            var templateServiceIns = new templateService($("#packageList").scope.exception, $q, camel);
            $scope.info = {
                preBtn: {
                    "id": "install-package-step2-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        monkey.show = {
                            "basic": true,
                            "addVM": false,
                            "confirm": false
                        };
                        $("#" + $scope.step.id).widget().pre();
                    }
                },
                nextBtn: {
                    "id": "install-package-step2-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        //获取已选择的虚拟机
                        $scope.param.vmIds = $scope.checkboxData;
                        $scope.showSelVM();
                        monkey.show = {
                            "basic": false,
                            "addVM": false,
                            "confirm": true
                        };
                        $("#" + $scope.step.id).widget().next();
                    }
                },

                cancelBtn: {
                    "id": "install-package-step2-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $scope.close();
                    }
                }
            };
            // 当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.vmTableList = {
                "id": "vmListTable",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "columns": [{
                        "sTitle": "", //设置第一列的标题
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "10%"
                    }, {
                        "sTitle": i18n.vm_term_vmName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.template_term_belongsToApp_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vappName);
                        },
                        "sWidth": "10%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.vpc_term_vpcName_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.vpcName);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_vmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }
                ],
                "data": null,
                "callback": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    // 复选框
                    var selBox = "<div ><tiny-checkbox text='' id='id' checked='' change='change()'></tiny-checkbox></div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = "monitorVmsCheckboxId" + iDataIndex;
                    selBoxScope.checked = aData.checked;
                    selBoxScope.change = function () {
                        selectVm(aData, aData.id, $("#" + selBoxScope.id).widget().option("checked"));
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:eq(0)", nRow).html(selBoxNode);
                }
            };


            // 勾选、去勾告警
            function selectVm(aData, vmId, checked) {
                var selected = $scope.checkboxData;
                if (checked) {
                    selected.push(vmId);
                    $scope.vms.push(aData);

                } else {
                    for (var i = 0; i < selected.length; i++) {
                        if (selected[i] === vmId) {
                            selected.splice(i, 1);
                            $scope.vms.splice(i, 1);
                        }
                    }
                }

                var headCheck = $("#monitorTableHeadCheckbox").widget();
                if ( !! headCheck) {
                    if (selected.length < $("#vmListTable").widget().options.data.length) {
                        headCheck.option("checked", false);
                    } else {
                        headCheck.option("checked", true);
                    }
                }
            }

            //生成一个checkbox放在表头处
            var tblHeadCheckbox = new Checkbox({
                "id": "monitorTableHeadCheckbox",
                "checked": false,
                "change": function () {
                    var alarms = $scope.vmTableList.data;
                    var isChecked = $("#monitorTableHeadCheckbox").widget().option("checked");
                    for (var i = 0; i < alarms.length; i++) {
                        $("#monitorVmsCheckboxId" + i).widget().option("checked", isChecked);
                    }

                    // 将已勾选的虚拟机id保存到selectedVm
                    $scope.checkboxData = [];
                    if (isChecked && alarms) {
                        _.each(alarms, function (item) {
                            $scope.checkboxData.push(item.id);
                            $scope.vms.push(item);
                        });
                    }

                }
            });

            //查询虚拟机列表
            function getData() {
                var options = {
                    "user": user,
                    "vpcId": "-1",
                    "cloudInfraId": $scope.cloudInfraId,
                    "option": {
                        "list": {
                            "condition": "",
                            "start": page.getStart(),
                            "limit": page.displayLength,
                            "status": ["running"]
                        }
                    }
                };
                var promise = templateServiceIns.queryVms(options);
                promise.then(function (data) {
                    $scope.vmTableList.totalRecords = data.list.total;
                    $scope.vmTableList.data = data.list.vms;
                    $scope.vmTableList.displayLength = page.displayLength;
                    $("#vmListTable").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });

                    //清空已勾选虚拟机
                    $scope.checkboxData = [];

                    //将checkbox放在表头处，在这里放是因为上面设置totalRecords或cur-page后，会将表头的checkbox清掉
                    tblHeadCheckbox.option("checked", false);
                    $('#vmListTable th:eq(0)').html(tblHeadCheckbox.getDom());
                });
            }

            //关闭当前窗口
            $scope.destroy = function () {
                $scope.close();
            };

            //初始化信息
            getData();

        }
    ];
    return ctrl;
});
