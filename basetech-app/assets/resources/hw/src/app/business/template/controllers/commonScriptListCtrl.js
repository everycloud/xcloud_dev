define(['tiny-lib/jquery',
    "tiny-lib/jquery.base64",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-lib/encoder",
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
], function ($, $jBase, angular, _, $encoder, TextBox, Button, Window, cloudInfraService, messageService, commonService, Message, templateService) {
    "use strict";

    var commonScriptListCtrl = ["$rootScope", "$scope", "$compile", "$state", "$q", "camel", "exception", "message", "storage",
        function ($rootScope, $scope, $compile, $state, $q, camel, exception, message, storage) {
            var i18n = $scope.i18n;
            //公共服务实例
            var cloudInfraServiceIns = new cloudInfraService($q, camel);
            var templateServiceIns = new templateService(exception, $q, camel);
            var user = $scope.user;
            //资源池ID，标识地域
            var cloudInfraId = null;
            $scope.osType = "";
            $scope.searchStr = "";
            // 权限控制
            //脚本
            $scope.hasScriptRight = _.contains(user.privilegeList, "311000");
            //脚本查看
            $scope.hasScriptViewRight = _.contains(user.privilegeList, "311001");
            //脚本操作
            $scope.hasScriptOperateRight = _.contains(user.privilegeList, "311002");
            $scope.hasScriptSendRight = _.contains(user.privilegeList, "311003");
            //地址下拉框
            $scope.address = {
                "id": "templateAddress",
                "width": "150",
                "height": "200",
                "values": [],
                "change": function () {
                    cloudInfraId = $("#templateAddress").widget().getSelectedId();
                    page.currentPage = 1;
                    //更新列表数据
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
                    "label": "Linux",
                    "default": true
                }, {
                    "selectId": "Windows",
                    "label": "Windows"
                }],
                "change": function () {
                    $scope.osType = $("#templateFitSystem").widget().getSelectedId();
                    page.currentPage = 1;
                    //更新列表数据
                    getData();
                }
            };

            //条件搜索下拉框
            $scope.searchBox = {
                "id": "templateSearchBox",
                "placeholder": i18n.common_term_findCondition_prom,
                "width": "250",
                "suggest-size": 10,
                "maxLength": 64,
                "suggest": function (content) {},
                "search": function (searchString) {
                    $scope.searchStr = searchString;
                    page.currentPage = 1;
                    //更新列表数据
                    getData();
                }
            };

            //创建添加按钮
            $scope.createBtn = {
                "id": "commonScriptList-list-clear",
                "text": i18n.common_term_add_button,
                "click": function () {
                    $("#createScript").scope.exception = exception;
                    $state.go("addScript", {
                        "action": "create",
                        "cloudInfraId": cloudInfraId
                    });
                }
            };

            //刷新
            $scope.refresh = {
                "id": "commonScriptRefresh",
                "click": function () {
                    //更新列表数据
                    getData();
                }
            };

            //帮助
            $scope.help = {
                "id": "templatecommonScriptHelp",
                "helpKey": "drawer_template_script",
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

            $scope.scriptListTable = {
                "id": "script-list-table",
                "captain": "vmCaptain",
                "paginationStyle": "full_numbers",
                "displayLength": 10,
                "totalRecords": 0,
                "lengthMenu": [10, 20, 30],
                "showDetails": {
                    "colIndex": 0,
                    "domPendType": "append"
                },
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
                        "sWidth": "13%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.common_term_ID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.id);
                        },
                        "sWidth": "10%",
                        "bSortable": true
                    }, {
                        "sTitle": i18n.common_term_status_label,
                        "mData": "status",
                        "sWidth": "13%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.template_term_suitOS_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.osType);
                        },
                        "sWidth": "13%",
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_createAt_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.createTime);
                        },
                        "sWidth": "13%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.template_term_applyRange_label,
                        "mData": "range",
                        "sWidth": "13%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label,
                        "mData": "operator",
                        "sWidth": "13%",
                        "bSortable": false
                    }
                ],
                "data": null,
                "columnVisibility": {
                    "activate": "click", 
                    "aiExclude": [0, 8],
                    "bRestore": true,
                    "fnStateChange": function (index, state) {}
                },
                "callback": function (evtObj) {
                    var displayLength = $("#script-list-table").widget().option("display-length");
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
                    $("td:eq(5)", nRow).addTitle();

                    //下钻时传递参数
                    $("td:eq(0)", nRow).bind("click", function () {
                        $scope.currentItem = aData;
                        $scope.currentItem.cloudInfraId = cloudInfraId;
                    });

                    // 操作列

                    // 可见范围
                    if (aData.range === 0 || aData.range === "0") {
                        $("td:eq(6)", nRow).text(i18n.sys_term_sysConfig_label);
                    } else {
                        $("td:eq(6)", nRow).text(i18n.org_term_organization_label);
                    }
                    //状态
                    if (aData.status === "Normal") {
                        $("td:eq(3)", nRow).text(i18n.common_term_natural_value);
                    } else {
                        //鉴权
                        if (aData.range === 0 || aData.range === "0" || !$scope.hasScriptOperateRight) {
                            $("td:eq(3)", nRow).text(i18n.common_term_abnormal_value);
                        } else {
                            var name = "<span style='padding-right: 10px;'>" + i18n.common_term_abnormal_value + "</span><a href='javascript:void(0)' ng-click='repair()'>" + i18n.common_term_restore_button + "</a>";
                            var nameLink = $compile($(name));
                            var nameScope = $scope.$new();
                            nameScope.name = aData.name;
                            nameScope.repair = function () {
                                $state.go("repairScript.navigation", {
                                    "id": aData.id,
                                    "cloudInfraId": cloudInfraId
                                });
                            };
                            var nameNode = nameLink(nameScope);
                            $("td:eq(3)", nRow).html(nameNode);
                        }
                    }

                    var optColumn = "";
                    if (aData.range === 0 || aData.range === "0" || !$scope.hasScriptOperateRight) {
                        optColumn = "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                    } else {
                        optColumn = "<a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a> " +
                            "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                    }
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope.id = "scriptOptMore" + iDataIndex;
                    optScope.text = "<span class='btn-link'>" + i18n.common_term_more_button + "</span>";

                    var scriptSendContent = {
                        title: i18n.template_term_batchInstall_button,
                        id: "scriptMoreSend",
                        click: function () {
                            scriptSend(aData);
                        }
                    };

                    if (aData.range === 0 || aData.range === "0" || !$scope.hasScriptOperateRight) {
                        optScope.content = [{
                            title: i18n.template_term_scriptUsageInfoCheck_button,
                            id: "scriptMoreSearch",
                            click: function () {
                                scriptUseInfo(aData.id);
                            }
                        }];

                        if ($scope.hasScriptSendRight) {
                            optScope.content.push(scriptSendContent);
                        }
                    } else {
                        optScope.content = [{
                            title: "<div class='msg-info'>" + i18n.common_term_modify_button + "</div>",
                            id: "scriptMoreUpdate",
                            click: function () {
                                $("#createScript").scope.exception = exception;
                                $state.go("addScript", {
                                    "action": "modify",
                                    "id": aData.id,
                                    "cloudInfraId": cloudInfraId
                                });
                            }
                        }, {
                            title: i18n.template_term_scriptUsageInfoCheck_button,
                            id: "scriptMoreSearch",
                            click: function () {
                                scriptUseInfo(aData.id);
                            }
                        }];

                        if ($scope.hasScriptSendRight) {
                            optScope.content.push(scriptSendContent);
                        }
                    }
                    optScope.data = aData;
                    optScope["delete"] = function () {
                        message.warnMsgBox({
                            "content": i18n.template_script_del_info_confirm_msg,
                            "callback": function () {
                                var options = {
                                    "user": user,
                                    "id": aData.id,
                                    "cloudInfraId": cloudInfraId
                                };
                                var promise = templateServiceIns.deleteScript(options);
                                promise.then(function (data) {
                                    //更新列表
                                    getData();
                                });
                            }
                        });
                    };
                    optScope.update = function () {};
                    var optNode = optLink(optScope);
                    $("td:eq(7)", nRow).html(optNode);
                }
            };

            function scriptSend(aData) {
                var deferred = templateServiceIns.queryScriptById({
                    "cloudInfraId": cloudInfraId,
                    "scriptId": aData.id,
                    "user": user
                });
                deferred.then(function (data) {
                    $("#scriptList").scope.exception = exception;
                    //跳转到批量安装页面
                    $state.go("batchInstallScript", {
                        "id": aData.id,
                        "cloudInfraId": cloudInfraId,
                        "name": data.name,
                        "osType": data.osType,
                        "version": data.version,
                        "description": data.description,
                        "installCommand": $.base64.decode(data.installCommand || "", true)
                    });
                });
            }

            //脚本使用信息查询
            function scriptUseInfo(id) {
                var options = {
                    "winId": "template-scriptList-scriptUseInfo-winId",
                    "templateId": "packageUseInfo",
                    "cloudInfraId": cloudInfraId,
                    "scriptId": id,
                    "exception": exception,
                    "title": i18n.template_term_scriptUsageInfoCheck_button,
                    "width": "1000px",
                    "height": "550px",
                    "content-type": "url",
                    "content": "app/business/template/views/scriptUseInfo.html",
                    "buttons": null,
                    "close": function () {}
                };
                var win = new Window(options);
                win.show();
            }

            // 查询公共脚本列表信息
            function getData() {
                if (!cloudInfraId) {
                    return;
                }
                var option = {
                    "cloud-infra": cloudInfraId,
                    "name": $scope.searchStr,
                    "ostype": $scope.osType,
                    "limit": page.displayLength,
                    "start": page.getStart(),
                    "sort": "0",
                    "order": "0"
                };
                var options = {
                    "user": user,
                    "option": option
                };
                var promise = templateServiceIns.queryScript(options);
                promise.then(function (data) {
                    if (!data) {
                        return;
                    }

                    var scriptInfos = data.scriptInfos;
                    if (scriptInfos) {
                        _.each(scriptInfos, function (item) {
                            _.extend(item, {
                                "showDetail": "",
                                "operator": "",
                                "detail": {
                                    contentType: "url", // simple & url
                                    content: "app/business/template/views/scriptDetail.html"
                                },
                                "createTime": commonService.utc2Local(item.createTime)
                            });
                        });
                    }
                    $(".script-detail").scope.exception = exception;
                    $scope.scriptListTable.data = scriptInfos;
                    $scope.scriptListTable.totalRecords = data.total;
                    $scope.scriptListTable.displayLength = page.displayLength;
                    $("#script-list-table").widget().option("cur-page", {
                        "pageIndex": page.currentPage
                    });
                });
            }

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
                    }
                    retDefer.resolve();
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
    return commonScriptListCtrl;
});
