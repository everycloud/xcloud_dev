/*global define*/
define(['jquery',
    "tiny-lib/angular",
    "tiny-widgets/Textbox",
    "app/services/httpService",
    "app/services/validatorService",
    "tiny-common/UnifyValid"
], function ($,angular, Textbox, httpService,validatorService, UnifyValid) {
    "use strict";
    var createVmIpCtrl = ["$scope", "camel","$compile","validator",
        function ($scope, camel,$compile,validator) {
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#createVmIpWindow").widget();
            var nicModel = window.option("nicModel");
            var ipv6Num = 1;

            $scope.ipv4Checkbox = {
                id:"ipv4Checkbox",
                text:"IPv4",
                value:nicModel.ipv4,
                checked:false,
                disable:true,
                change:function(){
                    var result = $("#"+$scope.ipv4Checkbox.id).widget().option("checked");
                    $("#"+$scope.ipv4Box.id).widget().option("disable",!result);
                }
            };
            $scope.ipv4Box = {
                id:"ipv4Box",
                label:"IPv4:",
                value:nicModel.ipv4,
                disable:true,
                validate:"required:"+$scope.i18n.common_term_null_valid
            };
            $scope.ipv6Checkbox = {
                id:"ipv6Checkbox",
                text:"IPv6",
                checked:false,
                disable:true,
                change:function(){
                    var result = $("#"+$scope.ipv6Checkbox.id).widget().option("checked");
                    $("#"+$scope.ipv6Textbox.id).widget().option("disable",!result);
                    $("#"+$scope.addButton.id).widget().option("disable",!result);
                    var index = 1;
                    while($("#ipv6Box_"+index).widget()){
                        $("#ipv6Box_"+index).widget().option("disable",!result);
                        index ++;
                    }
                }
            };
            $scope.ipv6Textbox = {
                id:"ipv6Box_1",
                label:"IPv6:",
                disable:true,
                validate:"required:"+$scope.i18n.common_term_null_valid+
                    ";regularCheck(" + validator.ipv6Reg +"):"+$scope.i18n.common_term_formatIP_valid
            };
            $scope.addButton = {
                "id": "addIpv6Button",
                "text": $scope.i18n.common_term_add_button,
                "disable":true,
                "click": function () {
                    if(ipv6Num >= 5){
                        return;
                    }
                    ipv6Num++;
                    var options = {
                        "id": "ipv6Box_" + ipv6Num,
                        "value": "",
                        "validate":"required:"+$scope.i18n.common_term_null_valid
                    };
                    var box = new Textbox(options);
                    $("#createVmIpv6Div").append(box.getDom());

                    var optColumn = "<a href='javascript:void(0)' style='margin-left: 5px' ng-click='delete()' id='deleteLink_"+ipv6Num+"'>"+
                        $scope.i18n.common_term_delete_button+"</a>";
                    var link = $compile($(optColumn));
                    var scope = $scope.$new(false);
                    scope.ipIndex = ipv6Num;
                    scope.delete = function () {
                        $("#ipv6Box_"+scope.ipIndex).remove();
                        $("#blankDiv_"+scope.ipIndex).remove();
                        $("#deleteLink_"+scope.ipIndex).remove();
                        ipv6Num--;
                    };
                    var node = link(scope);
                    $("#createVmIpv6Div").append(node);
                    $("#createVmIpv6Div").append($("<div id='blankDiv_"+ipv6Num+"' style='height: 7px'></div>"));
                }
            };

            //确定按钮
            $scope.okButton = {
                "id": "createVmIpOkButton",
                "text": $scope.i18n.common_term_ok_button,
                "labelWidth":"40px",
                "click": function () {
                    var result = UnifyValid.FormValid($("#createVmIpDiv"));
                    if (!result) {
                        return;
                    }
                    nicModel.ips = "";
                    nicModel.ipv6 = [];
                    if($("#"+$scope.ipv4Checkbox.id).widget().option("checked")){
                        nicModel.ipv4 = $("#"+$scope.ipv4Box.id).widget().getValue();
                        nicModel.ips = nicModel.ipv4 + ";";
                    }
                    else{
                        nicModel.ipv4 = null;
                    }
                    if($("#"+$scope.ipv6Checkbox.id).widget().option("checked")){
                        var index = 1;
                        while($("#ipv6Box_"+index).widget()){
                            nicModel.ipv6.push($("#ipv6Box_"+index).widget().getValue());
                            nicModel.ips += $("#ipv6Box_"+index).widget().getValue() + ";";
                            index ++;
                        }
                    }
                    window.destroy();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "createVmIpCancelButton",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    window.destroy();
                }
            };
            if(nicModel.ipv6Subnet &&  (nicModel.ipv6Subnet.ipAllocatePolicy == 1 || nicModel.ipv6Subnet.ipAllocatePolicy == 3)){
                $scope.ipv6Checkbox.checked = true;
                $scope.ipv6Checkbox.disable = false;
                $scope.ipv6Textbox.disable = false;
                $scope.addButton.disable = false;

                if(nicModel.ipv6 && nicModel.ipv6.length > 0){
                    $scope.ipv6Textbox.value = nicModel.ipv6[0];
                    ipv6Num ++;
                    for(;ipv6Num <= nicModel.ipv6.length; ipv6Num++){
                        var options = {
                            "id": "ipv6Box_" + ipv6Num,
                            "value": nicModel.ipv6[ipv6Num - 1],
                            "validate":"required:"+$scope.i18n.common_term_null_valid+
                                ";regularCheck(" + validator.ipv6Reg +"):"+$scope.i18n.common_term_formatIP_valid
                        };
                        var box = new Textbox(options);
                        $("#createVmIpv6Div").append(box.getDom());

                        var optColumn = "<a href='javascript:void(0)' style='margin-left: 5px' ng-click='delete()' id='deleteLink_"+ipv6Num+"'>"+
                            $scope.i18n.common_term_delete_button+"</a>";
                        var link = $compile($(optColumn));
                        var scope = $scope.$new(false);
                        scope.ipIndex = ipv6Num;
                        scope.delete = function () {
                            $("#ipv6Box_"+scope.ipIndex).remove();
                            $("#blankDiv_"+scope.ipIndex).remove();
                            $("#deleteLink_"+scope.ipIndex).remove();
                            ipv6Num--;
                        };
                        var node = link(scope);
                        $("#createVmIpv6Div").append(node);
                        $("#createVmIpv6Div").append($("<div id='blankDiv_"+ipv6Num+"' style='height: 7px'></div>"));
                    }
                    ipv6Num --;
                }
            }
            if(nicModel.ipv4Subnet &&  (nicModel.ipv4Subnet.ipAllocatePolicy == 1 || nicModel.ipv4Subnet.ipAllocatePolicy == 3)){
                $scope.ipv4Checkbox.checked = true;
                $scope.ipv4Checkbox.disable = false;
                $scope.ipv4Box.disable = false;
            }
        }];

    var createVmIpModule = angular.module("resources.vm.createVmIp", ["ng"]);
    createVmIpModule.service("camel", httpService);
    createVmIpModule.service("validator", validatorService);
    createVmIpModule.controller("resources.vm.createVmIp.ctrl", createVmIpCtrl);
    return createVmIpModule;
});