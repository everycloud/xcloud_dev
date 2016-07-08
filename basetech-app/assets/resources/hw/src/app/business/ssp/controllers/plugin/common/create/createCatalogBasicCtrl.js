define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    'tiny-common/UnifyValid',
    "app/services/validatorService",
    "app/business/ssp/services/catalog/catalogService",
    "fixtures/network/router/routerFixture"
], function ($, angular, _, UnifyValid, validatorService, catalogService) {
    "use strict";

    var basicICTCtrl = ["$rootScope", "$scope", "monkey", "camel", "$q", "$compile", "exception",
        function ($rootScope, $scope, monkey, camel, $q, $compile, exception) {
            $scope.service = monkey;

            var user = $("html").scope().user;
            var state = $("html").injector().get("$state");
            var i18n = $("html").scope().i18n;
            var validator = new validatorService();
            var catalogServiceImpl = new catalogService(exception, $q, camel);

            //选择已有服务
            $scope.sValues = [];
            $scope.baseInfo = {
                name: {
                    "id": "create-catalog-basicInfo-name",
                    label: i18n.service_term_serviceName_label + ":",
                    require: true,
                    "value": ""
                },
                directory: {
                    "id": "createDirectory",
                    label: i18n.service_term_catalog_label + ":",
                    "mode": "multiple",
                    "require": true,
                    "width": 200,
                    "validate": "regularCheck(" + validator.notAllSpaceReg + "):" + i18n.common_term_waitChoose_value,
                    values: []
                },
                imgs: {
                    label: i18n.common_term_icon_label + ":",
                    require: true
                },
                description: {
                    label: i18n.common_term_desc_label + ":",
                    "id": "create-catalog-basicInfo-description",
                    "type": "multi",
                    "width": "200",
                    "height": "60"
                },
                preBtn: {
                    "id": "create-catalog-selectres-pre",
                    "text": i18n.common_term_back_button,
                    "click": function () {
                        monkey.show = {
                            "catalogBasic": true,
                            "basicInfo": false
                        };
                    }
                },
                nextBtn: {
                    "id": "create-catalog-basicInfo-next",
                    "text": i18n.common_term_next_button,
                    "click": function () {
                        //根据选择的模板不一样，下一步显示的页面也不一样
                        state.go($scope.params.selectedTemplate.templateUrl);
                    }
                },
                cancelBtn: {
                    "id": "create-catalog-basicInfo-cancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        state.go("ssp.catalog");
                    }
                }
            };

            $scope.operate = {
                "queryCatalogs": function () {
                    var options = {
                        "user": user
                    };
                    var deferred = catalogServiceImpl.queryCatalogs(options);
                    deferred.then(function (data) {
                        if (!data || !data.catalogs) {
                            return false;
                        }
                        _.each(data.catalogs, function (item) {
                            _.extend(item, {
                                "selectId": item.id,
                                "label": item.name
                            });
                        });
                        data.catalogs[0].checked = true;

                        $scope.baseInfo.directory.values = data.catalogs;
                    });
                }
            };

            function init() {
                $scope.operate.queryCatalogs();
            }

            init();
        }
    ];
    return basicICTCtrl;
});
