/**
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    'app/business/resources/controllers/constants',
    'app/business/resources/services/rpool/zone/zoneResources/physical/dedicatedServers/dedicatedServersService',
    'app/services/commonService',
    'app/services/messageService',
    'tiny-widgets/Checkbox',
    'tiny-directives/Tabs',
    'tiny-directives/Checkbox',
    "tiny-directives/FilterSelect",
    'fixtures/zoneFixture'],
    function ($, angular, constants, DedicatedServersService, commonService, MessageService, Checkbox) {
        "use strict";

        var dedicatedServersCtrl = ["$scope", "$stateParams", "$compile", "$q", "camel", function ($scope, $stateParams, $compile, $q, camel) {
                var user = $scope.user;
                var i18n = $scope.i18n;
                var zoneId = $stateParams.id;
                var zoneName = $stateParams.name;
                var dedicatedServersService = new DedicatedServersService($q, camel);
                var associateStatus = dedicatedServersService.getAssociateStatus();
                var assignStatus = dedicatedServersService.getAssignStatus();
                var runStatus = dedicatedServersService.getRunStatus();
                var UNKNOWN = i18n.common_term_unknown_value || "未知";
                var associateValues = [];
                var idPrefix = "dedicatedServersID_";
                var tblHeaderCheckbox = new Checkbox({
                    "checked": false,
                    "change": function () {
                        var list = $scope.associateServerTable.data;
                        var checkedAll = tblHeaderCheckbox.option("checked");
                        for (var i = 0, len = list.length; i < len; i++) {
                            var id = idPrefix + list[i].id;
                            //这个id有特殊字符串，不能做jq的选择器
                            var dom = document.getElementById(id);
                            if (dom) {
                                $(dom).widget().option("checked", checkedAll);
                                $scope.checked[list[i].id] = checkedAll;
                            }
                        }
                    }
                });
                var ifAllChecked = function (list) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        var id = list[i].id;
                        if (!$scope.checked[id]) {
                            return false;
                        }
                    }
                    return true;
                }
                var renderTbHeaderCheckbox = function (list) {
                    var allChecked = ifAllChecked(list);
                    tblHeaderCheckbox.option("checked", allChecked);
                    tblHeaderCheckbox.rendTo($("#tableHeaderCheckbox"));
                };
                var getIds = function (associateState) {
                    var ids = [];
                    var checked = $scope.checked;
                    var list = $scope.associateServerTable.data;
                    for (var i = 0, len = list.length; i < len; i++) {
                        var item = list[i];
                        if (associateState == item.associateState && checked[item.id] === true) {
                            ids.push(item.id);
                        }
                    }
                    return ids;
                };
                for (var p in associateStatus) {
                    associateValues.push({
                        selectId: p,
                        label: associateStatus[p].label,
                        checked: associateStatus[p].checked
                    });
                }

                $scope.associateStatus = {
                    id: "associateStatusId",
                    values: associateValues,
                    change: function () {
                        var selectId = $("#associateStatusId").widget().getSelectedId();
                        $scope.searchModel.associateState = associateStatus[selectId].val;
                        $scope.operator.query();
                    }
                };


                $scope.associate = {
                    id: "dedicatedServersAssociate",
                    text: i18n.common_term_associate_button || "关联",
                    click: function () {
                        $scope.operator.associate();
                    }
                };

                $scope.dissociate = {
                    id: "dedicatedServersDissociate",
                    text: i18n.common_term_disassociate_button || "解关联",
                    click: function () {
                        $scope.operator.dissociate();
                    }
                };

                $scope.refresh = {
                    id: "dedicatedServersRefreshIdd",
                    text: i18n.common_term_fresh_button || "刷新",
                    refresh: function () {
                        $scope.operator.query();
                    }
                };

                $scope.searchBox = {
                    "id": "dedicatedServersSearchBox",
                    "placeholder": i18n.resource_term_findPhysiServer_prom || "请输入物理机名称",
                    "type": "round", // round,square,long
                    "width": "250",
                    "suggest-size": 10,
                    "maxLength": 64,
                    "search": function (searchString) {
                        $scope.searchModel.name = $.trim(searchString);
                        $scope.operator.query();
                    }
                };

                $scope.searchModel = {
                    name: "",
                    start: 0,
                    limit: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    associateState: "",
                    assignState: ""
                };

                //标识被勾选的server
                $scope.checked = {};

                /**
                 * 初始化表格的操作列
                 * @param dataItem
                 * @param row
                 */
                var addOperatorDom = function (nRow, aData, iDataIndex) {
                    var serverId = aData.id;
                    //操作暂不可用
                    if (false) {
                        var deleteText = i18n.common_term_delete_button || "删除";
                        var optTemplates = "<div>" +
                            "<a href='javascript:void(0)' ng-click='delete()' style='margin-right:10px; width:auto'>" + deleteText + "</a>" +
                            "</div>";
                        var optScope = $scope.$new(false);
                        optScope.data = aData;
                        optScope.delete = function () {
                            $scope.operator.delete(serverId);
                        };
                        var optDom = $compile($(optTemplates))(optScope);
                        $("td:last", nRow).html(optDom);
                    }

                    aData.checked = !!$scope.checked[serverId];
                    var selBox = "<div style='position: relative;margin:auto;width: 16px;height: 16px'>" +
                        "<tiny-checkbox text='' id='id' checked='checked' change='change()'></tiny-checkbox>" +
                        "</div>";
                    var selBoxLink = $compile(selBox);
                    var selBoxScope = $scope.$new();
                    selBoxScope.data = aData;
                    selBoxScope.id = idPrefix + serverId;
                    selBoxScope.checked = aData.checked;
                    selBoxScope.change = function () {
                        aData.checked = !aData.checked;
                        $scope.checked[serverId] = aData.checked;

                        var allChecked = ifAllChecked($scope.associateServerTable.data);
                        tblHeaderCheckbox.option("checked", allChecked);
                    };
                    var selBoxNode = selBoxLink(selBoxScope);
                    $("td:first", nRow).append(selBoxNode);

                };

                $scope.associateServerTable = {
                    data: [],
                    id: "associateServerTableId",
                    columnsDraggable: true,
                    enablePagination: true,
                    paginationStyle: "full_numbers",
                    lengthChange: true,
                    lengthMenu: commonService.TABLE_PAGE_LENGTH_OPTIONS,
                    displayLength: commonService.DEFAULT_TABLE_PAGE_LENGTH,
                    enableFilter: false,
                    curPage: 0,
                    totalRecords: 0,
                    hideTotalRecords: false,
                    columns: [
                        {
                            "sTitle": "<div  id='tableHeaderCheckbox'></div>",
                            "bSortable": false,
                            "bSearchable": false,
                            "sClass": "check",
                            "sWidth": 26
                        },
                        {
                            "sTitle": i18n.common_term_name_label || "名称",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.device_term_model_label || "型号",
                            "mData": "type",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.device_term_cabinet_label || "机柜",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.rack);
                            },
                            "bSortable": false,
                            "sWidth": "5%"
                        },
                        {
                            "sTitle": i18n.device_term_room_label || "机房",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.room);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.device_term_subrack_label || "机框",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.subrack);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_assignStatus_label || "分配状态",
                            "mData": "assignStateText",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_associateStatus_button || "关联状态",
                            "mData": "associateStateText",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_runningStatus_label || "运行状态",
                            "mData": "runStateText",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.device_term_BMCip_label || "BMC IP",
                            "mData": "bmcIp",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_tenant_label || "租户",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.userInfo && data.userInfo.name);
                            },
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_overdueTime_label || "到期时间",
                            "mData": "localExpirationDate",
                            "bSortable": false
                        },
                        {
                            "sTitle": i18n.common_term_operation_label || "操作",
                            "sClass": "operation",
                            "bSearchable": false,
                            "bSortable": false
                        }
                    ],
                    callback: function (evtObj) {
                        $scope.searchModel.start = evtObj.displayLength * (evtObj.currentPage - 1);
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.query(true);
                    },
                    changeSelect: function (evtObj) {
                        $scope.searchModel.start = 0;
                        $scope.searchModel.limit = evtObj.displayLength;
                        $scope.operator.query(true);
                    },
                    renderRow: function (nRow, aData, iDataIndex) {
                        addOperatorDom(nRow, aData, iDataIndex);
                    }
                };

                var parseTableData = function (resolvedValue) {
                    var list = resolvedValue.serverInfo;
                    for (var i = 0, len = list.length; i < len; i++) {
                        var item = list[i];
                        item.assignStateText = assignStatus[item.assignState] ? assignStatus[item.assignState].label : UNKNOWN;
                        item.associateStateText = associateStatus[item.associateState] ? associateStatus[item.associateState].label : UNKNOWN;
                        item.runStateText = runStatus[item.runState] ? runStatus[item.runState].label : UNKNOWN;
                        var expirationDate = item && item.userInfo && item.userInfo.expirationDate;
                        item.localExpirationDate = expirationDate ? commonService.utc2Local(expirationDate) : "";
                    }
                    $scope.associateServerTable.data = list;
                    $scope.associateServerTable.totalRecords = resolvedValue.total;

                    renderTbHeaderCheckbox(list);
                };
                var parseOperateResult = function (resolvedValue) {
                };

                $scope.operator = {
                    "query": function (cache) {
                        !cache && ($scope.checked = {});
                        var promise = dedicatedServersService.queryServer($.extend({}, {
                            userId: user.id,
                            zoneId: zoneId,
                            params: JSON.stringify($scope.searchModel)
                        }));
                        promise.then(function (resolvedValue) {
                            parseTableData(resolvedValue);
                        });
                    },
                    "associate": function () {
                        $scope.operator.commonOperate("associate");
                    },
                    "dissociate": function () {
                        $scope.operator.commonOperate("disassociate");
                    },
                    "commonOperate": function (type) {
                        var configs = {
                            associate: {
                                content: "请至少选择一个未关联的物理机",
                                associateState: "unassociated"
                            },
                            disassociate: {
                                content: "请至少选择一个已关联的物理机",
                                associateState: "associated"
                            }
                        };
                        var config = configs[type];
                        var associateState = config.associateState;
                        var ids = getIds(associateState);
                        var params = {};
                        if (ids && ids.length) {
                            params[type] = {idList: ids};
                            var promise = dedicatedServersService.vdcOperator($.extend({}, {
                                userId: user.id,
                                params: JSON.stringify(params)
                            }));
                            promise.then(function (resolvedValue) {
                                parseOperateResult(resolvedValue);
                                $scope.operator.query();
                            });
                        } else {
                            new MessageService().failMsgBox(config.content, "warn");
                        }
                    },
                    "delete": function (id) {
                        var deleteConfig = constants.rest.DEDICATED_SERVERS_DELETE;
                        $.ajax({
                            url: deleteConfig.url,
                            type: deleteConfig.type,
                            data: {
                                "id": id
                            }
                        }).done(function (response) {
                                // 刷新页面
                                $scope.operator.query();
                            }).fail(function (error) {
                            });
                    }
                };

                // 打开时请求数据
                $scope.operator.query();
            }
            ]
            ;

        return dedicatedServersCtrl;
    })
;
