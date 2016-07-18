/* global define */
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-lib/underscore",
    "tiny-widgets/Layout",
    "tiny-widgets/Window",
    "tiny-directives/Table",
    "tiny-directives/Button",
    "tiny-directives/Checkbox",
    "tiny-directives/Searchbox",
    "tiny-directives/Menubutton",
    "fixtures/serviceFixture"
], function ($, angular,_, layout) {
    "use strict";

    var serviceOrder = ["$scope", "$state",
        function ($scope, $state) {
            var user = $("html").scope().user;
            // 权限控制
            $scope.hasApprovalOrderRight = user.privilege.role_role_add_option_orderApproval_value;
            $scope.hasViewOrderRight = user.privilege.role_role_add_option_orderView_value;

            var lay = new layout({
                "id": "serviceOrderLayoutId",
                "subheight": 108
            });
            $scope.$on("$stateChangeSuccess", function () {
                var cur = $("a[ui-sref='" + $state.$current.name + "']").last();
                if (cur.length > 0) {
                    lay.opActive(cur);
                }
            });
        }
    ];

    return serviceOrder;
});
