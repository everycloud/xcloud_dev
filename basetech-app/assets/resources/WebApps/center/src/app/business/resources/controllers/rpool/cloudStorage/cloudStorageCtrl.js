/**
 * 各服务模块中的controller必须定义成一个module形式，以方便在各自的routerConfig中集成
 */
define(["tiny-lib/jquery",
    "tiny-lib/angular"
], function ($, angular) {
    "use strict";

    var cloudStorageCtrl = ["$scope", "$compile", "$state", "camel", function ($scope, $compile, $state, camel) {
        $scope.connectCloudDevBtn = {
            id: "cloudDevConnectBtn_id",
            disabled: false,
            iconsClass: "",
            text: "接入云存储设备",
            tip: "",
            connect: function () {
                "use strict";
            }
        }
    }];
    return cloudStorageCtrl;
});
