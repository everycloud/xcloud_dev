
define([
    "tiny-lib/jquery",
    "tiny-lib/angular",
    "tiny-common/UnifyValid",
    "app/services/validatorService",
    "app/services/httpService",
	"app/services/exceptionService",
    "fixtures/systemFixture"],

    function ($, angular, UnifyValid, ValidatorService, http,ExceptionService) {
        "use strict";
        var dependency = ['ng', 'wcc'];

        var editVdiCtrl = ["$scope", "$q", "camel","validator", function ($scope, $q, camel,validator) {
            var INPUT_WIDTH = 200;
            var vdiWinWidget = $("#vdiWindowId").widget();
            var winParams = vdiWinWidget.option("params");
			var accountId = winParams.id;
            var $rootScope = $("html").scope();
            var userId = $rootScope.user.id;

            var i18n = $rootScope.i18n || {};
            var saveBtnText = i18n.common_term_save_label || "保存";

            UnifyValid.confirmPWD = function (id) {
                id = id[0] || id;
                var val = $("#" + id).widget().getValue();
                var reVal = $("#re" + id).widget().getValue();
                return val === reVal;
            };

			UnifyValid.includeValid = function (id) {
				id = id[0] || id;
				var val = $("#" + id).widget().getValue();
				return validator.checkMustContain(val);
			};
			UnifyValid.specialCharacter = function (id) {
				id = id[0] || id;
				var val = $("#" + id).widget().getValue();
				return validator.checkContainSpecialCharacter(val);
			};

            var getPWDValidate = function (require) {
                var validate = [];
                var requireValidate = "required:" + i18n.common_term_null_valid;
                require && (validate.push(requireValidate));
                validate.push("maxSize(32):" + i18n.sprintf(i18n.common_term_length_valid,{1:8,2:32}));
				validate.push("minSize(8):" + i18n.sprintf(i18n.common_term_length_valid,{1:8,2:32}));
				var specChar = "specialCharacter(passwordId):" + i18n.common_term_specialCharacter_valid;
				var include = "includeValid(passwordId):" + i18n.common_term_compositionInclude4_valid;
				validate.push(specChar);
				validate.push(include);
                return validate.join(";");
            };

			var getPWDValidate2 = function (require, same) {
				var validate = [];
				var requireValidate = "required:" + i18n.common_term_null_valid;
				var sameValidate = "confirmPWD(passwordId):" + i18n.common_term_pswDifferent_valid;
				require && (validate.push(requireValidate));
				same && (validate.push(sameValidate));
				return validate.join(";");
			};

			$scope.oldPassword = {
				"id": "oldPasswordId",
				"label": (i18n.common_term_oldPsw_label || "旧密码") + ":",
				"width": INPUT_WIDTH,
				"type": "password",
				"require": true,
				"validate": "required:" + i18n.common_term_null_valid
			};

            $scope.password = {
                "id": "passwordId",
                "label": (i18n.common_term_newPsw_label || "新密码") + ":",
                "width": INPUT_WIDTH,
                "type": "password",
                "require": true,
				"extendFunction": ["specialCharacter","includeValid"],
                "validate": getPWDValidate(true)
            };

            $scope.repassword = {
                "id": "repasswordId",
                "label": (i18n.common_term_PswConfirm_label || "确认密码") + ":",
                "width": INPUT_WIDTH,
                "type": "password",
                "require": true,
                "extendFunction": ["confirmPWD"],
                "validate": getPWDValidate2(true, true)
            };

            var formDataToServer = function () {
                if (UnifyValid.FormValid($("#editVdiDiv"))) {
                    var params = {
						oldPassWord: $("#" + $scope.oldPassword.id).widget().getValue(),
						newPassWord: $("#" + $scope.repassword.id).widget().getValue()
                    };
                    return params;
                }
                return null;
            };

            $scope.saveBtn = {
                "id": "saveBtnId",
                "text": saveBtnText,
                "save": function () {
                    var formData = formDataToServer();
                    if (formData) {
						var defe = camel.put({
							"url": {s:"/goku/rest/v1.5/machine-accounts/{id}",o:{"id":accountId}},
							"params": JSON.stringify(formData),
							"userId": userId
						});
						defe.done(function (response) {
							vdiWinWidget.destroy();
						});
						defe.fail(function (data) {
							new ExceptionService().doException(data);
						});
                    }
                }
            };

            $scope.closeBtn = {
                "id": "closeBtn",
                "text": i18n.common_term_cancle_button || "取消",
                "close": function () {
                    vdiWinWidget.destroy();
                }
            };
        }];
        var editVdiModule = angular.module("editVdiModule", dependency);
        editVdiModule.controller("editMachineAccountCtrl", editVdiCtrl);
        editVdiModule.service("camel", http);
		editVdiModule.service("validator", ValidatorService);
        return editVdiModule;
    });