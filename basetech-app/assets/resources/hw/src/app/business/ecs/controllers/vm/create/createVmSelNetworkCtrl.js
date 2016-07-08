/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改时间：13-12-28
 */
/* global define */
define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'tiny-lib/underscore',
    'tiny-common/UnifyValid',
    'app/services/messageService',
    'app/services/validatorService',
    'app/business/ecs/services/vm/vmNicService',
    'app/business/network/services/networkService'
],
    function ($, angular, _, UnifyValid, messageService, validatorService, vmNicService, networkService) {
        "use strict";

        var createVmSelNetworkCtrl = ["$scope", "$window", "$q", "exception", "camel",
            function ($scope, $window, $q, exception, camel) {
                var validatorServiceIns = new validatorService();
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var networkIns = new networkService(exception, $q, camel);
                var i18n = $scope.i18n;
                var VLAN_MAX_ID = 4095;
                var messageIns = new messageService();
                $scope.ICT = $scope.user.cloudType === "ICT";
                $scope.maxNicNum = $scope.ICT ? 8 : 12;
                var ICT_DEFAULT_NET_TYPE = "VPCNET";
                $scope.networkType = {
                    "id": "ecsVmCreateNetworkType",
                    "layout": "horizon",
                    "selected": "private",
                    "values": [
                        {
                            "key": "basic",
                            "text": i18n.common_term_basicNet_label,
                            "checked": false
                        },
                        {
                            "key": "private",
                            "text": i18n.common_term_privateNet_label,
                            "checked": true
                        }
                    ],
                    "change": function () {
                        $scope.service.networkType = $("#" + $scope.networkType.id).widget().opChecked("checked");
                    }
                };

                // 基础网络
                $scope.basicAz = {
                    "label": i18n.resource_term_AZ_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "ecsVmCreateBasicAz",
                    "width": "220",
                    "data": []
                };

                // 私有网络
                $scope.vpc = {
                    "label": i18n.vpc_term_vpc_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "ecsVmCreateVpcId",
                    "labelWidth": "50px",
                    "width": "350",
                    "values": [],
                    "change": function () {
                        $scope.service.vpcId = $("#" + $scope.vpc.id).widget().getSelectedId();
                        $scope.service.vpcName = $("#" + $scope.vpc.id).widget().getSelectedLabel();
                        if ($scope.ICT) {
                            updateNicNetType();
                        }
                        queryPrivateNetworks();
                    }
                };

                // ict场景 需要根据网络类型过滤网络
                $scope.ictNetType = {
                    "label": i18n.vpc_term_netType_label + ":",
                    "id": "create-vm-ictNetType",
                    "width": "150",
                    "require": true,
                    "values": [
                        {
                            "selectId": "VPCNET",
                            "label": "VPC" + ($scope.urlParams.lang === "en" ? " " : "") + $scope.i18n.vpc_term_net_label,
                            "checked": true
                        },
                        {
                            "selectId": "EXTERNAL",
                            "label": i18n.vpc_term_directConnectNet_label
                        }
                    ],
                    "change": function (index) {
                        var ictNetworkType = $("#" + $scope.ictNetType.id + index).widget().getSelectedId();
                        updateICTNetwork(ictNetworkType, index);
                    }
                };

                $scope.privateNetwork = {
                    "label": i18n.vpc_term_net_label + ":",
                    "require": true,
                    "validate": "required:" + i18n.common_term_null_valid + ";",
                    "id": "ecsVmCreatePrivateNetwork",
                    "width": "350",
                    "data": [],
                    "change": function (index) {
                        if($scope.ICT){
                            var ictNetwork = getSpecNetwork($scope.privateNetwork["data" + index], $("#" + $scope.privateNetwork.id + index).widget().getSelectedId());
                            updateIpStatus(ictNetwork, index);
                        }
                        else{
                            var network = getSpecNetwork($scope.privateNetwork.data, $("#" + $scope.privateNetwork.id + index).widget().getSelectedId());
                            updateIpStatus(network, index);
                        }
                    }
                };

                $scope.privateIpv4 = {
                    "label": i18n.common_term_IPv4_label + ":",
                    "id": "ecsVmCreatePrivateIpv4",
                    "type": "ipv4",
                    "width": "200",
                    "value": "",
                    "extendFunction": ["isIPv4Check"],
                    "validate": "isIPv4Check():" + i18n.common_term_formatIP_valid
                };

                $scope.privateIpv6 = {
                    "label": i18n.common_term_IPv6_label + ":",
                    "id": "ecsVmCreatePrivateIpv6",
                    "type": "ipv6",
                    "width": "260",
                    "value": "",
                    "extendFunction": ["isIPv6Check"],
                    "validate": "isIPv6Check():" + i18n.common_term_formatIP_valid
                };

                $scope.addNic = {
                    "id": "ecsVmCreateVmNetworkAddNic",
                    "text": i18n.vm_term_addNIC_button,
                    "click": function () {
                        var length = $scope.nics.length;
                        if (length > $scope.maxNicNum - 1) {
                            return;
                        }

                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.nics.push({
                                    "networkID": "",
                                    "networkViewName": "",
                                    "ipv4": "",
                                    "ipv6": ""
                                });
                                if($scope.ICT){
                                    $scope.ictNetType["values" + length] = [
                                        {
                                            "selectId": "VPCNET",
                                            "label": "VPC" + ($scope.urlParams.lang === "en" ? " " : "") + $scope.i18n.vpc_term_net_label,
                                            "checked": true
                                        },
                                        {
                                            "selectId": "EXTERNAL",
                                            "label": i18n.vpc_term_directConnectNet_label
                                        }
                                    ];
                                }
                            });
                            if($scope.ICT){
                                var curLength = $scope.nics.length;
                                ictAddNicCallBack(curLength - 1);
                            }
                            else{
                                updateIpStatus($scope.privateNetwork.data[0], length);
                            }
                        }, 0);
                    }
                };

                $scope.delNic = {
                    "text": i18n.vm_term_delNIC_button,
                    "click": function (idx) {
                        $scope.nics.splice(idx, 1);
                    }
                };

                $scope.preBtn = {
                    "id": "ecsVmCreateVmNetworkPreBtn",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        $scope.service.show = "specInfo";
                        $("#ecsVmCreateStep").widget().pre();
                    }
                };
                $scope.nextBtn = {
                    "id": "ecsVmCreateVmNetworkNextBtn",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        //校验
                        var area = $scope.service.networkType === "basic" ? "#ecsVmCreateNetworkBase" : "#ecsVmCreateNetworkVpc";
                        if (!UnifyValid.FormValid($(area))) {
                            return;
                        }

                        //获取当前页数据
                        if ($scope.service.networkType === "basic") {
                            var azWidget = $("#" + $scope.basicAz.id).widget();
                            $scope.service.basicNetwork = {
                                "networkID": azWidget.getSelectedId(),
                                "azName": azWidget.getSelectedLabel()
                            };
                            $scope.service.vpcId = getSharedNetworkVpc($scope.service.basicNetwork.networkID);
                        } else {
                            var privateNetworks = [];
                            var networkWidget;
                            for (var i = 0, len = $scope.nics.length; i < len; i++) {
                                networkWidget = $("#" + $scope.privateNetwork.id + i).widget();
                                privateNetworks.push({
                                    "networkID": networkWidget.getSelectedId(),
                                    "networkViewName": networkWidget.getSelectedLabel(),
                                    "ipv4": $("#" + $scope.privateIpv4.id + i).widget().getValue(),
                                    "ipv6": $("#" + $scope.privateIpv6.id + i).widget().getValue()
                                });
                            }

                            $scope.service.privateNetwork = privateNetworks;

                            if (!$scope.ICT) {
                                var check = checkAvailablePrivateNetwork($scope.service.privateNetwork);
                                if (!check) {
                                    messageIns.failMsgBox(i18n.vm_vm_create_info_noneIPinSubnet_valid);
                                    return;
                                }
                            }
                        }

                        //跳到下一步
                        $scope.$emit($scope.events.selNetworkNext);
                        $scope.service.show = "baseInfo";
                        $("#ecsVmCreateStep").widget().next();
                    }
                };
                $scope.cancelBtn = {
                    "id": "ecsVmCreateVmNetworkCancelBtn",
                    "text": i18n.common_term_cancle_button,
                    "tooltip": "",
                    "click": function () {
                        setTimeout(function () {
                            $window.history.back();
                        }, 0);
                    }
                };

                var networkTypeView = {
                    "1": i18n.vpc_term_directConnectNet_label,
                    "2": i18n.vpc_term_innerNet_label,
                    "3": i18n.vpc_term_routerNet_label
                };

                //校验后台可用的IPV4、IPV6网络地址是否够用
                function checkAvailablePrivateNetwork(selectNetworkInfo) {
                    if (!selectNetworkInfo || selectNetworkInfo.length === 0) {
                        return false;
                    }
                    var netWorkArry = [];
                    _.each(selectNetworkInfo, function (item) {
                        var isNetworkExist = false;
                        for (var i = 0; i < netWorkArry.length; i++) {
                            if (netWorkArry[i].networkID === item.networkID) {
                                if (item.ipv4) {
                                    netWorkArry[i].ipv4Num++;
                                }
                                if (item.ipv6) {
                                    netWorkArry[i].ipv6Num++;
                                }
                                isNetworkExist = true;
                                return;
                            }
                        }
                        if (!isNetworkExist) {
                            netWorkArry.push({
                                networkID: item.networkID,
                                ipv4Num: (item.ipv4 ? 1 : 0),
                                ipv6Num: (item.ipv6 ? 1 : 0)
                            });
                        }
                    });
                    //比较界面设置的网络数量后台服务是否可以提供
                    var isNetworkNumAvailabled = true;
                    var availabledNetworkArry = $scope.privateNetwork.data;
                    var availabledNetworkArryLength = availabledNetworkArry.length;
                    _.each(netWorkArry, function (item) {
                        for (var j = 0; j < availabledNetworkArryLength; j++) {
                            var networkTmp = availabledNetworkArry[j];
                            if (networkTmp.networkID === item.networkID) {
                                //IPV4
                                if (item.ipv4Num > 0 &&
                                    (networkTmp.ipv4Subnet.ipAllocatePolicy === 1 || networkTmp.ipv4Subnet.ipAllocatePolicy === 3) &&
                                    (networkTmp.ipv4Subnet && (networkTmp.ipv4Subnet.usedAddrNum + item.ipv4Num > networkTmp.ipv4Subnet.totalAddrNum))) {
                                    isNetworkNumAvailabled = false;
                                    return;
                                }
                                //Ipv6
                                if (item.ipv6Num > 0 &&
                                    (networkTmp.ipv6Subnet.ipAllocatePolicy === 1 || networkTmp.ipv6Subnet.ipAllocatePolicy === 3) &&
                                    (networkTmp.ipv6Subnet && (networkTmp.ipv6Subnet.usedAddrNum + item.ipv6Num > networkTmp.ipv6Subnet.totalAddrNum))) {
                                    isNetworkNumAvailabled = false;
                                    return;
                                }
                            }
                        }
                    });
                    return isNetworkNumAvailabled;
                }

                // 查询基础网络列表
                function queryBasicNetworks() {
                    var options = {
                        "user": $scope.user,
                        "cloudInfraId": $scope.service.cloudInfra.id
                    };
                    var deferred = vmNicServiceIns.querySharedNetworks(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.sharedNetworks && data.sharedNetworks.length > 0) {
                            _.each(data.sharedNetworks, function (item) {
                                _.extend(item, {
                                    "selectId": item.network.networkID,
                                    "label": item.azName
                                });
                            });
                            data.sharedNetworks[0].checked = true;
                        }

                        $scope.basicAz.data = data.sharedNetworks;
                    });
                }

                // 查询可选VPC列表
                function queryVpcs() {
                    //如果有选择模板的步骤，则azId采用第一步所选的az;如果是从模板那边入口，则采用模板的az
                    //第一步的模板列表，是支持所选az的模板，但是该模板所在的az未必被该用户的VPC使用
                    var azId = $scope.service.azId?$scope.service.azId:$scope.service.selTemplate.azId;
                    azId = azId?[azId]:null;
                    var retDefer = $q.defer();
                    var options = {
                        "user": $scope.user,
                        "cloudInfraId": $scope.service.cloudInfra.id,
                        "azIds": azId
                    };

                    // 根据AZId来过滤vpc(ICT不管传不传azId都会查所有，因为az和vpc没有关系)
                    var deferred = vmNicServiceIns.queryVpcByAz(options);
                    deferred.then(function (data) {
                        if (!data) {
                            retDefer.reject(data);
                            return;
                        }

                        if (data.vpcs && data.vpcs.length > 0) {
                            _.each(data.vpcs, function (item) {
                                _.extend(item, {
                                    "label": item.name + ((item.availableZone && item.availableZone.length > 0) ? (" / " + i18n.resource_term_AZ_label + "-" + item.availableZone[0].name) : ""),
                                    "selectId": item.vpcID
                                });
                            });
                            data.vpcs[0].checked = true;
                            $scope.service.vpcId = data.vpcs[0].vpcID;
                            $scope.service.vpcName = data.vpcs[0].label;
                        }
                        $scope.vpc.values = data.vpcs;
                        retDefer.resolve(data);
                    });
                    return retDefer.promise;
                }

                // 查询VPC详情
                function queryVpcDetail() {
                    var options = {
                        "user": $scope.user,
                        "vpcId": $scope.service.vpcId,
                        "cloudInfraId": $scope.service.cloudInfra.id
                    };
                    var deferred = vmNicServiceIns.queryVpcDetail(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        var name = "";
                        if (data) {
                            name = data.name;
                        }
                        $scope.service.vpcName = name;
                    });
                }

                // 查询私有网络列表
                function queryPrivateNetworks() {
                    if (!$scope.service.vpcId || $scope.service.vpcId === "-1") {
                        return;
                    }
                    var options = {
                        "user": $scope.user,
                        "vpcId": $scope.service.vpcId,
                        "cloudInfraId": $scope.service.cloudInfra.id
                    };

                    var deferred = vmNicServiceIns.queryNetworks(options);
                    deferred.then(function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.networks && data.networks.length > 0) {
                            var net;
                            var type;
                            _.each(data.networks, function (item) {
                                net = {
                                    "selectId": item.networkID,
                                    "label": item.name + " ("
                                };
                                if (!$scope.ICT) {
                                    type = networkTypeView[item.networkType];
                                    if (type) {
                                        net.label += type;
                                    }
                                }
                                if (item.ipv4Subnet && item.ipv4Subnet.subnetAddr) {
                                    net.label += " / " + item.ipv4Subnet.subnetAddr;
                                }
                                if (item.ipv6Subnet && item.ipv6Subnet.subnetAddr) {
                                    net.label += " / " + item.ipv6Subnet.subnetAddr;
                                }
                                if (item.vlan) {
                                    net.label += " / " + (item.vlan > VLAN_MAX_ID ? "VXLAN ID: " : "VLAN ID: ") + item.vlan;
                                }
                                net.label += ")";
                                net.label = net.label.replace("( / ", "(").replace(" ()", "");
                                _.extend(item, net);
                            });

                            var network = data.networks[0];
                            network.checked = true;

                            for (var i = 0, length = $scope.nics.length; i < length; i++) {
                                updateIpStatus(network, i);
                            }
                        }

                        $scope.privateNetwork.data = data.networks;
                        if ($scope.ICT) {
                            for (var j = 0, nicLength = $scope.nics.length; j < nicLength; j++) {
                                $scope.privateNetwork["data" + j] = data.networks;
                            }
                        }
                    });
                }

                // 查询私有网络列表
                function ictAddNicCallBack(index) {
                    if (!$scope.service.vpcId || $scope.service.vpcId === "-1") {
                        return;
                    }
                    var options = {
                        "user": $scope.user,
                        "vpcId": $scope.service.vpcId,
                        "cloudInfraId": $scope.service.cloudInfra.id
                    };

                    var deferred = vmNicServiceIns.queryNetworks(options);
                    deferred.then(function (data) {
                        $scope.privateNetwork["data" + index] = [];
                        if (!data) {
                            return;
                        }
                        if (data.networks && data.networks.length > 0) {
                            var net;
                            _.each(data.networks, function (item) {
                                net = {
                                    "selectId": item.networkID,
                                    "label": item.name + " ("
                                };
                                if (item.ipv4Subnet && item.ipv4Subnet.subnetAddr) {
                                    net.label += " / " + item.ipv4Subnet.subnetAddr;
                                }
                                if (item.ipv6Subnet && item.ipv6Subnet.subnetAddr) {
                                    net.label += " / " + item.ipv6Subnet.subnetAddr;
                                }
                                if (item.vlan) {
                                    net.label += " / " + (item.vlan > VLAN_MAX_ID ? "VXLAN ID: " : "VLAN ID: ") + item.vlan;
                                }
                                net.label += ")";
                                net.label = net.label.replace("( / ", "(").replace(" ()", "");
                                _.extend(item, net);
                            });

                            var network = data.networks[0];
                            network.checked = true;
                            updateIpStatus(network, index);
                            $scope.privateNetwork["data" + index] = data.networks;
                        }
                    });
                }

                /**
                 * ICT场景 切换某个网卡的网络类型 执行函数
                 *   1、查询对应类型的网络，同时针对对应序列网卡 做如下处理
                 *   查询列表第一个网络详情
                 *   控制IP显示
                 * @param ictNetworkType  VPC网络/直连网络
                 * @param index 网卡序列号
                 */
                function updateICTNetwork(ictNetworkType, index) {
                    if (!$scope.service.vpcId || $scope.service.vpcId === "-1") {
                        return;
                    }
                    var options = {
                        "user": $scope.user,
                        "vpcId": $scope.service.vpcId,
                        "cloudInfraId": $scope.service.cloudInfra.id
                    };

                    if (ictNetworkType === ICT_DEFAULT_NET_TYPE) {
                        var deferred = vmNicServiceIns.queryNetworks(options);
                        deferred.then(function (data) {
                            $scope.privateNetwork["data" + index] = [];
                            if (!data) {
                                return;
                            }
                            if (data.networks && data.networks.length > 0) {
                                var net;
                                var type;
                                _.each(data.networks, function (item) {
                                    net = {
                                        "selectId": item.networkID,
                                        "label": item.name + " ("
                                    };
                                    if (item.ipv4Subnet && item.ipv4Subnet.subnetAddr) {
                                        net.label += " / " + item.ipv4Subnet.subnetAddr;
                                    }
                                    if (item.ipv6Subnet && item.ipv6Subnet.subnetAddr) {
                                        net.label += " / " + item.ipv6Subnet.subnetAddr;
                                    }
                                    if (item.vlan) {
                                        net.label += " / " + (item.vlan > VLAN_MAX_ID ? "VXLAN ID: " : "VLAN ID: ") + item.vlan;
                                    }
                                    net.label += ")";
                                    net.label = net.label.replace("( / ", "(").replace(" ()", "");
                                    _.extend(item, net);
                                });

                                var network = data.networks[0];
                                network.checked = true;
                                $scope.privateNetwork["data" + index] = data.networks;
                                updateIpStatus(network, index);
                            }
                        });
                    }
                    else {
                        var promise = networkIns.queryOutNetworks({
                            "isAssociated": true,
                            "vdcId": $scope.user.vdcId,
                            "vpcId": $scope.service.vpcId,
                            "userId": $scope.user.id,
                            "cloudInfraId": $scope.service.cloudInfra.id
                        });
                        promise.then(function (data) {
                            $scope.privateNetwork["data" + index] = [];
                            if (!data) {
                                return;
                            }
                            if (data.externalNetworks && data.externalNetworks.length > 0) {
                                var net;
                                _.each(data.externalNetworks, function (item) {
                                    net = {
                                        "selectId": item.exnetworkID,
                                        "networkID": item.exnetworkID,
                                        "label": item.name
                                    };
                                    _.extend(item, net);
                                });

                                var network = data.externalNetworks[0];
                                network.checked = true;
                                $scope.privateNetwork["data" + index] = data.externalNetworks;
                                updateIpStatus(network, index);
                            }
                        });
                    }
                }

                function updateIpInputStatus(network, idx) {
                    if (!network) {
                        return;
                    }

                    var ipv4Dom = $("#" + $scope.privateIpv4.id + idx).widget();
                    if (ipv4Dom) {
                        if ($scope.service.vmNum === 1 && (network.ipv4Subnet && network.ipv4Subnet.subnetAddr && (network.ipv4Subnet.ipAllocatePolicy === 1 || network.ipv4Subnet.ipAllocatePolicy === 3))) {
                            ipv4Dom.setDisable(false);
                        } else {
                            ipv4Dom.setDisable(true);
                            ipv4Dom.option("value", "");
                        }
                    }

                    var ipv6Dom = $("#" + $scope.privateIpv6.id + idx).widget();
                    if (ipv6Dom) {
                        if ($scope.service.vmNum === 1 && (network.ipv6Subnet && network.ipv6Subnet.subnetAddr && (network.ipv6Subnet.ipAllocatePolicy === 1 || network.ipv6Subnet.ipAllocatePolicy === 3))) {
                            ipv6Dom.option("disable", false);
                        } else {
                            ipv6Dom.option("disable", true);
                            ipv6Dom.option("value", "");
                        }
                    }
                }

                // 更新ip输入框的状态 ict场景需要再次调用查询网络详情接口
                function updateIpStatus(network, idx) {
                    if (!network) {
                        return;
                    }

                    if ($scope.ICT) {
                        var promise = networkIns.queryNetworkDetail({
                            "networkID": network.networkID,
                            "vdcId": $scope.user.vdcId,
                            "vpcId": $scope.service.vpcId,
                            "userId": $scope.user.id,
                            "cloudInfraId": $scope.service.cloudInfra.id
                        });
                        promise.then(function (data) {
                            if (!data) {
                                return;
                            }
                            network.ipv4Subnet = data.ipv4Subnet;
                            network.ipv6Subnet = data.ipv6Subnet;

                            updateIpInputStatus(network, idx);
                        });
                    }
                    else {
                        updateIpInputStatus(network, idx);
                    }
                }

                //ICT vpc切换需要更新所有的 网络类型（初始化默认VPC网络）
                function updateNicNetType() {
                    for (var j = 0, nicLength = $scope.nics.length; j < nicLength; j++) {
                        $scope.ictNetType["values" + j] = [
                            {"selectId": "VPCNET", "label": "VPC" + ($scope.urlParams.lang === "en" ? " " : "") + $scope.i18n.vpc_term_net_label, "checked": true },
                            {"selectId": "EXTERNAL", "label": i18n.vpc_term_directConnectNet_label }
                        ];
                    }
                }

                //在网络列表中查找指定网络
                function getSpecNetwork(networks, id) {
                    var network = {};
                    if (networks && networks.length > 0 && id) {
                        network = _.find(networks, function (item) {
                            return item.networkID === id;
                        });
                    }
                    return network;
                }

                // 找到共享网络中某网络的VPC
                function getSharedNetworkVpc(networkId) {
                    var vpcId = "";
                    var sharedNetwork = _.find($scope.basicAz.data, function (item) {
                        return item.network.networkID === networkId;
                    });

                    if (sharedNetwork) {
                        vpcId = sharedNetwork.network.vpcID;
                    }
                    return vpcId;
                }

                //校验IPv4是否合法
                UnifyValid.isIPv4Check = function () {
                    var element = this;
                    var ipValue = element.val();
                    if ($.trim(ipValue) === "") {
                        return true;
                    }
                    return validatorServiceIns.ipValidator(ipValue);
                };

                //校验IPv6是否合法
                UnifyValid.isIPv6Check = function () {
                    var element = this;
                    var ipValue = element.val();
                    if ($.trim(ipValue) === "") {
                        return true;
                    }
                    return validatorServiceIns.ipv6Check(ipValue);
                };

                // 事件处理，查询初始化信息
                $scope.$on($scope.events.specInfoNextFromParent, function (event, msg) {
                    // 初始化数据
                    $scope.addNic.disable = false;
                    $scope.nics = [
                        {
                            "networkID": "",
                            "networkViewName": "",
                            "ipv4": "",
                            "ipv6": ""
                        }
                    ];

                    // IT场景
                    if ($scope.service.vm_support_user_define_config === 'true') {
                        queryBasicNetworks();
                        var defer = queryVpcs();
                        defer.then(function (data) {
                            queryPrivateNetworks();
                        });
                    } else { // ICT场景
                        // 从虚拟机进来，只要查VPC详情
                        if ($scope.service.from === "vms") {
                            queryVpcDetail();
                            //ICT vpc切换需要更新所有的 网络类型（初始化默认VPC网络）
                            updateNicNetType();
                            queryPrivateNetworks();
                        } else { // 从模板进来进行选VPC
                            var defer2 = queryVpcs();
                            defer2.then(function (data) {
                                //ICT vpc切换需要更新所有的 网络类型（初始化默认VPC网络）
                                updateNicNetType();
                                queryPrivateNetworks();
                            });
                        }
                    }
                });
            }
        ];

        return createVmSelNetworkCtrl;
    }
);
