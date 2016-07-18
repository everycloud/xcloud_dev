define([
    "sprintf",
    'tiny-lib/jquery',
    'tiny-lib/angular',
    "tiny-lib/angular-sanitize.min",
    "language/keyID",
    'tiny-lib/underscore',
    'app/services/httpService',
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    'app/business/ecs/services/vm/queryVmService',
    'app/business/ecs/services/vm/vmNicService',
    'app/business/ecs/services/vm/vmCommonService',
    'app/services/competitionConfig',
    'tiny-widgets/Window',
    'tiny-widgets/Message'
], function (sprintf, $, angular,ngSanitize, keyIDI18n, _, http, validator, exception, capacityService, queryVmService, vmNicService, vmCommonService, competitionConfig, Window, Message) {
    "use strict";

    var nicsCtrl = ["$scope", "$compile", "$q", "camel", "exception",
        function ($scope, $compile, $q, camel, exception) {
            // 公共参数和服务
            var nicWindow = $("#ecsVmsNicDetailWinId").widget();
            var vmId = nicWindow.option("vmId");
            var cloudInfra = nicWindow.option("cloudInfra");
            var vpcId = nicWindow.option("vpcId");
            var status = nicWindow.option("status");
            var user = $("html").scope().user || {};
            $scope.ICT = user.cloudType === "ICT";
            $scope.vmwareICT = competitionConfig.isBaseOnVmware; // ICT 对接VMWARE场景 网卡进入退出安全组需要屏蔽掉

            var queryVmServiceIns = new queryVmService(exception, $q, camel);
            var vmNicServiceIns = new vmNicService(exception, $q, camel);
            var capacityServiceIns = new capacityService($q, camel);
            var vmCommonServiceIns = new vmCommonService();
            keyIDI18n.sprintf = sprintf.sprintf;
            $scope.i18n = keyIDI18n;
            var i18n = $scope.i18n;
            // 权限控制
            $scope.hasVmBasicOperateRight = _.contains(user.privilegeList, "616000"); // 启动、重启、关闭、强制重启、强制关闭、修改

            // 允许操作的状态
            var allowStatus = {
                "add": ["running", "stopped"],
                "modify": ["stopped"],
                "delete": ["running", "stopped"]
            };

            var supportModifyNic = "false";
            var supportWin = "false";

            // 是否重新加载网卡列表
            $scope.reloadVmNics = false;

            $scope.add = {
                "id": "ecsVmDetailNicsAdd",
                "text": i18n.common_term_add_button,
                "disable": !isStatusOk(status, "add"),
                "click": function () {
                    $scope.reloadVmNics = false;
                    var options = {
                        "winId": "ecsVmsDetailAddNicWinId",
                        "vmId": vmId,
                        "vpcId": vpcId,
                        "cloudInfra": cloudInfra,
                        "title": i18n.vm_term_addNIC_button,
                        "width": "800px",
                        "height": "450px",
                        "modal": true,
                        "content-type": "url",
                        "content": $scope.ICT ? "app/business/ecs/views/vm/nic/addNicICT.html" : "app/business/ecs/views/vm/nic/addNic.html",
                        "buttons": null,
                        "close": function (event) {
                            if ($scope.reloadVmNics) {
                                getVmNics();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
            };

            $scope.refresh = {
                "id": "ecsVmDetailDisksRefresh",
                "click": function () {
                    getVmNics();
                }
            };

            $scope.nics = {
                "id": "ecsVmDetailNicsTable",
                "enablePagination": false,
                "draggable": true,
                "showDetail": true,
                "columns": [{
                    "sTitle": "",
                    "mData": "",
                    "bSortable": false,
                    "sWidth": 40
                },{
                    "sTitle": i18n.common_term_NIC_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.name);
                    },
                    "bSortable": false
                },  {
                    "sTitle": i18n.vpc_term_netName_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.networkName);
                    },
                    "bSortable": false
                }, {
                    "sTitle": "MAC",
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.mac);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_IP_label,
                    "mData": function (data) {
                        return $.encoder.encodeForHTML(data.allIp);
                    },
                    "bSortable": false
                }, {
                    "sTitle": i18n.common_term_operation_label,
                    "mData": "",
                    bSortable: false
                }],
                "data": [],
                "renderRow": function (nRow, aData, iDataIndex) {
                    $(nRow).attr("lineNum", $.encoder.encodeForHTML("" + iDataIndex));
                    $(nRow).attr("infraId", $.encoder.encodeForHTML("" + cloudInfra.id));
                    $(nRow).attr("vpcId", $.encoder.encodeForHTML("" + vpcId));
                    $(nRow).attr("vmId", $.encoder.encodeForHTML("" + vmId));
                    $(nRow).attr("nicId", $.encoder.encodeForHTML("" + aData.nicId));
                    $(nRow).attr("networkType", $.encoder.encodeForHTML("" + aData.networkType));
                    $(nRow).attr("ipCheckResult", $.encoder.encodeForHTML("" + aData.ipCheckResult));
                    $(nRow).attr("eip", $.encoder.encodeForHTML("" + aData.elasticIp));
                    $(nRow).attr("sg", $.encoder.encodeForHTML("" + aData.sgName));
                    // tips
                    $("td:eq(1)", nRow).addTitle();
                    $("td:eq(2)", nRow).addTitle();
                    $("td:eq(3)", nRow).addTitle();
                    $("td:eq(4)", nRow).addTitle();
                    // 网络详情
                    $("td:eq(2)", nRow).html("<p class='btn-link'>" + $.encoder.encodeForHTML(aData.networkName) + "</p>");
                    $("td:eq(2)", nRow).bind("click", function () {
                        netDetailWindow({
                            "networkId": aData.networkId,
                            "vpcId": vpcId,
                            "cloudInfraId": cloudInfra.id,
                            "supportWin": supportWin
                        });
                    });

                    //操作列
                    if (!$scope.hasVmBasicOperateRight) {
                        return;
                    }
                    var menus = '<span class="dropdown" style="position: static">' +
                        '<a class="btn-link dropdown-toggle" data-toggle="dropdown">' + i18n.common_term_more_button + '<b class="caret"></b></a>' +
                        '<ul class="dropdown-menu pull-right vmOptWidth" role="menu" aria-labelledby="dLabel">';
                    if (supportModifyNic === "true") {
                        menus += isStatusOk(status, "modify") ? "<li><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a></li>" : "<li class='disabled'><a>" + i18n.common_term_modify_button + "</a></li>";
                        menus += "<li><a class='btn-link' ng-click='configFloatIp()'>" + i18n.common_term_setFloatIP_button + "</a></li>";
                    } else {
                        menus += "<li><a class='btn-link' ng-click='modifyIp()'>" + i18n.vm_term_modifyIP_button + "</a></li>";
                    }

                    if (!$scope.vmwareICT) {
                        if(!$scope.ICT && aData.sgInfo){
                            menus += "<li class='disabled'><a class='btn-link'>" + i18n.vm_term_addToSecurGroup_button + "</a></li>";
                        }
                        else{
                            menus += "<li><a class='btn-link' ng-click='enterSg()'>" + i18n.vm_term_addToSecurGroup_button + "</a></li>";
                        }
                        if(aData.sgInfo){
                            menus += "<li><a class='btn-link' ng-click='exitSg()'>" + i18n.security_term_quitSecuGroup_button + "</a></li>";
                        }
                        else{
                            menus += "<li class='disabled'><a class='btn-link'>" + i18n.security_term_quitSecuGroup_button + "</a></li>";
                        }
                    }

                    menus += '</ul></span>';
                    var delOpt;

                    if ($scope.vmwareICT) {
                        delOpt = "<span class='disabled'>" + i18n.common_term_delete_button + "</span>";
                    }
                    else {
                        delOpt = isStatusOk(status, "delete") ? "<a class='btn-link' ng-click='delete()'>" + i18n.common_term_delete_button + "</a>" : "<span class='disabled'>" + i18n.common_term_delete_button + "</span>";
                    }

                    var optColumn = "<div>" + delOpt + "&nbsp;&nbsp;&nbsp;" + menus + "</div>";
                    var optLink = $compile($(optColumn));
                    var optScope = $scope.$new();
                    optScope["delete"] = function () {
                        deleteNicConfirm(aData.nicId);
                    };
                    optScope.modify = function () {
                        modifyNic(aData.nicId, aData.name);
                    };
                    optScope.configFloatIp = function () {
                        configNicFloatIp(aData.nicId);
                    };
                    optScope.modifyIp = function () {
                        modifyIpAddress(aData.nicId);
                    };
                    optScope.enterSg = function () {
                        addNic2Sg(aData.nicId,aData.sgInfo);
                    };
                    optScope.exitSg = function () {
                        exitSecurityGroupConfirm(aData.nicId, aData.sgId);
                    };
                    var optNode = optLink(optScope);
                    $("td:eq(5)", nRow).html(optNode);
                    optNode.find('.dropdown').dropdown();
                    optNode.find('.dropdown-toggle').dropdown();
                }
            };

            //获取安全组名称，ICT下可能有多个安全组
            var getSgName = function (sgInfoArr) {
                var sgName = "";
                if (sgInfoArr && sgInfoArr.length > 0) {
                    _.each(sgInfoArr, function (item) {
                        sgName = sgName + item.sgName + "; ";
                    });
                    sgName = sgName.substring(0, sgName.length - 2);
                }
                return sgName;
            };
            // 查询虚拟机网卡列表
            function getVmNics() {
                var options = {
                    "user": user,
                    "vmId": vmId,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId
                };
                if($scope.ICT){
                    options.detailLevel = 8;
                }
                var defer = queryVmServiceIns.queryVmDetail(options);
                defer.then(function (data) {
                    if (!data || !data.vm) {
                        return;
                    }
                    _.each(data.vm.nics, function (item) {
                        item.detail = {
                            contentType: "url", // simple & url
                            content: "app/business/ecs/views/vm/nic/nicDetail.html"
                        };
                        item.allIp = vmCommonServiceIns.packIp(item.ip, item.ipv6s);
                        item.elasticIp = vmCommonServiceIns.packElasticIps(item.floatIps);
                        item.sgName = getSgName(item.sgInfo);
                        //只有在IT场景下使用，IT场景网卡只能绑定一个安全组
                        if (item.sgInfo && item.sgInfo.length > 0) {
                            item.sgId = item.sgInfo[0].sgId;
                        }
                    });
                    $scope.nics.data = data.vm.nics;
                });
            }

            // 修改网卡
            function modifyNic(nicId, nicName) {
                $scope.reloadVmNics = false;
                var options = {
                    "winId": "ecsVmsDetailModNicWinId",
                    "vmId": vmId,
                    "vpcId": vpcId,
                    "nicId": nicId,
                    "nicName": nicName,
                    "cloudInfra": cloudInfra,
                    "title": i18n.vm_term_modifyNIC_button,
                    "width": "800px",
                    "height": "450px",
                    "modal": true,
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/nic/modNic.html",
                    "buttons": null,
                    "close": function (event) {
                        if ($scope.reloadVmNics) {
                            getVmNics();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            // 配置浮动ip
            function configNicFloatIp(nicId, nicName) {
                $scope.reloadVmNics = false;
                var options = {
                    "winId": "ecsVmsDetailconfigNicFloatIpWinId",
                    "vmId": vmId,
                    "nicId": nicId,
                    "cloudInfra": cloudInfra,
                    "title": i18n.common_term_setFloatIP_button,
                    "width": "340px",
                    "height": "180px",
                    "modal": true,
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/nic/configFloatIp.html",
                    "buttons": null,
                    "close": function (event) {
                        if ($scope.reloadVmNics) {
                            getVmNics();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            // 修改IP地址
            function modifyIpAddress(nicId)
            {
                var  winParam = {
                    "needRefresh": false,
                    "vmId": vmId,
                    "nicId": nicId,
                    "cloudInfraId": cloudInfra.id,
                    "vpcId": vpcId
                };
                var options = {
                    "winId": "ecsVmsDetailModNicIpWinId",
                    "winParam": winParam,
                    title: i18n.vm_term_modifyIP_button,
                    width: "418px",
                    height: "180px",
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/nic/modIpAddress.html",
                    "buttons": null,
                    "close": function (event) {
                        if (winParam.needRefresh) {
                            getVmNics();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            // 加入安全组
            function addNic2Sg(nicId,sgInfo) {
                $scope.reloadVmNics = false;
                var options = {
                    "winId": "ecsVmsDetailAddNic2SgWinId",
                    "vmId": vmId,
                    "nicId": nicId,
                    "vpcId": vpcId,
                    "cloudInfra": cloudInfra,
                    "sgInfo":sgInfo,
                    "title": i18n.vm_term_addToSecurGroup_button,
                    "width": "800px",
                    "height": "450px",
                    "modal": true,
                    "content-type": "url",
                    "content": "app/business/ecs/views/vm/nic/addNic2Sg.html",
                    "buttons": null,
                    "close": function (event) {
                        if ($scope.reloadVmNics) {
                            getVmNics();
                        }
                    }
                };
                var win = new Window(options);
                win.show();
            }

            // 删除网卡确认框
            function deleteNicConfirm(nicId) {
                var options = {
                    "type": "confirm",
                    "content": i18n.vm_nic_del_info_confirm_msg,
                    "height": "120px",
                    "width": "330px",
                    "buttons": [{
                        label: i18n.common_term_ok_button,
                        "default": true,
                        majorBtn : true,
                        "handler": function (event) {
                            msg.destroy();
                            deleteNic(nicId);
                        }
                    }, {
                        label: i18n.common_term_cancle_button,
                        "handler": function (event) {
                            msg.destroy();
                        }
                    }]
                };
                var msg = new Message(options);
                msg.show();
            }

            // 删除网卡
            function deleteNic(nicId) {
                var defer = vmNicServiceIns.deleteVmNic({
                    "user": user,
                    "vmId": vmId,
                    "nicId": nicId,
                    "vpcId": vpcId,
                    "cloudInfraId": cloudInfra.id
                });
                defer.then(function (data) {
                    getVmNics();
                });
            }

            // 是否状态运行操作
            function isStatusOk(status, operate) {
                var allow = _.find(allowStatus[operate], function (item) {
                    return item === status;
                });
                return !!allow;
            }

            //退出安全组
            function exitSecurityGroupConfirm(nicId, sgId) {
                //ICT场景
                var options;
                if (supportModifyNic === "false") {
                    $scope.reloadVmNics = false;
                    options = {
                        "winId": "ecsVmsDetailExitSgFromNicWinId",
                        "vmId": vmId,
                        "nicId": nicId,
                        "vpcId": vpcId,
                        "cloudInfra": cloudInfra,
                        "title": i18n.security_term_quitSecuGroup_button,
                        "width": "360px",
                        "height": "200px",
                        "modal": true,
                        "content-type": "url",
                        "content": "app/business/ecs/views/vm/nic/exitSgFromNic.html",
                        "buttons": null,
                        "close": function (event) {
                            if ($scope.reloadVmNics) {
                                getVmNics();
                            }
                        }
                    };
                    var win = new Window(options);
                    win.show();
                }
                //IT场景
                else {
                    options = {
                        "type": "confirm",
                        "content": i18n.security_group_moveNIC_info_confirm_msg,
                        "height": "120px",
                        "width": "330px",
                        "buttons": [{
                            label: i18n.common_term_ok_button,
                            "default": true,
                            majorBtn : true,
                            "handler": function (event) {
                                msg.destroy();
                                exitSecurityGroup(nicId, sgId);
                            }
                        }, {
                            label: i18n.common_term_cancle_button,
                            "handler": function (event) {
                                msg.destroy();
                            }
                        }]
                    };
                    var msg = new Message(options);
                    msg.show();
                }
            }

            // 退出安全组
            function exitSecurityGroup(nicId, sgId) {
                var defer = vmNicServiceIns.exitSecurityGroup({
                    "user": user,
                    "vmId": vmId,
                    "nicId": nicId,
                    "sgId": sgId,
                    "vpcId": vpcId,
                    "cloudInfraId": cloudInfra.id
                });
                defer.then(function (data) {
                    getVmNics();
                });
            }

            function netDetailWindow(options) {
                var newWindow = new Window({
                    "winId": "netDetailWindow",
                    "title": i18n.vpc_term_net_label,
                    "options": options,
                    "content-type": "url",
                    "buttons": null,
                    "content": "app/business/ecs/views/vm/nic/networkDetail.html",
                    "height": 520,
                    "width": 800
                });
                newWindow.show();
            }

            // 查询支持的能力字段
            function queryCapacity() {
                var capacity = capacityServiceIns.querySpecificCapacity($("html").scope().capacities, cloudInfra.type, cloudInfra.version);
                if (capacity) {
                    supportModifyNic = capacity.vm_support_modify_nic;
                    supportWin = capacity.network_support_win_server;
                }
            }

            //获取初始数据
            queryCapacity();
            getVmNics();
        }
    ];

    var nicsModule = angular.module("ecs.vm.detail.nics", ['ng', "wcc", "ngSanitize"]);
    nicsModule.controller("ecs.vm.detail.nics.ctrl", nicsCtrl);
    nicsModule.service("camel", http);
    nicsModule.service("ecs.vm.detail.nics.validator", validator);
    nicsModule.service("exception", exception);

    return nicsModule;
});
