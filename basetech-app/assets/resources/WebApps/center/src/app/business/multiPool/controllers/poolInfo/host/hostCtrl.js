/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, Window, Message, bootstrap, Exception) {
    "use strict";

    var hostCtrl = ["$scope", "$compile", "$state", "camel","$stateParams", function ($scope, $compile, $state, camel,$stateParams) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.couldName = $stateParams.name;
		var infraId = $stateParams.infraId;
		var statuses = {
		    unassigned : $scope.i18n.common_term_noAssign_value,
			assigned : $scope.i18n.perform_term_allocated_label
		}
		

        //添加按钮
        $scope.addButton = {
            "id": "addHostButton",
            "text": $scope.i18n.common_term_add_button,
            "click": function () {
                addWindow();
            }
        };
        //查询信息
        var searchInfo = {
            "name": "",
            "az": "",
            "start": 0,
            "limit": 10
        };

        //模糊搜索框
        $scope.searchBox = {
            "id": "searchHostBox",
            "placeholder": $scope.i18n.common_term_findName_prom,
            "search": function (searchString) {
                searchInfo.start = 0;
                $scope.hostTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };
        $scope.refresh = function () {
            getData();
        };
        //物理机列表
        $scope.hostTable = {
            "id": "host_table",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "totalRecords": 0,
            "displayLength": 10,
            "lengthMenu": [10, 20, 50],
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_ID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false,
                    "sWidth": "120px"
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.device_term_model_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.model);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_assignStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.status);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_OS_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osType);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_specHardware_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.hardwareSpec);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.osIp);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "VDC",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vdcName);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.resource_term_AZ_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.availableZoneName);
                    },
                    "bSortable": false,
                    "sWidth": "120px"
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "120px"
                }
            ],
            "callback": function (pageInfo) {
                searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                getData();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.hostTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.hostTable.displayLength = pageInfo.displayLength;
                getData();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                $('td:eq(5)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();
                $('td:eq(7)', nRow).addTitle();

                addOperatorDom(aData, nRow);
            }
        };
        //操作列结构
        function addOperatorDom(aData, nRow) {
            var optColumn = "<div>"
		    if(aData.assignState === "assigned"){
			    optColumn += "<a href='javascript:void(0)' class='disabled'>" + 
			    $scope.i18n.common_term_modify_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			else{
			    optColumn += "<a href='javascript:void(0)' ng-click='edit()'>" + 
			    $scope.i18n.common_term_modify_button + "</a>&nbsp;&nbsp;&nbsp;&nbsp;";
			}			
			optColumn += "<a href='javascript:void(0)' ng-click='delete()'>" + $scope.i18n.common_term_delete_button +
                "</a></div>";

            var optLink = $compile($(optColumn));
            var optScope = $scope.$new();
            optScope.edit = function () {
                addWindow(aData.id);
            };
            optScope.delete = function () {
                deleteMessage(aData.id);
            };
            var optNode = optLink(optScope);
            $("td:eq(9)", nRow).html(optNode);
            optNode.find('.dropdown').dropdown();
        }


        function deleteMessage(hostId) {
            var options = {
                type: "confirm",
                content: $scope.i18n.server_server_del_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn: true,
                        handler: function (event) {
                            remove(hostId);
                            msg.destroy();
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


        function getData() {
            if ($("#" + $scope.searchBox.id).widget()) {
                searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
            }
            var deferred = camel.get({
                url: {s: "/goku/rest/v1.5/1/physical-servers?infraId={infraId}&start={start}&limit={limit}&search_input={name}",
				     o:{infraId:infraId,start:searchInfo.start,limit:searchInfo.limit,name:searchInfo.name}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                var hosts = data && data.servers || [];
				for(var i = 0;i<hosts.length;i++){
				    hosts[i].status = statuses[hosts[i].assignState];
				}
                $scope.$apply(function () {
                    $scope.hostTable.totalRecords = data.total;
                    $scope.hostTable.data = hosts;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }


        //添加弹框
        var addWindow = function (hostId) {
            var options = {
                "winId": "addHostWindow",
                "hostId": hostId,
                "infraId": infraId,
                "title": $scope.i18n.common_term_add_button,
                "content-type": "url",
                "content": "./app/business/multiPool/views/poolInfo/host/addHost.html",
                "height": 400,
                "width": 670,
                "resizable": true,
                "maximizable": false,
                "minimizable":false,
                "buttons": null,
                "close": function () {
                    getData();
                }
            };
            if (hostId) {
                options.title = $scope.i18n.common_term_modify_button;
            }
            var newWindow = new Window(options);
            newWindow.show();
        };

        function remove(hostId) {
            var deferred = camel.delete({
                url: {s: "/goku/rest/v1.5/1/physical-servers/{id}", o: {id: hostId}},
                "params": null,
                "userId": user.id
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        getData();
    }];

    return hostCtrl;
});