/**
 * Created on 13-12-26.
 */
define(["tiny-lib/angular"], function (angular) {
    "use strict";

    var resourcesCtrl = ["$scope","$state", function ($scope,$state) {

    }];

    var dependency = [];
    /**
     * 定义application moddule， 这里需要设置命令空间，防止重复
     * @type {module}
     */
    var resourcesModule = angular.module("resources", dependency);

    resourcesModule.controller("resources.ctrl", resourcesCtrl);
    resourcesModule.factory('safeApply', function ($rootScope) {
        return function (scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && ( typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        }
    });
    resourcesModule.directive("easyRadio", function(safeApply){
        return {
            require : '?ngModel',
            "link":function postLink(scope, element, attr, $ngModel) {

                // 隐藏原生radio
                element.addClass("hide");

                // 默认状态为unChecked
                element.after("<div class='tiny-radio-unchecked'></div>");

                // 检测model变化
                attr.$observe('radioModel', function(value) {
                    var checked = true;
                    if (value === "" || value === undefined) {
                        return;
                    }
                    var valueJson = JSON.parse(value);
                    for (var key in valueJson) {
                        var radioValue = attr.value[key] === undefined ? scope[attr.value][key] : attr.value[key];
                        if (radioValue && valueJson[key] && valueJson[key].toString() != radioValue.toString()) {
                            checked = false;
                        }
                    }

                    var div = element.next("div");
                    if (checked) {
                        div.addClass("tiny-radio-checked");
                        div.removeClass("tiny-radio-unchecked");
                        safeApply(scope, attr.ngChange);
                    }
                    else {
                        div.removeClass("tiny-radio-checked");
                        div.addClass("tiny-radio-unchecked");
                    }
                });

                // 更新模型数据
                var updateEasyRadio = function(){
                    $ngModel.$setViewValue(attr.value);
                };

                // 绑定事件，传递事件
                var div = element.next("div");
                div.bind("click", function() {
                    element.trigger("click");
                    safeApply(scope, updateEasyRadio);
                });
            }
        }
    });
    return resourcesModule;
});