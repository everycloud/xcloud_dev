/**

 * 文件名：

 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved

 * 描述：〈描述〉

 * 修改人：

 * 修改时间：14-2-20

 */
define(['tiny-lib/angular',
    'tiny-widgets/Checkbox',
    'tiny-widgets/IP',
    'tiny-widgets/Textbox',
    'tiny-widgets/Select',
    'tiny-common/UnifyValid',
    "app/business/resources/controllers/constants",
    "app/business/resources/controllers/device/constants",
    "app/services/exceptionService",
    "fixtures/deviceFixture"
],
    function (angular, Checkbox, IP, Textbox, Select, UnifyValid, constants, deviceConstants, ExceptionService, deviceFixture) {
        "use strict";
        var cfgAddingParamsCtrl = ['$scope', '$compile', '$state', '$stateParams', 'camel', '$rootScope', 'validator', function ($scope, $compile, $state, $stateParams, camel, $rootScope, validator) {
                $scope.cloudType = $rootScope.user.cloudType;
                $scope.chassisId = $stateParams.chassisId;
                $scope.chassisInfo = {};
                $scope.ipmiInfo = {};
                $scope.bmcIp = {};
                $scope.osIp = {};

                $scope.connectInfo = {
                    "serverId": "",
                    "osIP": "",
                    "bmcIP": "",
                    "bmcUserName": "",
                    "bmcPwd": "",
                    "accessType": 1,
                    "bladeModel": ""
                };
                //ip是否合法
                UnifyValid.ipCheck = function (id) {
                    var ip = $("#" + id).widget().getValue();
                    if (!ip) {
                        return false;
                    }
                    return validator.ipValidator(ip);
                };
                //密码是否一致
                UnifyValid.pwdEqual = function (index) {
                    if ($("#bmcPwd" + index).widget().getValue() === $("#cfmBmcPwd" + index).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };
                //不能包含不能包含特殊字符：| ; $ & > <
                UnifyValid.bmcStr = function (id) {
                    var str = $("#" + id).widget().getValue();
                    if (str.match(/^((?![;|\||\&|\$|\>|\<]).)*$/)) {
                        return true;
                    }
                    else {
                        return $scope.i18n.common_term_noSpecialCharacter2_valid;
                    }
                };
                //接入
                $scope.connect = {
                    "id": "connect",
                    "text": $scope.i18n.common_term_connect_button,
                    "disabled": false,
                    "focused": false,
                    "click": function () {
                        //校验
                        var result = UnifyValid.FormValid($("#cfgAddingParamsDiv"));
                        if (!result) {
                            return;
                        }

                        //调接入接口
                        for (var index in  $scope.table.data) {
                            var id = "addServerCheckbox" + index;
                            if (!$("#" + id).widget().option("disable") && $("#" + id).widget().option("checked")) {
                                $scope.connectInfo.serverId = $scope.table.data[index].uhmServerId;
                                $scope.connectInfo.osIP = $scope.osIp[index].getValue();
                                if ($scope.bmcIp[index].option("disable")) {
                                    $scope.connectInfo.bmcIP = null;
                                    $scope.connectInfo.bmcUserName = null;
                                    $scope.connectInfo.bmcPwd = null;
                                    $scope.connectInfo.ipmiVersion = null;
                                }
                                else {
                                    $scope.connectInfo.bmcIP = $scope.bmcIp[index].getValue();
                                    $scope.connectInfo.bmcUserName = $("#bmcUsername" + index).widget().getValue();
                                    $scope.connectInfo.bmcPwd = $("#bmcPwd" + index).widget().getValue();
                                    $scope.connectInfo.ipmiVersion = $scope.ipmiInfo[index].getSelectedId();
                                }
                                $scope.connectInfo.accessType = 1;
                                $scope.connectInfo.ipmiVersion = $scope.ipmiInfo[index].getSelectedId();
                                $scope.connectInfo.bladeModel = $scope.chassisInfo.productModel;
                                $scope.operate.addServer($scope.connectInfo);
                            }
                        }
                    }
                };
                //返回
                $scope.cancel = {
                    "id": "return",
                    "text": $scope.i18n.common_term_return_button,
                    "disabled": false,
                    "focused": false,
                    "click": function () {
                        $state.go("resources.device.rack", {});
                    }
                };

                //接入列表
                var tableColumns = [
                    {
                        "sTitle": "",
                        "mData": "",
                        "sWidth": "30px",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_slotID_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.slotNo);
                        },
                        "sWidth": "40px",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_type_label,
                        "mData": "",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_connectResult_label,
                        "mData": "",
                        "sWidth": "90px",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_connectBMC_label,
                        "mData": "",
                        "sWidth": "80px",
                        "bSortable": false},
                    {
                        "sTitle": "IPMI" + $scope.i18n.common_term_protocolVersion_label,
                        "mData": "",
                        "sWidth": "150px",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_managerIP_label,
                        "mData": "",
                        "bSortable": false},
                    {
                        "sTitle": "BMC IP",
                        "mData": "",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_BMCuser_label,
                        "mData": "",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.device_term_BMCpsw_label,
                        "mData": "",
                        "bSortable": false},
                    {
                        "sTitle": $scope.i18n.common_term_PswConfirm_label,
                        "mData": "",
                        "bSortable": false}
                ];

                $scope.table = {
                    "id": "hostsAddedParamsTable",
                    "data": [],
                    "columns": tableColumns,
                    "requestConfig": {
                        "enableRefresh": false,
                        "refreshInterval": 60000,
                        "httpMethod": "GET",
                        "url": "",
                        "data": "",
                        "sAjaxDataProp": "mData"
                    },
                    "enablePagination": false,
                    "columnsDraggable": true,
                    "renderRow": function (nRow, aData, iDataIndex) {
                        var result = aData.resourceState == 1 || aData.resourceState == 6;
                        //接入的checkbox
                        var addOptions = {
                            "id": "addServerCheckbox" + iDataIndex,
                            "checked": true,
                            "disable": !result,
                            "change": function () {
                                var result = $("#" + addOptions.id).widget().option("checked");
                                $scope.operate.setStatus(!result, iDataIndex);
                            }
                        };
                        var checkbox = new Checkbox(addOptions);
                        $('td:eq(0)', nRow).html(checkbox.getDom());

                        //支持接入的类型
                        $('td:eq(2)', nRow).html($scope.chassisInfo.productModel);

                        //接入结果
                        $('td:eq(3)', nRow).html($scope.i18n[deviceConstants.config.HOST_RESOURCE_STATUS[aData.resourceState]]);

                        //是否接入BMC的checkbox
                        var setBmcOptions = {
                            "id": "setBmc" + iDataIndex,
                            "checked": true,
                            "disable": !result,
                            "change": function () {
                                var result = $("#" + setBmcOptions.id).widget().option("checked");
                                $scope.operate.setBmcDisable(!result, iDataIndex);
                            }
                        };
                        if (!result && aData.bmcIp == null) {
                            setBmcOptions.checked = false;
                        }

                        var checkbox = new Checkbox(setBmcOptions);
                        $("td:eq(4)", nRow).html(checkbox.getDom());

                        //IPMI协议版本
                        var accessProtocol = aData.accessProtocol;
                        var values = [];
                        for (var index in  accessProtocol) {
                            var protocol = accessProtocol[index];
                            if ("IPMI20" == protocol) {
                                var value = {"selectId": "2.0",
                                    "label": "2.0"
                                }
                            }
                            else if ("IPMI15" == protocol) {
                                var value = {"selectId": "1.5",
                                    "label": "1.5"
                                }
                            }
                            else {
                                continue;
                            }
                            values.push(value);
                        }
                        var ipmiOptions = {
                            "id": "ipmiVersion" + iDataIndex,
                            "values": values,
                            "width": "120",
                            "disable": !result
                        };
                        if (!result && aData.ipmiVersion) {
                            ipmiOptions["default-selectid"] = aData.ipmiVersion;
                        }
                        $scope.ipmiInfo[iDataIndex] = new Select(ipmiOptions);
                        $("td:eq(5)", nRow).html($scope.ipmiInfo[iDataIndex].getDom());

                        var osIpContainer = $("<div></div>");
                        //管理ip
                        var osIpOption = {
                            "id": "osIp",
                            "value": "",
                            "type": "ipv4",
                            "disable": !result,
                            "focused": false,
                            "extendFunction": ["ipCheck"],
                            "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipcheck(osIp" + iDataIndex + "):" + $scope.i18n.common_term_formatIP_valid
                        };
                        if (!result) {
                            osIpOption.value = aData.osIp;
                        }
                        else {
                            osIpOption.value = "";
                        }
                        $scope.osIp[iDataIndex] = new IP(osIpOption);
                        $("td:eq(6)", nRow).html(osIpContainer.append($scope.osIp[iDataIndex].getDom()));

                        var bmcIpContainer = $("<div></div>");
                        //BMCip
                        var bmcIpOption = {
                            "id": "bmcIp" + iDataIndex,
                            "value": "",
                            "disable": !result,
                            "type": "ipv4",
                            "extendFunction": ["ipCheck"],
                            "validate": "required:" + $scope.i18n.common_term_null_valid + ";ipcheck(bmcIp" + iDataIndex + "):" + $scope.i18n.common_term_formatIP_valid
                        }
                        if (!result) {
                            bmcIpOption.value = aData.bmcIp;
                        }
                        else {
                            bmcIpOption.value = "";
                        }
                        $scope.bmcIp[iDataIndex] = new IP(bmcIpOption);

                        $("td:eq(7)", nRow).html(bmcIpContainer.append($scope.bmcIp[iDataIndex].getDom()));

                        //BMC用户名

                        var bmcUsernameOption = {
                            "id": "bmcUsername" + iDataIndex,
                            "width": "140px",
                            "disable": !result,
                            "value": "",
                            "extendFunction": ["bmcStr"],
                            "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                                + ";bmcStr(bmcUsername" + iDataIndex + ")"
                        };
                        if (!result) {
                            bmcUsernameOption.value = aData.bmcUserName;
                        }
                        else {
                            bmcUsernameOption.value = "";
                        }
                        var bmcUsername = new Textbox(bmcUsernameOption);

                        $('td:eq(8)', nRow).html(bmcUsername.getDom());

                        if (result) {
                            //BMC密码
                            var bmcPwd = new Textbox({
                                "id": "bmcPwd" + iDataIndex,
                                "width": "140px",
                                "value": "",
                                "disable": !result,
                                "type": "password",
                                "extendFunction": ["bmcStr"],
                                "validate": "required:" + $scope.i18n.common_term_null_valid + ";maxSize(32):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, {1: 32})
                                    + ";bmcStr(bmcPwd" + iDataIndex + ")"
                            });

                            $('td:eq(9)', nRow).html(bmcPwd.getDom());

                            //确认BMC密码
                            var cfmBmcPwd = new Textbox({
                                "id": "cfmBmcPwd" + iDataIndex,
                                "width": "140px",
                                "value": "",
                                "disable": !result,
                                "type": "password",
                                "extendFunction": ["pwdEqual"],
                                "validate": "required:" + $scope.i18n.common_term_null_valid + ";pwdEqual(" + iDataIndex + "):" + $scope.i18n.common_term_pswDifferent_valid
                            });

                            $('td:eq(10)', nRow).html(cfmBmcPwd.getDom());

                        }
                    }
                }
                $scope.operate = {
                    "init": function () {
                        var initConfig = deviceConstants.rest.CHASSIS_SLOTS_QUERY
                        var deferred = camel.get({
                            "url": {s: initConfig.url, o: {"chassisId": $scope.chassisId}},
                            "type": initConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $scope.table.data = response.servers;
                            });
                            //初始化表头的复选框
                            var options = {
                                "id": "tableHeadCheckbox",
                                "checked": true,
                                "change": function () {
                                    var isChecked = $("#tableHeadCheckbox").widget().options.checked;
                                    $scope.operate.setCheckbox(isChecked);
                                    for (var index in $scope.table.data) {
                                        $scope.operate.setStatus(!isChecked, index);
                                    }
                                }
                            };
                            var checkbox = new Checkbox(options);
                            $('#hostsAddedParamsTable th:eq(0)').html(checkbox.getDom());
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    "addServer": function (params) {
                        var addConfig = deviceConstants.rest.BLADE_HOST_ADD
                        var deferred = camel.post({
                            "url": addConfig.url,
                            "type": addConfig.type,
                            "params": JSON.stringify(params),
                            "userId": $rootScope.user.id,
                            "timeout": 60000
                        });
                        deferred.done(function (response) {
                            $state.go("resources.device.host");
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    },
                    //根据BMC复选框状态设置输入框的灰化
                    "setBmcDisable": function (result, index) {
                        if (result) {
                            $scope.operate.setBmcStatus(true, index);
                        }
                        else {
                            if ($("#setBmc" + index).widget().option("checked")) {
                                $scope.operate.setBmcStatus(false, index);
                            }
                            else {
                                $scope.operate.setBmcStatus(true, index);
                            }
                        }
                    },
                    //设置bmc输入框的灰化状态
                    "setBmcStatus": function (result, index) {
                        $scope.bmcIp[index].option("disable", result);
                        $scope.ipmiInfo[index].option("disable", result);
                        $("#bmcUsername" + index).widget().option("disable", result);
                        if ($("#bmcPwd" + index).widget()) {
                            $("#bmcPwd" + index).widget().option("disable", result);
                        }
                        if ($("#cfmBmcPwd" + index).widget()) {
                            $("#cfmBmcPwd" + index).widget().option("disable", result);
                        }
                        if (result) {
                            UnifyValid.clearValidate($scope.bmcIp[index].getDom());
                            UnifyValid.clearValidate($("#bmcUsername" + index).find("input"));
                            if ($("#bmcPwd" + index).length != 0) {
                                UnifyValid.clearValidate($("#bmcPwd" + index).find("input"));
                            }
                            if ($("#cfmBmcPwd" + index).length) {
                                UnifyValid.clearValidate($("#cfmBmcPwd" + index).find("input"));
                            }
                        }
                    },
                    //设置可输入框的灰化状态
                    "setStatus": function (result, index) {
                        $scope.operate.setBmcDisable(result, index);
                        $("#setBmc" + index).widget().option("disable", result);
                        $scope.osIp[index].option("disable", result)
                        UnifyValid.clearValidate($scope.osIp[index].getDom());

                    },
                    //复选框是否全部选中
                    "isAllChecked": function () {
                        for (var index in $scope.table.data) {
                            var id = "addServerCheckbox" + index;
                            if (!$("#" + id).widget().option("checked")) {
                                return false;
                            }
                        }
                        return true;
                    },
                    //设置复选框选中状态
                    "setCheckbox": function (param) {
                        for (var index in $scope.table.data) {
                            var id = "addServerCheckbox" + index;
                            if (!$("#" + id).widget().option("disable")) {
                                $("#" + id).widget().option("checked", param);
                            }
                        }
                    },
                    "queryChassisDetail": function () {
                        var queryConfig = deviceConstants.rest.CHASSIS_QUERY;
                        var deferred = camel.get({
                            "url": {s: queryConfig.url, o: {"start": "", "limit": "", "sort_key": "", "sort_dir": "", "zoneId": "", "resourceStatus": "", "name": "", "type": "", "chassisId": $scope.chassisId}},
                            "type": queryConfig.type,
                            "userId": $rootScope.user.id
                        });
                        deferred.done(function (response) {
                            $scope.$apply(function () {
                                $scope.chassisInfo = response.chassis[0];
                            });
                            $scope.operate.init();
                        });
                        deferred.fail(function (response) {
                            new ExceptionService().doException(response);
                        });
                    }
                }
                $scope.operate.queryChassisDetail();
            }]
            ;
        return cfgAddingParamsCtrl;
    })
;


