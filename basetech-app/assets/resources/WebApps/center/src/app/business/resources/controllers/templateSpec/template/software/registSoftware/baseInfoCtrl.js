define(['jquery',
    'tiny-lib/angular',
    'tiny-common/UnifyValid',
    'upload/FileUpload',
    "tiny-widgets/Message"],
    function ($, angular, UnifyValid, FileUpload, Message) {
        "use strict";

        var baseInfoCtrl = ["$scope", "$state", "$stateParams", function ($scope, $state, $stateParams) {

            // 扩展UnifyValid
            UnifyValid.checkSoftwareName = function (param) {
                var value = $(this).val();
                if(!/^[\w\s\._\-\(\)\[\]\#\u4E00-\u9FA5]{1,256}$/.test(jQuery.trim(value))) {
                    return false;
                }

                return true;
            };

            // 扩展UnifyValid
            UnifyValid.checkVersion = function (param) {
                var value = jQuery.trim($(this).val());
                if(!/^[A-Za-z0-9]+[\w\.\_\-]*$/.test(value)||value.length>64)
                {
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
                label: $scope.i18n.common_term_name_label+":",
                require: true,
                "id": "registSoftwareName",
                "tooltip": $scope.i18n.common_term_composition6_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "extendFunction" : ["checkSoftwareName"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";checkSoftwareName():"+$scope.i18n.common_term_composition6_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 256),
                "width": "240"
            };

            $scope.softwareName = {
                label: $scope.i18n.template_term_softwareFile_label+":",
                require: true,
                inputRequired:false,
                "id": "registSoftwareFileName",
                "value": "",
                "readonly":true,
                "display":true,
                "width": "240",
                "validate": "maxSize(256):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 256)+";required:"+$scope.i18n.common_term_null_valid,
                select: function () {
                    var fileName = undefined;
                    try {
                        fileName = FileUpload.openFtpSelectWindow("main");
                    }
                    catch (e) {
                    }

                    $scope.service.model.softwareName = fileName;
                }
            };

            $scope.password = {
                label: $scope.i18n.common_term_psw_label+":",
                require: true,
                "display": $stateParams.action == "create",
                "id": "ftsAuthenticPwd",
                "validate":"required:"+$scope.i18n.common_term_null_valid,
                "width": "240",
                "type":"password",
                "value":""
            };

            $scope.passwordConfirm = {
                label: $scope.i18n.common_term_PswConfirm_label+":",
                require: true,
                "display": $stateParams.action == "create",
                "id": "ftsAuthenticPwdConfirm",
                "extendFunction": ["pwdConfirm"],
                "validate":"required:"+$scope.i18n.common_term_null_valid+";pwdConfirm:"+$scope.i18n.common_term_pswDifferent_valid+";",
                "width": "240",
                "type":"password",
                "value":""
            };

            $scope.picture = {
                label: $scope.i18n.common_term_icon_label+":",
                require: false,
                "id": "registSoftwarePicture",
                "width": "240",
                "show":false,
                "imgs":[],
                "click":function(){
                    $scope.picture.show = !$scope.picture.show;
                },
                "init": function () {
                    var img = function (index) {
                        var src = "../theme/default/images/softwarePackage/icon_software_" + index + ".png";
                        return {
                            "src": src,
                            "click": function () {
                                $scope.service.model.picture = src;
                            }
                        }
                    };
                    var imgs = [];
                    for (var index = 1; index <= 10; index++)
                    {
                        imgs.push(img(index));
                    }
                    $scope.picture.imgs = imgs;
                }
            };

            $scope.osType = {
                label: $scope.i18n.template_term_suitOS_label+":",
                require: true,
                "id": "registSoftwareOSType",
                "width": "240",
                "values": [
                    {
                        "selectId": "Linux",
                        "label": "Linux",
                        "checked": true
                    },
                    {
                        "selectId": "Windows",
                        "label": "Windows"
                    }
                ],
                "change":function() {
                    //
                    var osType = $("#"+$scope.osType.id).widget().getSelectedId();
                    if (osType == "Linux") {
                        $scope.fileType.values = [
                            {
                                "selectId": "unknown",
                                "label": "unknown",
                                "checked": true
                            },
                            {
                                "selectId": "rpm",
                                "label": "rpm"
                            }
                        ];
                    } else {
                        $scope.fileType.values = [
                            {
                                "selectId": "unknown",
                                "label": "unknown",
                                "checked": true
                            },
                            {
                                "selectId": "msi",
                                "label": "msi"
                            }
                        ];
                    }
                }
            };

            $scope.fileType = {
                label: $scope.i18n.common_term_softwareType_label+":",
                require: true,
                "id": "registSoftwareFileType",
                "width": "240",
                "values": [
                    {
                        "selectId": "unknown",
                        "label": "unknown",
                        "checked": true
                    },
                    {
                        "selectId": "rpm",
                        "label": "rpm"
                    }
                ]
            };

            $scope.version = {
                label: $scope.i18n.common_term_version_label+":",
                require: true,
                "id": "registSoftwareVersion",
                "extendFunction" : ["checkVersion"],
                "value": "",
                "width": "240",
                "validate": "required:"+$scope.i18n.common_term_null_valid+";checkVersion():"+$scope.i18n.common_term_composition4_valid+$scope.i18n.common_term_startWithEnOrNum_valid+$scope.i18n.sprintf($scope.i18n.common_term_length_valid, 1, 64)+";"
            };

            $scope.description = {
                label: $scope.i18n.common_term_desc_label+":",
                require: false,
                "id": "registSoftwareDescription",
                "value": "",
                "type": "multi",
                "width": "450",
                "height": "80",
                "validate": "maxSize(1024):"+$scope.i18n.sprintf($scope.i18n.common_term_maxLength_valid, 1024)
            };

            $scope.nextBtn = {
                id: "baseInfo_next_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_next_button,
                tip: "",
                next: function () {
                    $scope.softwareName.inputRequired = true;
                    var valid = UnifyValid.FormValid($("#registSoftwareBaseInfo"));
                    if (!valid || !$scope.service.ftpAppletLoaded
                        || $("#addISOBaseInfo .ng-invalid").length > 0
                        || $scope.service.model.softwareName == "") {
                        return;
                    }

                    if ($scope.checkDuplicatedFile()) {
                        return;
                    }

                    if (FileUpload.getFileSize("main") > 1024*1024*1024*4) {
                        var options = {
                            "type": "error",
                            "content": $scope.i18n.sprintf($scope.i18n.common_term_fileMaxWithValue_valid, "4G"),
                            "width": "360px",
                            "height": "200px"
                        };
                        var msg = new Message(options);
                        msg.show();
                        return;
                    }

                    var action = $stateParams.action;
                    if (action === 'create') {
                        $scope.service.ftpInfo.pwd = $("#" + $scope.password.id).widget().getValue();
                    }

                    $scope.service.model.name = $("#" + $scope.name.id).widget().getValue();
                    $scope.service.model.osType = $("#" + $scope.osType.id).widget().getSelectedLabel();
                    $scope.service.model.fileType = $("#" + $scope.fileType.id).widget().getSelectedLabel();
                    if ($scope.service.model.range == '0') {
                        $scope.service.model.rangeValue = $scope.i18n.common_term_system_label;
                    } else {
                        $scope.service.model.rangeValue = "VDC";
                    }

                    $scope.service.model.version = $("#" + $scope.version.id).widget().getValue();
                    $scope.service.model.description = $("#" + $scope.description.id).widget().getValue();

                    // 触发事件
                    $scope.$emit($scope.registSoftwareEvents.baseInfoChanged, $scope.service.model);
                    $scope.service.show = "commandConfig";
                    $("#" + $scope.service.step.id).widget().next();
                }
            };

            $scope.cancelBtn = {
                id: "baseInfo_cancel_id",
                disabled: false,
                iconsClass: "",
                text: $scope.i18n.common_term_cancle_button,
                tip: "",
                cancel: function () {
                    $state.go($scope.service.from, {});
                }
            };

            /**
             * 初始化操作
             */
            $scope.init = function () {
                $scope.picture.init();

                var action = $stateParams.action;
                if (action === 'create') {
                    // do nothing
                    return;
                }

                $scope.name.disabled = true;
                $scope.name.require = false;
                $scope.name.validate = "";
                $scope.softwareName.disabled = true;
                $scope.softwareName.require = false;
                $scope.softwareName.validate = "";
                $scope.softwareName.display = false;

                // 事件处理
                $scope.$on($scope.registSoftwareEvents.softwareInfoInit, function (event, msg) {
                    // 修改时，初始化页面数据
                    $scope.service.model.name = msg.name;
                    $scope.service.model.softwareName = msg.mainFilePath && msg.mainFilePath.substr(msg.mainFilePath.lastIndexOf("/")+1, msg.mainFilePath.length);
                    $scope.service.model.osType = msg.osType;
                    $scope.service.model.fileType = msg.fileType;
                    $scope.service.model.picture = msg.picture;
                    $scope.service.model.range = msg.range;
                    $scope.service.model.version = msg.version;
                    $scope.service.model.description = msg.description;

                    $("#" + $scope.name.id).widget().option("value", $scope.service.model.name);
                    $("#" + $scope.softwareName.id).widget().option("value", $scope.service.model.softwareName);
                    $("#" + $scope.osType.id).widget().opChecked($scope.service.model.osType);

                    if ($scope.service.model.osType == "Linux") {
                        $scope.fileType.values = [
                            {
                                "selectId": "unknown",
                                "label": "unknown",
                                "checked": $scope.service.model.fileType == 'unknown'
                            },
                            {
                                "selectId": "rpm",
                                "label": "rpm",
                                "checked": $scope.service.model.fileType == 'rpm'
                            }
                        ];
                    } else {
                        $scope.fileType.values = [
                            {
                                "selectId": "unknown",
                                "label": "unknown",
                                "checked": $scope.service.model.fileType == 'unknown'
                            },
                            {
                                "selectId": "msi",
                                "label": "msi",
                                "checked": $scope.service.model.fileType == 'msi'
                            }
                        ];
                    }

                    $("#" + $scope.fileType.id).widget().opChecked($scope.service.model.fileType);

                    $("#" + $scope.version.id).widget().option("value", $scope.service.model.version);
                    $("#" + $scope.description.id).widget().option("value", $scope.service.model.description);
                });
            };

            $scope.init();
        }];

        return baseInfoCtrl;
    });
