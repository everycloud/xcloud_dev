define(['jquery',
	"tiny-widgets/Checkbox",
	"app/services/httpService",
	"tiny-common/UnifyValid",
	"tiny-widgets/Message",
	"app/business/resources/services/cluster/clusterService",
	"app/services/exceptionService",
	"fixtures/hypervisorFixture"
], function ($, Checkbox, httpService, UnifyValid, Message, clusterService, Exception) {
	var vgInfoCtrl = ["$scope", "camel","$compile" , function ($scope, camel,$compile) {
		var exceptionService = new Exception();
		var user = $("html").scope().user;
        $scope.i18n = $("html").scope().i18n;
		var window = $("#addVgWindow").widget();
		var clusterId = window.option('clusterId');
		var resourceGroupId = window.option('resourceGroupId');
		var existMemebers = [];
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

		//名称输入框
		$scope.nameTextbox = {
			"label": $scope.i18n.common_term_name_label+":",
			"require": true,
			"id": "vgNameTextbox",
			"value": "",
			"extendFunction": ["checkName"],
			"tooltip": ($scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: "1", 2: "128"}) + $scope.i18n.common_term_noSpecialCharacter1_valid)
				|| '长度1～128个字符,不能包含{,},#和冒号。',
			"validate": "checkName():" + $scope.i18n.sprintf($scope.i18n.common_term_length_valid, {1: "1", 2: "128"})  + $scope.i18n.common_term_noSpecialCharacter1_valid
		};

		$scope.SearchModel = {
			"vmName": '',
			"id": '',
			"curpage": 1,
			"pageSize": 10,
			"offset": 0,
			"limit": 10
		};
		//待选虚拟机列表
		var leftPage = null;
		$scope.leftTable = {
			"id": "addVgLeftTable",
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
			"id": "addVgRightTable",
			"data": [],
			"lengthChange": true,
			"enablePagination": false,
			"columnSorting": [],
			"curPage": {
			},
			"columns": [
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
						$scope.leftTable.data = data.vmInfoList;
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
		function initResourceGroup() {
			clusterService.getResourceGroup(clusterId, {type: 0},
				function (data) {
					if (data && data.groups) {
						for (var i = 0; i < data.groups.length; i++) {
							if (resourceGroupId == data.groups[i].urn) {
								for (var ii = 0; ii < data.groups[i].groupMembers.length; ii++) {
									existMemebers.push({id: data.groups[i].groupMembers[ii].id});
								}
								$scope.$apply(function () {
									$scope.rightTable.data = data.groups[i].groupMembers;
									$scope.nameTextbox.value = data.groups[i].name;
								});
								break;
							}
						}
						refrshBtnStatus();

						for (var i = 0; i < data.groups.length; i++) {
							var mems = data.groups[i].groupMembers;
							if (mems) {
								for (var k = 0; k < mems.length; k++) {
									allExistMemebers.push(mems[k]);
								}
							}
						}
						initLeftVMs(allExistMemebers);
					}
				}, function (data) {
					initLeftVMs([]);
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
					if(ruledVMs[t].id ==  data[index].id && !$("#leftCheckbox_" + index).widget().option("checked")){
						$("#leftCheckbox_" + index).widget().option("disable", true);
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
				refrshBtnStatus();
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
				refrshBtnStatus();
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

		//获取资源组内元素修改类型 0：删除  1：增加
		function modifyMemebers(newMemList) {
			var saveList = [];
			var otherList = [];
			//新增的
			for (var i = 0; i < newMemList.length; i++) {
				if (!isExist(newMemList[i].id)) {
					newMemList[i].operationType = 1;
					saveList.push(newMemList[i]);
				} else {
					otherList.push(newMemList[i]);
				}
			}
			//删除的
			for (var k = 0; k < existMemebers.length; k++) {
				if (!isExist2(existMemebers[k].id, otherList)) {
					existMemebers[k].operationType = 0;
					saveList.push(existMemebers[k]);
				}
			}
			return saveList;
		};

		//是否为已有的元素
		function isExist(id) {
			for (var k = 0; k < existMemebers.length; k++) {
				if (id == existMemebers[k].id) {
					return true;
				}
			}
			return false;
		}

		function isExist2(id, newMemList) {
			for (var k = 0; k < newMemList.length; k++) {
				if (id == newMemList[k].id) {
					return true;
				}
			}
			return false;
		}

		function save() {
			var result = UnifyValid.FormValid($("#addVgNameDiv"));
			if (!result) {
				return;
			}
			var req = {};
			req.name = $.trim($("#" + $scope.nameTextbox.id).widget().getValue());
			var rigthTable = $("#addVgRightTable").widget();
			var vmData = rigthTable.option("data");
			var members = [];
			for (var i = 0; i < vmData.length; i++) {
				members.push({id: vmData[i].id, name: vmData[i].name});
			}

			if (resourceGroupId) {
				req.groupMembers = modifyMemebers(members);
				req.urn = resourceGroupId;
				clusterService.editResourceGroup(clusterId, req,
					function (data) {
						window.destroy();
					}, function (data) {
						exceptionService.doException(data);
					});
			} else {
				req.groupMembers = members;
				req.type = 0;
				clusterService.addResourceGroup(clusterId, req,
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
			"text": $scope.i18n.common_term_cancle_button,
			"click": function () {
				window.destroy();
			}
		};

		function refrshBtnStatus(){
		}

		function init() {
			/*
			 查资源组
			 查询VM列表
			 */
			initResourceGroup();
		}
		init();
	}];

	var addVgModule = angular.module("resources.cluster.addVg", ["ng"]);
	addVgModule.service("camel", httpService);
	addVgModule.controller("resources.cluster.addVg.ctrl", vgInfoCtrl);
	return addVgModule;
});