define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'upload/FileUpload',
    "tiny-widgets/Message",
    "app/services/mask",
    'app/services/exceptionService',
    "upload/jquery-form"],
    function ($, angular, UnifyValid, FileUpload, Message, mask, Exception, jqueryForm) {
        "use strict";

        var baseInfoCtrl = ["$scope", "$window", "$state", "$timeout",
            function ($scope, $window, $state, $timeout) {

                var user = $("html").scope().user;
                var exceptionService = new Exception();
                $scope.openstack = ($scope.user.cloudType === "OPENSTACK" ? true : false);

                // 扩展UnifyValid
                UnifyValid.checkTemplateName = function (param) {
                    var value = $(this).val();
                    if (!/^[ ]*[\u4e00-\u9fa5A-Za-z0-9-_ ]{1,256}[ ]*$/.test(value)) {
                        return false;
                    }
                    return true;
                };

                UnifyValid.pwdConfirm = function () {
                    if ($("#" + $scope.password.id).widget().getValue() === $("#" + $scope.passwordConfirm.id).widget().getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.name = {
                    label: $scope.i18n.common_term_name_label + ":",
                    require: true,
                    "id": "addISOName",
                    "extendFunction": ["checkTemplateName"],
                    "validate": "required:" + $scope.i18n.common_term_null_valid + ";checkTemplateName(true):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256) + $scope.i18n.common_term_composition7_valid,
                    "width": "260"
                };

                $scope.templateLogo = {
                    "label": $scope.i18n.common_term_icon_label + ":",
                    "require": true,
                    "curLogo": "buff01.jpg",
                    "options": [],
                    "showOptions": false,
                    "change": function () {
                        $("#importTemplateLogoOptionId").toggle();
                    },
                    "changeLogo": function (logo) {
                        if (logo) {
                            $scope.service.model.curLogo = logo;
                            $("#importTemplateLogoOptionId").hide();
                        }
                    },
                    "init": function () {
                        var logoOptions = [];
                        for (var index = 1; index <= 9; index++) {
                            logoOptions.push("buff0" + index + ".jpg");
                        }
                        $scope.templateLogo.options = logoOptions;
                    }
                };

                $scope.templateLogo.init();

                $scope.templateName = {
                    label: $scope.i18n.common_term_templateFile_label + ":",
                    require: true,
                    "id": "createImageFile",
                    "idSingle": "createImagefileSingle",
                    "fileObjName": "imageName",
                    "action": "",
                    "fileType": ".gz;",
                    "maxSize": 1 * 1024 * 1024,
                    "selectError": function (event, file, errorMsg) {
                        var content = $scope.i18n.common_term_fileFormatError_valid || "文件格式不正确。";
                        if (errorMsg == "INVALID_FILE_TYPE") {
                            content = $scope.i18n.common_term_fileTypeNotMatch_valid || "文件类型不匹配。";
                        } else if (errorMsg == "EXCEED_FILE_SIZE") {
                            content = $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithValue_valid, "20G");
                        } else {
                            //do nothing
                        }

                        var options = {
                            "type": "error",
                            "content": content,
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();

                        $("#" + $scope.file.idSingle).widget().empty();
                    },
                    "method": "post",
                    "enableDetail": false,   //不显示文件上传状态等信息
                    "showSubmitBtn": false,  //后无提交按钮标题
                    "title": "",              //前无标题
                    "width": 260,
                    "beforeSubmit": function (event, file) {
                        mask.show();
                        $("#" + $scope.templateName.idSingle).widget().addFormData({
                            "name": $("#" + $scope.name.id).widget().getValue(),
                            "picture": $scope.service.model.curLogo,
                            "resPoolType": (user.cloudType !== "OPENSTACK" ? "FusionManager" : "OpenStack"),
                            "desc": $("#" + $scope.description.id).widget().getValue()
                        });
                    },
                    "select": function (event, file) {
                        $scope.service.model.templateName = file.name;
                    },
                    //文件上传完成后返回信息
                    "complete": function (event, responseText) {
                        mask.hide();

                        $state.go("serviceMgr.appTemplate", {});
                    }
                };


                $scope.description = {
                    label: $scope.i18n.common_term_desc_label || ":",
                    require: false,
                    "id": "addISODescription",
                    "value": "",
                    "type": "multi",
                    "width": "450",
                    "height": "80",
                    "validate": "maxSize(1024):" + $scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
                };

                $scope.nextBtn = {
                    id: "baseInfo_next_id",
                    disabled: false,
                    iconsClass: "",
                    text: $scope.i18n.common_term_next_button || "下一步",
                    tip: "",
                    next: function () {
                        var valid = UnifyValid.FormValid($("#importTemplateBasicInfoId"));
                        if (!valid) {
                            return;
                        }

                        if (!/^([A-Za-z0-9\._\s-]{1,})(\.tar\.gz){1}$/i.test($scope.service.model.templateName)) {
                            var options = {
                                "type": "error",
                                "content": $scope.i18n.app_term_appTemplateFormat_valid,
                                "width": "360px",
                                "height": "200px"
                            };
                            var msg = new Message(options);
                            msg.show();
                            return;
                        }

                        $scope.service.model.name = $("#" + $scope.name.id).widget().getValue();
                        $scope.service.model.description = $("#" + $scope.description.id).widget().getValue();

                        $scope.service.show = "confirm";
                        $("#" + $scope.service.step.id).widget().next();
                    }
                };

                $scope.cancelBtn = {
                    id: "baseInfo_cancel_id",
                    disabled: false,
                    iconsClass: "",
                    text: $scope.i18n.common_term_cancle_button || "取消",
                    tip: "",
                    cancel: function () {
                        $state.go("serviceMgr.appTemplate", {});
                    }
                };

                $("#importTemplate").click(function (e) {
                    var target = e.target;
                    if (!target) {
                        return false;
                    }

                    if (!$(target).hasClass("customHide")) {
                        $("#importTemplateLogoOptionId").hide();
                    }
                });

                // 事件处理
                $scope.$on($scope.importTemplEvent.confirmedFromParent, function (event, msg) {
                    $scope.uploadHandle();
                });

                /**
                 * 上传文件
                 */
                $scope.uploadHandle = function () {

                    $("#" + $scope.templateName.idSingle + " form").attr("action", "/goku/rest/v1.5/all/apptemplates/actions");

                    $("#" + $scope.templateName.idSingle).widget().submit();
                };

                /**
                 * 初始化操作
                 */
                $scope.init = function () {
                    var options = {
                        "beforeSend": function (request) {
                        },
                        "beforeSubmit": function (formData, jqForm, options) { //提交前的回调函数
                            return true;  //只要不返回false，表单都会提交,在这里可以对表单元素进行验证
                        },
                        "success": function (responseText, statusText) { //提交后的回调函数
                            $state.go("serviceMgr.appTemplate", {});
                        },
                        "error": function (data) {
                            exceptionService.doException(data, null);
                        },
                        "complete": function (xmlHttpRequest, ts) {
                            mask.hide();
                        }
                    };

                    $timeout(function () {
                        $("#" + $scope.templateName.idSingle + " form").ajaxForm(options);
                    }, 500);
                };

                $scope.init();
            }];

        return baseInfoCtrl;
    });
