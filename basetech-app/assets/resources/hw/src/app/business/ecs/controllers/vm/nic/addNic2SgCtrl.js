/**
 * 文件名：addNicCtrl.js
 * 版权：Huawei Technologies Co., Ltd. Copyright 2013-2014,  All rights reserved
 * 描述：虚拟机详情--添加网卡的control
 * 修改时间：14-2-18
 */
/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        'sprintf',
        'tiny-lib/angular-sanitize.min',
        'language/keyID',
        'app/services/httpService',
        'tiny-common/UnifyValid',
        'app/services/validatorService',
        'app/services/exceptionService',
        'app/business/ecs/services/vm/vmNicService',
        'tiny-directives/Radio',
        'tiny-directives/RadioGroup',
        'tiny-directives/Select',
        "fixtures/ecsFixture"
    ],
    function ($, angular,sprintf, ngSanitize, keyIDI18n, http, UnifyValid, validatorService, exception, vmNicService) {
        "use strict";

        var addNic2SgCtrl = ["$scope", "$compile", "$q", "camel", "exception",
            function ($scope, $compile, $q, camel, exception) {
                var sgWindow =  $("#ecsVmsDetailAddNic2SgWinId").widget();
                var vmId = sgWindow.option("vmId");
                var nicId = sgWindow.option("nicId");
                var vpcId = sgWindow.option("vpcId");
                var cloudInfra = sgWindow.option("cloudInfra");
                var sgInfo = sgWindow.option("sgInfo") || [];
                var user = $("html").scope().user || {};
                var isIT = user.cloudType === "IT";
                $scope.isIT = isIT;
                var vmNicServiceIns = new vmNicService(exception, $q, camel);
                var validator = new validatorService();
                keyIDI18n.sprintf = sprintf.sprintf;
                $scope.i18n = keyIDI18n;
                var i18n = $scope.i18n;
                // 搜索字符串
                var searchString = "";
                var sgID = "";
                var sgName = "";
                var sgId = "";
                // 当前页码信息
                var page = {
                    "currentPage": 1,
                    "displayLength": 10,
                    "name":"",
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
                    querySgs();
                };
                $scope.nextPage = function () {
                    if (!$scope.hasNextPage) {
                        return;
                    }
                    var item = $scope.sgs.data[page.displayLength - 1] || {};
                    markers.push(item.sgID);
                    $scope.hasPrePage = true;
                    page.currentPage++;
                    querySgs();
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
                        querySgs();
                    }
                };
                //模糊搜索框
                $scope.searchBox = {
                    "id": "searchSgBox",
                    "placeholder": $scope.i18n.common_term_findName_prom,
                    "search": function (searchString) {
                        page.currentPage = 1;
                        querySgs();
                    }
                };
                $scope.sgs = {
                    "id": "ecsVmDetailAddNic2Sgs",
                    "paginationStyle": "full_numbers",
                    "enablePagination": isIT ? true : false,
                    "totalRecords": 0,
                    "lengthMenu": [10, 20, 30],
                    "displayLength": 10,
                    "columns": [{
                        "sTitle": "",
                        "mData": "",
                        "sWidth": "30px",
                        "bSearchable": false,
                        "bSortable": false
                    }, {
                        "sTitle": i18n.common_term_name_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        }
                    }, {
                        "sTitle": i18n.common_term_desc_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.description);
                        }
                    }, {
                        "sTitle": i18n.virtual_term_ruleNum_label,
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.sgRuleCount);
                        }
                    }],
                    "data": [],
                    "callback": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        querySgs();
                    },
                    "changeSelect": function (evtObj) {
                        page.currentPage = evtObj.currentPage;
                        page.displayLength = evtObj.displayLength;
                        querySgs();
                    },
                    "renderRow": function (nRow, aData, iDataIndex) {
                        //单选按钮
                        var selBox = "<div><tiny-radio id='id' value='value' name='name' checked='checked' change='change()' disable='disable'></tiny-radio></div>";
                        var selBoxLink = $compile(selBox);
                        var selBoxScope = $scope.$new();
                        selBoxScope.value = aData.sgID;
                        selBoxScope.name = "ecsVmDetailAddNic2SgSgsRadio";
                        selBoxScope.id = "ecsVmDetailAddNic2SgSgRadioId" + iDataIndex;
                        selBoxScope.checked = aData.checked;
                        selBoxScope.disable = !!aData.joinAlready;
                        selBoxScope.change = function () {
                            sgID = aData.sgID;
                            $scope.okBtn.disable = false;

                            //获取当前选择的安全组的ID 名称
                            sgName = aData.name;
                            sgId = aData.sgID;

                        };
                        var selBoxNode = selBoxLink(selBoxScope);
                        $("td:eq(0)", nRow).html(selBoxNode);
                    }
                };

                $scope.okBtn = {
                    "id": "ecsVmDetailAddNicOK",
                    "text": i18n.common_term_ok_button,
                    "disable": true,
                    "click": function () {
                        var options = {
                            "vmId": vmId,
                            "nicId": nicId,
                            "vpcId": vpcId,
                            "networkId": $("#ecsVmDetailAddNic2SgSgRadioId0").widget().opChecked(),
                            "cloudInfraId": cloudInfra.id,
                            "sgID": sgID,
                            "user": user
                        };

                        var deferred = vmNicServiceIns.addNic2SecurityGroup(options);
                        deferred.then(function (data) {
                            $(".ecs_vm_detail_nics").scope().reloadVmNics = true;
                            $("#ecsVmsDetailAddNic2SgWinId").widget().destroy();
                        });
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmDetailAddNicCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmsDetailAddNic2SgWinId").widget().destroy();
                    }
                };

                // 查询安全组列表
                function querySgs() {
                    var options = {
                        "cloudInfraId": cloudInfra.id,
                        "user": user,
                        "vpcId": vpcId,
                        "limit": page.displayLength
                    };
                    if($("#" + $scope.searchBox.id).widget()){
                        page.name = $("#" + $scope.searchBox.id).widget().getValue();
                    }
                    if(isIT) {
                        options.start = page.getStart();
                        options.name = page.name;
                    }
                    else {
                        var length = markers.length;
                        options.start = markers[length-1] || null;
                    }

                    var deferred = vmNicServiceIns.querySg(options);
                    deferred.then(function (data) {
                        if (data) {
                            var datas = data.sgs || [];
                            for(var i=0;i<datas.length;i++){
                                for(var j=0;j<sgInfo.length;j++){
                                    if(sgInfo[j].sgId === datas[i].sgID){
                                        datas[i].joinAlready = true;
                                        break;
                                    }
                                }
                            }
                            $scope.sgs.data = datas;
                            $scope.sgs.displayLength = page.displayLength;
                            $scope.sgs.totalRecords = data.total;
                            if (datas.length < page.displayLength) {
                                $scope.hasNextPage = false;
                            }
                            else {
                                $scope.hasNextPage = true;
                            }
                            $("#" + $scope.sgs.id).widget().option("cur-page", {
                                "pageIndex": page.currentPage
                            });

                            // 清空已选网络
                            $scope.okBtn.disable = true;
                            var radio = $("#ecsVmDetailAddNicNetRadioId0").widget();
                            if (radio) {
                                radio.option("checked", false);
                            }
                        }
                    });
                }

                //获取初始数据
                querySgs();
            }
        ];

        var addNic2SgModule = angular.module("ecs.vm.detail.nic.add2sg", ['ng',"wcc","ngSanitize"]);
        addNic2SgModule.controller("ecs.vm.detail.nic.add2sg.ctrl", addNic2SgCtrl);
        addNic2SgModule.service("camel", http);
        addNic2SgModule.service("exception", exception);

        return addNic2SgModule;
    }
);
