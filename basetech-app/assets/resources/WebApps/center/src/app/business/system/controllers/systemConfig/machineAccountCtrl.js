define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "app/services/commonService",
    "app/services/messageService",
    "app/services/mainService",
    "app/services/exceptionService",
    "tiny-widgets/Window",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/FilterSelect"],
    function ($, angular, commonService, MessageService, MainService, ExceptionService, Window) {

        "use strict";
        var operatorLogCtrl = ["$scope", "$q", "camel", "$compile", function ($scope, $q, camel, $compile) {
            var $rootScope = $("html").scope();
			var i18n = $scope.i18n || {};

			$scope.hasAccountManageOperateRight = $rootScope.user.privilege.role_role_add_option_machine_accountHandle_value;

			$scope.centerTitle = i18n.sys_term_machineAccountMgmt_label || "机机账号管理";
            var userId = $rootScope.user.id;
            var exception = new ExceptionService();
            var mainService = new MainService(exception, $q, camel);
            var vdiWindowOptions = {
                "winId": "vdiWindowId",
                "minimizable": false,
                "maximizable": false,
                "content-type": "url",
                "content": "app/business/system/views/systemConfig/editMachineAccount.html",
                "height": 280,
                "width": 620,
                "buttons": null,
                "close": function (event) {
                    $scope.search();
                }
            };

            $scope.searchModel = {
                type: ""
            };

			//搜索框
			$scope.searchBox = {
				"id": "amchineAccountSearchBoxId",
				"placeholder": i18n.sys_term_findMashineAccount_prom || "请输入帐户类型",
				"type": "round", // round,square,long
				"width": "200",
				"maxLength": 64,
				"search": function (searchString) {
					$scope.searchModel.type = "";
					$scope.searchModel.type = $.trim(searchString);
					$scope.search();
				}
			};

            $scope.btns = {
                refresh: {
                    id: "refreshBtn",
                    text: i18n.common_term_fresh_button||"刷新",
                    handler: function () {
                        $scope.search();
                    }
                }
            };

            $scope.machineAccountTable = {
                "id": "machineAccountTableId",
				"data" :[],
                "columns": [
                    {
                        "sTitle": i18n.common_term_name_label || "名称",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.name);
                        },
                        "sWidth": "50%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_type_label || "类型",
                        "mData": function (data) {
                            return $.encoder.encodeForHTML(data.type);
                        },
                        "sWidth": "40%",
                        "bSortable": false
                    },
                    {
                        "sTitle": i18n.common_term_operation_label||"操作",
                        "mData": "",
						"sWidth": "10%",
						"sClass": "account-operate",
                        "bSortable": false
                    }
                ],
                "pagination": false,
                "paginationStyle": "full_members",
                "hideTotalRecords": false,
                "lengthChange": "true",
                "lengthMenu": commonService.TABLE_PAGE_LENGTH_OPTIONS,
                "displayLength": commonService.DEFAULT_TABLE_PAGE_LENGTH,
                "draggable": true,
                "enableFilter": false,
                "renderRow": function (row, dataitem, index) {
					if(!$scope.hasAccountManageOperateRight){
						return
					}
					var optTemplates = "<a href='javascript:void(0)' ng-click='edit()'>" + (i18n.common_term_modify_button || "修改") + "</a>";
                    var opts = $compile($(optTemplates));
                    var optscope = $scope.$new(false);
                    optscope.edit = function () {
                        new Window($.extend({
                            params: dataitem,
                            title: i18n.common_term_modify_button || "修改"
                        }, vdiWindowOptions)).show();
                    };
                    var optNode = opts(optscope);
                    $("td.account-operate", row).html(optNode);
                },
                "callback": function (evtObj) {
                },
                "changeSelect": function (evtObj) {
                }
            };

            $scope.search = function () {
				var defe = camel.get({
					"url": {s: "/goku/rest/v1.5/machine-accounts?type={type}",o: {"type": $scope.searchModel.type}},
					"userId": userId
				});
				defe.done(function (data) {
					$scope.$apply(function () {
						if(data){
							$scope.machineAccountTable.data =  data.machineAccounts;
						}
					});
				});
				defe.fail(function (data) {
				});
            };

            $scope.search();
            $scope.$on('$destroy', function () {
            });

        }];
        return operatorLogCtrl;
    });