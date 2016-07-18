
define(['tiny-lib/jquery',
    "tiny-lib/angular",
    "tiny-directives/Textbox",
    "tiny-directives/Button",
    "tiny-widgets/Window",
    "tiny-directives/Progressbar",
    "tiny-directives/Checkbox",
    "tiny-directives/Table",
    "fixtures/monitorAlarmFixture"], function ($, angular, TextBox, Button, Window) {
    "use strict";

    var loginCtrl = ["$scope", "$compile","$state", "camel", function ($scope, $compile,$state, camel) {

        //用户名文本框
        $scope.loginName = {
            "label":"",
            "require":false,
            "id": "loginName",
             "value":"用户名",
            "focus":function(){
                $scope.loginName.value="";
            }
        };

        //密码文本框
        $scope.loginPass = {
            "label":"",
            "require":false,
            "id": "loginName",
            "value":"密码",
            "focus":function(){
                $scope.loginPass.value="";
            }
        };

        //验证码文本框
        $scope.loginCheckCode = {
            "label":"",
            "require":false,
            "id": "loginCheckCode",
            "width":"113",
            "value":"验证码",
            "focus":function(){
                $scope.loginCheckCode.value="";
            }
        };

        //登陆按钮
        $scope.loginBtn = {
            "label":"",
            "icons-class":"../theme/default/images/login2_btn.png",
            "require":false,
            "id":"loginBtn",
            "text":"登陆",
            "click":function(){
                //登陆后显示footer header
                $("#main_menu_div").show();
                $("#service-footer").show();
                $state.go("home");
            }
        }


    }];
    return loginCtrl;
});
