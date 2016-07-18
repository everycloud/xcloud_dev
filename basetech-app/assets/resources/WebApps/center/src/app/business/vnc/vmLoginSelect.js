define(['tiny-lib/jquery',
    'tiny-lib/angular',
    'app/services/httpService',
    'app/services/exceptionService',
    "app/services/cookieService"],
    function ($, angular, http, exceptionService, cookieService) {
        "use strict";

        var loginSelectCtrl = ["$q", "$scope", "$compile", "camel", "exception",
            function ($q, $scope, $compile, camel, exception) {
                var storage = new cookieService();
                var vncConfig = storage.get("vncConfig");
                var winParam = $("#ecsVmLoginSelectWinId").widget().option("winParam") || {},
                    user = $("html").scope().user || {},
                    i18n = $scope.i18n;

                function vncLogin(id) {

                    storage.add("vncConfig", "tightVNC");

                    //window.open第二个参数是打开窗口句柄，传入唯一标识实现每个虚拟机只能打开一个窗口；但参数不能带:-; 字符
                    var vmId = id.replace(/[^a-zA-Z0-9]/g, '0');

                    var iHeight = 600;
                    var iWidth = 800;
                    var iTop = (window.screen.height-100-iHeight)/2;
                    var iLeft = (window.screen.width-10-iWidth)/2;
                    var userId = user && user.id;
                    var deployMode = $("html").scope().deployMode;
                    var basePath = "center";
                    if (deployMode == "top") {
                        basePath = "/cloudmanager";
                    } else if (deployMode == "local") {
                        basePath = "/fusionmanager";
                    } else {
                        basePath = "/center";
                    }
                    window.open("https://"+window.location.host+basePath+"/src/app/business/vnc/vncLogin.html?vmId="+encodeURIComponent(id)+"&userId="+encodeURIComponent(userId),'VNC'+ vmId,'left='+iLeft+',top='+iTop+',width='+iWidth+',height='+iHeight+',toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=no');
                }

                function noVncLogin(vmId) {

                    storage.add("vncConfig", "noVNC");

                    // 查询noVnc地址
                    var deferred = camel.get({
                        "url": {"s": "/goku/rest/v1.5/irm/{tenant_id}/vms/{id}/novnc-acess-info", "o": {"tenant_id": 1, "id": vmId}},
                        "userId": user.id
                    });
                    deferred.success(function (data, textStatus, jqXHR) {
                        if (!data || !data.url) {
                            return;
                        }

                        // 重构url
                        var url = data.url.replace(/(\d+\.\d+\.\d+\.\d+)/g, window.location.hostname),
                            iHeight = 600,
                            iWidth = 800,
                            iTop = (window.screen.height - 100 - iHeight) / 2,
                            iLeft = (window.screen.width - 10 - iWidth) / 2;

                        window.open(url, 'VNC' + vmId.replace(/[^a-zA-Z0-9]/g, '0'), 'left=' + iLeft + ',top=' + iTop + ',width=' + iWidth + ',height=' +
                            iHeight + ',toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=no');
                    });
                    deferred.fail(function (jqXHR, textStatus, errorThrown) {
                        exception.doException(jqXHR, null);
                    });
                }

                $scope.vncSelect = {
                    "id": "ecsVmLoginSelect",
                    "width": "200",
                    "spacing":{"width" : "50px", "height" : "20px"},
                    "layout":"horizon", // horizon vertical
                    "values": [
                        {
                            "key": "vnc",
                            "text": $scope.i18n.vm_term_tightVNC_label || "tightVNC",
                            "tooltip": "",
                            "checked": vncConfig !== "noVNC"
                        },
                        {
                            "key": "noVnc",
                            "text": $scope.i18n.vm_term_noVNC_label || "noVNC",
                            "tooltip": "",
                            "checked": vncConfig === "noVNC"
                        }
                    ]
                };

                $scope.okBtn = {
                    "id": "ecsVmLoginSelectOK",
                    "text": i18n.common_term_ok_button,
                    "click": function () {
                        var vncType = $("#"+$scope.vncSelect.id).widget().opChecked("checked");
                        if (vncType === "vnc") {
                            vncLogin(winParam.vmId);
                        } else if (vncType === "noVnc") {
                            noVncLogin(winParam.vmId);
                        } else {
                            vncLogin(winParam.vmId);
                        }

                        $("#ecsVmLoginSelectWinId").widget().destroy();
                    }
                };

                $scope.cancelBtn = {
                    "id": "ecsVmLoginSelectCancel",
                    "text": i18n.common_term_cancle_button,
                    "click": function () {
                        $("#ecsVmLoginSelectWinId").widget().destroy();
                    }
                };
            }
        ];

        var loginSelect = angular.module("ecs.vm.login.select", []);
        loginSelect.controller("ecs.vm.login.select.ctrl", loginSelectCtrl);
        loginSelect.service("camel", http);
        loginSelect.service("exception", exceptionService);
        return loginSelect;
    }
);
