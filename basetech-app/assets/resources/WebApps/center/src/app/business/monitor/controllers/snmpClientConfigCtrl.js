define(['jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-widgets/Checkbox",
    "tiny-widgets/Message",
    "app/services/exceptionService",
    "app/business/monitor/services/alarmService",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"], function ($, angular, TextBox, Button, Window, Checkbox, Message, ExceptionService, AlarmService, UnifyValid, ValidatorService) {
    "use strict";

    var snmpClientConfigCtrl = ["$scope", "$compile", "camel", 'validator', function ($scope, $compile, camel, validator) {
        $scope.privilege = $("html").scope().user.privilege;
        $scope.operateRight = $scope.privilege.role_role_add_option_alarmHandle_value;
        var user = $("html").scope().user;
        var exception = new ExceptionService();
        $scope.currentItem = undefined;
        $scope.showWin = false;
        $scope.showWinTitle = $scope.i18n.alarm_term_addThirdAssembly_button || "添加第三方部件";
        $scope.reqParams = {};
        $scope.reqParams.start = 0;
        $scope.reqParams.limit = 10;
        $scope.mode = "insert";
        $scope.snmpVersion = "2";
        $scope.snmpClientPK = "";
        $scope.showWinTitle = "";
        $scope.createBtn = {
            "id": "thirdPartyConfig-createBtn",
            "text": $scope.i18n.alarm_term_addThirdAssembly_button || "添加第三方部件",
            "click": function () {
                $scope.mode = "insert";
                $scope.showWin = true;
                $scope.showWinTitle = $scope.i18n.alarm_term_addThirdAssembly_button || "添加第三方部件";
                initSnmpClientView(null);
                $scope.$digest();
            }
        };
        $scope.refreshBtn = {
            "id": "refreshBtn",
            "click": function () {
                getData();
            }
        };
        $scope.saveBtn = {
            "id": "saveBtn",
            "text": $scope.i18n.common_term_save_label || "保存",
            "click": function () {

                if (!validateData()) {
                    return;
                }

                if ($scope.mode == "insert") {
                    Insert();
                }
                else {
                    Update();
                }

            }
        };
        $scope.cancelBtn = {
            "id": "cancelBtn",
            "text": $scope.i18n.common_term_cancle_button || "取消",
            "click": function () {
                $scope.showWin = false;
                $scope.$digest();
            }
        };
        var page = {
            "currentPage": 1,
            "displayLength": 10,
            "getStart": function () {
                return page.currentPage == 0 ? 0 : (page.currentPage - 1) * page.displayLength;
            }
        };
        $scope.dataGridViewTable = {
            "lengthMenu": [10, 20, 50],
            "id": "dataGridViewTable",
            "paginationStyle": "full_numbers",
            "displayLength": 10,
            "totalRecords": 0,
            "showDetails": false,
            "columns": [
                {"sTitle": "ID", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.id);
                }, "bSortable": false, "sWidth": "10%"},
                {"sTitle": $scope.i18n.common_term_assemblyName_label || "部件名称", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.name);
                }, "bSortable": false, "sWidth": "10%"},
                {"sTitle": $scope.i18n.common_term_assemblyType_label || "部件类型", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.type);
                }, "bSortable": false, "sWidth": "12%"},
                {"sTitle": $scope.i18n.common_term_IP_label || "IP地址", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.ip);
                }, "bSortable": false, "sWidth": "13%"},
                {"sTitle": $scope.i18n.common_term_maintenancePort_value || "维护端口", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.port);
                }, "bSortable": false, "sWidth": "10%"},
                {"sTitle": $scope.i18n.common_term_SNMPversion_label || "SNMP版本", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.snmpVersionValue);
                }, "bSortable": false, "sWidth": "15%"},
                {"sTitle": $scope.i18n.common_term_assemblyDesc_label || "部件描述", "mData": function (data) {
                    return $.encoder.encodeForHTML(data.description);
                }, "bSortable": false, "sWidth": "15%"},
                {"sTitle": $scope.i18n.common_term_operation_label || "操作", "bSortable": false, "sWidth": "10%", "bVisible": $scope.operateRight}
            ],
            "data": null,
            "columnVisibility": {
                "activate": "click",
                "aiExclude": [0, 7],
                "bRestore": true,
                "fnStateChange": function (index, state) {

                }
            },
            "callback": function (evtObj) {
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

                if (!$scope.operateRight) {
                    return;
                }

                var optColumn = "<a href='javascript:void(0)' ng-click='modify()'>" + ($scope.i18n.common_term_modify_button || "修改") + "</a>&nbsp;&nbsp;"
                    + " <a href='javascript:void(0)' ng-click='delete()'>" + ($scope.i18n.common_term_delete_button || "删除") + "</a>";
                var optLink = $compile($(optColumn));

                var optScope = $scope.$new();
                optScope.data = aData;
                optScope.modify = function () {
                    $scope.currentItem = aData;
                    $scope.snmpClientPK = aData.id;
                    $scope.mode = "update";
                    $scope.showWin = true;
                    $scope.showWinTitle = $scope.i18n.alarm_term_modifyAssembly_button || "修改部件信息";
                    initSnmpClientView(aData);
                };
                optScope["delete"] = function () {

                    var confirmShowDialog = new Message({
                        "type": "confirm",
                        "title": $scope.i18n.common_term_confirm_label || "确认删除",
                        "content": $scope.i18n.alarm_config_delData_info_confirm_msg || "确实要删除该条数据吗？",
                        "height": "150px",
                        "width": "350px",
                        "buttons": [
                            {
                                label: $scope.i18n.common_term_ok_button || '确定',
                                accessKey: '2',
                                "key": "okBtn",
                                majorBtn : true,
                                default: true
                            },
                            {
                                label: $scope.i18n.common_term_cancle_button || '取消',
                                accessKey: '3',
                                "key": "cancelBtn",
                                default: false
                            }
                        ]
                    });
                    confirmShowDialog.setButton("okBtn", function () {
                        confirmShowDialog.destroy();
                        AlarmService.removeSnmpClient(
                            aData.id, user,
                            function (result) {
                                if (result.result == true) {
                                    $scope.$apply(function () {
                                        getData();
                                    });
                                }
                                if (result.result == false) {
                                    exception.doException(result.data, null);
                                }
                            });
                    });
                    confirmShowDialog.setButton("cancelBtn", function () {
                        confirmShowDialog.destroy();
                    });
                    confirmShowDialog.show();
                };

                var optNode = optLink(optScope);
                $("td:eq(7)", nRow).html(optNode);
            }
        };

        $scope.nameControl = {
            "id": "nameControl",
            "label": ($scope.i18n.common_term_assemblyName_label || "部件名称") + ":",
            "require": true,
            "value": "",
            "type": "input",
            "readonly": false,
            "tooltip": ($scope.i18n.common_term_composition1_valid || "由数字、字母、下划线组成，") + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符。"),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符") +
                ";regularCheck('^\\w*$'):" + ($scope.i18n.common_term_composition1_valid || "由数字、字母、下划线组成。")
        };
        $scope.portControl = {
            "id": "portControl",
            "label": ($scope.i18n.common_term_maintenancePort_value || "维护端口") + ":",
            "require": true,
            "value": "",
            "type": "input",
            "readonly": false,
            "tooltip": ($scope.i18n.alarm_config_third_para_port_mean_tip || "第三方部件端口号，范围为1-65535。"),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";minValue(1):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 65535) || "范围为1-65535" ) +
                ";maxValue(65535):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1, 65535) || "范围为1-65535")
        };

        $scope.checkComplexControl = {
            "id": "checkComplexControl",
            "text": $scope.i18n.sys_term_verifyReadWriteCommunityName_label || "是否对读团体名和写团体名做复杂度校验",
            "checked": true
        };

        $scope.checkComplexPasswordControl = {
            "id": "checkComplexPasswordControl",
            "text": $scope.i18n.sys_term_verifyAuthenticationKeyPsw_label || "校验认证密码和密钥密码的复杂度",
            "checked": true
        };
        var pwdDesc = ( $scope.i18n.common_term_compositionInclude6_valid || "只能由英文大写字母、英文小写字母、数字、特殊字符组成，且必须包含至少两种字符。");
        $scope.readNameControl = {
            "id": "readNameControl",
            "label": ($scope.i18n.device_term_readCommunityName_label || "读团体名") + ":",
            "require": true,
            "value": "",
            "type": "input",
            "readonly": false,
            "extendFunction": ["snmpPWD","groupNameMinSizeCheck"],
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";groupNameMinSizeCheck(readNameControl):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。")+
                ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。")+
                ";snmpPWD(readNameControl):"+pwdDesc
        };
        $scope.writeNameControl = {
            "id": "writeNameControl",
            "label": ($scope.i18n.device_term_writeCommunityName_label || "写团体名") + ":",
            "require": true,
            "value": "",
            "type": "input",
            "readonly": false,
            "extendFunction": ["snmpPWD","groupNameMinSizeCheck"],
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";groupNameMinSizeCheck(writeNameControl):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                ";snmpPWD(writeNameControl):"+pwdDesc
        };
        UnifyValid.snmpPWD = function (id) {
            id = id[0] || id;
            var value = $("#" + id).widget().getValue();
            //长度范围为8个～128个字符、至少两种字符的组合:小写字母、大写字母、数字、特殊字符。
            if(id == $scope.authPassWordControl.id || id ==  $scope.privPassWordControl.id)
            {
                if($("#checkComplexPasswordControl").widget().option("checked") == false)
                {
                    return true;
                }
            }
            if(id == $scope.readNameControl.id || id ==  $scope.writeNameControl.id)
            {
                if($("#checkComplexControl").widget().option("checked") == false)
                {
                    return true;
                }
            }
            var upperReg = /[A-Z]+/g;
            var lowerReg = /[a-z]+/g;
            var numberReg = /\d+/g;
            var specialReg = /[^a-z|A-Z|0-9]+/g;
            var validators = [upperReg, lowerReg, numberReg , specialReg ];
            var len = validators.length;
            //记录字符类型数量
            var total = 0;
            while (total < 2 && len > 0) {
                len--;
                if (validators[len].test(value)) {
                    total++;
                }
            }
            //种类小于两种校验不通过
            if (total < 2) {
                return false;
            }
            return true;
        };
        UnifyValid.groupNameMinSizeCheck = function (id) {
            if($("#checkComplexControl").widget().option("checked") == false)
            {
                return true;
            }
            var value = $("#" + id).widget().getValue();

            if (value.length < parseInt(8, 10)) {
                return false;
            }
            return true;
        };
        UnifyValid.groupNameCheck = function (id) {
            if($("#checkComplexControl").widget().option("checked") == false)
            {
                return true;
            }
            var value = $("#" + id).widget().getValue();
            //由大写字母，小写字母和数字组成
            var regex = /^[a-zA-Z\d]+$/;
            if (!regex.test(value)) {
                return false;
            }
            return validator.checkMustContain(value);
        };
        $scope.outTimeControl = {
            "id": "outTimeControl",
            "label": ($scope.i18n.device_term_timeout_label || "超时时间") + ":",
            "require": true,
            "value": "",
            "type": "input",
            "readonly": false,
            "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_rangeInteger_valid, 1000, 60000) || "1000 ～ 60000（含1000和60000）之间的整数。"),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";minValue(1000):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1000, 60000) || "范围为1000-60000" ) +
                ";maxValue(60000):" + ($scope.i18n.sprintf($scope.i18n.common_term_range_valid, 1000, 60000) || "范围为1000-60000" )
        };

        $scope.descriptionControl = {
            "id": "descriptionControl",
            "label": ($scope.i18n.common_term_assemblyDesc_label || "部件描述") + ":",
            "require": false,
            "value": "",
            "type": "multi",
            "readonly": false,
            "width": 400,
            "height": 60,
            "tooltip": "",
            "validate": "maxSize(1024):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 0, 1024) || "不能超过1024个字符")
        };

        $scope.ipControl = {
            "id": "ipControl",
            "label": ($scope.i18n.common_term_IP_label || "IP地址") + ":",
            "require": true,
            "value": "",
            "width":"150px",
            "type": "input",
            "readonly": false,
            "tooltip": "",
            "extendFunction": ["ipCheck","ipRangeCheck","ipNotStartWith127"],
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";ipCheck(ipControl):" + ($scope.i18n.common_term_formatIP_valid || "IP地址不合法")+
                ";ipRangeCheck(ipControl):不能为0.0.0.0或255.255.255.255" +
                ";ipNotStartWith127(ipControl):" + $scope.i18n.vpc_term_IPcantbe127_valid
        };
        UnifyValid.ipCheck = function (id) {
            var ip = $("#" + id).widget().getValue();
            return validator.ipFormatCheck(ip);
        };
        UnifyValid.ipRangeCheck = function (id) {
            id = id[0] || id;
            var ip = $("#" + id).widget().getValue();
            var value =  validator.getIpValue(ip);
            var maxIpValue = 255*(1 + 256 + 256*256 + 256*256*256);
            if(value === 0 || value === maxIpValue){
                return false;
            }
            else{
                return true;
            }
        };
        UnifyValid.ipNotStartWith127 = function (id) {
            var ip = $("#" + id).widget().getValue();
            return validator.ipNotStartWith127(ip);
        };
        $scope.tsnmpClienTypeControl = {
            "id": "tsnmpClienTypeControl",
            "width": "150",
            "label": ($scope.i18n.common_term_assemblyType_label || "部件类型") + ":",
            "require": true,
            "values": [
                {
                    "selectId": "NetScaler",
                    "label": "NetScaler",
                    "checked": true
                },
                {
                    "selectId": "SVN",
                    "label": "SVN",
                    "checked": true
                }
            ],
            "change": function () {

                if ($("#tsnmpClienTypeControl").widget().getSelectedId() == "NetScaler") {
                    $scope.snmpVersion = "3";
                    $scope.snmpVersionControl.values =
                        [
                            {
                                "selectId": "2",
                                "label": "SNMPv2c"
                            } ,
                            {
                                "selectId": "3",
                                "label": "SNMPv3",
                                "checked": true
                            }
                        ];
                }
                else {
                    $scope.snmpVersion = "3";
                    $scope.snmpVersionControl.values =
                        [
                            {
                                "selectId": "2",
                                "label": "SNMPv2c"
                            },
                            {
                                "selectId": "3",
                                "label": "SNMPv3",
                                "checked": true
                            }
                        ];

                }

            }
        };

        $scope.snmpVersionControl = {
            "id": "snmpVersionControl",
            "width": "150",
            "label": ($scope.i18n.common_term_SNMPversion_label || "SNMP版本") + ":",
            "require": true,
            "values": [
                {
                    "selectId": "2",
                    "label": "SNMPv2c"
                } ,
                {
                    "selectId": "3",
                    "label": "SNMPv3",
                    "checked": true
                }
            ],
            "change": function () {
                $scope.snmpVersion = $("#snmpVersionControl").widget().getSelectedId();
            }
        };

        $scope.userNameControl = {
            "id": "userNameControl",
            "label": ($scope.i18n.common_term_secuUserName_label || "安全用户名") + ":",
            "require": true,
            "value": "",
            "type": "input",
            "readonly": false,
            "tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符。"),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 128) || "长度范围是1个～128个字符。")
        };
        $scope.authGenericControl = {
            "id": "authGenericControl",
            "width": "150",
            "label": ($scope.i18n.common_term_authProtocol_label || "认证协议") + ":",
            "require": true,
            "values": [
                {
                    "selectId": "MD5",
                    "label": "MD5",
                    "checked": false
                },
                {
                    "selectId": "SHA",
                    "label": "SHA1",
                    "checked": true
                }
            ],
            "change": function () {

            }
        };
        $scope.authPassWordCheckBoxControl = {
            "id": "authPassWordCheckBoxControl",
            "text": ($scope.i18n.common_term_modifyPsw_button || "修改密码"),
            "checked": false,
            "change": function () {
                $("#authPassWordControl").widget().option("disable", !$("#authPassWordCheckBoxControl").widget().option("checked"));
                $("#confirmAuthPassWordControl").widget().option("disable", !$("#authPassWordCheckBoxControl").widget().option("checked"));
            }
        };
        $scope.authPassWordControl = {
            "id": "authPassWordControl",
            "label": ($scope.i18n.common_term_authenticPsw_label || "认证密码") + ":",
            "require": true,
            "value": "",
            "type": "password",
            "disable": false,
            "extendFunction": ["snmpPWD","snmpMinSizeCheck"],
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";snmpMinSizeCheck(authPassWordControl):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                ";snmpPWD(authPassWordControl):"+pwdDesc
        };

        UnifyValid.snmpMinSizeCheck = function (id) {
            if($("#checkComplexPasswordControl").widget().option("checked") == false)
            {
                return true;
            }
            var value = $("#" + id).widget().getValue();

            if (value.length < parseInt(8, 10)) {
                return false;
            }
            return true;
        };
        UnifyValid.snmpPasswordCheck = function (id) {
            if($("#checkComplexPasswordControl").widget().option("checked") == false)
            {
                return true;
            }
            var value = $("#" + id).widget().getValue();
            //由大写字母，小写字母和数字组成
            var regex = /^[a-zA-Z\d]+$/;
            if (!regex.test(value)) {
                return false;
            }
            return validator.checkMustContain(value);
        };



        $scope.confirmAuthPassWordControl = {
            "id": "confirmAuthPassWordControl",
            "label": ($scope.i18n.common_term_authenticPswConfirm_label || "确认认证密码") + ":",
            "require": true,
            "value": "",
            "type": "password",
            "disable": false,
            "tooltip": "",
            "extendFunction": ["equalAuthPassWord"],
            "validate": "equalAuthPassWord():" + ($scope.i18n.common_term_pswDifferent_valid || "两次输入的密码不一致，请重新输入。")
        };
        UnifyValid.equalAuthPassWord = function () {
            if ($("#authPassWordControl").widget().getValue() === $("#confirmAuthPassWordControl").widget().getValue()) {
                return true;
            } else {
                return false;
            }
        }
        $scope.privacyProtocolControl = {
            "id": "privacyProtocolControl",
            "label": ($scope.i18n.common_term_secretKeyType_label || "密钥类型") + ":",
            "require": true,
            "width":"150px",
            "values": [
                {
                    "selectId": "DES",
                    "label": "DES56",
                    "checked": false
                },
                {
                    "selectId": "AES128",
                    "label": "AES128",
                    "checked": true
                },
                {
                    "selectId": "AES192",
                    "label": "AES192",
                    "checked": false
                },
                {
                    "selectId": "AES256",
                    "label": "AES256",
                    "checked": false
                }
            ],
            "type": "input",
            "readonly": false,
            "tooltip": ""
        };
        $scope.privPassWordCheckBoxControl = {
            "id": "privPassWordCheckBoxControl",
            "text": ($scope.i18n.common_term_modifyPsw_button || "修改密码"),
            "checked": false,
            "change": function () {
                $("#privPassWordControl").widget().option("disable", !$("#privPassWordCheckBoxControl").widget().option("checked"));
                $("#confirmPrivPassWordControl").widget().option("disable", !$("#privPassWordCheckBoxControl").widget().option("checked"));
            }
        };
        $scope.privPassWordControl = {
            "id": "privPassWordControl",
            "label": ($scope.i18n.common_term_secretKeyPsw_label || "密钥密码") + ":",
            "require": true,
            "value": "",
            "type": "password",
            "extendFunction": ["snmpPWD","snmpMinSizeCheck"],
            "disable": false,
            "tooltip": $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 128),
            "validate": "required:" + ($scope.i18n.common_term_null_valid || "不能为空") +
                ";snmpMinSizeCheck(privPassWordControl):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                ";maxSize(128):" + ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, 8, 128) || "长度范围是8个～128个字符。") +
                ";snmpPWD(privPassWordControl):"+pwdDesc
        };
        $scope.confirmPrivPassWordControl = {
            "id": "confirmPrivPassWordControl",
            "label": ($scope.i18n.common_term_keyPswConfirm_label || "确认密钥密码") + ":",
            "require": true,
            "value": "",
            "type": "password",
            "disable": false,
            "tooltip":  "",
            "extendFunction": ["equalPrivPassWord"],
            "validate": "equalPrivPassWord():" + ($scope.i18n.common_term_pswDifferent_valid || "两次输入的密码不一致，请重新输入。")
        };
        UnifyValid.equalPrivPassWord = function () {
            if ($("#privPassWordControl").widget().getValue() === $("#confirmPrivPassWordControl").widget().getValue()) {
                return true;
            } else {
                return false;
            }
        };
        function createSnmPClientItem() {
            var snmpInfo = {};
            snmpInfo.snmpVersion = ($scope.mode == "insert" ? $("#snmpVersionControl").widget().getSelectedId() : $scope.currentItem.snmpVersion);
            snmpInfo.readName = $("#readNameControl").widget().getValue();
            snmpInfo.writeName = $("#writeNameControl").widget().getValue();
            snmpInfo.userName = $("#userNameControl").widget().getValue();
            snmpInfo.authGeneric = $("#authGenericControl").widget().getSelectedId();
            snmpInfo.authPassWord = $("#authPassWordControl").widget().getValue();
            snmpInfo.privacyProtocol = $("#privacyProtocolControl").widget().getSelectedId();
            snmpInfo.privPassWord = $("#privPassWordControl").widget().getValue();
            snmpInfo.outTime = $("#outTimeControl").widget().getValue();
            snmpInfo.name = $("#nameControl").widget().getValue();
            snmpInfo.id = $scope.snmpClientPK;
            snmpInfo.type = ($scope.mode == "insert" ? $("#tsnmpClienTypeControl").widget().getSelectedId() : $scope.currentItem.type);
            snmpInfo.description = $("#descriptionControl").widget().getValue();
            snmpInfo.ip = $("#ipControl").widget().getValue();
            snmpInfo.port = $("#portControl").widget().getValue();
            if( snmpInfo.snmpVersion == "2")
            {
                snmpInfo.checkComplex = $("#checkComplexControl").widget().option("checked");
            }
            else
            {
                snmpInfo.checkComplex = $("#checkComplexPasswordControl").widget().option("checked");
            }

            if(snmpInfo.snmpVersion == "3")
            {
                delete  snmpInfo.readName;
                delete  snmpInfo.writeName;
            }

            snmpInfo.snmpVersion != "2" || delete  snmpInfo.userName;
            snmpInfo.snmpVersion != "2" || delete  snmpInfo.authGeneric;
            snmpInfo.snmpVersion != "2" || delete  snmpInfo.authPassWord;
            snmpInfo.snmpVersion != "2" || delete  snmpInfo.privacyProtocol;
            snmpInfo.snmpVersion != "2" || delete  snmpInfo.privPassWord;
            $scope.mode == "update" || delete  snmpInfo.id;

            if (snmpInfo.snmpVersion != "2") {
                if ($scope.mode == "update" && $("#authPassWordCheckBoxControl").widget().option("checked") == false) {
                    delete  snmpInfo.authPassWord;
                }
                if ($scope.mode == "update" && $("#privPassWordCheckBoxControl").widget().option("checked") == false) {
                    delete  snmpInfo.privPassWord;
                }
            }

            return snmpInfo;
        }

        function initSnmpClientView(iRow) {

            UnifyValid.clearValidate($("#nameControl").find("input"));
            UnifyValid.clearValidate($("#readNameControl").find("input"));
            UnifyValid.clearValidate($("#writeNameControl").find("input"));
            UnifyValid.clearValidate($("#authPassWordControl").find("input"));
            UnifyValid.clearValidate($("#privPassWordControl").find("input"));
            UnifyValid.clearValidate($("#confirmAuthPassWordControl").find("input"));
            UnifyValid.clearValidate($("#confirmPrivPassWordControl").find("input"));
            UnifyValid.clearValidate($("#outTimeControl").find("input"));
            UnifyValid.clearValidate($("#userNameControl").find("input"));
            UnifyValid.clearValidate($("#descriptionControl").find("textarea"));
            UnifyValid.clearValidate($("#ipControl"));
            UnifyValid.clearValidate($("#portControl").find("input"));

            $scope.snmpVersion = (iRow == null ? "3" : iRow.snmpVersion);
            var type = (iRow == null ? "NetScaler" : iRow.type)
            if (type == "NetScaler") {
                $scope.snmpVersionControl.values =
                    [
                        {
                            "selectId": "2",
                            "label": "SNMPv2c"
                        },
                        {
                            "selectId": "3",
                            "label": "SNMPv3",
                            "checked": true
                        }
                    ];
            }
            else {
                $scope.snmpVersionControl.values =
                    [
                        {
                            "selectId": "2",
                            "label": "SNMPv2c"
                        },
                        {
                            "selectId": "3",
                            "label": "SNMPv3",
                            "checked": true
                        }
                    ];
            }

            $("#snmpVersionControl").widget().opChecked((iRow == null ? "3" : iRow.snmpVersion));
            $("#readNameControl").widget().option("value", (iRow == null ? "" : iRow.readName));
            $("#writeNameControl").widget().option("value", (iRow == null ? "" : iRow.writeName));
            $("#userNameControl").widget().option("value", (iRow == null ? "" : iRow.userName));
            $("#authGenericControl").widget().opChecked((iRow == null ? "SHA" : iRow.authGeneric));
            $("#privacyProtocolControl").widget().opChecked((iRow == null ? "AES128" : iRow.privacyProtocol));
            $("#authPassWordControl").widget().option("value", "");
            $("#privPassWordControl").widget().option("value", "");
            $("#confirmAuthPassWordControl").widget().option("value", "");
            $("#confirmPrivPassWordControl").widget().option("value", "");
            $("#outTimeControl").widget().option("value", (iRow == null ? "3000" : iRow.outTime));
            $("#nameControl").widget().option("value", (iRow == null ? "" : iRow.name));
            $("#tsnmpClienTypeControl").widget().opChecked((iRow == null ? "NetScaler" : iRow.type));
            $("#descriptionControl").widget().option("value", (iRow == null ? "" : iRow.description));
            $("#ipControl").widget().option("value", (iRow == null ? "" : iRow.ip));
            $("#portControl").widget().option("value", (iRow == null ? "161" : iRow.port));

            if($("#checkComplexControl").widget())
            {
                $("#checkComplexControl").widget().option("checked", true);
            }
            if($("#checkComplexPasswordControl").widget())
            {
                $("#checkComplexPasswordControl").widget().option("checked", true);
            }
            $("#authPassWordCheckBoxControl").widget().option("checked", false);
            $("#privPassWordCheckBoxControl").widget().option("checked", false);
            $("#authPassWordControl").widget().option("disable", ( $scope.mode == "insert" ? false : true));
            $("#privPassWordControl").widget().option("disable", ( $scope.mode == "insert" ? false : true));
            $("#confirmAuthPassWordControl").widget().option("disable", ( $scope.mode == "insert" ? false : true));
            $("#confirmPrivPassWordControl").widget().option("disable", ( $scope.mode == "insert" ? false : true));

        }

        function Update() {
            var snmpInfo = createSnmPClientItem();
            AlarmService.modifySnmpClient(
                JSON.stringify({"snmpInfo": snmpInfo}), snmpInfo.id, user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            getData();
                            $scope.showWin = false;
                        });
                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        }

        function Insert() {
            var snmpInfo = createSnmPClientItem();
            AlarmService.addSnmpClient(
                JSON.stringify({"snmpInfo": snmpInfo}), user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            getData();
                            $scope.showWin = false;
                        });
                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        }

        function validateData() {
            if (!UnifyValid.FormValid($("#snmpClientView"))) {
                return false;
            }
            return true;
        }

        function getQueryJsonInfo() {
            $scope.reqParams.start = page.displayLength * (page.currentPage - 1);
            $scope.reqParams.limit = page.displayLength;
        }

        function getData() {
            getQueryJsonInfo();
            AlarmService.getSnmpClientList(
                $scope.reqParams, user,
                function (result) {
                    if (result.result == true) {
                        $scope.$apply(function () {
                            $scope.dataGridViewTable.data = result.data.snmpClients;
                            $scope.dataGridViewTable.totalRecords = result.data.total;

                        });
                    }
                    if (result.result == false) {
                        exception.doException(result.data, null);
                    }
                });
        };

        function page_load() {
            getData();
        }

        page_load();

    }];
    return snmpClientConfigCtrl;
});
