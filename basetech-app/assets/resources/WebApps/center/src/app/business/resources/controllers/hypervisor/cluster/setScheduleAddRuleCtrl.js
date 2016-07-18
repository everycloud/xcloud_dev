define(['jquery',
	"tiny-widgets/Checkbox",
	"app/services/httpService",
	"tiny-common/UnifyValid",
	"tiny-widgets/Message",
	"app/business/resources/services/cluster/clusterService",
	"app/services/exceptionService",
	"bootstrapui/ui-bootstrap-tpls",
	"fixtures/hypervisorFixture"
], function ($, Checkbox, httpService, UnifyValid, Message, clusterService, Exception,uibootstrap) {
	var vgInfoCtrl = ["$scope", "camel", "$compile" , function ($scope, camel, $compile) {
		var exceptionService = new Exception();
		var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
		var window = $("#addRuleWindow").widget();
		var clusterId = window.option('clusterId');
		var ruleIndex = window.option('ruleIndex');
		var ruleType = window.option('ruleType');
		var drsBaseInfo = window.option('drsBaseInfo');
		$scope.ruleType = ruleType;

		var vmGroupInfoSeted = [];
		var hostGroupInfoSeted = [];

		var allExistMemebers = [];

		UnifyValid.checkName = function () {
			var value = $(this).val();
			value = $.trim(value);
			//字符串不能有“{”、“#”、“}”、“:”
			if(value.indexOf("{") != -1 || value.indexOf("}") != -1
				|| value.indexOf("#") != -1 || value.indexOf(":") != -1
				|| value.indexOf("：") != -1){
				return false;
			}
			return !(value.length < 1 || value.length > 128);
		};

        $scope.dealNgbindString = {
            waitChoose_value : $scope.i18n.common_term_waitChoose_value+"：",
            choosed_value : $scope.i18n.common_term_choosed_value+"："
        };

		$scope.ruleTypes = {
			"gather": "1",
			"mutex": "2",
			"vmToHost": "3"
		}
		//名称输入框
		$scope.nameTextbox = {
			"label": $scope.i18n.common_term_name_label+":",
			"require": true,
			"type": "input",
			"id": "vgNameTextbox",
			"extendFunction": ["checkName"],
			"tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: "1", 2: "128"}) + $scope.i18n.common_term_noSpecialCharacter1_valid)
				|| '长度1～128个字符,不能包含{,},#和冒号。',
			"validate": "checkName():" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: "1", 2: "128"})  + $scope.i18n.common_term_noSpecialCharacter1_valid
		}
		//类型下拉框
		$scope.typeSelector = {
			"label": $scope.i18n.common_term_type_label+":",
			"id": "ruleTypeSelector",
			"width": "150",
			"disable": (ruleIndex) ? true : false,
			"values": [
				{
					"selectId": $scope.ruleTypes.gather,
					"label":  $scope.i18n.virtual_cluster_schedul_para_rule_option_gather_value || "聚集虚拟机",
					"checked": true
				},
				{
					"selectId": $scope.ruleTypes.mutex,
					"label": $scope.i18n.virtual_cluster_schedul_para_rule_option_mutex_value || "互斥虚拟机"
				},
				{
					"selectId": $scope.ruleTypes.vmToHost,
					"label": $scope.i18n.virtual_cluster_schedul_para_rule_option_VMtoHost_value || "虚拟机到主机"
				}
			],
			"change": function () {
				var result = $("#" + $scope.typeSelector.id).widget().getSelectedId();
				$scope.ruleType = result;
				refrshBtnStatus();
			}
		};
		//集群虚拟机组下拉框
		$scope.vmSelector = {
			"label": $scope.i18n.vm_term_VMgroup_label || "虚拟机组:",
			"require": true,
			"id": "clusterVmSelector",
			"width": "200",
			"validate":  "required:" + ($scope.i18n.common_term_null_valid + ";"  ||  "不能为空;" ),
			"values": [],
			"change" : function (){
			}
		}
		//规则下拉框
		$scope.ruleSelector = {
			"label":  $scope.i18n.common_term_rule_label || "规则:",
			"require": true,
			"id": "vmToHostRuleSelector",
			"width": "200",
			"validate":  "required:" + ($scope.i18n.common_term_null_valid + ";"  ||  "不能为空;" ),
			"values": [
				{selectId: 1, label: $scope.i18n.virtual_cluster_schedul_para_rule_option_onHost_value ||  "必须在该组中的主机上运行"},
				{selectId: 2, label: $scope.i18n.virtual_cluster_schedul_para_rule_option_onHostAdvice_value || "应在该组中的主机上运行"},
				{selectId: 3, label: $scope.i18n.virtual_cluster_schedul_para_rule_option_notHost_value || "不得在该组中的主机上运行"},
				{selectId: 4, label: $scope.i18n.virtual_cluster_schedul_para_rule_option_notHostAdvice_value || "不应在该组中的主机上运行"}
			],
			"change" : function (){
			}
		}
		//集群主机组下拉框
		$scope.hostSelector = {
			"label": $scope.i18n.common_term_hostGroup_label + ":" || "主机组:",
			"require": true,
			"id": "clusterHostSelector",
			"width": "200",
			"validate":  "required:" + ($scope.i18n.common_term_null_valid + ";"  ||  "不能为空;" ),
			"values": [],
			"change" : function (){
			}
		}

		$scope.SearchModel = {
			"vmName": '',
			"vmId": '',
			"curpage": 1,
			"pageSize": 10,
			"offset": 0,
			"limit": 10
		};
		//待选虚拟机列表
		var leftPage = null;
		$scope.leftTable = {
			"id": "addRuleLeftTable",
			"data": [],
			"paginationStyle": "simple",
			"lengthChange": true,
			"enablePagination": true,
			"lengthMenu": [10, 20, 50],
			"columnSorting": [],
			"curPage": {
			},
			"columns": [
				{
					"sTitle": "",
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.ck);
					},
					"bSortable": false,
					sWidth: '20px'
				},
				{
					"sTitle": $scope.i18n.common_term_name_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.name);
					},
					"bSortable": false
				},
				{
					"sTitle": "ID",
					"mData": function (data) {
						var newId = clusterService.getVMVisibleId(data.id);
						return $.encoder.encodeForHTML(newId);
					},
					"bSortable": false
				}
			],
			"callback": function (pageInfo) {
				$scope.SearchModel.curpage = pageInfo.currentPage;
				$scope.SearchModel.offset = pageInfo.displayLength * (pageInfo.currentPage - 1);
				initLeftVMs(allExistMemebers);
			},
			"changeSelect": function (pageInfo) {
				$scope.SearchModel.offset = 0;
				$scope.SearchModel.curpage = 1;
				$scope.SearchModel.limit = pageInfo.displayLength;
				initLeftVMs(allExistMemebers);
			},
			"renderRow": function (nRow, aData, iDataIndex) {
				$('td:eq(1)', nRow).addTitle();
				$('td:eq(2)', nRow).attr("title",aData.id);
				var options = {
					"id": "leftCheckbox_" + iDataIndex,
					"checked": false,
					"change": function(){
						var result = $("#leftCheckbox_" + iDataIndex).widget().option("checked");
						if(result){
							//选中则给右侧添加一条
							$scope.operator.leftToRight(aData.id, aData.name);
						} else {
							//去选中则将右侧对应一条删除
							$scope.operator.rightToLeft(aData.id);
						}
					}
				};
				var checkbox = new Checkbox(options);
				$('td:eq(0)', nRow).html(checkbox.getDom());
			}
		};
		//已选虚拟机列表
		var rightPage = null;
		$scope.rightTable = {
			"id": "addRuleRightTable",
			"data": [],
			"lengthChange": true,
			"enablePagination": false,
			"columns": [
				{
					"sTitle": $scope.i18n.common_term_name_label,
					"mData":  function (data) {
						return $.encoder.encodeForHTML(data.name);
					},
					"bSortable": false
				},
				{
					"sTitle": "ID",
					"mData":  function (data) {
						var newId = clusterService.getVMVisibleId(data.id);
						return $.encoder.encodeForHTML(newId);
					},
					"bSortable": false
				},
				{
					"sTitle": $scope.i18n.common_term_operation_label,
					"mData": function (data) {
						return $.encoder.encodeForHTML(data.operator);
					},
					"bSortable": false,
					sWidth: '40px'
				}
			],
			"renderRow": function (nRow, aData, iDataIndex) {
				$('td:eq(0)', nRow).addTitle();
				$('td:eq(1)', nRow).attr("title",aData.id);

				var optColumn = "<a href='javascript:void(0)' ng-click='delete()'>"+$scope.i18n.common_term_delete_button+"</a>";
				var optLink = $compile($(optColumn));
				var optScope = $scope.$new();
				optScope.delete = function () {
					$scope.operator.rightToLeft(aData.id);
					//去选择左侧列表
					unSelectLeft(aData.id);
				};
				var optNode = optLink(optScope);
				$("td:eq(2)", nRow).html(optNode);
			}
		};

		function initLeftVMs(ruledVMs) {
			var pageInfo = {
				"limit": $scope.SearchModel.limit,
				"offset": $scope.SearchModel.offset,
				"filterName": $scope.SearchModel.vmName
			}
			clusterService.getVMsByClutser(clusterId, pageInfo,
				function (data) {
					$scope.$apply(function () {
                            var vms = data && data.vmInfoList || [];
							$scope.leftTable.data = vms;
							$scope.leftTable.totalRecords = data.total;
						
						if ($("#" + $scope.leftTable.id).widget()) {
							$("#" + $scope.leftTable.id).widget().option("total-records", data.total);
							$("#" + $scope.leftTable.id).widget().option("cur-page", {"pageIndex": $scope.SearchModel.curpage});
							$("#" + $scope.leftTable.id).widget().option("display-length", $scope.SearchModel.limit);
						}
					});
					initLeftSelected(ruledVMs);
				},
				function (data) {
				});
		};

		function initRule(callbackGetVms,initResourceGroups) {
			clusterService.getClusterDRS(clusterId,
				function (data) {
					$scope.$apply(function () {
						if (data && data.drsParams) {

							//初始化规则信息
							if (data.drsParams.drsRules) {
								var rules = data.drsParams.drsRules;
								//修改规则时初始化
								var vmSelectorItemURN = null;
								var hostSelectorItemURN = null;
								if (ruleIndex) {
									for (var i = 0; i < rules.length; i++) {
										if (rules[i].ruleIndex == ruleIndex) {
											var ru = rules[i];
											for (var k = 0; k < ru.vms.length; k++) {
												ru.vms[k].id = ru.vms[k].urn;
											}
											$scope.rightTable.data = ru.vms;
											$scope.nameTextbox.value = ru.ruleName;
											$("#" + $scope.typeSelector.id).widget().opChecked(ru.ruleType);
											$("#" + $scope.ruleSelector.id).widget().opChecked(rules[i].vm2HostRuleType);

											vmSelectorItemURN = rules[i].vmGroupUrn;
											hostSelectorItemURN = rules[i].hostGroupUrn;
											$scope.ruleType = ru.ruleType;
											break;
										}
									}
								}
								//获取已被设置规则VM的id
								//获取已被设置规则的VM组和主机组
								var ruledVMs = [];
								for (var i = 0; i < rules.length; i++) {
									if (rules[i].ruleType != 3) {
										for (var ii = 0; ii < rules[i].vms.length; ii++) {
                                            var tempRuledVMs = [];
                                            tempRuledVMs.push(rules[i].vms[ii]);
                                            tempRuledVMs.push(rules[i].ruleType);
                                            ruledVMs.push(tempRuledVMs);
										}
									}else{//虚拟机到主机
										if(ruleIndex && (ruleIndex == rules[i].ruleIndex)){
											continue;
										}
										vmGroupInfoSeted.push(rules[i].vmGroupUrn);
										hostGroupInfoSeted.push(rules[i].hostGroupUrn);
									}
								}
								initResourceGroups(vmSelectorItemURN,hostSelectorItemURN);
								callbackGetVms(ruledVMs);
							}
						}
					});
				},
				function (data) {
					initResourceGroups();
					callbackGetVms([]);
				});
		};

		function unSelectLeft(resourceId){
			var leftTable =$("#" + $scope.leftTable.id).widget();
			var data = leftTable.option("data");
			var index = 0;
			while ($("#leftCheckbox_" + index).widget()) {
				for (var k = 0; k < data.length; k++) {
					if (resourceId == data[index].id) {
						$("#leftCheckbox_" + index).widget().option("checked", false);
					}
				}
				index++;
			}
		}

		function initLeftSelected(ruledVMs) {
			//修改时，初始化左侧列表的选中
			var leftTable = $("#" + $scope.leftTable.id).widget();
			var data = leftTable.option("data");
			var rightData =$("#" + $scope.rightTable.id).widget().option("data");
			var index = 0;
			while ($("#leftCheckbox_" + index).widget()) {
				for (var k = 0; k < rightData.length; k++) {
					if (rightData[k].id == data[index].id) {
						$("#leftCheckbox_" + index).widget().option("checked", true);
					}
				}
				for (var t = 0; t < ruledVMs.length; t++) {
                    var getSelectedId = $("#ruleTypeSelector").widget().getSelectedId()
                    if(ruledVMs[t][0].urn ==  data[index].id && !$("#leftCheckbox_" + index).widget().option("checked") && getSelectedId == ruledVMs[t][1])
                    {
                            $("#leftCheckbox_" + index).widget().option("disable", true);
                            $scope.type = data[index].orgId;
                    }
				}
				index++;
			}
		}

		function isExistInRight(leftVmId) {
			var rigthTable =$("#" + $scope.rightTable.id).widget();
			var data = rigthTable.option("data");
			if (data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == leftVmId) {
						return true;
					}
				}
			}
			return false;
		}

		$scope.operator = {
			"leftToRight": function (leftResourceId,leftResourceName) {
				if (!isExistInRight(leftResourceId)) {
					$scope.rightTable.data.push({"name": leftResourceName, "id": leftResourceId});
				}
				$("#" + $scope.rightTable.id).widget().option("data", $scope.rightTable.data);
			},
			leftToRightAll: function () {
			},
			rightToLeft: function (resourceId) {
				var iDataIndex = -1;
				var rigthTable = $("#" + $scope.rightTable.id).widget();
				var data = rigthTable.option("data");
				if (data) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].id == resourceId) {
							iDataIndex = i;
							break;
						}
					}
				}
				$scope.rightTable.data.splice(iDataIndex, 1);
				$("#" + $scope.rightTable.id).widget().option("data", $scope.rightTable.data);
			},
			rightToLeftAll: function () {
			}
		};

		//模糊搜索框
		$scope.searchBox = {
			"id": "searchVmBox",
			"placeholder":  $scope.i18n.common_term_findName_prom,
			"search": function (searchString) {
				$scope.SearchModel.vmName = '';

				$scope.SearchModel.offset = 0;
				$scope.SearchModel.curPage = 1;
				$scope.SearchModel.vmName = searchString
				initLeftVMs(allExistMemebers);
			}
		};

		//确定按钮
		$scope.okButton = {
			"id": "addRuleOkButton",
			"disable" : false,
			"text": $scope.i18n.common_term_ok_button,
			"click": function () {
				save();
			}
		};

		function save() {
			var result = UnifyValid.FormValid($("#addRuleNameDiv"));
			if (!result) {
				return;
			}
			var reqParams = {};
			var vms = [];
			//聚集虚拟机 互斥虚拟机 虚拟机主机组
			var ruleTypeSelectValue = $("#" + $scope.typeSelector.id).widget().getSelectedId();
			if (ruleTypeSelectValue == '1' || ruleTypeSelectValue == '2') {
				var rigthTable =  $("#" + $scope.rightTable.id).widget();
				var vmData = rigthTable.option("data");
				for (var i = 0; i < vmData.length; i++) {
					vms.push({urn: vmData[i].id + "", name: vmData[i].name});
				}
				reqParams.vms = vms;
			} else {
				reqParams.vmGroupUrn = $("#" + $scope.vmSelector.id).widget().getSelectedId();
				reqParams.hostGroupUrn = $("#" + $scope.hostSelector.id).widget().getSelectedId();
				reqParams.vm2HostRuleType = $("#" + $scope.ruleSelector.id).widget().getSelectedId();
			}
			reqParams.ruleName = $.trim($("#" + $scope.nameTextbox.id).widget().getValue());
			reqParams.ruleType = ruleTypeSelectValue;
			var req = {
				"drsRules" : [reqParams]
			};
			if (ruleIndex) {
				reqParams.ruleIndex = ruleIndex;
				clusterService.editRule(clusterId, req,
					function (data) {
						window.destroy();
					}, function (data) {
						exceptionService.doException(data);
					});
			} else {
				clusterService.addRule(clusterId, req,
					function (data) {
						window.destroy();
					}, function (data) {
						exceptionService.doException(data);
					});
			}
		}

		//取消按钮
		$scope.cancelButton = {
			"id": "addRuleCancelButton",
			"text":$scope.i18n.common_term_cancle_button,
			"click": function () {
				window.destroy();
			}
		};

		function isVmGroupExist(urn) {
			if (vmGroupInfoSeted) {
				for (var i = 0; i < vmGroupInfoSeted.length; i++) {
					if (urn == vmGroupInfoSeted[i]) {
						return true;
					}
				}
			}
			return false;
		};
		function isHostGroupExist(urn) {
			if (hostGroupInfoSeted) {
				for (var i = 0; i < hostGroupInfoSeted.length; i++) {
					if (urn == hostGroupInfoSeted[i]) {
						return true;
					}
				}
			}
			return false;
		};

		function initResourceGroups(vmSelectorItemURN,hostSelectorItemURN) {
			//VM
			clusterService.getResourceGroup(clusterId, {type: 0},
				function (data) {
					if (data && data.groups) {
						$scope.$apply(function () {
							var vmValues = [];
							for (var i = 0; i < data.groups.length; i++) {
								if(isVmGroupExist(data.groups[i].urn)){
									continue;
								}
								var v = {selectId: data.groups[i].urn, label: data.groups[i].name};
								if(vmSelectorItemURN == data.groups[i].urn){
									v.checked = true;
								}
								vmValues.push(v);
							}
							$scope.vmSelector.values = vmValues;
						});
					}
				}, function (data) {
				});
			//host
			clusterService.getResourceGroup(clusterId, {type: 1},
				function (data) {
					if (data && data.groups) {
						$scope.$apply(function () {
							var hostValues = [];
							for (var i = 0; i < data.groups.length; i++) {
								if(isHostGroupExist(data.groups[i].urn)){
									continue;
								}
								var v = {selectId: data.groups[i].urn, label: data.groups[i].name};
								if(hostSelectorItemURN == data.groups[i].urn){
									v.checked = true;
								}
								hostValues.push(v);
							}
							$scope.hostSelector.values = hostValues;
						});
					}
				}, function (data) {
				});
		}

		function refrshBtnStatus(){
            init();
		}

		function init() {
			/*
			 查资源组
			 查规则
			 设置“虚拟机到主机”的下拉
			 查询VM列表
			 */
				initRule(function (ruledVMs) {
					if (!(ruleIndex && ruleType == '3')) {
						allExistMemebers = ruledVMs;
						initLeftVMs(ruledVMs);
					}
				},function (vmSelectorItemURN,hostSelectorItemURN){
					initResourceGroups(vmSelectorItemURN,hostSelectorItemURN);
				});
		}
		init();
	}];

	var addRuleModule = angular.module("resources.cluster.addRule", ["ng","ui.bootstrap"]);
	addRuleModule.service("camel", httpService);
	addRuleModule.controller("resources.cluster.addRule.ctrl", vgInfoCtrl);
	return addRuleModule;
});