define(['jquery',
    'tiny-lib/angular',
    "tiny-widgets/Message",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, Message, httpService, validatorService, UnifyValid, exceptionService) {
        "use strict";
        var createDiskCtrl = ["$scope", "$compile", "$q", "validator", "camel", function ($scope, $compile, $q, validator, camel) {
            var user = $("html").scope().user;
            var exceptionSer = new exceptionService();
            var window = $("#createDiskWindow").widget();
            var tokenId;
            var projectId;
            var serviceId = window.option("serviceId");

            UnifyValid.diskNameValid = function () {
                var input = $("#" + $scope.name.id).widget().getValue();
                if ($.trim(input) === "") {
                    return true;
                }
                var nameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/;
                return nameReg.test(input);
            };

            $scope.name = {
                "label": "名称:",
                "id": "createVolumeName",
                "width": "200",
                "value": "",
                "extendFunction": ["diskNameValid"],
                "validate": "diskNameValid():由英文字母、中文、数字、中划线、下划线组成，长度范围1个~64个字符;"
            };

            $scope.az = {
                "label": "可用分区:",
                "id": "createVolumeAz",
                "width": "200",
                "values": [],
                "require": true,
                "validate": "required:必填项;",
                "change": function () {
                    $scope.onSelectAz($("#createVolumeAz").widget().getSelectedId());
                }
            };

            $scope.capacity = {
                "label": "容量(GB):",
                "id": "createVolumeCapacity",
                "width": "200",
                "value": "20",
                "require": true,
                "tips": "1~65536GB",
                "validate": "integer:请输入1～65536间的整数;maxValue(65536):请输入1～65536间的整数;minValue(1):请输入1～65536间的整数;"
            };

            //确定按钮
            $scope.okButton = {
                "id": "createDiskOkButton",
                "text": "确定",
                "disable": true,
                "click": function () {
                    var result = UnifyValid.FormValid($("#createDiskDiv"));
                    if (!result) {
                        return;
                    }
                    createVolume();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "createDiskCancelButton",
                "text": "取消",
                "click": function () {
                    window.destroy();
                }
            };

            // 创建卷
            function createVolume() {
                var promise = getToken();
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }
                    tokenId = data.id;
                    projectId = data.projectId;

                    var volumeInfo = {
                        "name" : $.trim($("#createVolumeName").widget().getValue()) || {},
                        "azId" : $("#az").widget().getSelectedId(),
                        "size" : $("#capacity").widget().getValue()
                    }
                    var deferred = camel.post({
                        url: {
                            s: "/{redirect_address_id}/irm/{tenant_id}/volumes",
                            o: {redirect_address_id: serviceId, tenant_id: projectId}
                        },
                        "params": JSON.stringify({"volume":volumeInfo}),
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        window.destroy();
                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });

                }, function (response) {
                    exceptionService.doException(response);
                });
            };

            // 获取AZ列表
            function queryAzs() {
                var promise = getToken();
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }
                    tokenId = data.id;
                    projectId = data.projectId;
                    var deferred = camel.get({
                        url: {
                            s: "/{redirect_address_id}/irm/{tenant_id}/os-availability-zone/detail",
                            o: {redirect_address_id: serviceId, tenant_id: projectId}
                        },
                        "userId": user.id
                    });
                    deferred.success(function (data) {
                        if (data && data.availableZones && data.availableZones.length > 0) {
                            _.each(data.availableZones, function(item) {
                                _.extend(item, {
                                    "selectId": item.id,
                                    "label": item.name
                                });
                            });
                            data.availableZones[0].checked = true;
                        }
                        $scope.$apply(function(){
                            $scope.az.values = data.availableZones;
                        })

                    });
                    deferred.fail(function (data) {
                        exceptionService.doException(data);
                    });

                }, function (response) {
                    exceptionService.doException(response);
                });
            };

            function getToken() {
                var deferred = $q.defer();
                var deferred1 = camel.get({
                    "url": {"s": "/goku/rest/v1.5/token"},
                    "params": {"user-id": user.id},
                    "userId": user.id
                });
                deferred1.success(function (data) {
                    deferred.resolve(data);
                });
                deferred1.fail(function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            }

            // 初始化时，查询AZ列表
            queryAzs();

        }];

        var createDiskApp = angular.module("vdcMgr.vdc.volumes.create", ['framework']);
        createDiskApp.service("camel", httpService);
        createDiskApp.service("validator", validatorService);
        createDiskApp.controller("vdcMgr.vdc.volumes.create.ctrl", createDiskCtrl);
        return createDiskApp;
    }
);
