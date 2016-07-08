/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Radio",
    "tiny-widgets/Message",
    "app/services/validatorService",
    "app/business/tenantUser/service/userService",
    "tiny-common/UnifyValid",
    "app/services/httpService",
    "app/services/exceptionService"], function ($, angular, Radio,Message, validatorService,UserService, UnifyValid, httpService, Exception) {
    "use strict";
    var transferVmCtrl = ["$scope", "validator", "camel", function ($scope, validator, camel) {
        var exceptionService = new Exception();
        $scope.userService = new UserService();
        var window = $("#transferVmWindow").widget();
        var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
        var options = window.option("options");
        //用户列表
        var searchInfo = {
            "start": 0,
            "limit": 10
        };
        $scope.userTable = {
            "id": "selectUserTable",
            "data": null,
            "require": true,
            "name": $scope.i18n.common_term_user_label+":",
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": true,
            "columnsDraggable":true,
            "lengthMenu": [10, 20, 50],
            "displayLength": 10,
            "columns": [
                {
                    "sTitle": "",
                    "mData": function (data) {
                        return "";
                    },
                    "bSortable": false,
                    "sWidth": 40
                },
                {
                    "sTitle": $scope.i18n.common_term_userName_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": "ID",
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.id);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.role_term_sysMgrRole_value,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.role);
                    },
                    "bSortable": false
                },
                {
                    "sTitle": $scope.i18n.common_term_onlineStatus_label,
                    "mData": function(data){
                        return $.encoder.encodeForHTML(data.onLineStatusStr);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
                searchInfo.start = evtObj.displayLength * (evtObj.currentPage - 1);
                getUsers();
            },
            "changeSelect": function (pageInfo) {
                searchInfo.start = 0;
                $scope.userTable.curPage = {
                    "pageIndex": 1
                };
                searchInfo.limit = pageInfo.displayLength;
                $scope.userTable.displayLength = pageInfo.displayLength;
                getUsers();
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(1)', nRow).addTitle();
                $('td:eq(2)', nRow).addTitle();
                $('td:eq(3)', nRow).addTitle();
                $('td:eq(4)', nRow).addTitle();
                //单选框
                var options = {
                    "id": "userRadio_" + iDataIndex,
                    "checked": aData.checked,
                    "disable": false,
                    "change": function () {
                        var index = 0;
                        while ($("#userRadio_" + index).widget()) {
                            if (index != iDataIndex) {
                                $("#userRadio_" + index).widget().option("checked", false);
                            }
                            index++;
                        }
                    }
                };
                var radio = new Radio(options);
                $('td:eq(0)', nRow).html(radio.getDom());
            }
        };

        //确定按钮
        $scope.okButton = {
            "id": "transferVmOkButton",
            "text": $scope.i18n.common_term_ok_button,
            "click": function () {
                var data = $scope.userTable.data;
                var selectedUser;
                var index = 0;
                while ($("#userRadio_" + index).widget()) {
                    var checked = $("#userRadio_" + index).widget().option("checked");
                    if (checked) {
                        selectedUser = data[index].id;
                        break;
                    }
                    index++;
                }
                if (selectedUser) {
                    transfer(selectedUser);
                }
            }
        };
        //取消按钮
        $scope.cancelButton = {
            "id": "transferVmCancelButton",
            "text": $scope.i18n.common_term_cancle_button,
            "click": function () {
                window.destroy();
            }
        };
        function getUsers() {
            var params = {
                start : searchInfo.start,
                limit : searchInfo.limit
            };
            var deferred = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{tenant_id}/users/list",
                    o: {
                        "tenant_id": user.vdcId
                    }
                },
                "params": JSON.stringify(params),
                "userId": user.id
            });
            deferred.success(function (response) {
                $scope.$apply(function () {
                    var users = response && response.userList || [];
                    for (var item in users) {
                        users[item].userTypeStr = $scope.userService.transferUserType(users[item].userType,$scope.i18n);
                        users[item].lockStatusStr = $scope.userService.transferLockStatus(users[item].lockStatus ,$scope.i18n);
                        users[item].onLineStatusStr = $scope.userService.transferOnLineStatus(users[item].onLineStatus ,$scope.i18n);
                        var roleList = users[item].roleList;
                        var role = "";
                        if (roleList !== null) {
                            for (var index in roleList) {
                                role = role + roleList[index].name + ";";
                            }
                            if (role.length > 1) {
                                role = role.substr(0, role.length - 1);
                            } else {
                                role = "N/A";
                            }
                        }
                        users[item].role = role;
                    }
                    $scope.userTable.data = users;
                    $scope.userTable.totalRecords = response.total;
                });
            });
            deferred.fail(function (response) {
                exceptionService.doException(response);
            });
        }
        function showMessage() {
            var options = {
                type: "confirm",
                "title": $scope.i18n.alarm_term_warning_label,
                content: $scope.i18n.vm_vm_transferUser_info_modifyNIC_msg,
                height: "200px",
                width: "400px",
                "buttons": [
                    {
                        label: $scope.i18n.common_term_ok_button,
                        default: true,
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
        function transfer(selectedUser) {
		    var params = {
			    allocate : {
			        "vmIds":options.selectedVm,
				    "userId":selectedUser
				}
			};
            var deferred = camel.post({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/vpcs/{vpc_id}/vms/action?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": user.vdcId,
                        "vpc_id": options.vpcId,
                        "cloud_infra_id": options.cloudInfraId
                    }
                },
                params: JSON.stringify(params),
                "userId": user.id,
				"timeout": 60000
            });
            deferred.success(function (data) {
                showMessage();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        }

        getUsers();
    }];

    var transferVmModule = angular.module("ecs.vm.transferVm", ["ng"]);
    transferVmModule.service("validator", validatorService);
    transferVmModule.service("camel", httpService);
    transferVmModule.controller("ecs.vm.transferVm.ctrl", transferVmCtrl);
    return transferVmModule;
});