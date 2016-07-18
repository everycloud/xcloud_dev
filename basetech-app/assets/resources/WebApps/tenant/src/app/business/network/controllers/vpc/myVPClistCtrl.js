/*global define*/
define([
    'tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    "app/services/cloudInfraService",
    "app/services/messageService",
    "app/business/network/services/vpc/vpcService",
    "app/business/network/services/networkService",
    "bootstrap/bootstrap.min",
    "tiny-directives/Table",
    "fixtures/network/vpcFixture"
], function ($, angular, _, Window, cloudInfraService, messageService, vpcService, networkService) {
    "use strict";

    return ["$scope", "$compile", "$q", "camel", "$state", "networkCommon", "exception", "storage", function ($scope, $compile, $q, camel, $state, networkCommon, exception, storage) {
        var i18n = $scope.i18n;

        $scope.cloudInfraId = (networkCommon && networkCommon.cloudInfraId);
        networkCommon.vpcTypeShared = false;

        var vpcServiceIns = new vpcService(exception, $q, camel);
        var cloudInfraServiceIns = new cloudInfraService($q, camel);
        var networkInstance = new networkService(exception, $q, camel);

        var user = $scope.user;
        var VPC_OPERATE = "556000";
        var privilegeList = user.privilegeList;
        $scope.hasVpcOperateRight = _.contains(privilegeList, VPC_OPERATE);

        $scope.openstack = user.cloudType === "ICT";

        // default vdcQuota
        var vdcQuota = {"CPU": -1, "MEMORY": -1, "STORAGE": -1, "EIP": -1, "SEG": -1, "VM": -1};
        // 修改VPC配额上下限默认参数
        var modifyQuotaParam = {vm: {}, cpu: {}, mem: {}, storage: {}, net: {}, eip: {}, sg: {}};
        // -1表示不限制
        var UNLIMITED = -1;
        //最大配额
        var MAXQUATO = 2147483648
        // VPCSpec参数
        var vpcSpec = {};
        var vpcQuota = {};

        //当前页码信息
        var page = {
            "currentPage": 1,
            "displayLength": 10,
            "getStart": function () {
                return page.currentPage === 0 ? 0 : (page.currentPage - 1) * page.displayLength;
            }
        };
        $scope.createBtn = {
            "id": "networkVpcCreate",
            "text": i18n.vpc_term_createVPC_button,
            "click": function () {
                $state.go("network.createVPC.navigate", {
                    "azId": networkCommon.azId
                });
            }
        };
        $scope.type = {
            "id": "networkVPCType",
            "width": "120",
            "values": [
                {
                    "selectId": "1",
                    "label": i18n.vpc_term_myVPC_label,
                    "checked": true
                },
                {
                    "selectId": "2",
                    "label": i18n.common_term_shareVPC_label
                }
            ],
            "change": function () {
                $scope.cloudInfraId = $("#networkVPCType").widget().getSelectedId();
                page.currentPage = 1;
                getVPCList();
                $("#networkVpcListTable").widget().option("cur-page", {
                    "pageIndex": 1
                });
            }
        };

        $scope.searchLocation = {
            "id": "networkVPCSearchLocation",
            "width": "120",
            "values": [],
            "change": function () {
                $scope.cloudInfraId = $("#networkVPCSearchLocation").widget().getSelectedId();
                networkCommon.cloudInfraId = $scope.cloudInfraId;
                page.currentPage = 1;
                getVPCList();
                $("#networkVpcListTable").widget().option("cur-page", {
                    "pageIndex": 1
                });
                storage.add("cloudInfraId", $scope.cloudInfraId);
            }
        };
        $scope.refresh = {
            "click": function () {
                getVPCList();
            }
        };

        $scope.help = {
            "helpKey": "drawer_vpc_org",
            "show": false,
            "i18n": $scope.urlParams.lang,
            "click": function () {
                $scope.help.show = true;
            }
        };

        // ICT场景 VPC不感知AZ
        var columnDatas = $scope.openstack ? [
            {
                "sTitle": i18n.common_term_name_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.name);
                },
                "bSortable": false
            },
            {
                "sTitle": "VPC ID",
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.vpcID);
                },
                "bSortable": false
            },
            {
                "sTitle": i18n.common_term_desc_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.description);
                },
                "bSortable": false
            },
            {
                "sTitle": i18n.common_term_operation_label,
                "mData": "opt",
                "bSortable": false
            }
        ] : [
            {
                "sTitle": i18n.common_term_name_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.name);
                },
                "bSortable": false
            },
            {
                "sTitle": "VPC ID",
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.vpcID);
                },
                "bSortable": false
            },
            {
                "sTitle": i18n.common_term_desc_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.description);
                },
                "bSortable": false
            },
            {
                "sTitle": i18n.resource_term_AZ_label,
                "mData": function (data) {
                    return $.encoder.encodeForHTML(data.azIDsMapNames);
                },
                "bSortable": false
            },
            {
                "sTitle": i18n.common_term_operation_label,
                "mData": "opt",
                "bSortable": false
            }
        ];
        $scope.vpcModel = {
            "id": "networkVpcListTable",
            "enablePagination": true,
            "paginationStyle": "full_numbers",
            "totalRecords": 0,
            "displayLength": 10,
            "lengthMenu": [10, 20, 30],
            "columns": columnDatas,
            "data": [],
            "callback": function (evtObj) {
                page.currentPage = evtObj.currentPage;
                page.displayLength = evtObj.displayLength;
                getVPCList();
            },
            "changeSelect": function (evtObj) {
                page.currentPage = evtObj.currentPage;
                page.displayLength = evtObj.displayLength;
                getVPCList();
            },
            "renderRow": function (nRow, aData) {
                var optScope = $scope.$new();
                optScope.modify = function () {
                    var options = {
                        "winId": "modifyVpcWindow",
                        title: i18n.vpc_term_modifyVPC_button,
                        rowData: aData,
                        cloudInfraId: networkCommon.cloudInfraId,
                        height: "250px",
                        width: ($scope.urlParams.lang == "zh"? "520px": "620px"),
                        "content-type": "url",
                        "content": "app/business/network/views/vpc/modifyVpcWindow.html",
                        "buttons": null,
                        "close": function () {
                            getVPCList();
                        }
                    };
                    var win = new Window(options);
                    win.show();
                };
                optScope.remove = function () {
                    delVPC(aData.vpcID);
                };
                optScope.goDetail = function () {
                    if (networkCommon) {
                        networkCommon.vpcId = aData.vpcID;
                        networkCommon.vpcName = aData.name;
                    }
                    //创VPC的接口支持选多个AZ，网络也需要支持选AZ 目前：创VPC单选，网络默认第一个AZ
                    if (aData.azId && aData.azId.length && (aData.azId.length > 0)) {
                        if (networkCommon) {
                            networkCommon.azId = aData.azId;
                        }
                    }
                    if (aData.networkProvider === 1) {
                        $state.go("network.vmwareVpc.network", {
                            "vpcName": aData.name,
                            "cloud_infras": $scope.cloudInfraId,
                            "vpcId": aData.vpcID,
                            "azId": aData.azId
                        });
                    } else {
                        $state.go("network.vpcmanager.summary", {
                            "vpcName": aData.name,
                            "cloud_infras": $scope.cloudInfraId,
                            "vpcId": aData.vpcID,
                            "azId": aData.azId
                        });
                    }
                };
                optScope.curCloudId = aData.azId;

                //链接
                var link = "<a class='btn-link' ng-click='goDetail()'>" + $.encoder.encodeForHTML(aData.name) + "</a> ";
                var nameLink = $compile(link);
                var linkNode = nameLink(optScope);
                $("td:eq(0)", nRow).html(linkNode);

                if (!$scope.hasVpcOperateRight) {
                    return;
                }
                // 操作
                var opt = "";
                //ICT列表中需要有修改配额操作
                if ($scope.openstack) {
                    var submenus = '<span class="dropdown margin-horizon-beautifier" style="position: static">';
                    submenus += '<a class="btn-link dropdown-toggle" data-toggle="dropdown" href="#">' + i18n.common_term_more_button + '<b class="caret"></b></a>';
                    submenus += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">';
                    submenus += '<li><a class="btn-link" ng-click="modify()">' + i18n.common_term_modify_button + '</a></li>';
                    submenus += '<li><a class="btn-link" ng-click="remove()">' + i18n.common_term_delete_button + '</a></li>' + '</ul></span>';
                    // 操作
                    opt = "<div><a class='btn-link margin-right-beautifier' ng-click='modifyQuota()'>" + i18n.vpc_term_modifyQuota_button + "</a>" + submenus + "</div>";
                } else{
                    opt = "<div><a class='btn-link' ng-click='modify()'>" + i18n.common_term_modify_button + "</a><a class='margin-horizon-beautifier btn-link' ng-click='remove()'>" + i18n.common_term_delete_button + "</a> </div>";
                }

                optScope.modifyQuota = function () {
                    var params = {
                        "cloudInfraId": $scope.cloudInfraId,
                        "vdcId": user.vdcId,
                        "userId": user.id,
                        "vpcId": aData.vpcID
                    };

                    var vpcQuotaPromise = $scope.getVpcQuota(params);
                    var vpcPromise = $scope.getVpcSpec(params);
                    var vdcQuotaPromise = $scope.getVdcQuota(params);

                    $.when(vpcQuotaPromise, vpcPromise, vdcQuotaPromise).done(function () {
                        /**上下限配置规格：
                         * 下限 = 当前VPC的资源使用量
                         * 上限 = 当前VPC所属VDC的剩余配额+当前VPC规格
                         *
                         * 1、其中当前VPC使用量 和 当前VPC配额 从vpcQuota中获取
                         * 2、VPC规格 通过查询单个VPC中获取
                         * 3、当前VPC所属VDC的剩余配额从VDC提供的接口中获取
                         */
                        var vmData = vpcQuota.vm;
                        modifyQuotaParam.vm.inUse = vmData.inUse > 0 ? vmData.inUse:1;
                        modifyQuotaParam.vm.limit = vdcQuota.VM === UNLIMITED ? UNLIMITED : (((vdcQuota.VM + vpcSpec.maxVMNum) >= MAXQUATO) ? (MAXQUATO - 1) : (vdcQuota.VM + vpcSpec.maxVMNum));

                        // CPU核数
                        var cpuData = vpcQuota.vCPU;
                        modifyQuotaParam.cpu.inUse = cpuData.inUse > 0 ? cpuData.inUse : 1;
                        modifyQuotaParam.cpu.limit = vdcQuota.CPU === UNLIMITED ? UNLIMITED : (((vdcQuota.CPU + vpcSpec.maxVCPUNum) >= MAXQUATO)?(MAXQUATO - 1) : (vdcQuota.CPU + vpcSpec.maxVCPUNum)) ;

                        // 内存
                        var memData = vpcQuota.memoryCapacity;
                        modifyQuotaParam.mem.inUse = memData.inUse > 0 ? memData.inUse : 1;
                        modifyQuotaParam.mem.limit = vdcQuota.MEMORY === UNLIMITED ? UNLIMITED : (((vdcQuota.MEMORY + vpcSpec.maxMemoryCapacity) >=MAXQUATO) ? (MAXQUATO - 1) : (vdcQuota.MEMORY + vpcSpec.maxMemoryCapacity));

                        // 存储
                        var storageData = vpcQuota.storageCapacity;
                        modifyQuotaParam.storage.inUse = storageData.inUse > 0 ? storageData.inUse : 1;
                        modifyQuotaParam.storage.limit = vdcQuota.STORAGE === UNLIMITED ? UNLIMITED : (((vdcQuota.STORAGE + vpcSpec.maxStorageCapacity) >=MAXQUATO) ? (MAXQUATO-1) : (vdcQuota.STORAGE + vpcSpec.maxStorageCapacity));

                        // 网络使用(VDC没有对网络的限制，直接取VPC配额)
                        var netData = vpcQuota.routedNetwork;
                        modifyQuotaParam.net.inUse = netData.inUse;
                        modifyQuotaParam.net.limit = 200;

                        // 弹性IP,上限如果不限默认为200
                        var eipData = vpcQuota.publicIp;
                        modifyQuotaParam.eip.inUse = eipData.inUse > 0 ? eipData.inUse : 1;
                        modifyQuotaParam.eip.limit = vdcQuota.EIP === UNLIMITED ? 200 : (((vdcQuota.EIP + vpcSpec.maxPublicIpNum) > 200) ? 200 : (vdcQuota.EIP + vpcSpec.maxPublicIpNum));

                        // 安全组个数，上限如果不限默认为500
                        var sgData = vpcQuota.securityGroup;
                        modifyQuotaParam.sg.inUse = sgData.inUse;
                        modifyQuotaParam.sg.limit = vdcQuota.SEG === UNLIMITED ? 500 : (((vdcQuota.SEG + vpcSpec.maxSecurityGroupNum) >500) ? 500 : (vdcQuota.SEG + vpcSpec.maxSecurityGroupNum)) ;

                        var options = {
                            "winId": "modifyQuotaWindow",
                            title: i18n.vpc_term_modifyQuota_button,
                            "param": {
                                quotaInfo: modifyQuotaParam,
                                options: params,
                                vpcSpec: vpcSpec
                            },
                            height: "440px",
                            width: ($scope.urlParams.lang == "zh"? "560px": "700px"),
                            "content-type": "url",
                            "content": "app/business/network/views/modifyVpcQuota.html",
                            "buttons": null,
                            "close": function () {
                                getVPCList();
                            }
                        };
                        var win = new Window(options);
                        win.show();
                    });
                };

                var optLink = $compile(opt);
                var optNode = optLink(optScope);
                $("td:eq(0)", nRow).addTitle();
                $("td:eq(1)", nRow).addTitle();
                $("td:eq(2)", nRow).addTitle();
                if ($scope.openstack) {
                    $("td:eq(3)", nRow).append(optNode);
                    optNode.find('.dropdown').dropdown();
                } else {
                    $("td:eq(4)", nRow).append(optNode);
                }
            }
        };

        $scope.getVpcSpec = function (options) {
            var retDefer = $.Deferred();
            var deferred = vpcServiceIns.getVpc(options);
            deferred.then(function (data) {
                if (!data || !data.vpcSpecTemplate) {
                    retDefer.reject(data);
                    return;
                }
                vpcSpec = data.vpcSpecTemplate;
                retDefer.resolve();
            });
            return retDefer.promise();
        };
        $scope.getVpcQuota = function (options) {
            var retDefer = $.Deferred();
            var deferred = networkInstance.queryVpcQuota(options);
            deferred.then(function (data) {
                if (!data) {
                    retDefer.reject(data);
                    return;
                }
                vpcQuota = data;
                retDefer.resolve();
            });
            return retDefer.promise();
        };
        $scope.getVdcQuota = function (options) {
            var retDefer = $.Deferred();
            var deferred = networkInstance.queryVdcQuota(options);
            deferred.then(function (data) {
                if (!data || !data.quotaDistribution) {
                    retDefer.reject(data);
                    return;
                }
                // allQuota为true，表示所有都不限制；此时后台quotaInfo字段为null
                if (data.allQuota) {
                    retDefer.resolve();
                    return;
                }
                //vdcQuota = {CPU: 500, MEMORY: 200, STORAGE: 200, EIP: 300, SEG: 300…};
                _.each(data.quotaInfo, function (total) {
                    _.each(data.quotaDistribution, function (left) {
                        if (total.quotaName === left.quotaName) {
                            vdcQuota[total.quotaName] = total.limit - left.limit;
                        }
                    });
                });
                retDefer.resolve();
            });
            return retDefer.promise();
        };

        //删除VPC
        function delVPC(vpcId) {
            var promise = vpcServiceIns.deleteVpc({
                vdcId: $scope.user.vdcId,
                vpcId: vpcId,
                userId: $scope.user.id,
                cloudInfraId: $scope.cloudInfraId
            });
            promise.then(function () {
                getVPCList();
            });
        }

        //查询当前租户可见的地域列表
        function getLocations() {
            var retDefer = $q.defer();
            var deferred = cloudInfraServiceIns.queryCloudInfras($scope.user.vdcId, $scope.user.id);
            deferred.then(function (data) {
                if (data.cloudInfras && data.cloudInfras.length > 0) {
                    var currId = cloudInfraServiceIns.getUserSelCloudInfra(data.cloudInfras).selectId;
                    networkCommon.cloudInfraId = currId;
                    $scope.cloudInfraId = currId;
                    $scope.searchLocation.values = data.cloudInfras;
                    retDefer.resolve();
                }
                retDefer.reject();
            }, function (rejectedValue) {
                retDefer.reject(rejectedValue);
            });
            return retDefer.promise;
        }

        //获取VPC列表
        function getVPCList() {
            if (!$scope.cloudInfraId) {
                return;
            }
            var deferred = vpcServiceIns.getVpcList({
                "vdc_id": $scope.user.vdcId,
                "cloudInfraId": $scope.cloudInfraId,
                "start": page.getStart(),
                "limit": page.displayLength,
                "userId": $scope.user.id,
                "shared": false
            });

            deferred.then(function (data) {
                if (!data) {
                    return;
                }
                _.each(data.vpcs, function (vpc) {
                    _.extend(vpc, {
                        "opt": "",
                        "azIDsMapNames": $scope.openstack ? "" : vpc.availableZone[0].name,
                        "azId": $scope.openstack ? "" : vpc.availableZone[0].id
                    });
                });
                $scope.vpcModel.data = data.vpcs;
                $scope.vpcModel.displayLength = page.displayLength;
                $scope.vpcModel.totalRecords = data.total;
                $("#networkVpcListTable").widget().option("cur-page", {
                    "pageIndex": page.currentPage
                });
            });
        }

        $scope.$on("$viewContentLoaded", function () {
            //获取初始化信息
            var promise = getLocations();
            promise.then(function () {
                getVPCList();
            });
        });

        function isShowTablePage() {
            $scope.vpcModel.enablePagination = !$scope.openstack;
        }

        //是否显示分页，ICT场景下不显示分页
        isShowTablePage();
    }];
});
