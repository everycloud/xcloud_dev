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
            var from = $stateParams.from;

            var orderServiceIns = new orderService(exception, $q, camel);

            function init() {
                var retDefer = $.Deferred();
                var options = {
                    "user": user,
                    "orderId": orderId
                };
                var deferred = orderServiceIns.queryOrder(options);
                deferred.then(function (data) {
                    if (!data) {
                        retDefer.reject();
                        return;
                    }
                    var param = JSON.parse(data.definationParams);
                    if (param.appType === "it") {
                        $state.go("ssp.approvalAppITApply",{"serviceId": serviceId, "orderId" :orderId, "action":action, "from":from});
                    } else {
                        $state.go("ssp.approvalAppICTApply",{"serviceId": serviceId, "orderId" :orderId, "action":action, "from":from});
                    }
                    retDefer.resolve();
                });
            }
            init();
        }
    ];

    return ctrl;
});
