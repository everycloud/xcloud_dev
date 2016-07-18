/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "bootstrap/bootstrap.min",
    "app/services/exceptionService",
    "app/business/resources/services/hypervisor/environment/vsamManageService",
    "fixtures/hypervisorFixture"
], function ($, angular, Window, Message, bootstrap, Exception, VSAMManageService) {
    "use strict";

    var environmentCtrl = ["$scope", "$compile", "$state", "camel", "$q", function ($scope, $compile, $state, camel, $q) {
        var exceptionService = new Exception();
        var vsamManageService = new VSAMManageService($q, camel);
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_hypervisorHandle_value;
        var types = {
            "FusionCompute": "FusionCompute",
            "xenserver": "XenServer",
            "vmware": "VMWare"
        };
        var updateStatus = {
            "0": $scope.i18n.common_term_updating_value,
            "1": $scope.i18n.common_term_updatSucceed_value,
            "2": $scope.i18n.common_term_updatFail_value,
            "3": $scope.i18n.common_term_noUpdate_value
        };
        var connectStatus = {
            "connected": $scope.i18n.common_term_natural_value,
            "disconnected": $scope.i18n.common_term_abnormal_value,
            "connecting": $scope.i18n.common_term_linking_value,
            "connected_failed": $scope.i18n.common_term_linkFail_value
        };

        //添加按钮
        $scope.addButton = {
            "id": "addEnvironmentButton",
            "text": $scope.i18n.common_term_add_button,
            "click": function () {
                $state.go("resources.addEnvironment", {"action": "add"});
            }
        };

        //类型过滤框
        $scope.typeSelector = {
            "id": "searchTypeSelector",
            "width": "135",
            "values": [
                {
                    "selectId": "all",
                    "label": $scope.i18n.common_term_allType_label,
                    "checked": true
                },
                {
                    "selectId": "FusionCompute",
                    "label": "FusionComputer"
                },
                {
                    "selectId": "VMware",
                    "label": "VMware"
                }
            ],
            "change": function () {
                searchInfo.type = $("#" + $scope.typeSelector.id).widget().getSelectedId();
                searchInfo.type = searchInfo.type === "all" ? null : searchInfo.type;
                searchInfo.start = 0;
                $scope.environmentTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };

        //模糊搜索框
        $scope.searchBox = {
            "id": "searchEnvironmentBox",
            "placeholder": $scope.i18n.common_term_findName_prom,
            "search": function (searchString) {
                searchInfo.start = 0;
                $scope.environmentTable.curPage = {
                    "pageIndex": 1
                };
                getData();
            }
        };
        $scope.refresh = function () {
            getData();
        };
        $scope.help = {
            show : false
        };
        //查询信息
        var searchInfo = {
            "name": "",
            "type": null,
            "sort": "name",
            "order": "asc",
            "start": 0,
            "limit": 10
        };
        //虚拟化环境列表
        $scope.environmentTable = {
            "id": "environment_table",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            showDetails: true,
            "totalRecords": 0,
            "displayLength":10,
            "lengthMenu": [10, 20, 50],
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": 40
                },
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_type_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.type);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "IP",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.connector.ip);
                    },
                    "bSortable": false,
                    "sWidth": "150px"
                },
                {
                    "sTitle": $scope.i18n.common_term_linkStatus_value,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.connector.statusView);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_updatStatus_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.updatestatus);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.virtual_term_vsamName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.vsam.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false,
                    "sWidth": "187px"
                }
            ],
            "callback": function (pageInfo) {
                searchInfo.start = pageInfo.displayLength * (pageInfo.currentPage - 1);
                getData();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.environmentTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.environmentTable.displayLength = pageInfo.displayLength;
                getData();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                $(nRow).attr("eid", $.encoder.encodeForHTML("" + aData.id));
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(6)', nRow).addTitle();

                //详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                var scope = $scope.$new(false);
                scope.name = aData.name;
                scope.detail = function () {
                    $state.go("resources.hypervisorInfo.vm", {
                        "hyperName": aData.name, "hyperId": aData.id
                    });
                };
                var node = link(scope);
                $("td:eq(1)", nRow).html(node);

                if(aData.connector.status === "connected_failed"){
                    //连接失败详情
                    var link = $compile($("<a href='javascript:void(0)' ng-click='failedDetail()'>{{i18n.common_term_linkFail_value}}</a>"));
                    var scope = $scope.$new(false);
                    scope.vsam = aData.vsam.name;
                    scope.failedDetail = function () {
                        failedWindow(aData);
                    };
                    var node = link(scope);
                    $("td:eq(4)", nRow).html(node);
                }
                //VSAM详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='vsamDetail()'>{{vsam}}</a>"));
                var scope = $scope.$new(false);
                scope.vsam = aData.vsam.name;
                scope.vsamDetail = function () {
                    vsamWindow(aData);
                };
                var node = link(scope);
                $("td:eq(6)", nRow).html(node);

                addOperatorDom(aData, nRow);
            }
        };
        //操作列结构
        function addOperatorDom(aData, nRow) {
            var subMenus = '<span class="dropdown" style="position: static">' +
                '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
            if (aData.type === "FusionCompute") {
                if (aData.connector.status === "connected") {
                    subMenus = subMenus + '<li><a tabindex="1" ng-click="setMac()">'+$scope.i18n.common_term_setMAC_button+'</a></li>';
                }
                else {
                    subMenus = subMenus + '<li class="disabled"><a tabindex="1">'+$scope.i18n.common_term_setMAC_button+'</a></li>';
                }
            }
            subMenus = subMenus + '<li><a tabindex="2" ng-click="update()">' + $scope.i18n.common_term_update_button + '</a></li>' +
                '<li><a tabindex="3" ng-click="edit()">' + $scope.i18n.common_term_modify_button + '</a></li>' +
                '<li ng-if="hasVSAM"><a tabindex="4" ng-click="editVSAM()">' + ( $scope.i18n.virtual_term_modifyVSAM_button || "修改VSAM") + '</a></li>' +
                '<li><a tabindex="5" ng-click="delete()">' + $scope.i18n.common_term_delete_button + '</a></li>' +
                '</ul>' +
                '</span>';
            var optColumn = "";
            if($scope.operable){
                optColumn += "<div><a href='javascript:void(0)' ng-click='viewLog()'>"+$scope.i18n.common_term_checkLog_button+
                    "</a>&nbsp;&nbsp;&nbsp;&nbsp;" + subMenus + "</div>";
            }
            else{
                optColumn += "<div><a href='javascript:void(0)' ng-click='viewLog()'>"+$scope.i18n.common_term_checkLog_button+"</a></div>";
            }

            var optLink = $compile($(optColumn));
            var optScope = $scope.$new();
            optScope.hasVSAM = !!(aData.vsam && aData.vsam.id);
            optScope.viewLog = function () {
                logWindow(aData);
            };
            optScope.setMac = function () {
                macWindow(aData);
            };
            optScope.update = function () {
                update(aData.id);
            };
            optScope.delete = function () {
                deleteMessage(aData);
            };
            optScope.edit = function () {
                editMessage(aData);
            };
            optScope.editVSAM = function () {
                vsamManageWindow(aData);
            };
            var optNode = optLink(optScope);
            $("td:eq(7)", nRow).html(optNode);
            optNode.find('.dropdown').dropdown();
        }

        function failedWindow(aData) {
            var newWindow = new Window({
                "winId": "failedDetailWindow",
                "title": $scope.i18n.common_term_linkFail_value,
                "failedInfo": aData.connector,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/environment/failedDetail.html",
                "height": 100,
                "width": 300
            });
            newWindow.show();
        }
        function vsamWindow(aData) {
            var vsam = aData.vsam;
            var promise = vsamManageService.getVSAM({
                userId: user.id,
                vsamId: vsam.id
            });
            promise.then(function (data) {
                $.extend(vsam, data || {});
                var newWindow = new Window({
                    "winId": "vsamDetailWindow",
                    "title": $scope.i18n.virtual_term_vsamDetail_label,
                    "vsamInfo": vsam,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/environment/vsamDetail.html",
                    "height": data.haMode ? 440 : 380,
                    "width": 500
                });
                newWindow.show();
            });
        }

        function vsamManageWindow(aData) {
            var vsam = aData.vsam;
            var promise = vsamManageService.getVSAM({
                userId: user.id,
                vsamId: vsam.id
            });
            promise.then(function (data) {
                $.extend(vsam, data || {});
                var isEn = window.urlParams.lang === "en";

                var getHeight = function (mode, status) {
                    var textLineHeight = 22;
                    var inputLineHieght = 37;
                    var inputNum = (mode ? 2 : 0);
                    var textNum = (isEn ? 4 : 3);
                    var height = 240;
                    !status && (textNum = isEn ? 2 : 1);
                    height += (inputNum * inputLineHieght + textNum * textLineHeight);
                    return height;
                }
                var newWindow = new Window({
                    "winId": "vsamManageWindow",
                    "title": $scope.i18n.virtual_term_modifyVSAM_button || "修改VSAM",
                    "vsamInfo": vsam,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/resources/views/hypervisor/environment/vsamManage.html",
                    "height": getHeight(data.haMode, data.status === "normal"),
                    "width": 500,
                    "close": function () {
                        getData();
                    }
                });
                newWindow.show();
            });
        }

        function logWindow(aData) {
            var newWindow = new Window({
                "winId": "viewLogWindow",
                "title": $scope.i18n.common_term_checkLog_button,
                "content-type": "url",
                "eid": aData.id,
                "buttons": null,
                "content": "app/business/resources/views/hypervisor/environment/environmentLog.html",
                "height": 500,
                "width": 680
            });
            newWindow.show();
        }

        function updateMessage() {
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
                            $state.go("system.taskCenter");
                            msg.destroy();
                        }
                    },
                    {
                        label: $scope.i18n.common_term_cancle_button,
                        default: false,
                        handler: function (event) {
                            getData();
                            msg.destroy();
                        }
                    }
                ]
            };
            var msg = new Message(options);
            msg.show();
        }

        function deleteMessage(aData) {
            var options = {
                type: "confirm",
                content: $scope.i18n.virtual_hyper_del_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            remove(aData.id);
                            msg.destroy();
                        }
                    },
                    {
                        label:$scope.i18n.common_term_cancle_button,
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

        function editMessage(aData) {
            var options = {
                type: "confirm",
                content: $scope.i18n.virtual_hyper_modifyConnectPara_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label:  $scope.i18n.common_term_ok_button,
                        default: true,
                        majorBtn : true,
                        handler: function (event) {
                            msg.destroy();
                            $state.go("resources.addEnvironment", {"action": "edit", "eid": aData.id});
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

        function macWindow(aData) {
            var newWindow = new Window({
                "winId": "setMacWindow",
                "title": $scope.i18n.common_term_setMAC_button,
                "content-type": "url",
                "eid": aData.id,
                "buttons": null,
                "modal": true,
                "content": "app/business/resources/views/hypervisor/environment/setMac.html",
                "height": 600,
                "width": 700
            });
            newWindow.show();
        }

        function getData() {
            if ($("#" + $scope.searchBox.id).widget()) {
                searchInfo.name = $("#" + $scope.searchBox.id).widget().getValue();
            }
            var params = {
                "list": {
                    "hypervisorName": searchInfo.name,
                    "hypervisorType": searchInfo.type,
                    "limit": searchInfo.limit,
                    "start": searchInfo.start
                }
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/hypervisors/action"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var hypervisors = data && data.list && data.list.hypervisors || [];
                for (var i = 0, l = hypervisors.length; i < l; i++) {
                    hypervisors[i].detail = {
                        contentType: "url",
                        content: "app/business/resources/views/hypervisor/environment/environmentDetail.html"
                    };
                    hypervisors[i].updatestatus = updateStatus[hypervisors[i].updatestatus] || hypervisors[i].updatestatus;
                    hypervisors[i].connector.statusView = connectStatus[hypervisors[i].connector.status] || hypervisors[i].connector.status;
                    hypervisors[i].type = types[hypervisors[i].type] || hypervisors[i].type;
                    if (!hypervisors[i].vsam) {
                        hypervisors[i].vsam = {};
                        hypervisors[i].vsam.name = "";
                    }
                }
                $scope.$apply(function () {
                    $scope.environmentTable.totalRecords = data.list.total;
                    $scope.environmentTable.data = hypervisors;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function update(eid) {
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/hypervisors/{id}/action", o: {id: eid}},
                "params": JSON.stringify({"update": {"scanType": "ALL"}}),
                "userId": user.id
            });
            deferred.success(function (data) {
                updateMessage();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function remove(eid) {
            var deferred = camel.delete({
                url: {s: " /goku/rest/v1.5/irm/1/hypervisors/{id}", o: {id: eid}},
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

    return environmentCtrl;
});