define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'tiny-widgets/Window',
    'tiny-widgets/Message',
    "tiny-widgets/Checkbox",
    "app/business/resources/controllers/constants",
    "app/business/resources/services/exceptionService",
    "language/ame-rpool-exception"],
    function ($, angular, Window, Message, Checkbox, constants, exceptionService, ameException) {
        "use strict";

        var vmListCtrl = ["$scope", "$compile", "camel","$state", function ($scope, $compile, camel, $state) {

            $scope.searchModel = {
                filterName: "",
                detail: 0,
                queryVmInsystem: true,
                filterIsTemplate: true,
                filterStatus: ["running"],
                filterVmManagerType: 1,
                offset: "0",
                limit: "10"
            };

            var saveSelectedVm = function (dataItem, action) {
                var checked = false;
                for (var index in $scope.service.vmList) {
                    if ($scope.service.vmList[index].id == dataItem.id) {
                        if (action == "delete") {
                            $scope.service.vmList.splice(index, 1);
                            return;
                        }
                        checked = true;
                        break;
                    }
                }

                if (!checked) {
                    $scope.service.vmList.push(dataItem);
                }
            };

            var getVmIsChecked = function (dataItem) {
                var isChecked = false;
                for (var index in $scope.service.vmList) {
                    if ($scope.service.vmList[index].id == dataItem.id) {
                        isChecked = true;
                        break;
                    }
                }

                return isChecked;
            };

            var addOperatorDom = function (dataItem, row, index) {
                // 增加tip属性
                $("td:eq(1)", row).addTitle();
                $("td:eq(3)", row).addTitle();
                $("td:eq(4)", row).addTitle();

                $("td:eq(2)", row).html($scope.service.vmStatus[dataItem.status]);
                $("td:eq(2)", row).addTitle();

                var setChecked = getVmIsChecked(dataItem);

                // 增加checkBox
                var options = {
                    "checked": setChecked,
                    "change": function () {
                        saveSelectedVm(dataItem, $("#vmCheckbox_" + index).widget().options.checked ? "add" : "delete");

                        var indexTemp = 0;
                        var allChecked = true;
                        while ($("#vmCheckbox_" + indexTemp).widget()) {
                            var isChecked = $("#vmCheckbox_" + indexTemp).widget().options.checked;
                            if (!isChecked) {
                                allChecked = false;
                                break;
                            }
                            indexTemp++;
                        }

                        if (allChecked) {
                            $("#vmTableHeadCheckbox").widget().option("checked", true);
                        } else {
                            $("#vmTableHeadCheckbox").widget().option("checked", false);
                        }
                    }
                };
                var checkbox = new Checkbox(options);
                $('td:eq(0)', row).html(checkbox.getDom().attr("id", "vmCheckbox_" + index));
            };


            $scope.vmListTable = {
                caption: "",
                data: [],
                id: "selectVmListTableId",
                columnsDraggable: true,
                enablePagination: true,
                paginationStyle: "full_numbers",
                lengthChange: true,
                lengthMenu:[10, 20, 50],
                displayLength: 10,
                enableFilter: false,
                curPage: {"pageIndex": 1},
                totalRecords: 0,
                hideTotalRecords: false,
                showDetails: false,
                columns: [
                    {
                        "sTitle": "",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "30"
                    },
                    {
                        "sTitle": $scope.i18n.vm_term_vmName_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    },
                    {
                        "sTitle": $scope.i18n.common_term_status_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.status);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_IP_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.ip);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_host_label,
                        "mData": function(data) {
                            return $.encoder.encodeForHTML(data.hostName);
                        },
                        "bSortable": false
                    }
                ],
                callback: function (eveObj) {
                    $scope.searchModel.offset = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmListTable.curPage.pageIndex = eveObj.currentPage;
                },
                changeSelect: function (eveObj) {
                    $scope.searchModel.offset = eveObj.currentPage;
                    $scope.searchModel.limit = eveObj.displayLength;
                    $scope.operator.query();

                    $scope.vmListTable.curPage.pageIndex = eveObj.currentPage;
                    $scope.vmListTable.displayLength = eveObj.displayLength;
                },
                renderRow: function (row, dataitem, index) {
                    // 添加操作
                    addOperatorDom(dataitem, row, index);
                }
            };

            $scope.preBtn = {
                id: "distirbuteSelectVmPreBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_back_button,
                tip: "",
                pre: function () {
                    $scope.service.show = "baseInfo";
                    $("#"+$scope.service.step.id).widget().pre();
                }
            };

            $scope.nextBtn = {
                id: "distirbuteSelectVmNextBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    if (!$scope.service.vmList || $scope.service.vmList.length == 0) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.vm_term_chooseVM_msg,
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();
                        return;
                    }
                    $scope.service.show = "confirm";
                    $scope.$emit($scope.distributionEvents.vmSelected, {});
                    $("#" + $scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "distirbuteSelectVmCancelBtnID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.software", {});
                }
            };

            $scope.refresh = {
                id: "distirbuteSelectVmRefreshID",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_fresh_button,
                tip: "",
                click: function () {
                    $scope.searchModel.filterName = $("#"+$scope.searchBox.id).widget().getValue();
                    $scope.operator.query();
                }
            };

            $scope.searchBox = {
                "id": "distirbuteSelectVmSearchBoxID",
                "placeholder": $scope.i18n.template_term_findVMname_prom,
                "type":"round", 
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {
                },
                "search": function (searchString) {
                    $scope.searchModel.offset = 0;
                    $scope.searchModel.filterName = $("#"+$scope.searchBox.id).widget().getValue();
                    $scope.operator.query();
                }
            };

            $scope.operator = {
                "query": function () {
                    // 统一转换offset
                    var offset = $scope.searchModel.offset == 0 ? 1:$scope.searchModel.offset;
                    $scope.searchModel.offset = $scope.searchModel.limit * (offset - 1);

                    var deferred = camel.post({
                        "url": {"s":constants.rest.SOFTWARE_DISTRIBUTE_QUERYVM.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify($scope.searchModel),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            // 获取数据

                            $scope.vmListTable.data = data.vmInfoList;
                            $scope.vmListTable.totalRecords = data.total;

                            var vms = data.vmInfoList;
                            for (var i in vms) {
                                var nics = vms[i].vmConfig && vms[i].vmConfig.nics || [];
                                for (var j = 0; j < nics.length; j++) {
                                    vms[i].ip = vms[i].ip ? (vms[i].ip + ";" + nics[j].ip) : nics[j].ip;
                                    vms[i].mac = vms[i].mac ? (vms[i].mac + ";" + nics[j].mac) : nics[j].mac;
                                    var ips6 = nics[j].ips6 || [];
                                    for (var k = 0; k < ips6.length; k++) {
                                        vms[i].ip = vms[i].ip ? (vms[i].ip + ";" + ips6[k]) : ips6[k];
                                    }
                                }
                            }

                        });

                        var allChecked = true;
                        if (!data.total || data.total == 0) {
                            allChecked = false;
                        }
                        for (var index in $scope.vmListTable.data) {
                            if(!getVmIsChecked($scope.vmListTable.data[index]))
                            {
                                allChecked = false;
                                break;
                            }
                        }

                        //表头全选复选框
                        var options = {
                            "checked": allChecked,
                            "change": function () {
                                var isChecked = $("#vmTableHeadCheckbox").widget().options.checked;
                                var index = 0;
                                while ($("#vmCheckbox_" + index).widget()) {
                                    $("#vmCheckbox_" + index).widget().option("checked", isChecked);
                                    saveSelectedVm($scope.vmListTable.data[index], isChecked ? "add":"delete");
                                    index++;
                                }
                            }
                        };
                        var checkbox = new Checkbox(options);
                        $("#" + $scope.vmListTable.id + " th:eq(0)").html(checkbox.getDom().attr("id", "vmTableHeadCheckbox"));
                    });
                    $scope.searchModel.offset = offset;
                }
            };

            // 监控事件
            $scope.$on($scope.distributionEvents.baseInfoChangedFromParent, function (event, msg) {
                $scope.operator.query();
            });
        }];

        return vmListCtrl;
    });
