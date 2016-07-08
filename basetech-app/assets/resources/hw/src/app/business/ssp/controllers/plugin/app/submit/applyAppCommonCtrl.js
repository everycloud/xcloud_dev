/* global define */
define(["tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Window",
    'tiny-common/UnifyValid',
    "app/services/httpService",
    'app/services/messageService',
    'app/services/validatorService',
    'app/services/exceptionService',
    'app/services/capacityService',
    "app/services/cloudInfraService",
    "app/business/ssp/services/catalog/catalogService",
    "app/business/ssp/services/order/orderService",
    "app/business/ssp/services/plugin/commonService",
    "app/business/ssp/services/plugin/app/appCommonService",
    'app/services/commonService',
    'app/business/network/services/networkService',
    "app/business/ssp/services/plugin/app/desigerService",
    "app/business/ssp/controllers/plugin/app/constants",
    'bootstrap/bootstrap.min',
    'tiny-directives/RadioGroup',
    "fixtures/appFixture"
], function ($, angular, _,Window, UnifyValid, http, messageService, validatorService, exceptionService, capacityService, cloudInfraService, catalogService, orderService, commonService,appCommonService, timeCommonService,networkService,desigerService,constants) {
    "use strict";

    var ctrl = ["$scope","$compile", "$state", "$stateParams","appUtilService", "$q", "camel", "exception",
        function ($scope,$compile, $state, $stateParams,appUtilService, $q, camel, exception) {

            var user = $scope.user;
            var serviceId = $stateParams.serviceId;
            var orderId = $stateParams.orderId;
            var action = $stateParams.action;

            var catalogServiceIns = new catalogService(exception, $q, camel);

            function init() {
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "id": serviceId
                };
                var deferred = catalogServiceIns.queryServiceOffering(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    var param = JSON.parse(data.params);
                    if (param.appType === "it") {
                        $state.go("ssp.applyAppIT",{"serviceId": serviceId, "orderId" :orderId, "action":action});
                    } else {
                        $state.go("ssp.applyAppICT",{"serviceId": serviceId, "orderId" :orderId, "action":action});
                    }
                    retDefer.resolve();
                });
            }
            init();
        }
    ];

    return ctrl;
});
