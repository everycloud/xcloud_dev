/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService"
], function ($, angular, Window, Message, Exception) {
    "use strict";

    var storageCtrl = ["$scope", "$state","$stateParams", "$compile", "camel", function ($scope, $state,$stateParams, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.operable = user.privilege.role_role_add_option_storagePoolHandle_value;
        var zoneId = $stateParams.id;
        //创建按钮
        $scope.createButton = {
            "id": "createDisasterButton",
            "text": $scope.i18n.common_term_create_button,
            "click": function () {
                createDisasterWindow();
            }
        };
        $scope.refresh = function(){
            getData();
        };
        $scope.help = {
            show : false
        };
        //集群列表
        $scope.storageTable = {
            "id": "secondaryStorageTable",
            "data": null,
            "enablePagination": false,
            "columnsDraggable": true,
            "columns": [
                {
                    "sTitle": $scope.i18n.common_term_name_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_desc_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.description);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_storageNum_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.dsNum);
                    },
                    "bSortable": false
                }
            ],
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();

                //详情链接
                var link = $compile($("<a href='javascript:void(0)' ng-click='detail()'>{{name}}</a>"));
                var scope = $scope.$new(false);
                scope.name = aData.name;
                scope.detail = function () {
                    detailWindow(aData.id);
                };
                var node = link(scope);
                $("td:eq(0)", nRow).html(node);

                // 操作列
                addOperatorDom(aData, nRow);
            }
        };

        function addOperatorDom(aData, nRow) {
            var optColumn = "<div><a href='javascript:void(0)' ng-click='edit()'>"+$scope.i18n.common_term_modify_button+"</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>" + "</div>";

            var optLink = $compile($(optColumn));
            var optScope = $scope.$new();
            optScope.edit = function () {
                editDisasterWindow(aData.id);
            };
            optScope.delete = function () {
                deleteMessage(aData);
            };
            var optNode = optLink(optScope);
            $("td:eq(4)", nRow).html(optNode);
        }
        function deleteMessage(aData) {
            var options = {
                type: "confirm",
                content: $scope.i18n.resource_stor_delDRgroup_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            deleteDisaster(aData.id);
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
        function createDisasterWindow(){
            var newWindow = new Window({
                "winId": "createDisasterWindow",
                "title": $scope.i18n.resource_term_createReport_button,
                "content-type": "url",
                "buttons": null,
                "zoneId":zoneId,
                "content": "app/business/resources/views/rpool/zone/zoneResources/storage/disasterRecovery/createDisaster.html",
                "height": 500,
                "width": 800,
                "close":function(){
                    getData();
                }
            });
            newWindow.show();
        }
        function detailWindow(id){
            var newWindow = new Window({
                "winId": "disasterDetailWindow",
                "title": $scope.i18n.resource_term_disasterStorDetail_label,
                "content-type": "url",
                "buttons": null,
                "disasterId":id,
                "content": "app/business/resources/views/rpool/zone/zoneResources/storage/disasterRecovery/disasterDetail.html",
                "height": 500,
                "width": 800,
                "close":function(){
                }
            });
            newWindow.show();
        }
        function editDisasterWindow(id){
            var newWindow = new Window({
                "winId": "editDisasterWindow",
                "title": $scope.i18n.resource_term_modifyDisasterStor_button,
                "content-type": "url",
                "buttons": null,
                "disasterId":id,
                "zoneId":zoneId,
                "content": "app/business/resources/views/rpool/zone/zoneResources/storage/disasterRecovery/editDisaster.html",
                "height": 500,
                "width": 800,
                "close":function(){
                    getData();
                }
            });
            newWindow.show();
        }
        function getData() {
            var params = {
                list:{
                    scopeType:"ZONE",
                    scopeObjectId:zoneId
                }
            };
            var deferred = camel.post({
                "url": {s:"/goku/rest/v1.5/irm/1/disastergroups/action"},
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (data) {
                var disasters = data && data.list && data.list.disasterGroups || [];
                for (var i = 0; i < disasters.length; i++) {
                    disasters[i].dsNum = disasters[i].dsInfos && disasters[i].dsInfos.length || 0;
                }
                $scope.$apply(function () {
                    $scope.storageTable.data = disasters;
                });
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }
        function deleteDisaster(id) {
            var deferred = camel.delete({
                "url": {s:"/goku/rest/v1.5/irm/1/disastergroups/{id}",o:{id:id}},
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
        if($scope.operable){
            $scope.storageTable.columns.push(
                {
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false
                });
        }
        getData();
    }];

    return storageCtrl;
});