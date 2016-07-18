define([
    'jquery',
    'tiny-lib/angular',
    'app/services/validatorService',
    "tiny-common/UnifyValid",
    "app/services/httpService",
    'tiny-widgets/Message',
    "app/services/exceptionService",
	"app/framework/directive/directiveFM",
    "fixtures/labelFixture"
], function ($, angular, validatorService, UnifyValid, http, Message, Exception,directiveFM) {
    "use strict";
    var addLabelCtrl = ["$scope", "$compile", "camel", "$rootScope",
        function ($scope, $compile, camel, $rootScope) {
            var userId = $("html").scope().user.id;
            $scope.i18n = $("html").scope().i18n;
            var exceptionService = new Exception();
            var validator = new validatorService();
            var window = $("#addLabelWin").widget();
            var tagName = window.option("tagName");
            var tagValues = window.option("tagValues");

			$scope.meanVisable = (tagName == null);

            UnifyValid.checkTagName = function () {
                var value = $.trim($(this).val());
                var reg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,128}[ ]*$/;
                return reg.test(value);
            };
            UnifyValid.checkTagValues = function () {
                var values = $.trim($(this).val());
                if (values == null || values == '') {
                    return false;
                }
				if(tagName != null){//修改
					var reg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,128}[ ]*$/;
					if (!reg.test(values)) {
						return false;
					}
				}else{//新增
					var arr = values.replace(/；/g, ";").split(";");
					for (var i = 0; i < arr.length; i++) {
						if ($.trim(arr[i]) == '') {
							continue;
						}
						var reg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,128}[ ]*$/;
						if (!reg.test(arr[i])) {
							return false;
						}
					}
				}
                return true;
            };

            $scope.labelKey = {
                "label": $scope.i18n.cloud_term_tagName_label+"：",
                require: true,
                id: "labelKeyId",
                type: "input",
				disable : true,
                "value": (tagName) ? tagName : 'SLA',
                "extendFunction": ["checkTagName"],
                tooltip: $scope.i18n.common_term_composition3_valid+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"}),
                "validate": "checkTagName():"+$scope.i18n.common_term_composition3_valid+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"})
            };
            $scope.labelValue = {
                label: $scope.i18n.cloud_term_tagValue_label+"：",
                require: true,
                id: "labelValueId",
                "extendFunction": ["checkTagValues"],
                tooltip:  $scope.i18n.common_term_composition3_valid+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"}),
                "validate": "checkTagValues():"+$scope.i18n.common_term_composition3_valid+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"128"}),
                "type": "multi",
                "width": 149,
                "height": 60,
                "readonly": false,
                value: (tagValues) ? tagValues : ''
            };
            $scope.okBtn = {
                "id": "okBtn",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    var updateValue = $("#" + $scope.labelValue.id).widget().getValue();
                    if(updateValue === tagValues)
                    {
                        $("#addLabelWin").widget().destroy();
                    }
                    else
                    {
                        if(tagName != null){
                            $scope.operate.editLabel();
                        }else{
                            $scope.operate.addLabel();
                        }
                    }
                }
            };
            $scope.cancelBtn = {
                "id": "btnCancel",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#addLabelWin").widget().destroy();
                }
            };

            $scope.operate = {
                "addLabel": function () {
                    var result = UnifyValid.FormValid($("#addLabelDiv"));
                    if (!result) {
                        return;
                    }
                    var param = {};
                    param.tagGroup = {
                        name: $("#labelKeyId").widget().getValue()
                    };

                    var values = $.trim($("#labelValueId").widget().getValue());
                    var arr = values.replace(/；/g, ";").split(";");
                    var vs = [];
                    for (var i = 0; i < arr.length; i++) {
                        if ($.trim(arr[i]) == '') {
                            continue;
                        }
                        vs.push($.trim(arr[i]));
                    }
                    param.tagGroup.values = vs;
                    var defe = camel.post({
                        "url": "/goku/rest/v1.5/all/tag-groups",
                        "params": JSON.stringify(param),
                        "userId": userId
                    });
                    defe.done(function (response) {
                        $("#addLabelWin").widget().destroy();
                    });
                    defe.fail(function (data) {
                        exceptionService.doException(data);
                    });
                },
				"editLabel":function(){
					var result = UnifyValid.FormValid($("#addLabelDiv"));
					if (!result) {
						return;
					}
					var name = $("#labelKeyId").widget().getValue();
					var param = {
						name : name,
						value: $.trim($("#labelValueId").widget().getValue())
					};
					var defe = camel.put({
						"url": "/goku/rest/v1.5/all/tag-groups?name=" + name + "&value=" + tagValues,
						"params": JSON.stringify(param),
						"userId": userId
					});
					defe.done(function (response) {
						$("#addLabelWin").widget().destroy();
					});
					defe.fail(function (data) {
						exceptionService.doException(data);
					});
				}
            };
        }
    ];
    var dependency = ['ng', 'wcc',directiveFM.name];
    var addLabelModule = angular.module("service.label.addLabel", dependency);
    addLabelModule.controller("service.label.addLabel.ctrl", addLabelCtrl);
    addLabelModule.service("camel", http);
    return addLabelModule;
});
