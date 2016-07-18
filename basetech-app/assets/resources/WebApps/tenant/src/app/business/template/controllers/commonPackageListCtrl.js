/* global define */
define(['tiny-lib/jquery',
    "tiny-lib/jquery.base64",
    "tiny-lib/angular",
    "tiny-lib/encoder",
    "tiny-lib/underscore",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "app/services/cloudInfraService",
    "app/services/messageService",
    "app/services/commonService",
    'tiny-widgets/Message',
    "app/business/template/services/templateService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/tenantTemplateFixture"
], function ($, $jBase, angular, $encoder, _, TextBox, Button, Window, cloudInfraService, messageService, commonService, Message, templateService) {
    "use strict";

    var commonPackageListCtrl = ["$rootScope", "$scope", "$compile", "$state", "$q", "camel", "exception", "message", "storage",
        function ($rootScope, $scope, $compile, $state, $q, camel, exception, message, storage) {

            //公共服务实例
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var templateServiceIns = new templateService(exception, $q, camel);
            var user = $scope.user;
            //资源池ID，标识地域
            var cloudInfraId = "";
            $scope.osType = "";
            $scope.softType = "";
            $scope.searchStr = "";
            var i18n = $scope.i18n;
            // 权限控制
            //脚本
            $scope.hasPackageRight = _.contains(user.privilegeList, "313000");
            //脚本查看
            $scope.hasPackageViewRight = _.contains(user.privilegeList, "313001");
            //脚本操作
            $scope.hasPackageOperateRight = _.contains(user.privilegeList, "313002");
            $scope.hasPackageSendRight = _.contains(user.privilegeList, "313003");
            //地址下拉框
            $scope.address = {
                "id": "templateAddress",
                "width": "150",
                "height": "200",
                "values": [],
                "change": function () {
                    cloudInfraId = $("#templateAddress").widget().getSelectedId();
                    page.currentPage = 1;
                    //更新软件包信息列表
                    getData();
                    storage.add("cloudInfraId", cloudInfraId);
                }
            };

            //操作系统下拉框
            $scope.fitSystem = {
                "id": "templateFitSystem",
                "width": "150",
                "height": "200",
                "values": [{
                    "selectId": "",
                    "label": i18n.common_term_allOStype_label,
                    "checked": true
                }, {
                    "selectId": "Linux",
                    "label": "Linux"
                }, {
                    "selectId": "Windows",
                    "label": "Windows"
                }],
                "change": function () {
                    $scope.osType = $("#templateFitSystem").widget().getSelectedId();
                    page.currentPage = 1;
                    //更新软件包信息列表
                    getData();
                }
            };

            //操作系统下拉框
            $scope.type = {
                "id": "templateFType",
                "width": "150",
                "height": "200",
                "values": [{
                    "selectId": "",
                    "label": i18n.common_term_allSoftType_label,
                    "checked": true

                }, {
                    "selectId": "rpm",
                    "label": "rpm"
                }, {
                    "selectId": "msi",
                    "label": "msi"
                }, {
                    "selectId": "unknown",
                    "label": i18n.common_term_unknownType_label
                }],
                "change": function () {
                    $scope.softType = $("#templateFType").widget().getSelectedId();
                    page.currentPage = 1;
                    //更新软件包信息列表
                    getData();
                }
            };

            //条件搜索
            $scope.searchBox = {
                "id": "templateSearchBox",
                "placeholder": i18n.common_term_findCondition_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "search": function (searchString) {
                    $scope.searchStr = searchString;
                    page.currentPage = 1;
                    //更新软件包信息列表
                    getData();
                }
            };

            //创建按钮
            $scope.createBtn = {
                "id": "commonScriptList-list-clear",
                "text": i18n.common_term_add_button,
                "click": function () {
                    $("#createPackage").scope.exception = exception;
                    $state.go("addPackage", {
                        "cloudInfraId": cloudInfraId,
                        "action": "create"
                    });
                }
            };


            //刷新
            $scope.refresh = {
                "id": "commonScriptRefresh",
                "click": function () {
                    //更新软件包信息列表
                    getData();
                }
            };

            //帮助
            $scope.help = {
                "id": "templateCommonPackageHelp",
                "helpKey": "drawer_template_soft",
                "show": false,
                "i18n": $scope.urlParams.lang,
                "click": function () {
                    $scope.help.show = true;
                }
            };

            // 存储当前点击展开的详情
            $scope.currentItem = undefined;
            //当前页码信息
            var page = {
                "currentPage": 1,
                "displayLength": 10,
                "getStart": function () {
                    return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                }
            };

            $scope.packageListTable = {
                "id": "package-list-table",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "showDetails": true,
                "draggable": true,
                "columns": [{
                        "sTitle": "",
                        "mData": "showDetail",
                        "bSearchable": false,
                        "bSortable": false,
                        "sWidth": "36px"
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "10%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "sWidth": "8%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "status",
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_softwareType_label,
                        "mData": "fileType",
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.template_term_softwareVersion_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.version);
                        },
                        "sWidth": "10%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.template_term_suitOS_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osType);
                        },
                        "sWidth": "12%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "sWidth": "12%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.template_term_applyRange_label,
                        "mData": "range",
                        "sWidth": "8%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operator",
                        "sWidth": "12%",
                        "bSortable": false
                    }
                ],
                "data": null,
                "columnVisibility": {
                    "activate": "click", //"mouseover"/"click"
                    "aiExclude": [0, 8],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {}
                },
                "callback": function (evtObj) {
                    var displayLength = $("#package-list-table").widget().option("display-length");
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getData();
                },
                "changeSelect": function (evtObj) {
                    page.currentPage = evtObj.currentPage;
                    page.displayLength = evtObj.displayLength;
                    getData();
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    //tips提示
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(7)", nRow).addTitle();
                    //下钻时传递参数
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                        $scope.currentItem.cloudInfraId = cloudInfraId;
                    });
                    // 操作列

                    // 可见范围
                    if (aData.range === 0 || aData.range === "0") {
                        $("td:eq(8)", nRow).text(i18n.common_term_system_label);
                    } else {
                        $("td:eq(8)", nRow).text(i18n.org_term_organization_label);
                    }

                    if (aData.fileType === "unknown") {
                        $("td:eq(4)", nRow).text(i18n.common_term_unknownType_label);
                    }

                    // 状态
                    if (isSoftwareNormal(aData)) {
                        $("td:eq(3)", nRow).text(i18n.common_term_natural_value);
                    } else {
                        if (aData.range === 0 || aData.range === "0" || !$scope.hasPackageOperateRight) {
                            $("td:eq(3)", nRow).text(i18n.common_term_abnormal_value);
                        } else {
                            var name = "<span style='padding-right: 10px;'>" + i18n.common_term_abnormal_value + "</span><a href='javascript:void(0)' ng-click='repair()'>" + i18n.common_term_restore_button + "</a>";
                            var nameLink = $compile($(name));
                            var nameScope = $scope.$new();
                            nameScope.name = aData.name;
                            nameScope.repair = function () {
                                $state.go("repairSoftwarePackage.navigation", {
                                    "id": aData.id,
                                    "cloudInfraId": cloudInfraId
                                });
                            };
                            var nameNode = nameLink(nameScope);
                            $("td:eq(3)", nRow).html(nameNode);
                        }
                    }

                    var optColumn = "";
                    if (aData.range === 0 || aData.range === "0" || !$scope.hasPackageOperateRight) {
                        optColumn = "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                    } else {
                        optColumn = "<a  class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a> " +
                            "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                    }
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.id = "packageOptMore" + iDataIndex;
                    optScope.text = "<span class='btn-link'>" + i18n.common_term_more_button + "</span>";
                    optScope.data = aData;

                    var packageSendContent = {
                        title: i18n.template_term_batchInstall_button,
                        id: "packageMoreSend",
                        click: function () {
                            sendPackage(aData);
                        }
                    };

                    if (aData.range === 0 || aData.range === "0" || !$scope.hasPackageOperateRight) {
                        optScope.content = [
                            {
                                title: i18n.template_term_softUsageInfoCheck_label,
                                id: "packageMoreSearch",
                                click: function () {
                                    packageUseInfo(aData.id);
                                }
                            }
                        ];

                        if ($scope.hasPackageSendRight) {
                            optScope.content.push(packageSendContent);
                        }
                    } else {
                        optScope.content = [{
                            title: "<div class='msg-info'>" + i18n.common_term_modify_button + "</div>",
                            id: "packageMoreUpdate",
                            click: function () {
                                $("#createPackage").scope.exception = exception;
                                $state.go("addPackage", {
                                    "action": "modify",
                                    "id": aData.id,
                                    "cloudInfraId": cloudInfraId
                                });
                            }
                        }, {
                            title: i18n.template_term_softUsageInfoCheck_label,
                            id: "packageMoreSearch",
                            click: function () {
                                packageUseInfo(aData.id);
                            }
                        }];

                        if ($scope.hasPackageSendRight) {
                            optScope.content.push(packageSendContent);
                        }
                    }

                    optScope["delete"] = function () {
                        message.warnMsgBox({
                            "content": i18n.template_software_del_info_confirm_msg,
                            "callback": function () {
                                var options = {
                                    "user": user,
                                    "id": aData.id,
                                    "cloudInfraId": cloudInfraId
                                };
                                var promise = templateServiceIns.deleteSoftPackage(options);
                                promise.then(function (data) {
                                    getData();
                                });
                            }
                        });

                    };
                    optScope.update = function () {};
                    var optNode = optLink(optScope);
                    $("td:eq(9)", nRow).html(optNode);
                }
            };

            /**
             * 判断软件状态
             *
             * @param dataItem
             * @returns {boolean}
             */
            var isSoftwareNormal = function (dataItem) {
                if (!dataItem) {
                    return true;
                }

                if (dataItem.status !== "Normal") {
                    return false;
                }

                for (var index in dataItem.attachmentPaths) {
                    if (dataItem.attachmentPaths[index].status !== "Normal") {
                        return false;
                    }
                }

                return true;
            };

            function sendPackage(aData) {
                //查询当前软件包详情
                var deferred = templateServiceIns.querySoftwarePackageById({
                    "cloudInfraId": cloudInfraId,
                    "softwareid": aData.id,
                    "user": user
                });
                deferred.then(function (data) {
                    if (!data) {
                        return;
                    }
                    $("#packageList").scope.exception = exception;
                    //跳转到批量安装页面
                    $state.go("batchInstallPackage", {
                        "id": aData.id,
                        "cloudInfraId": cloudInfraId,
                        "name": data.name,
                        "osType": data.osType,
                        "fileType": data.fileType,
                        "version": data.version,
                        "description": data.description,
                        "installCommand": $.base64.decode(data.installCommand || "", true),
                        "unInstallCommand": $.base64.decode(data.unInstallCommand || "", true),
                        "startCommand": $.base64.decode(data.startCommand || "", true),
                        "stopCommand": $.base64.decode(data.stopCommand || "", true)
                    });
                });
            }

            //软件包使用信息查询
            function packageUseInfo(id) {
                var options = {
                    "winId": "template-packageList-packageUseInfo-winId",
                    "templateId": "packageUseInfo",
                    "cloudInfraId": cloudInfraId,
                    "softwareid": id,
                    "exception": exception,
                    "title": i18n.template_term_softUsageInfoCheck_label,
                    "width": "1000px",
                    "height": "550px",
                    "content-type": "url",
                    "content": "app/business/template/views/packageUseInfo.html",
                    "buttons": null,
                    "close": function () {}
                };
                var win = new Window(options);
                win.show();
            }

            // 查询公共软件包列表信息
            function getData() {
                var user = $rootScope.user;
                var options = {
                    "user": user,
                    "params": {
                        "cloud-infra": cloudInfraId,
                        "name": $scope.searchStr,
                        "ostype": $scope.osType,
                        "filetype": $scope.softType,
                        "limit": page.displayLength,
                        "start": page.getStart(),
                        "sort": "0",
                        "order": "0"
                    }
                };
                var promise = templateServiceIns.querySoftwarePackageList(options);
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }

                    var softwareInfos = data.softwareInfos;
                    if (softwareInfos) {
                        _.each(softwareInfos, function (item) {
                            _.extend(item, {
                                "showDetail": "",
                                "operator": "",
                                "detail": {
                                    contentType: "url", // simple & url
                                    content: "app/business/template/views/packageDetail.html"
                                },
                                "createTime": commonService.utc2Local(item.createTime)
                            });
                        });
                    }
                    $(".package-detail").scope.exception = exception;
                    $scope.packageListTable.data = softwareInfos;
                    $scope.packageListTable.totalRecords = data.total;
                    $scope.packageListTable.displayLength = page.displayLength;
                    $("#package-list-table").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                });
            }

            //查询当前租户可见的地域列表
            function getLocations() {
                var retDefer = $q.defer();
                var deferred = cloudInfraServiceIns.queryCloudInfras($rootScope.user.vdcId, $rootScope.user.id);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    if (data.cloudInfras && data.cloudInfras.length > 0) {
                        cloudInfraId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                        $scope.address.values = data.cloudInfras;
                        retDefer.resolve();
                    }
                }, function (rejectedValue) {
                    exception.doException(rejectedValue, "");
                    retDefer.reject();
                });
                return retDefer.promise;
            }

            $scope.$on("$viewContentLoaded", function () {
                //获取初始化信息
                var promise = getLocations();
                promise.then(function () {
                    //获取初始软件包列表
                    getData();
                });
            });
        }
    ];
    return commonPackageListCtrl;
});
