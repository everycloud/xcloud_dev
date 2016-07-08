/**
 * 文件名：addDiskCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：ecs-storage-disk--添加磁盘的control
 * 修改时间：14-2-27
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'tiny-lib/underscore',
       "bootstrapui/ui-bootstrap-tpls",
        'app/services/httpService',
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        'app/services/cloudInfraService',
        'app/services/exceptionService',
        'app/business/ecs/services/storage/diskService',
        'tiny-directives/Radio',
        'tiny-directives/RadioGroup',
        'tiny-directives/Select'
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, _, uibootstrap,http, UnifyValid, validator, cloudInfraService, exception, diskService) {
        "use strict";

        var addDiskCtrl = ["$scope", "$compile", "$q", "camel", "exception", "validator",
            function ($scope, $compile, $q, camel, exception, validator) {
                // 父窗口传递的参数
                var winParam = $("#ecsStorageDisksAddDiskWinId").widget().option("winParam");
                winParam = winParam || {};
                var cloudInfra = winParam.cloudInfra || {};
                var user = $("html").scope().user || {};
                var isIT = user.cloudType === "IT";
                $scope.isIT = isIT;
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                var cloudInfraServiceIns = new cloudInfraService($q, camel);
                var diskServiceIns = new diskService(exception, $q, camel);

                $scope.name = {
                    "label": i18n.common_term_name_label + ":",
                    "id": "ecsStorageDiskAddDiskName",
                    "width": "200",
                    "value": "",
                    "extendFunction": ["diskNameValid"],
                    "validate": "diskNameValid():" + i18n.common_term_composition3_valid + i18n.sprintf(i18n.common_term_length_valid, "0", 64)
                };

                $scope.diskType = {
                    "label": i18n.common_term_type_label + ":",
                    "id": "ecsStorageDiskAddDiskType",
                    "layout": "horizon",
                    "values": [{
                        "key": "normal",
                        "text": i18n.common_term_common_label,
                        "checked": true
                    }, {
                        "key": "share",
                        "text": i18n.common_term_share_label
                    }]
                };

                $scope.az = {
                    "label": i18n.resource_term_AZ_label + ":",
                    "id": "ecsStorageDiskAddDiskAz",
                    "width": "200",
                    "values": [],
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "change": function () {
                        $scope.onSelectAz($("#ecsStorageDiskAddDiskAz").widget().getSelectedId());
                    }
                };

                var capValidTips = i18n.sprintf(i18n.common_term_rangeInteger_valid, 1, 65536);
                $scope.capacity = {
                    "label": i18n.common_term_capacity_label + "(GB):",
                    "id": "ecsStorageDiskAddDiskCapacity",
                    "width": "200",
                    "value": "20",
                    "require": true,
                    "tips": "1~65536GB",
                    "validate": "integer:" + capValidTips + ";maxValue(65536):" + capValidTips + ";minValue(1):"  + capValidTips
                };
                //模式下拉框
                $scope.patternSelector = {
                    "label": $scope.i18n.common_term_formatDiskMode_label+":",
                    "id": "createDiskPatternSelector",
                    "width": "200",
                    "values": [
                        {
                            "selectId": "0",
                            "label": $scope.i18n.common_term_formatFull_label,
                            "checked": true
                        },
                        {
                            "selectId": "1",
                            "label": $scope.i18n.common_term_formatDelay_label
                        },
                        {
                            "selectId": "2",
                            "label": $scope.i18n.common_term_formatQuick_label
                        }
                    ]
                };
                $scope.storageMedia = {
                    "label": i18n.common_term_storageMedia_label + ":",
                    "id": "ecsStorageDiskAddDiskStoreMedia",
                    "width": "200",
                    "require": isIT,
                    "validate": isIT?("required:" + i18n.common_term_null_valid + ";"):"",
                    "values": [],
                    "all": []
                };

                $scope.okBtn = {
                    "id": "ecsStorageDiskAddDiskOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        if (!UnifyValid.FormValid($(".ecs_vm_detail_disk_add"))) {
                            return;
                        }

                        //获取磁盘信息
                        var options = {
                            "user": user,
                            "cloudInfraId": cloudInfra.id,
                            "name": $.trim($("#ecsStorageDiskAddDiskName").widget().getValue()),
                            "size": $("#ecsStorageDiskAddDiskCapacity").widget().getValue(),
                            "azId": $("#ecsStorageDiskAddDiskAz").widget().getSelectedId(),
                            "type": $("#ecsStorageDiskAddDiskType").widget().opChecked("checked"),
                            "mediaType": $("#ecsStorageDiskAddDiskStoreMedia").widget().getSelectedId(),
                            "vpcId": winParam.vpcId
                        };
                        options.configType = $("#" + $scope.patternSelector.id).widget().getSelectedId();
                        var deferred = diskServiceIns.createDisk(options);
                        deferred.then(function (data) {
                            winParam.needRefresh = true;
                            $("#ecsStorageDisksAddDiskWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsStorageDiskAddDiskCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsStorageDisksAddDiskWinId").widget().destroy();
                    }
                };

                //选择AZ
                $scope.onSelectAz = function (azId) {
                    if (azId && $scope.storageMedia.all.length > 0) {
                        var mediaTypes = [];
                        if(!isIT){
                            mediaTypes.push({
                                "selectId": "",
                                "label": " ",
                                "checked": true
                            });
                        }
                        var medias = _.find($scope.storageMedia.all, function (item) {
                            return azId === item.azId;
                        });
                        if (medias) {
                            if (medias.storage && medias.storage.length > 0) {
                                _.each(medias.storage, function (media) {
                                    if (media.name.indexOf("MediaType") >= 0) {
                                        mediaTypes.push({
                                            "selectId": media.value,
                                            "label": media.value === "SAN-Any"?"Any":media.value
                                        });
                                    }
                                });
                            }
                        }
                        $scope.storageMedia.values = mediaTypes;
                    }
                };

                //查询AZ列表
                function queryAz() {
                    var promise = cloudInfraServiceIns.queryAzs(user.vdcId, user.id, cloudInfra.id);
                    promise.then(function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.availableZones && data.availableZones.length > 0) {
                            var azs = [];
                            _.each(data.availableZones, function (item) {
                                //保存存储介质
                                if (item.tags) {
                                    var azMedia = {
                                        "azId": item.id,
                                        "storage": item.tags.datastore
                                    };
                                    $scope.storageMedia.all.push(azMedia);
                                }
                                if(item.name !== "manage-az"){
                                    azs.push(item);
                                }
                            });
                            if(azs.length > 0){
                                azs[0].checked = true;
                                $scope.az.values = azs;
                                $scope.onSelectAz(azs[0].selectId);
                            }
                        }
                    }, function (response) {
                        exception.doException(response);
                    });
                }

                UnifyValid.diskNameValid = function () {
                    var input = $("#" + $scope.name.id).widget().getValue();
                    if ($.trim(input) === "") {
                        return true;
                    }
                    var nameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{0,64}[ ]*$/;
                    return nameReg.test(input);
                };

                // 查询初始化信息
                queryAz();
            }
        ];

        var addDiskModule = angular.module("ecs.storage.disk.add", ["ui.bootstrap",'ng', "wcc", 'ngSanitize']);
        addDiskModule.controller("ecs.storage.disk.add.ctrl", addDiskCtrl);
        addDiskModule.service("camel", http);
        addDiskModule.service("validator", validator);
        addDiskModule.service("exception", exception);

        return addDiskModule;
    }
);
