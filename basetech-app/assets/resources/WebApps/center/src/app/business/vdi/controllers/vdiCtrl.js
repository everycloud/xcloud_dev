define(["tiny-lib/jquery",
    "app/business/system/services/vdiManageService"], function ($, VdiManageService) {
    "use strict";

    var vdiCtrl = ["$scope", "$state", "camel", "$q", "$stateParams", function ($scope, $state, camel, $q, $stateParams) {
        var vdiManageService = new VdiManageService($q, camel);
        var user = $scope.user;
        var vdiId = $stateParams.id || "";
        var iframe = document.getElementById("importContentId");
        $scope.vdis = [];
        $scope.vdiSelect = {
            id: "vdiSelectId",
            values: [],
            change:function(){
                var vdiId = $("#"+ $scope.vdiSelect.id).widget().getSelectedId();
                $scope.toVdi(vdiId);
            }
        };
        $scope.toVdi = function (vdiId) {
            var vdis = $scope.vdis;
            var vdi = "";
            for (var i = 0, len = vdis.length; i < len; i++) {
                if (vdis[i].id == vdiId) {
                    vdi = vdis[i];
                    break;
                }
            }
            iframe.src = "https://" + vdi.primaryIP + ":8448/business.action?BMEBusiness=main&BMEWebToken=null";
        };

        var resize = function () {
            var viewHeight = $(window).height();
            var MIN_HEIGHT = 500;
            viewHeight < MIN_HEIGHT && (viewHeight = MIN_HEIGHT);
            var iframeMinHeight = viewHeight - $("#main_menu_div").outerHeight() - $("#service-footer").outerHeight();
            iframe.style.minHeight = iframeMinHeight + "px";
        };
        resize();

        var getList = function () {
            var promise = vdiManageService.vdiList($scope.user.id, {
                start: 0,
                limit: 100
            });
            promise.then(function (response) {
                var vdis = $scope.vdis = response.vdis || [];
                var values = [];
                if (vdis && vdis.length >= 1) {
                    vdiId = vdiId || vdis[0].id;
                    $scope.toVdi(vdiId);
                    for (var i = 0, len = vdis.length; i < len; i++) {
                        var item = vdis[i];
                        values.push({
                            "selectId": item.id,
                            "checked": item.id == vdiId,
                            "label": item.name
                        });
                    }
                }
                $scope.vdiSelect.values = values;
            });
        };
        getList();

        $(window).bind("resize.vdi", resize);
        $scope.$on('$destroy', function () {
            $(window).unbind("resize.vdi");
        });
    }];
    return vdiCtrl;
});