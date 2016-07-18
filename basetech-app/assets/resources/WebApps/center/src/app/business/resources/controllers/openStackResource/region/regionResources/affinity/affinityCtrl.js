/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "bootstrap/bootstrap.min",
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "fixtures/hypervisorFixture"
], function ($, angular, bootstrap, Window, Message, exceptionService) {
    "use strict";

    var affinityCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", function ($scope, $state, $stateParams, $compile, camel) {
        var user = $("html").scope().user;
        var exceptionSer = new exceptionService();
        var regionName = $stateParams.region;
        var tokenId;
        var projectId;
        var novaId;
        var types = {
            affinity:$scope.i18n.common_term_affinity_value,
            inffinity:$scope.i18n.common_term_unAffinity_value
        };
        //创建按钮
        $scope.createButton = {
            "id": "createAffinityButton",
            "text": $scope.i18n.common_term_create_button,
            "click": function () {
                createWindow(null);
            }
        };
        $scope.refresh = function () {
            getData();
        };
        //亲和性组列表
        $scope.affinityTable = {
            "id": "affinityTable",
            "data": null,
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "lengthMenu": [10, 20, 50],
            "columnSorting": [],
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
                    "sTitle": $scope.i18n.common_term_ID_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_type_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.typeStr);
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
                    "sTitle": $scope.i18n.common_term_operation_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
            },
            "changeSelect": function (pageInfo) {
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();

                // 操作列
                var subMenus = '<span class="dropdown" style="position: static">' +
                    '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">'+$scope.i18n.common_term_more_button+'<b class="caret"></b></a>' +
                    '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                subMenus = subMenus + '<li><a tabindex="3" ng-click="edit()">'+$scope.i18n.common_term_modify_button+'</a></li>' +
                    '<li><a tabindex="4" ng-click="delete()">'+$scope.i18n.common_term_delete_button+'</a></li>' +
                    '</ul>' +
                    '</span>';
                var optColumn = "<div><a href='javascript:void(0)' ng-click='member()'>"+$scope.i18n.common_term_memberManage_label+"</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                    subMenus + "</div>";
                var optLink = $compile($(optColumn));
                var optScope = $scope.$new();
                optScope.member = function () {
                    memberWindow(aData.id);
                };
                optScope.edit = function () {
                    createWindow(aData.id);
                };
                optScope.delete = function () {
                    deleteMessage(aData.id);
                };
                var optNode = optLink(optScope);
                $("td:eq(4)", nRow).html(optNode);
                optNode.find('.dropdown').dropdown();
            }
        };
        function memberWindow(affinityId) {
            var newWindow = new Window({
                "winId": "memberOfAffinityWindow",
                "title": $scope.i18n.common_term_memberManage_label,
                "affinityId": affinityId,
                "novaId": novaId,
                "projectId": projectId,
                "tokenId": tokenId,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/openStackResource/region/regionResources/affinity/memberOfAffinity.html",
                "height": 550,
                "width": 800,
                "close": function () {
                    getData();
                }
            });
            newWindow.show();
        }

        function createWindow(affinityId) {
            var options = {
                "winId": "createAffinityWindow",
                "title": affinityId ? $scope.i18n.common_term_modify_button : $scope.i18n.common_term_create_button,
                "affinityId": affinityId,
                "novaId": novaId,
                "projectId": projectId,
                "tokenId": tokenId,
                "content-type": "url",
                "buttons": null,
                "content": "app/business/resources/views/openStackResource/region/regionResources/affinity/createAffinity.html",
                "height": 260,
                "width": 350,
                "close": function () {
                    getData();
                }
            };
            var newWindow = new Window(options);
            newWindow.show();
        }

        function deleteMessage(affinityId) {
            var options = {
                type: "confirm",
                content: $scope.i18n.virtual_host_delAffinityGroup_info_confirm_msg,
                height: "150px",
                width: "350px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
                        handler: function (event) {
                            deleteAffinity(affinityId);
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
            var deferred = camel.get({
                "url": {s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group", o: {novaId: novaId, projectId: projectId}},
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                var affinitys = data && data["os-affinity-group"] || [];
                for(var i=0;i<affinitys.length;i++){
                    affinitys[i].typeStr = types[affinitys[i].type] || affinitys[i].type;
                }
                $scope.$apply(function () {
                    $scope.affinityTable.totalRecords = affinitys.length;
                    $scope.affinityTable.data = affinitys;
                });
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function deleteAffinity(affinityId) {
            var deferred = camel.delete({
                "url": {
                    s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group/{affinityId}",
                    o: {novaId: novaId, projectId: projectId, affinityId: affinityId}
                },
                "params": null,
                "userId": user.id,
                "token": tokenId
            });
            deferred.success(function (data) {
                getData();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }
        function getToken() {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/token"},
                "params": {"user-id": user.id},
                "userId": user.id
            });
            deferred.success(function (data) {
                if (data === undefined) {
                    return;
                }
                tokenId = data.id;
                projectId = data.projectId;
                getData();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        function getRegion() {
            var deferred = camel.get({
                "url": {"s": "/goku/rest/v1.5/openstack/endpoint"},
                "userId": user.id
            });
            deferred.success(function (data) {
                var endPoint = data && data.endpoint || [];
                var regions = [];
                for (var i = 0; i < endPoint.length; i++) {
                    if (endPoint[i].regionName === regionName && endPoint[i].serviceName === "nova") {
                        novaId = endPoint[i].serviceId;
                        break;
                    }
                }
                getToken();
            });
            deferred.fail(function (data) {
                exceptionSer.doException(data);
            });
        }

        getRegion();
    }];

    return affinityCtrl;
});