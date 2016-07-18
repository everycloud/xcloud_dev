define(['jquery',
    "app/services/httpService",
    "app/business/resources/services/cluster/clusterService"], function ($, httpService, clusterService) {
    var hgInfoCtrl = ["$scope", "camel" , function ($scope, camel) {
        $scope.i18n = $("html").scope().i18n;

		var VM2HostRuleType = {
			1: $scope.i18n.virtual_cluster_schedul_para_rule_option_onHost_value ||  "必须在该组中的主机上运行",
			2: $scope.i18n.virtual_cluster_schedul_para_rule_option_onHostAdvice_value || "应在该组中的主机上运行",
			3: $scope.i18n.virtual_cluster_schedul_para_rule_option_notHost_value || "不得在该组中的主机上运行",
			4: $scope.i18n.virtual_cluster_schedul_para_rule_option_notHostAdvice_value || "不应在该组中的主机上运行"
		};
        $scope.vm2Host = {
            "vmGroup": {
                "label": $scope.i18n.vm_term_VMgroup_label + ":" || "虚拟机组:"
            },
            "rule": {
                "label": $scope.i18n.common_term_rule_label || "规则:"
            },
            "clusterHost": {
                "label": $scope.i18n.common_term_hostGroup_label + ":"  || "主机组:"
            }
        };
        $scope.ruleInfoVmTable = {
            "id": "ruleInfoVmTableId",
            "data": [],
            "paginationStyle": "full_numbers",
            "lengthChange": true,
            "enablePagination": false,
            "lengthMenu": [10, 20, 50],
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
						var newId = clusterService.getVMVisibleId(data.urn);
						return $.encoder.encodeForHTML(newId);
                    },
                    "bSortable": false
                }
            ],
            "callback": function (evtObj) {
            },
            "renderRow": function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).addTitle();
				$('td:eq(1)', nRow).attr("title",aData.urn);
            }
        };
        $scope.getRuleInfo = function (clusterId, ruleIndex) {
            clusterService.getClusterDRS(clusterId,
                function (data) {
                    $scope.$apply(function () {
                        if (data && data.drsParams) {

                            var currentRuleVms = [];
                            //初始化规则信息
                            if (data.drsParams.drsRules) {
                                var rules = data.drsParams.drsRules;
                                //修改时初始化
                                if (ruleIndex) {
                                    for (var i = 0; i < rules.length; i++) {
                                        if (rules[i].ruleIndex == ruleIndex) {
                                            var ru = rules[i];
                                            $scope.ruleInfoVmTable.data = ru.vms;
                                            if (ru.vmGroupInfo) {
                                                $scope.vm2Host.vmGroup.value = ru.vmGroupInfo.name;
                                                $scope.vm2Host.clusterHost.value = ru.hostGroupInfo.name;
                                                $scope.vm2Host.rule.value = VM2HostRuleType[ru.vm2HostRuleType];
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                },
                function (data) {
                });
        };
    }];

    var hgInfoModule = angular.module("resources.cluster.ruleInfo", ["ng", "wcc"]);
    hgInfoModule.service("camel", httpService);
    hgInfoModule.controller("resources.cluster.ruleInfo.ctrl", hgInfoCtrl);
    return hgInfoModule;
});