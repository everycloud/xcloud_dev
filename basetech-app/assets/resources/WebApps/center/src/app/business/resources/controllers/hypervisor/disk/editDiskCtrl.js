/*global define*/
define(['jquery',
    'tiny-lib/angular',
    'tiny-directives/RadioGroup',
    "app/services/httpService",
	'app/services/validatorService',
	"tiny-common/UnifyValid",
    "app/services/exceptionService"],
    function ($, angular, RadioGroup,httpService,validatorService,UnifyValid, Exception) {
        "use strict";

        var editDiskCtrl = ["$scope", "$compile","camel","validator", function ($scope, $compile,camel,validator) {
            var exceptionService = new Exception();
            var user = $("html").scope().user;
            $scope.i18n = $("html").scope().i18n;
            var window = $("#editDiskWindow").widget();
            var winParams = window.option("WIN_PARAMS");

            var volumnId = winParams.volumnId;
            var diskOldName = winParams.diskName;
            var persistentDisk = winParams.persistentDisk ;
            $scope.influence = winParams.influence;
            var allocType = winParams.allocType;
            var vmType = winParams.vmType || "";
			var storageType = winParams.storageType;
			$scope.disableInf_Perm = storageType == "LUN" || storageType == "local" || storageType == "san";

			UnifyValid.checkName = function () {
				var value = $.trim($(this).val());
				var vmDiskNameReg = /^[ ]*[A-Za-z0-9-_\u4e00-\u9fa5]{1,64}[ ]*$/;
				return vmDiskNameReg.test(value);
			};
            //名称输入框
            $scope.nameTextbox = {
                "label": $scope.i18n.common_term_name_label+":",
                "id": "edit_disk_name_textbox",
                "value": diskOldName,
                "require":true,
                "disable":vmType === "vmware",
				"extendFunction": ["checkName"],
				"validate": "required:"+$scope.i18n.common_term_null_valid + ";maxSize(64):"+validator.i18nReplace($scope.i18n.common_term_length_valid,{"1":"1","2":"64"})+
                    ";checkName():"+$scope.i18n.common_term_composition3_valid
            };
            //模式下拉框
            $scope.patternSelector = {
                "label": $scope.i18n.common_term_setMode_label+":",
                "id": "edit_disk_pattern_selector",
                "width": "135",
                "disable":true,
                "values": [
                    {"selectId": "thick",
                        "label": $scope.i18n.common_term_common_label,
                        "checked":(allocType === 'thick') ? true : false
                    },
                    {"selectId": "thickformat",
                        "label": $scope.i18n.common_term_lazyZeroed_label,
                        "checked":(allocType === 'thickformat') ? true : false
                    },
                    {"selectId": "thin",
                        "label": $scope.i18n.common_term_thinProv_label,
                        "checked":(allocType === 'thin') ? true : false
                    }
                ]
            };
            $scope.influenceCheckbox = {
                "id": "edit_disk_influence_checkbox",
                "label": "",
                "checked": $scope.influence,
                "text": $scope.i18n.vm_disk_add_para_snap_option_no_value,
				"disable": $scope.disableInf_Perm,
                "change": function () {
                    if ($scope.influenceCheckbox.checked) {
                        $("#eidt_disk_permanence_radio").widget().opDisabled('yes',true);
                        $("#eidt_disk_permanence_radio").widget().opDisabled('no',true);
                        $("#" + $scope.permanenceRadio.id).widget().opChecked("yes", true);
                        $scope.influence = false;
                        $scope.influenceCheckbox.checked = false;
                    }else{
                        $("#eidt_disk_permanence_radio").widget().opDisabled('yes',false);
                        $("#eidt_disk_permanence_radio").widget().opDisabled('no',false);
                        $scope.influenceCheckbox.checked = true;
                        $scope.influence = true;
                    }
                }
            };
            $scope.permanenceRadio = {
                "id": "eidt_disk_permanence_radio",
                "layout": "vertical",
                "values": [
                        {
                            "key": "yes",
                            "text": $scope.i18n.org_term_persistent_label,
                            "checked":(persistentDisk) ? true : false,
                            "disable": ($scope.disableInf_Perm || !$scope.influence)
                        },
                        {
                            "key": "no",
                            "text": $scope.i18n.org_term_nonpersistent_label,
                            "checked":(persistentDisk) ? false : true,
                            "disable": ($scope.disableInf_Perm || !$scope.influence)
                        }
                ],
                "change": function () {

                }
            };
            //确定按钮
            $scope.okButton = {
                "id": "edit_disk_ok_button",
                "text": $scope.i18n.common_term_ok_button,
                "click": function () {
                    save();
                }
            };
            //取消按钮
            $scope.cancelButton = {
                "id": "edit_disk_cancel_button",
                "text": $scope.i18n.common_term_cancle_button,
                "click": function () {
                    $("#editDiskWindow").widget().destroy();
                }
            };

            function save() {
				var result = UnifyValid.FormValid($("#edit_disk_div"));
				if (!result) {
					return;
				}
                var params = {
                    "modifyBasicInfo": {
                        "indepDisk": $scope.influenceCheckbox.checked,//是否独立磁盘
                        "persistentDisk" : ($("#eidt_disk_permanence_radio").widget().opChecked("checked") === 'yes') ? true : false
                    }
                };
				if(vmType != "vmware"){
					params.modifyBasicInfo.diskName = $.trim($("#" + $scope.nameTextbox.id).widget().getValue());
				}
                var deferred = camel.post({
                    "url":{s: "/goku/rest/v1.5/irm/1/volumes/{id}/action",o:{'id':volumnId}},
                    "params": JSON.stringify(params),
                    "userId": user.id
                });
                deferred.success(function (data) {
                    $("#editDiskWindow").widget().destroy();
                });
                deferred.fail(function (data) {
                    exceptionService.doException(data);
                });
            }
			$scope.init = function(){
				if(storageType == "LUN"){
					$("#" + $scope.permanenceRadio.id).widget().opDisabled("yes",true);
					$("#" + $scope.permanenceRadio.id).widget().opDisabled("no",true);
				}
			};
        }];

        var editDiskApp = angular.module("editDiskApp", ['framework']);
        editDiskApp.controller("resources.hypervisor.editDisk.ctrl", editDiskCtrl);
        editDiskApp.service("camel", httpService);
        editDiskApp.service("validator", validatorService);
        return editDiskApp;
    }
);
