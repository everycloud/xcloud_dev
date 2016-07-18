/*global define*/
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-widgets/Window",
    "app/services/exceptionService",
    "app/services/competitionConfig"
], function ($, angular, Window, Exception,competition) {
    "use strict";

    var summaryCtrl = ["$scope", "$state", "$stateParams", "$compile", "camel", function ($scope, $state, $stateParams, $compile, camel) {
        var exceptionService = new Exception();
        var user = $("html").scope().user;
        $scope.storeName = $stateParams.storeName;
        var storeId = $stateParams.storeId;
        var storeTypes = {
            "local": $scope.i18n.resource_stor_create_para_type_option_local_value,
            "san": $scope.i18n.resource_stor_create_para_type_option_SAN_value,
            "LOCALPOME": $scope.i18n.resource_stor_create_para_type_option_vLocal_value,
            "LUNPOME": $scope.i18n.resource_stor_create_para_type_option_vSAN_value,
            "LUN": $scope.i18n.resource_stor_create_para_type_option_bare_value,
            "NAS":$scope.i18n.common_term_NAS_label
        };

        $scope.label = {
            "name": $scope.i18n.common_term_name_label+":",
            "status": $scope.i18n.common_term_status_label+":",
            "config": $scope.i18n.common_term_thinProvCfg_label+":",
            "maintenanceMode":$scope.i18n.device_term_MaintenanceMode_value+":",
            "type": $scope.i18n.common_term_type_label+":",
            "mediaType": $scope.i18n.common_term_storageMedia_label+":",
            "hypervisor": $scope.i18n.virtual_term_hypervisor_label+":",
            "cluster":$scope.i18n.virtual_term_cluster_label+":",
            "ioSwitch":$scope.i18n.resource_term_IOcontorl_label+":",
            "vmNum": "普通虚拟机个数(个):",
            "templateNum": "模板虚拟机个数(个):",
            "linkNum": "链接克隆虚拟机个数(个):",
            "diskNum": "磁盘个数(个):"
        };
        $scope.info = {

        };
        $scope.allocated = "";
        $scope.total = "";
        $scope.used = "";
        $scope.free = "";
        //存储分配率进度条
        $scope.storeAllotBar = {
            id: "storeAllotBar",
            value: 45,
            labelPosition:"right",
            width:180
        };
        //存储占用率进度条
        $scope.storeUseBar = {
            id: "storeUseBar",
            value: 75,
            labelPosition:"right",
            width:180
        };

        //迁移磁盘按钮
        $scope.migrateDiskButton = {
            "id": "migrateDiskButton",
            "text": $scope.i18n.resource_term_MigrateDisk_button,
            "click": function () {
                $state.go("resources.migrateDisk");
            }
        };
        function getStore() {
            var params = {
                "detail": "0",
                "scopeType": "DATASTORE",
                "scopeObjectId": storeId
            };
            var deferred = camel.post({
                url: {s: "/goku/rest/v1.5/irm/1/datastores"},
                "params": JSON.stringify(params),
                "userId":user.id
            });
            deferred.success(function (data) {
                var store = data.datastoreInfos[0];
                $scope.$apply(function () {
					if(store){
						$scope.info.name = store.name;
						$scope.info.status = store.accessible?$scope.i18n.common_term_available_label : $scope.i18n.common_term_unavailable_value;
						$scope.info.config = store.ability.isThin? $scope.i18n.common_term_support_value :  $scope.i18n.common_term_notSupport_value;
						$scope.info.maintenanceMode = store.maintenancemode? $scope.i18n.common_term_yes_button : $scope.i18n.common_term_no_label;
						$scope.info.typeStr = storeTypes[store.type] || store.type;
						$scope.info.showIoSwith = competition.storageIoControl && (store.type === 'LOCALPOME' || store.type === 'LUNPOME' || store.type === 'NAS');
						$scope.info.mediaType = store.mediaType === "SAN-Any"?"Any":store.mediaType;
						$scope.info.hypervisor = store.hypervisorName;
						$scope.info.cluster = store.resClusterName;
						$scope.info.ioSwithStr = store.ioSwitch == 0?$scope.i18n.common_term_close_button : $scope.i18n.common_term_enable_value;
						if(store.capacity){
							$scope.allocated = precision2(store.capacity.usedSizeGB, 0);
							$scope.total = precision2(store.capacity.totalCapacityGB, 0);
							$scope.used = precision2(store.capacity.totalCapacityGB - store.capacity.freeCapacityGB, 0);
							$scope.free = precision2(store.capacity.freeCapacityGB, 0);
						}
					}
                });
				var bar1 = $scope.total == 0?precision2(100,2):precision2($scope.allocated/$scope.total * 100, 2);
				$scope.storeAllotprogressDisaply = bar1 > 100 ? 100 : bar1;
				$scope.storeAllotprogress = bar1;
				var bar2 = $scope.total == 0?precision2(100,2):precision2($scope.used/$scope.total * 100, 2);
				$scope.storeUseprogressDisaply = bar2 > 100 ? 100 : bar2;
				$scope.storeUseprogress = bar2;
                $scope.$digest();
            });
            deferred.fail(function (data) {
                exceptionService.doException(data);
            });
        };
		function precision2(numberStr, digits) {
			var number = 0;
			try {
				number = new Number(numberStr);
			} catch (error) {
			}
			return number.toFixed(digits);
		};
        getStore();
    }];
    return summaryCtrl;
});
