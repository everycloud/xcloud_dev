/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Window",
    "tiny-widgets/Message",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Window, Message, httpService, UnifyValid, exceptionService) {
        "use strict";

        var memberOfAffinityCtrl = ["$scope", "$compile", "$state", "camel", "validator", '$interval', function ($scope, $compile, $state, camel, validator, $interval) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var exceptionSer = new exceptionService();
            var window = $("#memberOfAffinityWindow").widget();
            var affinityId = window.option("affinityId");
            var tokenId = window.option("tokenId");
            var projectId = window.option("projectId");
            var novaId = window.option("novaId");

            $scope.refresh = function(){
                getData();
            };
            //添加成员按钮
            $scope.addMemberButton = {
                "id": "addMemberButton",
                "text": $scope.i18n.common_term_add_button,
                "click": function () {
                    var newWindow = new Window({
                        "winId": "addMemberWindow",
                        "affinityId": affinityId,
                        "novaId": novaId,
                        "projectId": projectId,
                        "tokenId": tokenId,
                        "selectedMember": $scope.memberTable.data,
                        "title": $scope.i18n.common_term_addmember_button,
                        "content-type": "url",
                        "buttons": null,
                        "content": "app/business/resources/views/openStackResource/region/regionResources/affinity/addMemberToAffinity.html",
                        "height": 500,
                        "width": 750,
                        "close": function () {
                            $scope.readyToReresh = true;
                        }
                    });
                    newWindow.show();
                }
            };
            //成员列表
            $scope.memberTable = {
                "id": "memberOfAffinityTable",
                "data": [],
                "enablePagination": false,
                "columnsDraggable": true,
                "columns": [
                    {
                        "sTitle": "ID",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.display_name);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_vmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.uuid);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_operation_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "bSortable": false,
                        "sWidth": 100
                    }
                ],
                "callback": function (evtObj) {
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(0)", nRow).addTitle();
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    // 操作列
                    var optColumn = "<a href='javascript:void(0)' ng-click='remove()'>"+$scope.i18n.common_term_move_button+"</a>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.remove = function () {
                        var memberId = [aData.uuid];
                        if ($scope.memberTable.data.length === 2) {
                            var data = $scope.memberTable.data;
                            memberId = [data[0].uuid, data[1].uuid];
                        }
                        removeMessage(memberId);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(3)", nRow).html(optNode);
                }
            };
            function getData() {
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group/{affinityId}",
                        o: {novaId: novaId, projectId: projectId, affinityId: affinityId}
                    },
                    "params": null,
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    var vmInfo = data && data.affinity_group && data.affinity_group.vmsinfo || {};
                    var members = [];
                    for (var index in vmInfo) {
                        members.push(vmInfo[index]);
                    }
                    $scope.$apply(function () {
                        $scope.memberTable.data = members;
                    });
                    $scope.readyToReresh = false;
                });
                deferred.fail(function (data) {
                    $scope.readyToReresh = false;
                    exceptionSer.doException(data);
                });
            }
            function removeMessage(memberId) {
                var options = {
                    type: "confirm",
                    content: $scope.i18n.virtual_host_moveAffinityGroupMember_info_confirm_msg,
                    height: "150px",
                    width: "350px",
                    "buttons": [
                        {
                            label: $scope.i18n.common_term_ok_button,
                            default: true,
                            handler: function (event) {
                                removeMember(memberId);
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
                if (memberId.length === 2) {
                    options.content = $scope.i18n.resource_open_delAffinityGroupLastMember_info_confirm_msg;
                }
                var msg = new Message(options);
                msg.show();
            }

            function removeMember(memberId) {
                var params = {
                    "remove_vm": {
                        "vm_list": memberId
                    }
                };
                var deferred = camel.post({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/os-affinity-group/{affinityId}/action",
                        o: {novaId: novaId, projectId: projectId, affinityId: affinityId}
                    },
                    "params": JSON.stringify(params),
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    $scope.readyToReresh = true;
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }
            $interval(function () {
                if($scope.readyToReresh){
                    getData();
                }
            }, 3000);
            getData();
        }];

        var memberOfAffinityApp = angular.module("memberOfAffinityApp", ['framework']);
        memberOfAffinityApp.service("camel", httpService);
        memberOfAffinityApp.controller("resources.regionResources.memberOfAffinity.ctrl", memberOfAffinityCtrl);
        return memberOfAffinityApp;
    }
);