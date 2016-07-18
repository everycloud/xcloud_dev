/**
 * 文件名：
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：〈描述〉
 * 修改人：
 * 修改时间：14-2-24
 */
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Message",
    "tiny-common/UnifyValid",
    "app/business/system/services/physicalSubNetsService",
    "app/services/messageService",
    "tiny-directives/FormField",
    "tiny-directives/IP",
    "bootstrap/bootstrap.min",
    "fixtures/systemFixture"],

    function ($, angular, Message, UnifyValid, PhysicalSubNetsService, MessageService) {
        "use strict";
        var physicalSubNets = ["$scope", "$rootScope", "$q", "camel", "validator", function ($scope, $rootScope, $q, camel, validator) {

            var MAX_IP_SECTION = 3;
            var MAX_IP_NUM = 512;
            var physicalSubNetsService = new PhysicalSubNetsService($q, camel);
            var messageService = new MessageService();
            var ipValidator = {
                //ip转为10进制数字
                transform: function (ip) {
                    if (ip) {
                        var ipArr = ip.split(".");
                        return ipArr[0] * 256 * 256 * 256 + ipArr[1] * 256 * 256 + ipArr[2] * 256 + parseInt(ipArr[3]);
                    }
                    return -MAX_IP_NUM;
                },
                getIPs: function (id) {
                    if (id.indexOf("useIpSection_") > -1) {
                        try {
                            var idArr = id.split("_");
                            var startId = [idArr[0], "Start", idArr[2]].join("_");
                            var endId = [idArr[0], "End", idArr[2]].join("_");
                            var startIp = $("#" + startId).widget().getValue();
                            var endIp = $("#" + endId).widget().getValue();
                            return {
                                start: startIp || "",
                                end: endIp || ""
                            };
                        } catch (e) {
                            return {start: "", end: ""};
                        }
                    }
                    return {start: "", end: ""};
                },
                validIPSection: function (ipStart, ipEnd) {
                    var ipStartNum = ipValidator.transform(ipStart);
                    var ipEndNum = ipValidator.transform(ipEnd);
                    var discrepancy = ipEndNum - ipStartNum;
                    return discrepancy;
                },
                ipNumCheck: function (ipStart, ipEnd) {
                    var discrepancy = ipValidator.validIPSection(ipStart, ipEnd);
                    if (discrepancy > MAX_IP_NUM) {
                        var msg = "每一段最多输入512个IP地址";
                        return false;
                    }
                    return true;
                },
                ipOrderCheck: function (ipStart, ipEnd) {
                    var discrepancy = ipValidator.validIPSection(ipStart, ipEnd);
                    if (discrepancy < 0) {
                        var msg = "结束IP地址必须大于等于开始IP地址";
                        return false;
                    }
                    return true;
                },
                check: function (id, method) {
                    id[0] && (id = id[0]);
                    var ips = ipValidator.getIPs(id);
                    var useIpSectionVal = $scope.formObj.useIpSection.val;
                    var idArr = id.split("_");
                    //开始。结束ip都是ip格式才做进一步校验
                    var validResult;
                    var startOk = validator.ipFormatCheck(ips.start);
                    var endOk = validator.ipFormatCheck(ips.end);
                    if (startOk || endOk) {
                        //开始ip检查但在end ip上弹tip
                        validResult = ipValidator[method](ips.start, ips.end);

                        if (id.indexOf("useIpSection_Start_") === 0) {
                            //无奈啊 只能直接操作组件内部属性了。。。
                            var ipInput = $("#useIpSection_End_" + idArr[2]).widget()._element.find('.tiny_input_ip_anchor');
                            ipInput.focus();
                            //不弹tip
                            validResult = true;
                        }
                    } else {
                        validResult = true;
                    }
                    return validResult;
                }
            };

            UnifyValid.ipNumCheck = function (id) {
                return ipValidator.check(id, "ipNumCheck");
            };
            UnifyValid.ipOrderCheck = function (id) {
                return ipValidator.check(id, "ipOrderCheck");
            };
            UnifyValid.ipFormatCheck = function (id) {
                id[0] && (id = id[0]);
                var ip = $("#" + id).widget().getValue();
                var idArr = id.split("_");
                var validResult = validator.ipFormatCheck(ip);
                return validResult;
            };

            //校验配置
            var validConfig = [
                {
                    method: "ipFormatCheck",
                    errorMsg: "IP格式不正确"
                },
                {
                    method: "ipOrderCheck",
                    errorMsg: "结束IP地址必须大于等于开始IP地址"
                },
                {
                    method: "ipNumCheck",
                    errorMsg: "每一段最多输入512个IP地址"
                }
            ];
            //拼接ip段校验属性
            var concatProperties = function (index) {
                var extendFunction = [];
                var startValidate = [];
                var endValidate = [];
                for (var i = 0, len = validConfig.length; i < len; i++) {
                    extendFunction.push(validConfig[i].method);
                    startValidate.push(validConfig[i].method + "(useIpSection_Start_" + index + "):" + validConfig[i].errorMsg);
                    endValidate.push(validConfig[i].method + "(useIpSection_End_" + index + "):" + validConfig[i].errorMsg);
                }
                var properties = {
                    extendFunction: extendFunction,
                    startValidate: startValidate.join(";"),
                    endValidate: endValidate.join(";")
                }
                return properties;
            }
            //计算增加/删除按钮状态
            var operateState = function (showNum, total) {
                var disableAdd = false;
                var disableDel = false;
                showNum === total && ( disableAdd = true);
                return {
                    disableAdd: disableAdd,
                    disableDel: disableDel
                };
            }
            //初始化ip段model
            var initUseIpSection = function (vals) {
                var len = vals.length;
                var showNum = 0;
                var useIpSectionVal = [];
                for (var i = 0; i < len; i++) {
                    var properties = concatProperties(i);
                    var item = {
                        start: {
                            id: "useIpSection_Start_" + i,
                            val: vals[i].start,
                            extendFunction: properties.extendFunction,
                            validate: properties.startValidate
                        },
                        end: {
                            id: "useIpSection_End_" + i,
                            val: vals[i].end,
                            extendFunction: properties.extendFunction,
                            validate: properties.endValidate
                        },
                        show: !!vals[i].start
                    };
                    !!vals[i].start && (showNum++);
                    useIpSectionVal.push(item);
                }
                var state = operateState(showNum, len);
                return {
                    useIpSectionVal: useIpSectionVal,
                    disableAdd: state.disableAdd,
                    disableDel: state.disableDel
                }
            };
            var parseUserInputAvailIPRanges = function (userInputAvailIPRanges) {
                //format like "192.168.233.2-192.168.233.9;192.168.233.21-192.168.233.254";
                var userInputAvailIPRangesArr = userInputAvailIPRanges.split(";");
                var ipSectionVals = [];
                for (var i = 0; i < MAX_IP_SECTION; i++) {
                    var section = (userInputAvailIPRangesArr[i] || "-").split("-");
                    ipSectionVals.push({
                        start: section[0],
                        end: section[1]
                    });
                }
                var useIpSection = initUseIpSection(ipSectionVals);

                $scope.formObj.useIpSection.disableAdd = useIpSection.disableAdd;
                $scope.formObj.useIpSection.disableDel = useIpSection.disableDel;
                $scope.formObj.useIpSection.val = useIpSection.useIpSectionVal;
            };
            var concatUserInputAvailIPRanges = function (userInputAvailIPRanges) {
                var useIpSectionVal = $scope.formObj.useIpSection.val;
                var userInputAvailIPRangesArr = [];
                for (var i = 0, len = useIpSectionVal.length; i < len; i++) {
                    if (useIpSectionVal[i].start.val) {
                        userInputAvailIPRangesArr.push([useIpSectionVal[i].start.val, useIpSectionVal[i].end.val].join("-"));
                    }
                }
                $scope.model.userInputAvailIPRanges = userInputAvailIPRangesArr.join(";");
            };
            var parseData = function (resp) {
                $scope.model = resp;
                parseUserInputAvailIPRanges(resp.userInputAvailIPRanges);
            };

            $scope.formObj = {
                netPortName: {
                    id: "netPortNameId",
                    label: "网口名称:",
                    require: false,
                    width: 100,
                    val: [
                        {
                            "selectId": "GmnEx",
                            "label": "GmnEx",
                            "checked": true
                        }
                    ]
                },
                subnetAddr: {
                    id: "subnetAddr",
                    label: "子网IP:",
                    require: false
                },
                mask: {
                    id: "mask",
                    label: "子网掩码:",
                    require: false
                },
                gateway: {
                    id: "gateway",
                    label: "子网掩码:",
                    require: false
                },
                useIpSection: {
                    id: "useIpSection",
                    label: "可用IP段:",
                    require: false,
                    type: "ipv4"
                },
                save: {
                    id: "saveBtnId",
                    text: "保存",
                    handler: function () {
                        $scope.operater.save();
                    }
                }
            };
            $scope.model = {
                id: "",
                subnetAddr: "",
                mask: "",
                gateway: "",
                userInputAvailIPRanges: ""
            };

            $scope.operater = {
                //添加按钮动作
                add: function () {
                    var useIpSection = $scope.formObj.useIpSection;
                    var sections = useIpSection.val;

                    var len = sections.length;
                    var showNum = 0;

                    for (var i = 0; i < len; i++) {
                        if (sections[i].show) {
                            showNum++;
                        }
                    }
                    //显示下一个ip段input
                    sections[showNum].show = true;
                    showNum++;

                    var state = operateState(showNum, len);
                    useIpSection.disableAdd = state.disableAdd;
                    useIpSection.disableDel = state.disableDel;
                },
                //删除按钮动作
                del: function (index) {
                    var useIpSection = $scope.formObj.useIpSection;
                    var sections = useIpSection.val;

                    var len = sections.length;
                    var showNum = 0;

                    //删除当前ip段，在末尾补一个隐藏的空ip段
                    sections.splice(index, 1);

                    var properties = concatProperties(index);
                    sections.push({
                        show: false,
                        start: {
                            id: "useIpSection_Start_" + index,
                            val: "",
                            extendFunction: properties.extendFunction,
                            validate: properties.startValidate
                        },
                        end: {
                            id: "useIpSection_Start_" + index,
                            val: "",
                            extendFunction: properties.extendFunction,
                            validate: properties.startValidate
                        }
                    });

                    for (var i = 0; i < len; i++) {
                        if (sections[i].show) {
                            showNum++;
                        }
                    }
                    var state = operateState(showNum, len);
                    useIpSection.disableAdd = state.disableAdd;
                    useIpSection.disableDel = state.disableDel;
                },
                //获取物理设备子网信息
                get: function () {
                    var promise = physicalSubNetsService.queryPhysicalSubNets({
                        userId: $rootScope.user.id
                    });
                    promise.then(function (resolvedValue) {
                        parseData(resolvedValue);
                    });
                },
                //保存物理设备子网信息
                save: function () {
                    if (UnifyValid.FormValid($("#physicalSubNetsDiv"))) {
                        concatUserInputAvailIPRanges();
                        var promise = physicalSubNetsService.putPhysicalSubNets({
                            userId: $rootScope.user.id,
                            params: JSON.stringify($scope.model)
                        });
                        promise.then(function (resolvedSave) {
                            messageService.okMsgBox("保存成功");
                        });
                    }
                }
            };
            //获取物理设备子网信息
            $scope.operater.get();
        }];


        return physicalSubNets;
    });