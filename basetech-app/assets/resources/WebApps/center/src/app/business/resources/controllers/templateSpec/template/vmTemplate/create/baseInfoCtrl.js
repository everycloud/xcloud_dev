define(['jquery',
    'tiny-lib/angular',
    "app/business/resources/controllers/constants",
    'tiny-common/UnifyValid'],
    function ($, angular, constants, UnifyValid) {
        "use strict";

        var baseInfoCtrl = ["$scope", "camel", "$state", "$stateParams", "exception", function ($scope, camel, $state, $stateParams, exception) {

            $scope.clusterTypes = {
                0:$scope.i18n.common_term_unknown_value,
                1:$scope.i18n.common_term_virtualization_label,
                2:$scope.i18n.virtual_term_bareCluster_label,
                3:$scope.i18n.virtual_term_manageCluster_label || "管理集群",
                4:$scope.i18n.common_term_databaseCluster_label,
                5:$scope.i18n.resource_term_storageCluster_label
            };

            UnifyValid.checkVmtName = function () {
                var value = $(this).val();
                if(!/^[ ]*[\u4e00-\u9fa5A-Za-z0-9-_. ]{1,64}[ ]*$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            $scope.name = {
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "createVmtName",
                "tooltip": $scope.i18n.common_term_composition5_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64),
                "extendFunction" : ["checkVmtName"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkVmtName():"+$scope.i18n.common_term_composition5_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64),
                "width": "200"
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "createVmtPicture",
                "width": "200",
                "show":false,
                "imgs":[],
                "click":function(){
                    $scope.picture.show = !$scope.picture.show;
                },
                "init": function () {
                    var img = function (index) {
                        var src = "../theme/default/images/vmTemplate/icon_vmtemplate_" + index + ".png";
                        return {
                            "src": src,
                            "click": function () {
                                $scope.service.model.picture = src;
                            }
                        }
                    };
                    var imgs = [];
                    for (var index = 1; index <= 10; index++)
                    {
                        imgs.push(img(index));
                    }
                    $scope.picture.imgs = imgs;
                }
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "createVmtDescription",
                "value": "",
                "type": "multi",
                "width": "450",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.hypervisor = {
                label: $scope.i18n.virtual_term_hypervisor_label+":",
                require: true,
                "id": "createVmtHypervisor",
                "width": "200",
                "values": [],
                "change":function(){
                    $scope.service.model.hypervisorID = $("#" + $scope.hypervisor.id).widget().getSelectedId();
                    $scope.operator.queryCluster($("#"+$scope.hypervisor.id).widget().getSelectedId());
                    var hypervisor = $scope.hypervisorMap[$scope.service.model.hypervisorID];
                    $scope.hypervisorType = hypervisor.type;
                }
            };

            /**
             * 虚拟化环境ID到对象的映射
             * @type {{}}
             */
            $scope.hypervisorMap = {};

            $scope.hypervisorType = "";

            /**
             * 虚拟化环境列表
             * @type {undefined}
             */
            $scope.hypervisorList = undefined;

            $scope.host = {
                label: $scope.i18n.common_term_host_label+":",
                require: false,
                "id": "createVmtHost",
                "width": "200",
                "values": [],
                "change":function() {
                    $scope.service.model.hostID = $("#" + $scope.host.id).widget().getSelectedId();
                }
            };

            $scope.type = {
                label: $scope.i18n.common_term_type_label+":",
                require: true,
                "id": "createVmtType",
                "width": "200",
                "values": [
                    {
                        "selectId": "vapp_template",
                        "label": $scope.i18n.template_term_appVM_label,
                        "checked": true
                    },
                    {
                        "selectId": "desktop_template",
                        "label": $scope.i18n.template_term_deskVM_label
                    }
                ],
                "change":function() {
                    $scope.service.model.type = $("#" + $scope.type.id).widget().getSelectedId();
                }
            };

            $scope.clusterTable = {
                label: $scope.i18n.virtual_term_clusters_label+":",
                require: true,
                data: [],
                length:0,
                change:function(){
                    $scope.service.model.clusterId =  $scope.service.model.cluster&& $scope.service.model.cluster.id;
                    $scope.service.model.clusterInfo = {
                        "clusterId": $scope.service.model.cluster && $scope.service.model.cluster.indexId,
                        "name": $scope.service.model.cluster && $scope.service.model.cluster.name,
                        "virtualEnvId":$scope.service.model.hypervisorID,
                        "domain":$scope.service.model.cluster && $scope.service.model.cluster.domain
                    };

                    $scope.operator.queryHost($scope.service.model.clusterId);
                }
            };

            $scope.nextBtn = {
                id: "baseInfo_next_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    var valid = UnifyValid.FormValid($("#createVmtBaseInfo"));
                    if (!valid || $("#" + $scope.hypervisor.id).widget().getSelectedId() == undefined
                        || $scope.service.model.cluster == undefined) {
                        return;
                    }

                    // 更新model中的数据
                    $scope.service.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.service.model.description = $("#" + $scope.description.id).widget().getValue();
                    $scope.service.model.hypervisorID = $("#" + $scope.hypervisor.id).widget().getSelectedId();
                    for (var index in $scope.hypervisorList) {
                        if ($scope.service.model.hypervisorID == $scope.hypervisorList[index].id) {
                            $scope.service.model.hypervisorType = $scope.hypervisorList[index].type;
                        }
                    }

                    $scope.service.model.type = $("#" + $scope.type.id).widget().getSelectedId();
                    $scope.service.model.hostID = $("#" + $scope.host.id).widget().getSelectedId();
                    $scope.service.model.targetHostUrn = $("#" + $scope.host.id).widget().getSelectedId();
                    $scope.service.model.hostName = $("#" + $scope.host.id).widget().getSelectedLabel();

                    $scope.service.model.clusterId =  $scope.service.model.cluster&& $scope.service.model.cluster.id;
                    $scope.service.model.clusterInfo = {
                        "clusterId": $scope.service.model.cluster && $scope.service.model.cluster.indexId,
                        "name": $scope.service.model.cluster && $scope.service.model.cluster.name,
                        "virtualEnvId":$scope.service.model.hypervisorID,
                        "domain":$scope.service.model.cluster && $scope.service.model.cluster.domain
                    };

                    // 触发事件
                    $scope.$emit($scope.createVmtEvents.baseInfoChanged, $scope.service.model);

                    // 步骤切换
                    $scope.service.show = "specInfo";
                    $("#" + $scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "baseInfo_cancel_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go("resources.templateSpec.vmTemplateResources.vmTemplate", {});
                }
            };

            // 操作定义
            $scope.operator = {
                "queryHyper":function() {
                    var params = {
                        "list": {
                            "hypervisorName": "",
                            "hypervisorType": null,
                            "hypervisorVersion": "",
                            "hypervisorIp": "",
                            "hypervisorPort": "",
                            "hypervisorConnectStatus": "",
                            "start": 0,
                            "limit": 100
                        }
                    };
                    var deferred = camel.post({
                        url: {"s":constants.rest.VMT_HYPERVISOR_QUERY.url,"o":{"tenant_id":1}},
                        "params": JSON.stringify(params),
                        "beforeSend": function (request) {
                            request.setRequestHeader("X-AUTH-USER-ID", $("html").scope().user && $("html").scope().user.id);
                        }
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            var hypervisors = [];
                            if(data && data.list && data.list.hypervisors) {
                                hypervisors = data.list.hypervisors;
                            }
                            var hypervisorList = [];
                            var hypervisorMap = {};
                            for (var index in hypervisors) {
                                var hyper = {};
                                hyper.selectId = hypervisors[index].id;
                                hyper.label = hypervisors[index].name;
                                if (index == 0) {
                                    $scope.service.model.hypervisorID = hypervisors[index].id;
                                    hyper.checked = true;
                                    $scope.hypervisorType = hypervisors[index].type;
                                }

                                hypervisorList.push(hyper);

                                hypervisorMap[hypervisors[index].id] = hypervisors[index];
                            }

                            $scope.hypervisor.values = hypervisorList;

                            $scope.hypervisorList = hypervisors;

                            $scope.hypervisorMap = hypervisorMap;

                            // 查询集群信息
                            if (hypervisorList && hypervisorList[0]) {
                                $scope.operator.queryCluster(hypervisorList[0].selectId);
                            }
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "queryCluster":function(id) {

                    if (!id) {
                        $scope.clusterTable.length = 0;
                        $scope.clusterTable.data = null;
                        $scope.service.model.cluster = null;
                        $scope.service.model.clusterId = null;
                        $scope.service.model.clusterInfo = {};

                        // 查询主机信息
                        $scope.operator.queryHost("");
                        return;
                    }

                    var deferred = camel.post({
                        "url": {"s":constants.rest.VMT_CLUSTER_QUERY.url,"o":{"tenant_id":1}},
                        "params":JSON.stringify({"list":{"requestType":"ASSOCIATED", "hypervisorId":id, "start":0,"limit":10}}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            if (!data.list) {
                                $scope.clusterTable.length = 0;
                                $scope.clusterTable.data = null;
                                $scope.service.model.cluster = null;
                                $scope.service.model.clusterId = null;
                                $scope.service.model.clusterInfo = {};

                                // 查询主机信息
                                $scope.operator.queryHost("");
                                return;
                            }

                            var clusterList = data.list.resourceClusters;
                            for (var index in clusterList) {
                                clusterList[index].type = $scope.clusterTypes[clusterList[index].type];
                            }

                            $scope.clusterTable.data = clusterList;
                            if ($scope.clusterTable.data && $scope.clusterTable.data.length > 0) {
                                $scope.clusterTable.length = $scope.clusterTable.data.length;
                                $scope.service.model.cluster = $scope.clusterTable.data[0];
                                $scope.service.model.clusterId = $scope.clusterTable.data[0].id;
                                $scope.service.model.clusterInfo = {
                                    "clusterId":$scope.clusterTable.data[0].indexId,
                                    "name":$scope.clusterTable.data[0].name
                                };
                            }

                            // 查询主机信息
                            $scope.operator.queryHost($scope.service.model.clusterId || "");
                        });
                    });
                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                },
                "queryHost":function(id) {

                    if (!id || id == "") {
                        $scope.host.values = [];
                        return;
                    }

                    var deferred = camel.post({
                        "url": {"s":constants.rest.VMT_HOST_QUERY.url,"o":{"tenant_id":1}},
                        "params":JSON.stringify({"clusterId":id}),
                        "userId": $("html").scope().user && $("html").scope().user.id
                    });
                    deferred.success(function (data) {
                        $scope.$apply(function () {
                            if (!data || !data.hosts) {
                                // 清空
                                $scope.host.values = [];
                            } else {

                                var hosts = [];
                                for (var index in data.hosts) {
                                    hosts.push({
                                        "selectId": data.hosts[index].id,
                                        "label": data.hosts[index].name,
                                        "checked": false
                                    });
                                }

                                $scope.host.values = hosts;
                            }
                        });
                    });

                    deferred.fail(function (data) {
                        exception.doException(data, null);
                    });
                }
            };

            // 初始化操作
            $scope.init = function() {

                if ($stateParams.startStep === "baseInfo") {
                    // 初始化图片组件
                    $scope.picture.init();

                    // 查询虚拟化环境信息
                    $scope.operator.queryHyper();
                }
            };

            $scope.init();
        }];

        return baseInfoCtrl;
    });