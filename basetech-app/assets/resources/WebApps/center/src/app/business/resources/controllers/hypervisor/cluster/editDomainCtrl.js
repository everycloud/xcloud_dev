/*global define*/
define(['jquery',
    'tiny-lib/angular',
    "app/services/httpService",
    "app/business/user/service/domainService",
    "app/services/exceptionService"
], function ($, angular, httpService, DomainService, Exception) {
        "use strict";

        var editDomainCtrl = ["$scope", "$compile", "camel", function ($scope, $compile, camel) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var i18n = $scope.i18n || {};
            var window = $("#editClusterDomainWindow").widget();
            var oldDomainId = window.option("domainId");
            var $rootScope = $("html").injector().get("$rootScope");
            $scope.domainService = new DomainService();
            $scope.domainId = "domainParentId";
            var clusterId = window.option("clusterId");
            $scope.domainTree = {
                id: "clusterDomainTree",
                width: "300",
                height: "200",
                setting: {
                    view: {
                        selectedMulti: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick: function (event, id, node) {
                            $scope.domainId = node.id;
                            if (node.id === "domainParentId" || node.id === oldDomainId) {
                                $("#" + $scope.okButton.id).widget().option("disable", true);
                            }
                            else {
                                $("#" + $scope.okButton.id).widget().option("disable", false);
                            }
                        }
                    }
                },
                values: []
            };
            //确定按钮
            $scope.okButton = {
                "id": "domainOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "disable": true,
                "click": function () {
                    editDomain();
                }
            };
            $scope.quitButton = {
                "id": "domainQuitButton",
                "text": i18n.domain_term_quitDomain_button||"退出域",
                "disable": true,
                "click": function () {
                    quitDomain();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "domainCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            function getData() {
                var deferred = camel.get({
                    "url": {s: "/goku/rest/v1.5/1/domains?user-id={user-id}", o: {"user-id": $rootScope.user.id}},
                    "userId": user.id
                });
                deferred.success(function (response) {
                    $scope.$apply(function () {
                        var domainList = [];
                        if (response) {
                            domainList = response.domainList;
                        }
                        $scope.domainTree.values = $scope.domainService.initTree(domainList);
                    });
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }

            function editDomain() {
                var params = {
                    modifyDomain: {
                        clusterIds: [clusterId],
                        inDomainId: $scope.domainId,
                        outDomainId: oldDomainId
                    }
                };
                var deferred = camel.put({
                    url: {s: "/goku/rest/v1.5/irm/1/resourceclusters"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.complete(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            function quitDomain() {
                var params = {
                    modifyDomain: {
                        clusterIds: [clusterId],
                        outDomainId: oldDomainId
                    }
                };
                var deferred = camel.put({
                    url: {s: "/goku/rest/v1.5/irm/1/resourceclusters"},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.complete(function (data) {
                    window.destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
            if (oldDomainId) {
                $scope.quitButton.disable = false;
            }
            getData();
        }];

        var editClusterDomainApp = angular.module("editClusterDomainApp", ['framework']);
        editClusterDomainApp.service("camel", httpService);
        editClusterDomainApp.controller("resources.clusterInfo.editDomain.ctrl", editDomainCtrl);
        return editClusterDomainApp;
    }
);
