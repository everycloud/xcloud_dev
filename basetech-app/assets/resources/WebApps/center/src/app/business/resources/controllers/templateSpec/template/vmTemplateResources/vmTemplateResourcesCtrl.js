define(["tiny-lib/angular",
    'tiny-widgets/Tabs',
    'app/business/resources/controllers/constants',
    'fixtures/templateFixture'],
    function (angular, Tabs, constants) {
        "use strict";

        var vmTemplateResourcesCtrl = ["$scope", function ($scope) {

            $scope.plugins = [{
                "openState": "resources.templateSpec.vmTemplateResources.vmTemplate",
                "name": $scope.i18n.template_term_vms_label
            },{
                "openState": "resources.templateSpec.vmTemplateResources.logicVmTemplate",
                "name": $scope.i18n.template_term_vmLogic_label
            }];
        }];

        return vmTemplateResourcesCtrl;
    });
