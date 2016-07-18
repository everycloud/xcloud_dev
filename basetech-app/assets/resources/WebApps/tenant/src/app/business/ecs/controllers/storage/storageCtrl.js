/* global define */
define(['tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Table",
        "fixtures/ecsFixture"
    ],
    function ($, angular, TextBox, Button, Window) {
        "use strict";

        var storageCtrl = ["$rootScope", "$scope", "$compile",
            function ($rootScope, $scope, $compile) {
                $scope.cloudType = $rootScope.user.cloudType;
            }
        ];

        return storageCtrl;
    }
);
