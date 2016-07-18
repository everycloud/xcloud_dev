/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Checkbox, httpService, UnifyValid, exceptionService) {
        "use strict";

        var addMemberCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var exceptionSer = new exceptionService();
            var window = $("#addMemberWindow").widget();
            var affinityId = window.option("affinityId");
            var tokenId = window.option("tokenId");
            var projectId = window.option("projectId");
            var novaId = window.option("novaId");
            var selectedMember = window.option("selectedMember");

            //查询信息
            var searchInfo = {
                "name": "",
                "markers": [],
                "limit": 10
            };
            $scope.hasPrePage = false;
            $scope.hasNextPage = true;
            //模糊搜索框
            $scope.searchBox = {
                "id": "searchVmBox",
                "placeholder": $scope.i18n.common_term_findName_prom,
                "search": function (searchString) {
                    searchInfo.markers = [];
                    $scope.hasPrePage = false;
                    getData();
                }
            };
            $scope.prePage = function () {
                if(!$scope.hasPrePage){
                    return;
                }
                searchInfo.markers.pop();
                if(searchInfo.markers.length === 0){
                    $scope.hasPrePage = false;
                }
                getData();
            };
            $scope.nextPage = function () {
                if(!$scope.hasNextPage){
                    return;
                }
                searchInfo.markers.push($scope.memberTable.data[searchInfo.limit -1].id);
                $scope.hasPrePage = true;
                getData();
            };
            //页尺寸选择框
            $scope.sizeSelector = {
                "id": "searchSizeSelector",
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
                "change":function(){
                    searchInfo.limit = $("#" + $scope.sizeSelector.id).widget().getSelectedId();
                    searchInfo.markers = [];
                    $scope.hasPrePage = false;
                    getData();
                }
            };
            //虚拟机列表
            $scope.memberTable = {
                "id": "addMemberTable",
                "data": null,
                "enablePagination": false,
                "columns": [
                    {
                        "sTitle": "",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
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
                        "sTitle": $scope.i18n.common_term_vmID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.resource_term_AZ_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data["OS-EXT-AZ:availability_zone"]);
                        },
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.created);
                        },
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {

                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    //复选框
                    var options = {
                        "id": "memberCheckbox_" + iDataIndex,
                        "checked": false,
                        "change": function () {

                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };
            function getData() {
                var params = {
                    limit:searchInfo.limit
                };
                if($("#"+$scope.searchBox.id).widget()){
                    params.name = $("#"+$scope.searchBox.id).widget().getValue();
                }
                if(searchInfo.markers.length > 0){
                    params.marker = searchInfo.markers[searchInfo.markers.length - 1];
                }
                var deferred = camel.get({
                    "url": {
                        s: "/goku/rest/v1.5/openstack/{novaId}/v2/{projectId}/servers/detail?all_tenants=1",
                        o: {novaId: novaId, projectId: projectId}
                    },
                    "params": params,
                    "userId": user.id,
                    "token": tokenId
                });
                deferred.success(function (data) {
                    var servers = data && data.servers || [];
                    var members = [];
                    for(var i=0;i<servers.length;i++){
                        members.push(servers[i]);
                        for(var j=0;j<selectedMember;j++){
                            if(selectedMember[j].id == servers[i].id){
                                members.pop();
                                break;
                            }
                        }
                    }
                    $scope.$apply(function () {
                        $scope.memberTable.data = members;
                        if(members.length < searchInfo.limit){
                            $scope.hasNextPage = false;
                        }
                        else{
                            $scope.hasNextPage = true;
                        }
                    });
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            //确定按钮
            $scope.okButton = {
                "id": "addMemberOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var data = $scope.memberTable.data;
                    var index = 0;
                    var selectedMember = [];
                    while ($("#memberCheckbox_" + index).widget()) {
                        var checked = $("#memberCheckbox_" + index).widget().option("checked");
                        if (checked) {
                            selectedMember.push(data[index].id);
                        }
                        index++;
                    }
                    if(selectedMember.length > 0){
                        addMember(selectedMember);
                    }
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "addMemberCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function addMember(selectedMember) {
                var params = {
                    "add_vm": {
                        "vm_list": selectedMember
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
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionSer.doException(data);
                });
            }

            getData();
        }];

        var addMemberApp = angular.module("addMemberToAffinityApp", ['framework']);
        addMemberApp.service("camel", httpService);
        addMemberApp.controller("resources.regionResources.addMemberToAffinity.ctrl", addMemberCtrl);
        return addMemberApp;
    }
);