define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Checkbox",
    "app/services/httpService",
    "tiny-common/UnifyValid"],
    function ($, angular, Checkbox, httpService,UnifyValid) {
        "use strict";
        var user = $("html").scope().user;
        var retrieveCtrl = ["$scope", "$compile","camel", function ($scope, $compile,camel) {

            var window = $("#retrieveDiskWindow").widget();
            //磁盘列表
            $scope.diskTable = {
                "id": "retrieveDiskTable",
                "data": null,
                "caption": "",
                "paginationStyle": "full_numbers",
                "lengthChange": true,
                "enablePagination": true,
                "lengthMenu": [10, 20, 50],
                "columns": [
                    {
                        "sTitle": "",
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.name);
						},
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_name_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.name);
						},
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_vms_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.vm);
						},
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_vmID_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.vmId);
						},
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_storage_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.store);
						},
                        "bSortable": false
                    },
                    {
                        "sTitle": $scope.i18n.common_term_capacity_label,
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.size);
						},
                        "bSortable": false
                    },
                    {
                        "sTitle": "可回收容量",
						"mData": function (data) {
							return $.encoder.encodeForHTML(data.freeSize);
						},
                        "bSortable": false
                    }
                ],
                "callback": function (evtObj) {

                },
                "renderRow":function(nRow, aData, iDataIndex){
                    //复选框
                    var options = {
                        "id" : "diskCheckbox_" + iDataIndex,
                        "checked" : false,
                        "change" : function() {

                        }
                    };
                    var checkbox = new Checkbox(options);
                    $('td:eq(0)', nRow).html(checkbox.getDom());
                }
            };
            function getDisks(pageInfo) {
                var deferred = camel.get({
                    "url":"/hypervisor/disk",
                    "params" : pageInfo,
                    "userId":user.id
                });
                deferred.success(function(data) {
                    $scope.$apply(function () {
                        $scope.diskTable.data = data;
                    });
                });
            }
            getDisks(null);

            //回收按钮
            $scope.retrieveButton = {
                "id": "retrieveDiskButton",
                "text": "回收",
                "click":function(){
                    var diskTable = $("#"+$scope.diskTable.id).widget();
                    var data = diskTable.options.data;
                    $scope.diskTable.selectedDisk = [];
                    for (var i = 0; i < data.length; i++) {
                        var checked = $("#diskCheckbox_" + i).widget().option("checked");
                        if(checked){
                            $scope.diskTable.selectedDisk.push(data[i].name);
                        }
                    }
                    if($scope.diskTable.selectedDisk.length == 0){
                        return;
                    }
                    window.destroy();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "retrieveDiskCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click":function(){
                    window.destroy();
                }
            };
        }];

        var retrieveDiskApp = angular.module("retrieveDiskApp", ['framework']);
        retrieveDiskApp.service("camel",httpService);
        retrieveDiskApp.controller("resources.disk.retrieveDisk.ctrl", retrieveCtrl);
        return retrieveDiskApp;
    }
);
