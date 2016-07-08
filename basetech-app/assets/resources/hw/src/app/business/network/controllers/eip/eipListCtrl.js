define([
        "tiny-lib/jquery",
        "tiny-lib/angular",
        "app/business/network/services/eip/eipService",
        "app/business/network/services/router/routerService",
        "app/services/messageService",
        "tiny-widgets/Window",
        "tiny-widgets/Message",
        "tiny-lib/underscore",
        "tiny-lib/encoder",
        "tiny-directives/Table",
        "bootstrap/bootstrap.min",
        "tiny-lib/underscore",
        "fixtures/network/eip/elasticipFixture",
        "fixtures/network/router/routerFixture"
    ],
    function ($, angular, eipService, routerService, MessageService, Window, Message, _) {
        "use strict";
        var eipListCtrl = ["$scope", "$compile", "$q", "camel", "networkCommon", "exception",
            function ($scope, $compile, $q, camel, networkCommon, exception) {
                // 公共服务实例
                var eipServiceIns = new eipService(exception, $q, camel);
                var routerServiceIns = new routerService(exception, $q, camel);
                $scope.params = {
                    "cloudInfraId": networkCommon && networkCommon.cloudInfraId,
                    "vpcId": networkCommon && networkCommon.vpcId,
                    "azId": networkCommon && networkCommon.azId,
                    "userId": $scope.user.id,
                    "openstack": ($scope.user.cloudType === "ICT" ? true : false),
                    "vdcId": $scope.user.vdcId,
                    "eipId": ""
                };
                var i18n = $scope.i18n;
                //是否有路由器标识
                var hasRouter = false;
                //鉴权
                var EIP_OPERATE = "553002";
                var privilegeList = $("html").scope().user.privilegeList;
                $scope.hasEIPOperateRight = _.contains(privilegeList, EIP_OPERATE);

                //sc场景屏蔽申请与更多按钮
                $scope.isSC = ($("html").scope().deployMode === 'serviceCenter');

                $scope.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;
                //当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "getStart": function () {
                        return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                    }
                };
                $scope.page = page;
                //ICT 场景下的分页
                $scope.hasPrePage = false;
                $scope.hasNextPage = false;
                var markers = [];
                $scope.prePage = function () {
                    if (!$scope.hasPrePage) {
                        return;
                    }
                    markers.pop();
                    if (markers.length === 0) {
                        $scope.hasPrePage = false;
                    }
                    page.currentPage--;
                    $scope.operator.queryElasticIP();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    var item = $scope.eipTable.data[page.displayLength - 1] || {};
                    markers.push(item.id);
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    $scope.operator.queryElasticIP();
                };
                $scope.pageSize = {
                    "id": "securitygroup-searchSizeSelector",
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
                    "change": function () {
                        page.currentPage = 1;
                        page.displayLength = $("#" + $scope.pageSize.id).widget().getSelectedId();
                        markers = [];
                        $scope.hasPrePage = false;
                        $scope.operator.queryElasticIP();
                    }
                };
                //刷新按钮
                $scope.refresh = {
                    "id": "networkEIPListrefreshBtn",
                    "tips": i18n.common_term_fresh_button,
                    "click": function () {
                        $scope.operator.queryElasticIP();
                    }
                };
                //帮助
                $scope.help = {
                    "helpKey": "drawer_eip",
                    "tips": i18n.common_term_help_label,
                    "show": false,
                    "i18n": $scope.urlParams.lang,
                    "click": function () {
                        $scope.help.show = true;
                    }
                };
                //申请弹性IP
                $scope.createBtn = {
                    "id": "network-vpcmanager-eiplist-create",
                    "text": i18n.common_term_apply_button,
                    "icon": {
                        left: "opt-add"
                    },
                    "click": function () {
                        if (!hasRouter) {
                            new MessageService().okMsgBox(i18n.nat_dnat_add_info_noRouter_msg);
                            return;
                        } else {
                            //IT软件路由器 和 ICT处理方式一致
                            if ($scope.params.openstack) {
                                $scope.operator.applyElasticIP();
                            } else if ($scope.routerType === 1 || $scope.routerType === 2) {
                                var params = $scope.params;
                                params.routerType = $scope.routerType;
                                params.vpcTypeShared = $scope.vpcTypeShared;
                                var options = {
                                    "winId": "createEIPWindowId",
                                    "params": params,
                                    title: i18n.eip_term_applyEIP_button,
                                    height: "400px",
                                    width: "700px",
                                    "content-type": "url",
                                    "content": "app/business/network/views/eip/createEIPWindow.html",
                                    "buttons": null,
                                    "close": function () {
                                        $scope.operator.queryElasticIP();
                                    }
                                };
                                var win = new Window(options);
                                win.show();
                            }
                        }
                    }
                };

                //ICT场景
                if ($scope.params.openstack) {
                    $scope.eipTable = {
                        "id": "network-vpcmanager-eiplist-listtable",
                        "enablePagination": false,
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "displayLength": 10,
                        "totalRecords": 0,
                        "showDetails": true,
                        "columns": [{
                            "sTitle": "",
                            "mData": "detail",
                            "sWidth": "40px",
                            "bSortable": false
                        },{
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_privateIP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.privateIP);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            if (!$scope.hasEIPOperateRight) {
                                return;
                            }
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            //下钻时传递参数
                            $("td:eq(0)", nRow).bind("click", function () {
                                $scope.elasticIPId = aData.id;
                            });
                            //操作列
                            var optColumn = "";
                            if (aData.resourceStatus === "BIND") {
                                if("UNBINDING" === aData.operateStatus || "BINDING" === aData.operateStatus || "UPDATING" === aData.bandwidthStatus){
                                    optColumn = "<span class='disabled'>" + i18n.common_term_unbond_button + "&nbsp;</span>";
                                }else{
                                    optColumn = "<a href='javascript:void(0)' ng-click='unBind()'>" + i18n.common_term_unbond_button + "&nbsp;</a>";
                                }
                            } else if (aData.resourceStatus === "UNBIND") {
                                if("UNBINDING" === aData.operateStatus || "BINDING" === aData.operateStatus || "UPDATING" === aData.bandwidthStatus){
                                    optColumn = "<span class='disabled'>" + i18n.vpc_term_bond_label + "&nbsp;</span> ";
                                }else{
                                    optColumn = "<a href='javascript:void(0)' ng-click='bind()'>" + i18n.vpc_term_bond_label + "&nbsp;</a> ";
                                }
                            }
                            if(!$scope.isSC){
                                if("BINDING" === aData.operateStatus||"UNBINDING" === aData.operateStatus || "UPDATING" === aData.bandwidthStatus){
                                    optColumn = optColumn + "<span class='disabled'> " + i18n.common_term_more_button + "</span>";
                                }else if(aData.bandObject !== "VPN" && !aData.privateIP){
                                    optColumn = optColumn + "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                                }
                            }
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.unBind = function () {
                                unbindElasticIP(aData.id);
                            };
                            optScope.bind = function () {
                                bind(aData.id);
                            };
                            //弹性IP绑定后不可以释放，判断绑定方法：1、私有IP不为空，2、绑定对象为VPN（由于绑定对象为VPN时私有IP为空）
                            if (aData.bandObject !== "VPN" && !aData.privateIP) {
                                optScope.id = "elasticIPOptMore" + iDataIndex;
                                optScope.text = "<span class='btn-link'> " + i18n.common_term_more_button + "</span>";
                                var releaseEIPMenu = {
                                    title: i18n.common_term_release_button,
                                    id: "releaseElasticIPId",
                                    click: function () {
                                        releaseIP(aData.id);
                                    }
                                };
                                optScope.content = [releaseEIPMenu];
                            }
                            var optNode = optLink(optScope);
                            if (aData.bandObject !== "VPN") {
                                $("td:eq(4)", nRow).append(optNode);
                            }
                        },
                        "callback": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            $scope.operator.queryElasticIP();
                        },
                        "changeSelect": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            $scope.operator.queryElasticIP();
                        }
                    };
                } else {
                    $scope.eipTable = {
                        "id": "network-vpcmanager-eiplist-listtable",
                        "paginationStyle": "full_numbers",
                        "lengthMenu": [10, 20, 30],
                        "displayLength": 10,
                        "totalRecords": 0,
                        "showDetails": true,
                        "columns": [{
                            "sTitle": "",
                            "mData": "detail",
                            "sWidth": "40px",
                            "bSortable": false
                        }, {
                            "sTitle": "IP",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.ip);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": "ID",
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.id);
                            },
                            "bSortable": false
                        },{
                            "sTitle": i18n.vpc_term_bondStatus_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.resourceStatusDis);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.vpc_term_publicIPpool_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.publicIPPoolName);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.vpc_term_bondObj_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.bandObject);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_privateIP_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.privateIP);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.vpc_term_modifyBandStatus_label,
                            "mData": function (data) {
                                return $.encoder.encodeForHTML(data.bandwidthStatusDis);
                            },
                            "bSortable": false
                        }, {
                            "sTitle": i18n.common_term_operation_label,
                            "mData": "opt",
                            "bSortable": false
                        }],
                        "data": [],
                        "renderRow": function (nRow, aData, iDataIndex) {
                            if (!$scope.hasEIPOperateRight) {
                                return;
                            }
                            $("td:eq(1)", nRow).addTitle();
                            $("td:eq(2)", nRow).addTitle();
                            $("td:eq(3)", nRow).addTitle();
                            $("td:eq(4)", nRow).addTitle();
                            $("td:eq(5)", nRow).addTitle();
                            //下钻时传递参数
                            $("td:eq(0)", nRow).bind("click", function () {
                                $scope.elasticIPId = aData.id;
                            });
                            //操作列
                            var optColumn = "";
                            if (aData.resourceStatus === "BIND") {
                                if("UNBINDING" === aData.operateStatus || "BINDING" === aData.operateStatus || "UPDATING" === aData.bandwidthStatus){
                                    optColumn = "<span class='disabled'>" + i18n.common_term_unbond_button + "&nbsp;</span>";
                                }else{
                                    optColumn = "<a href='javascript:void(0)' ng-click='unBind()'>" + i18n.common_term_unbond_button + "&nbsp;</a>";
                                }
                            } else if (aData.resourceStatus === "UNBIND") {
                                if("UNBINDING" === aData.operateStatus || "BINDING" === aData.operateStatus || "UPDATING" === aData.bandwidthStatus){
                                    optColumn = "<span class='disabled'>" + i18n.vpc_term_bond_label + "&nbsp;</span> ";
                                }else{
                                    optColumn = "<a href='javascript:void(0)' ng-click='bind()'>" + i18n.vpc_term_bond_label + "&nbsp;</a> ";
                                }
                            }
                            if(!$scope.isSC){
                                if("BINDING" === aData.operateStatus||"UNBINDING" === aData.operateStatus || "UPDATING" === aData.bandwidthStatus){
                                    optColumn = optColumn + "<span class='disabled'> " + i18n.common_term_more_button + "</span>";
                                }else if((aData.bandObject !== "VPN" && !aData.privateIP) || $scope.routerType === 1){
                                    optColumn = optColumn + "<tiny-menubutton id='id' text='text' content='content'></tiny-menubutton>";
                                }
                            }
                            var optLink = $compile($(optColumn));
                            var optScope = $scope.$new();
                            optScope.unBind = function () {
                                unbindElasticIP(aData.id);
                            };
                            optScope.bind = function () {
                                bind(aData.id);
                            };
                            var modifyIPBWMenu = {
                                title: i18n.eip_term_modifyIPband_button,
                                id: "modifyIPBandwidthId",
                                click: function () {
                                    modifyIPBandwidth(aData.id);
                                }
                            };
                            var releaseEIPMenu = {
                                title: i18n.common_term_release_button,
                                id: "releaseElasticIPId",
                                click: function () {
                                    releaseIP(aData.id);
                                }
                            };
                            //1：硬件， 2：软件
                            if ($scope.routerType === 1) {
                                optScope.id = "elasticIPOptMore" + iDataIndex;
                                optScope.text = "<span class='btn-link'> " + i18n.common_term_more_button + "</span>";
                                //弹性IP绑定后不可以释放，判断绑定方法：1、私有IP不为空，2、绑定对象为VPN（由于绑定对象为VPN时私有IP为空）
                                if (aData.bandObject !== "VPN" && !aData.privateIP) {
                                    optScope.content = [modifyIPBWMenu, releaseEIPMenu];
                                } else {
                                    optScope.content = [modifyIPBWMenu];
                                }
                            } else if ($scope.routerType === 2) {
                                //弹性IP绑定后不可以释放，判断绑定方法：1、私有IP不为空，2、绑定对象为VPN（由于绑定对象为VPN时私有IP为空）
                                if (aData.bandObject !== "VPN" && !aData.privateIP) {
                                    optScope.id = "elasticIPOptMore" + iDataIndex;
                                    optScope.text = "<span class='btn-link'> " + i18n.common_term_more_button + "</span>";
                                    optScope.content = [releaseEIPMenu];
                                }
                            }
                            var optNode = optLink(optScope);
                            if (aData.bandObject !== "VPN") {
                                $("td:eq(8)", nRow).append(optNode);
                            }
                        },
                        "callback": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            $scope.operator.queryElasticIP();
                        },
                        "changeSelect": function (evtObj) {
                            page.currentPage = evtObj.currentPage;
                            page.displayLength = evtObj.displayLength;
                            $scope.operator.queryElasticIP();
                        }
                    };
                }
                //释放弹性IP
                function releaseIP(eipId) {
                    var deleteMsg = new Message({
                        "type": "prompt",
                        "title": i18n.common_term_confirm_label,
                        "content": i18n.eip_eip_release_info_confirm_msg,
                        "height": "120px",
                        "width": "350px",
                        "buttons": [{
                            "label": i18n.common_term_ok_button,
                            "accessKey": '2',
                            "key": "okBtn",
                            "default": true
                        }, {
                            "label": i18n.common_term_cancle_button,
                            "accessKey": '3',
                            "key": "cancelBtn",
                            "default": false
                        }]
                    });
                    deleteMsg.setButton("okBtn", function () {
                        $scope.operator.releaseElasticIP(eipId);
                        deleteMsg.destroy();
                    });
                    deleteMsg.setButton("cancelBtn", function () {
                        deleteMsg.destroy();
                    });
                    deleteMsg.show();
                }

                //解绑定弹性IP
                function unbindElasticIP(eipId) {
                    var unbindMsg = new Message({
                        "type": "prompt",
                        "title": i18n.common_term_confirm_label,
                        "content": i18n.lb_lb_unbondEIP_info_confirm_msg,
                        "height": "120px",
                        "width": "350px",
                        "buttons": [{
                            "label": i18n.common_term_ok_button,
                            "accessKey": '2',
                            "key": "okBtn",
                            "default": true
                        }, {
                            "label": i18n.common_term_cancle_button,
                            "accessKey": '3',
                            "key": "cancelBtn",
                            "default": false
                        }]
                    });
                    unbindMsg.setButton("okBtn", function () {
                        $scope.operator.unbind(eipId);
                        unbindMsg.destroy();
                    });
                    unbindMsg.setButton("cancelBtn", function () {
                        unbindMsg.destroy();
                    });
                    unbindMsg.show();
                }

                //绑定弹性IP
                function bind(eipId) {
                    $scope.params.eipId = eipId;
                    var options = "";
                    var win = "";
                    if ($scope.params.openstack) {
                        options = {
                            "winId": "bindElasticIPWindowId",
                            "params": $scope.params,
                            "title": i18n.vpc_term_bondEIP_label,
                            "height": "480px",
                            "width": "800px",
                            "content-type": "url",
                            "content": "app/business/network/views/eip/bindElasticIPByVM.html",
                            "buttons": null,
                            "close": function () {
                                $scope.operator.queryElasticIP();
                            }
                        };
                    } else {
                        var para = $scope.params;
                        para.vpcTypeShared = networkCommon && networkCommon.vpcTypeShared;
                        options = {
                            "winId": "bindElasticIPWindowId",
                            "params": para,
                            "title": i18n.vpc_term_bondEIP_label,
                            "height": "480px",
                            "width": "800px",
                            "content-type": "url",
                            "content": "app/business/network/views/eip/bindElasticIP.html",
                            "buttons": null,
                            "close": function () {
                                $scope.operator.queryElasticIP();
                            }
                        };
                    }
                    win = new Window(options);
                    win.show();
                }

                //修改IP带宽
                function modifyIPBandwidth(eipId) {
                    $scope.params.eipId = eipId;
                    var options = {
                        "winId": "modifyIpbwWindowId",
                        "params": $scope.params,
                        "title": i18n.eip_term_modifyIPband_button,
                        "height": "400px",
                        "width": "680px",
                        "content-type": "url",
                        "content": "app/business/network/views/eip/modifyIpbw.html",
                        "buttons": null,
                        "close": function () {
                            $scope.operator.queryElasticIP();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
                //ICT场景表格数据
                function dealIctTableData(item) {
                    item.detail = {
                        "contentType": "url",
                        "content": "app/business/network/views/eip/elasticIPDetail.html"
                    };
                    //绑定对象
                    if(item.usedType){
                        if (item.usedType.toUpperCase() === "VM" || item.usedType.toUpperCase() === "SLB") {
                            if (item.vmName !== null || item.nicName !== null) {
                                item.bandObject = item.vmName + ":" + item.nicName;
                            } else {
                                item.bandObject = "";
                            }
                            //绑定对象为VPN
                        } else if (item.usedType.toUpperCase() === "VPN") {
                            item.bandObject = "VPN";
                        } else if (item.usedType.toUpperCase() === "F5") {
                            item.bandObject = "F5";
                        } else if (item.usedType.toUpperCase() === "MANUAL_IP") {
                            item.bandObject = item.privateIP;
                        } else {
                            item.bandObject = "";
                        }
                    }else{
                        item.bandObject = "";
                    }

                    item.opt = "";
                }

                //FusionSphere场景表格数据
                function dealFspTableData(item) {
                    item.detail = {
                        "contentType": "url",
                        "content": "app/business/network/views/eip/elasticIPDetail.html"
                    };
                    //绑定状态
                    item.resourceStatusDis = resStatus(item.operateStatus);
                    //带宽修改状态
                    if (item.bandwidthStatus === "SUCCESS") {
                        item.bandwidthStatusDis = i18n.common_term_modifySucceed_value;
                    } else if (item.bandwidthStatus === "FAIL") {
                        item.bandwidthStatusDis = i18n.common_term_modifyFail_value;
                    } else if (item.bandwidthStatus === "UPDATING") {
                        item.bandwidthStatusDis = i18n.common_term_modifing_value;
                    } else {
                        item.bandwidthStatusDis = "";
                    }
                    //绑定对象
                    if(item.usedType){
                        if (item.usedType.toUpperCase() === "VM" || item.usedType.toUpperCase() === "SLB") {
                            if (item.vmName !== null || item.nicName !== null) {
                                item.bandObject = item.vmName + ":" + item.nicName;
                            } else {
                                item.bandObject = "";
                            }
                        } else if (item.usedType.toUpperCase() === "VPN") {
                            item.bandObject = "VPN";
                        } else if (item.usedType.toUpperCase() === "F5") {
                            item.bandObject = "F5";
                        } else if (item.usedType.toUpperCase() === "MANUAL_IP") {
                            item.bandObject = item.privateIP;
                        } else {
                            item.bandObject = "";
                        }
                    }else {
                        item.bandObject = "";
                    }
                    item.opt = "";
                }
                //ajax命令操作
                $scope.operator = {
                    //查询router类型：1:硬件; 2:软件
                    "queryRouter": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "azId": $scope.params.azId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId
                        };
                        var deferred = routerServiceIns.queryRouter(options);
                        deferred.then(function (data) {
                            if (!data || !data.routers || data.routers.length <= 0) {
                                hasRouter = false;
                            } else {
                                hasRouter = true;
                                $scope.routerType = data.routers[0].routerType;
                                $scope.operator.queryElasticIP();
                            }
                        });
                    },
                    //查询弹性IP列表
                    "queryElasticIP": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "limit": page.displayLength
                        };
                        if(!$scope.params.openstack) {
                            options.start = page.getStart();
                        }
                        else {
                            var length = markers.length;
                            options.start = markers[length-1] || null;
                        }
                        var deferred = eipServiceIns.queryElasticIP(options);
                        deferred.then(function (data) {
                            if (!data) {
                                return;
                            }
                            var elasticIPRes = data.elasticIPs;
                            //ICT场景
                            if ($scope.params.openstack) {
                                _.each(elasticIPRes, dealIctTableData);
                                $scope.eipTable.data = elasticIPRes;
                            } else {
                                _.each(elasticIPRes, dealFspTableData);
                                //router为软件类型，列表第三列显示“外部网络”，而非“公网IP池”
                                if ($scope.routerType === 2) {
                                    $scope.eipTable.columns = [{
                                        "sTitle": "",
                                        "mData": "detail",
                                        "sWidth": "40px",
                                        "bSortable": false
                                    }, {
                                        "sTitle": "IP",
                                        "mData": function (data) {
                                            return $.encoder.encodeForHTML(data.ip);
                                        },
                                        "bSortable": false
                                    }, {
                                        "sTitle": "ID",
                                        "sWidth": "20%",
                                        "mData": function (data) {
                                            return $.encoder.encodeForHTML(data.id);
                                        },
                                        "bSortable": false
                                    }, {
                                        "sTitle":i18n.vpc_term_bond_label,
                                        "mData": function (data) {
                                            return $.encoder.encodeForHTML(data.resourceStatusDis);
                                        },
                                        "bSortable": false
                                    }, {
                                        "sTitle": i18n.resource_term_externalNet_label,
                                        "mData": function (data) {
                                            return $.encoder.encodeForHTML(data.externalNetworkName);
                                        },
                                        "bSortable": false
                                    }, {
                                        "sTitle": i18n.vpc_term_bondObj_label,
                                        "mData": function (data) {
                                            return $.encoder.encodeForHTML(data.bandObject);
                                        },
                                        "bSortable": false
                                    }, {
                                        "sTitle": i18n.common_term_privateIP_label,
                                        "mData":  function (data) {
                                            return $.encoder.encodeForHTML(data.privateIP);
                                        },
                                        "bSortable": false
                                    }, {
                                        "sTitle": i18n.vpc_term_modifyBandStatus_label,
                                        "mData": "bandwidthStatusDis",
                                        "bSortable": false
                                    }, {
                                        "sTitle": i18n.common_term_operation_label,
                                        "mData": "opt",
                                        "bSortable": false
                                    }];
                                }
                                $scope.eipTable.data = elasticIPRes;
                            }
                            $scope.eipTable.totalRecords = data.total;
                            $scope.eipTable.displayLength = page.displayLength;
                            $("#network-vpcmanager-eiplist-listtable").widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });
                            if (!$scope.eipTable.data||($scope.eipTable.data.length < page.displayLength)) {
                                $scope.hasNextPage = false;
                            }
                            else {
                                $scope.hasNextPage = true;
                            }
                        });
                    },
                    "applyElasticIP": function () {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "maxRxBandwidth": "",
                            "maxTxBandwidth": "",
                            "ipPoolID": ""
                        };
                        var deferred = eipServiceIns.applyElasticIP(options);
                        deferred.then(function (data) {
                            new MessageService().okMsgBox(i18n.eip_eip_apply_info_succeed_msg);
                            $scope.operator.queryElasticIP();
                        });
                    },
                    //释放弹性IP
                    "releaseElasticIP": function (elasticIPId) {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "id": elasticIPId
                        };
                        var deferred = eipServiceIns.releaseElasticIP(options);
                        deferred.then(function (data) {
                            $scope.operator.queryElasticIP();
                        });
                    },
                    //解绑定弹性IP
                    "unbind": function (elasticIPId) {
                        var options = {
                            "cloudInfraId": $scope.params.cloudInfraId,
                            "vpcId": $scope.params.vpcId,
                            "vdcId": $scope.params.vdcId,
                            "userId": $scope.params.userId,
                            "id": elasticIPId
                        };
                        var deferred = eipServiceIns.unbindElasticIP(options);
                        deferred.then(function (data) {
                            $scope.operator.queryElasticIP();
                        });
                    }
                };

                //绑定状态
                function resStatus(code) {
                    var str = "";
                    switch (code) {
                    case "BINDING":
                        str = i18n.common_term_bonding_value;
                        break;
                    case "BIND_SUCCESS":
                        str = i18n.common_term_bonded_value;
                        break;
                    case "BIND_FAILED":
                        str = i18n.common_term_noBond_value;
                        break;
                    case "BIND_FAILED_ROLLBACK":
                        str = i18n.eip_term_bondFailClear_label;
                        break;
                    case "UNBINDING":
                        str = i18n.common_term_unbond_value;
                        break;
                    case "UNBIND_SUCCESS":
                        str = i18n.common_term_noBond_value;
                        break;
                    case "UNBIND_FAILED":
                        str = i18n.common_term_bonded_value;
                        break;
                    case "UNBIND_FAILED_FORCE_UNBIND":
                        str = i18n.common_term_unbondingForcely_value;
                        break;
                    case "FREEZING":
                        str = i18n.common_term_freezing_value;
                        break;
                    case "FREEZE_SUCCESS":
                        str = i18n.common_term_freezeSucceed_value;
                        break;
                    case "FREEZE_FAILED":
                        str = i18n.common_term_freezeFail_value;
                        break;
                    case "UNFREEZING":
                        str = i18n.common_term_unfreezing_value;
                        break;
                    case "UNFREEZE_SUCCESS":
                        str = i18n.common_term_unfreezeSucceed_value;
                        break;
                    case "UNFREEZE_FAILED":
                        str = i18n.common_term_unfreezeFail_value;
                        break;
                    default:
                        str = i18n.common_term_noBond_value;
                        break;
                    }
                    return str;
                }
                $scope.$on("$viewContentLoaded", function () {
                    $scope.operator.queryRouter();
                });
            }
        ];
        return eipListCtrl;
    });
