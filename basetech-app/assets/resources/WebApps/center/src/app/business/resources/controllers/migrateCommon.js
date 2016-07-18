define([""], function () {
	var i18n = $("html").scope().i18n;
    function getModeType(type) {
        type = type.toUpperCase();
        if (type == 'NAS' || type == 'LOCALPOME' || type == 'LUNPOME') {
            return "V";//虚拟化存储
        } else {
            return "B"//块存储
        }
    };
    function isNas(type) {
        return type.toUpperCase() == 'NAS';
    };

    var COMMON = {
		'DATASTORE_TYPE' :  {
			"NFS":  i18n.common_term_NAS_label || "NAS存储",
			"NAS": i18n.common_term_NAS_label || "NAS存储",
			"advanceSan": "Advance San",
			"LOCAL": i18n.resource_stor_create_para_type_option_local_value || "本地存储",
			"LOCALPOME": i18n.resource_stor_create_para_type_option_vLocal_value || "虚拟化本地存储",
			"SAN": i18n.resource_stor_create_para_type_option_SAN_value || "SAN存储",
			"LUNPOME": i18n.resource_stor_create_para_type_option_vSAN_value || "虚拟化SAN存储",
			"LUN": i18n.resource_stor_create_para_type_option_bare_value || "裸设备映射存储",
			"DSWARE": "FusionStorage"
		},
        //卷配置模式
        'allocTypes': {
            "thick": i18n.common_term_common_label || "普通",
            "thin": i18n.common_term_thinProv_label || "精简",
            "thickformat": i18n.common_term_lazyZeroed_label || "普通延迟置零"
        },
        'diskType': {
            'normal': i18n.common_term_common_label || '普通',
            'share': i18n.common_term_share_label || '共享'
        },
        "getMigrateMode": function (modeInfo) {
            if(modeInfo.sourceType == null){
                return{
                    targetMode: [modeInfo.sourceMode],//迁移后模式
                    isSelect: false,//是否可选择模式
                    isChange: false//是否变化
                };
            }
            var sourceMode = modeInfo.sourceMode;
            var st = getModeType(modeInfo.sourceType);
            var tt = getModeType(modeInfo.targetType);
            var key = '';
            /*RUNNING
             块存储 虚拟化存储 是 迁移时可以选择为普通延迟置零（NAS不支持）或者精简
             虚拟化存储（普通） 虚拟化存储  是 迁移时可以选择为普通延迟置零（NAS不支持）或者精简
             虚拟化存储（延迟置零） 虚拟化存储（非NAS） 否 保持不变
             虚拟化存储（延迟置零） 虚拟化存储（NAS） 是 精简
             虚拟化存储（精简） 虚拟化存储 否 保持不变
             */
            if (modeInfo.vmStatus == 'running') {
                if (st == 'B') {
                    return {
                        targetMode: ['thick','thin', 'thickformat'],
                        isSelect: true,//是否下拉框可用
                        isChange: true//迁移前后模式是否变化
                    }
                } else {
                    if (modeInfo.sourceMode == 'thick') {
                        return {
                            targetMode: ['thick','thin', 'thickformat'],
                            isSelect: true,
                            isChange: true
                        }
                    } else if (modeInfo.sourceMode == 'thickformat') {
                        if (isNas(modeInfo.targetType)) {//NAS
                            return {
                                targetMode: ['thin'],
                                isSelect: false,
                                isChange: true
                            }
                        } else {
                            return {
                                targetMode: [modeInfo.sourceMode],
                                isSelect: false,
                                isChange: false
                            }
                        }
                    } else if (modeInfo.sourceMode == 'thin') {
                        return {
                            targetMode: [modeInfo.sourceMode],
                            isSelect: false,
                            isChange: false
                        }
                    }
                }
            }
            /*STOPPED
             虚拟化存储（普通，延迟置零，精简） 虚拟化存储（非NAS） 否 保持不变
             虚拟化存储（延迟置零） 虚拟化存储（NAS） 是 精简
             虚拟化存储 块存储 是 普通
             块存储(普通) 虚拟化存储 否 保持不变
             块存储(普通) 块存储 否 保持不变
             * */
            else if (modeInfo.vmStatus == 'stopped') {
                if (st == 'V') {
                    if (tt == 'V') {
                        if (isNas(modeInfo.targetType)) {//NAS
                            return {
                                targetMode: ['thin'],
                                isSelect: false,
                                isChange: true
                            }
                        } else {
                            return {
                                targetMode: [modeInfo.sourceMode],
                                isSelect: false,
                                isChange: false
                            }
                        }
                    } else {
                        return {
                            targetMode: ['thick'],
                            isSelect: false,
                            isChange: true
                        }
                    }
                } else {
                    return {
                        targetMode: [modeInfo.sourceMode],
                        isSelect: false,
                        isChange: false
                    }
                }
            }
            return {
                targetMode: [modeInfo.sourceMode],//迁移后模式
                isSelect: false,//是否可选择模式
                isChange: false//是否变化
            };
        }
    };
    return COMMON;
});
