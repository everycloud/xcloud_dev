define(['tiny-lib/jquery', "tiny-lib/angular", "tiny-lib/underscore"], function ($, angular, _) {
    "use strict";

    //保存依赖关系的矩阵
    var dependMatrix = [];

    var backupDependMatrix = null;

    //依赖矩阵的单个元素
    function DependAtom(srcId, dependId) {
        this.id = srcId;
        this.addDepends = function (dependId) {
            if (dependId) {
                this.dependOn.push(dependId);
            }
        };
        this.dependOn = [];
        this.addDepends(dependId);

        this.toString = function () {
            return " [srcId=" + this.id + "; ->dependId=" + this.dependOn + "] ";
        };
    }

    function getAtomById(srcId) {
        if (!srcId || (dependMatrix.length <= 0)) {
            return null;
        }
        var foundAtom = null;
        _.each(dependMatrix, function (item, index) {
            if (srcId === item.id) {
                foundAtom = item;
            }
        });
        return foundAtom;
    }

    function add2DependMatrix(srcId, dependId) {
        var foundAtom = getAtomById(srcId);
        if (foundAtom) {
            foundAtom.addDepends(dependId);
        } else {
            var newAtom = new DependAtom(srcId, dependId);
            dependMatrix.push(newAtom);
        }
    }

    function isValid(id) {
        return (typeof (id) !== "undefined") && (null !== id) && (id !== "");
    }

    var service = function () {
        //softTable除当前正在被配置的软件包外的软件包列表  shellTable除当前正在被配置的shell外的shell列表
        this.init = function (softTable, shellTable) {
            dependMatrix = [];
            var self = this;
            var i;
            if (softTable.length > 0) {
                _.each(softTable, function (item, index) {
                    if (!item.softwareData) {
                        return;
                    }
                    if (item.softwareData.installParams && (item.softwareData.installParams.length > 0)) {
                        for (i = 0; i < item.softwareData.installParams.length; i++) {
                            if (isValid(item.softwareData.installParams[i].associateVmId)) {
                                self.add(item.vmTemplateAmeId, item.softwareData.installParams[i].associateVmId);
                            }
                        }
                    }

                    if (item.softwareData.startParams && (item.softwareData.startParams.length > 0)) {
                        for (i = 0; i < item.softwareData.startParams.length; i++) {
                            if (isValid(item.softwareData.startParams[i].associateVmId)) {
                                self.add(item.vmTemplateAmeId, item.softwareData.startParams[i].associateVmId);
                            }
                        }
                    }

                    if (item.softwareData.stopParams && (item.softwareData.stopParams.length > 0)) {
                        for (i = 0; i < item.softwareData.stopParams.length; i++) {
                            if (isValid(item.softwareData.stopParams[i].associateVmId)) {
                                self.add(item.vmTemplateAmeId, item.softwareData.stopParams[i].associateVmId);
                            }
                        }
                    }

                    if (item.softwareData.unInstallParams && (item.softwareData.unInstallParams.length > 0)) {
                        for (i = 0; i < item.softwareData.unInstallParams.length; i++) {
                            if (isValid(item.softwareData.unInstallParams[i].associateVmId)) {
                                self.add(item.vmTemplateAmeId, item.softwareData.unInstallParams[i].associateVmId);
                            }
                        }
                    }
                });
            }
            if (shellTable.length > 0) {
                _.each(shellTable, function (item, index) {
                    if (!item.shellData) {
                        return;
                    }
                    if (item.shellData.installParams && (item.shellData.installParams.length > 0)) {
                        for (var i = 0; i < item.shellData.installParams.length; i++) {
                            if (isValid(item.shellData.installParams[i].associateVmId)) {
                                self.add(item.vmTemplateAmeId, item.shellData.installParams[i].associateVmId);
                            }
                        }
                    }
                });
            }
        };
        this.isValidDependence = function (option) {
            if (!option || !option.associate || !option.associate.associateVmId || ("" === option.associate.associateVmId)) {
                return false;
            }

            return true;
        };
        this.generateErrorTips = function (curVmTemplateName, targetVmTemplateName) {
            return curVmTemplateName + "和" + targetVmTemplateName + "存在循环依赖";
        };
        //本方法用于开发调试,不对外提供
        this.showDependence = function () {
            return {
                "dependMatrix": dependMatrix,
                "backupDependMatrix": backupDependMatrix
            };
        };
        //备份依赖矩,待用户的选择合法保存时再保持(用户可能在当前页多次变更)
        this.backup = function () {
            backupDependMatrix = angular.copy(dependMatrix);
        };
        //还原依赖矩,用户的选择不合法,或者用户放弃,或者合法前即将保存时使用
        this.recover = function () {
            dependMatrix = angular.copy(backupDependMatrix);
        };
        this.add = function (srcId, dependId) {
            add2DependMatrix(srcId, dependId);
        };
        this.validateDepends = function (srcId, validatingId) {
            if (srcId === validatingId) {
                return true;
            }
            if (dependMatrix.length <= 0) {
                return false;
            }
            for (var i = 0; i < dependMatrix.length; i++) {
                //不可能存在路径
                if (srcId !== dependMatrix[i].id) {
                    continue;
                }

                //递归判断依赖关系
                if (dependMatrix[i].dependOn.length > 0) {
                    for (var j = 0; j < dependMatrix[i].dependOn.length; j++) {
                        if (this.validateDepends(dependMatrix[i].dependOn[j], validatingId)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        this.CustomJsonFormat = function(txt){
            var stepBack4 = "    ";
            if (/^\s*$/.test(txt)) {
                return txt;
            }
            var data = null;
            try {
                data = JSON.parse(txt);
            } catch (e) {
                return txt;
            }

            if (null === data || !data.Resources) {
                return data;
            }
            // 如果是脚本需要屏蔽六个参数:UninstallCommands StartCommands StopCommands UninstallParams StartParams StopParams
            _.each(data.Resources, function (resource) {
                if (resource && resource.Properties && resource.Properties.Softwares) {
                    var softwares = resource.Properties.Softwares;
                    _.each(softwares, function (software) {
                        if (software && software.Type === "Script") {
                            delete software.UninstallCommands;
                            delete software.UninstallParams;
                            delete software.StartCommands;
                            delete software.StartParams;
                            delete software.StopCommands;
                            delete software.StopParams;
                        }
                    });
                }
            });

            var draw = [];
            var table = '\n';
            var notify = function (key, value, isLast, backward, fromObj) {
                var tab = '';
                var i;
                var j;
                var k;
                var len;
                for (i = 0; i < backward; i++) {
                    tab += stepBack4;
                }
                ++backward;

                if (value && (value.constructor === Array)) {
                    draw.push(tab + (fromObj ? ('"' + key + '":') : '') + '[' + table);
                    for (j = 0; j < value.length; j++) {
                        notify(j, value[j], (j === (value.length - 1)), backward, false);
                    }
                    draw.push(tab + ']' + (isLast ? table : (',' + table)));
                } else if (value && (typeof value === 'object')) {
                    draw.push(tab + (fromObj ? ('"' + key + '":') : '') + '{' + table);
                    len = 0;
                    k = 0;
                    _.each(value, function (item, index) {
                        ++len;
                    });
                    _.each(value, function (item, index) {
                        notify(index, value[index], (++k === len), backward, true);
                    });
                    draw.push(tab + '}' + (isLast ? table : (',' + table)));
                } else {
                    if (typeof value === 'string') {
                        value = '"' + value + '"';
                    }
                    draw.push(tab + (fromObj ? ('"' + key + '":') : '') + value + (isLast ? table : (',' + table)));
                }
            };

            notify('', data, true, 0, false);
            return draw.join("");
        };

        //将CustomJsonFormat定制化(会换行,退格等)的JSON回归标准格式(无换行等)
        this.formatJSON = function(txt){
            if (null === txt){
                return "";
            }
            if (/^\s*$/.test(txt)) {
                return txt;
            }
            var data = null;
            try {
                data = JSON.parse(txt);
            } catch (e) {
                return txt;
            }

            var draw = [];
            //key-当前遍历的对象的属性 value-当前遍历的对象的属性对应的值 fromObj-当前的value是否来源于一个对象(例如:顶层对象及数组的成员为false)
            //isLast-当前遍历的value是否前一个对象的最后一个属性对应的值
            var notify = function (key, value, isLast, fromObj) {
                var i;
                var j;
                var k;
                var len;

                if (value && (value.constructor === Array)) {
                    draw.push((fromObj ? ('"' + key + '":') : '') + '[');
                    for (j = 0; j < value.length; j++) {
                        notify(j, value[j], (j === (value.length - 1)), false);
                    }
                    draw.push(']' + (isLast ? '' : ','));
                } else if (value && (typeof value === 'object')) {
                    draw.push((fromObj ? ('"' + key + '":') : '') + '{');
                    len = 0;
                    k = 0;
                    _.each(value, function (item, index) {
                        ++len;
                    });
                    _.each(value, function (item, index) {
                        notify(index, value[index], (++k === len), true);
                    });
                    draw.push('}' + (isLast ? '' : (',')));
                }
                else {
                    if (typeof value === 'string') {
                        value = '"' + value + '"';
                    }
                    draw.push((fromObj ? ('"' + key + '":') : '') + value + (isLast ? '' : (',')));
                }
            };

            notify('', data, true, false);
            return draw.join("");
        };
    };

    return service;
});
