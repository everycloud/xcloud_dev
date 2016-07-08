define(["tiny-lib/jquery","tiny-lib/encoder", "./resource"], function ($, $encoder, $res) {
    "use strict";
    var encoder = $.encoder;
    var i18n = $("html").scope().i18n;
    $.fn.addNicOpt = function (mxcell, tableId) {
        var dom = this;
        dom.unbind("click");
        dom.bind("click", function () {
            var trDom = $("<tr><td class='textOverflow' style='width: 60px'></td><td class='textOverflow' style='width: 60px'></td><td class='textOverflow' style='width: 50px; height:20px; line-height: 20px'></td><td class='textOverflow'></td></tr>");
            var input = $("<input type='text' value=''>");
            input.css({
                "width": $("#" + tableId).find("thead tr th:first").css("width")
            });
            trDom.find("td:first").append(input);

            //是否支持VLB
            var checkbox = $("<div><input type='checkbox' style='margin: 0;vertical-align: middle;'/><label style='padding: 0 0 0 5px'>"+i18n.common_term_support_value+"</label></div>");
            trDom.find("td:eq(2)").append(checkbox);

            var editDom = $('<img class="template-nic-edit btn-link" src="../theme/default/images/design-modify.png">');
            var delDom = $('<img class="template-nic-delete btn-link" src="../theme/default/images/design-delete.png">');

            var opts = $('<div>').append(editDom).append(delDom);
            trDom.find("td:last").append(opts);

            editDom.editNicOpt(mxcell);
            delDom.deleteNicOpt(mxcell);
            checkbox.find("input").bind("click", function () {
                var nic = mxcell.resource.getNic(trDom.data("id"));
                if (!nic) {
                    return;
                }
                nic.vlb = this.checked + "";
            });
            input.bind("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    if (!input.val() || input.val() === "") {
                        trDom.remove();
                        return;
                    }
                    trDom.find("td:first").text(input.val());
                    var id = mxcell.resource.createId();
                    trDom.data("id", id);
                    var nic = new Nic(input.val());
                    nic.templateDefine = mxcell.resource.templateDefine;
                    nic.systemDefault = false;
                    mxcell.resource.addNic(id, nic);
                }
            });
            input.bind("blur", function () {
                if (!input.val() || input.val() === "") {
                    trDom.remove();
                    return;
                }
                trDom.find("td:first").text(input.val());
                var id = mxcell.resource.createId();
                trDom.data("id", id);
                var nic = new Nic(input.val());
                nic.templateDefine = mxcell.resource.templateDefine;
                nic.systemDefault = false;
                mxcell.resource.addNic(id, nic);
            });
            $("#" + tableId).find("tbody").append(trDom);
            input.focus();
        });
    };

    $.fn.deleteNicOpt = function (mxcell) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                //如果网卡已经关联了网络，还需要删除连线
                var nic = mxcell.resource.getNic(trDom.data("id"));
                if (nic.portGroupId.refId !== null) {
                    var conCell = mxcell.resource.templateDefine.getConnectionByFromIdAndToId(mxcell.resourceId, nic.portGroupId.refId);
                    mxcell.resource.templateDefine.delConnection(conCell);
                }
                mxcell.resource.delNic(trDom.data("id"));

                trDom.remove();
            });
        });
    };

    $.fn.editNicOpt = function (mxcell) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                var table = $(item).closest("table");
                var input = $("<input type='text' value=''>");

                var nic = mxcell.resource.getNic(trDom.data("id"));
                input.val(nic.name);
                input.css({
                    "width": table.find("thead tr th:first").css("width")
                });
                trDom.find("td:first").html(input);

                input.bind("keypress", function (evt) {
                    if (evt.keyCode === 13) {
                        trDom.find("td:first").text(input.val());
                        nic.name = input.val();
                    }
                });
                input.bind("blur", function () {
                    trDom.find("td:first").text(input.val());
                    nic.name = input.val();
                });
                input.focus();
            });
        });
    };

    $.fn.addCommandsOpt = function (mxcell, tableId, type) {
        var dom = this;
        dom.unbind("click");
        dom.bind("click", function () {
            var trDom = $("<tr><td class='textOverflow' style='max-width: 200px'></td><td></td></tr>");
            var input = $("<input type='text' value=''>");
            trDom.find("td:first").append(input);
            var editDom = $('<img class="btn-link ' + type + "-edit" + '" src="../theme/default/images/design-modify.png" style="margin-right: 4px">');
            var delDom = $('<img class="btn-link ' + type + "-delete" + '" src="../theme/default/images/design-delete.png">');

            var opts = $('<div class="pull-right">').append(editDom).append(delDom);
            trDom.find("td:last").append(opts);

            editDom.editCommandsOpt(mxcell, type);
            delDom.deleteCommandsOpt(mxcell, type);
            input.bind("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    if (!input.val() || input.val() === "") {
                        trDom.remove();
                        return;
                    }
                    trDom.find("td>input").replaceWith(encoder.encodeForHTML(input.val()));
                    var id = mxcell.resource.createId();
                    trDom.data("id", id);
                    addCommand(mxcell, type, id, input.val());
                }
            });
            input.bind("blur", function () {
                if (!input.val() || input.val() === "") {
                    trDom.remove();
                    return;
                }
                trDom.find("td>input").replaceWith(encoder.encodeForHTML(input.val()));
                var id = mxcell.resource.createId();
                trDom.data("id", id);
                addCommand(mxcell, type, id, input.val());
            });
            $("#" + tableId).find("tbody").append(trDom);
            input.focus();
        });
    };

    $.fn.editCommandsOpt = function (mxcell, type) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                var input = $("<input type='text' value=''>");
                var command = getCommand(mxcell, type, trDom.data("id"));
                input.val(command);
                trDom.find("td:first").html(input);

                input.bind("keypress", function (evt) {
                    if (evt.keyCode === 13) {
                        trDom.find("td:first").text(input.val());
                        updateCommand(mxcell, type, trDom.data("id"), input.val());
                    }
                });
                input.bind("blur", function () {
                    trDom.find("td:first").text(input.val());
                    updateCommand(mxcell, type, trDom.data("id"), input.val());
                });
                input.focus();
            });
        });
    };

    $.fn.deleteCommandsOpt = function (mxcell, type) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                deleteCommand(mxcell, type, trDom.data("id"));
                trDom.remove();
            });
        });
    };

    $.fn.editScalingPolicy = function (scope) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                scope.addScalingPolicyUI("modify", trDom.data("id"));
            });
        });

    };

    $.fn.deleteScalingPolicy = function (mxcell) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                mxcell.scalinggroup.delScalingPolicies(trDom.data("id"));
                trDom.remove();
            });
        });
    };

    //添加输出参数
    $.fn.addOutPutPraOpt = function (tableId, template) {
        var dom = this;
        dom.unbind("click");
        dom.bind("click", function () {
            var trDom = $("<tr><td class='textOverflow' style='width: 60px'></td><td class='textOverflow' style='width: 60px'></td><td class='textOverflow' style='width: 60px; height:20px; line-height: 20px'></td><td></td></tr>");

            //输出参数最多可以输入50条
            var outputTableTrLength = $("#template-output-table").find("tr").length;
            if (outputTableTrLength > 50) {
                return;
            }

            var id = template.createId();
            var temp = new OutputDefine(template.getOutputs());
            temp.id = id;

            var input = $("<input type='text' value=''>");
            input.css({
                "width": $("#" + tableId).find("thead tr th:eq(0)").css("width")
            });
            trDom.find("td:first").append(input);

            var input2 = $("<input type='text' value=''>");
            input2.css({
                "width": $("#" + tableId).find("thead tr th:eq(1)").css("width")
            });
            trDom.find("td:eq(1)").append(input2);

            var input3 = $("<input type='text' value=''>");
            input3.css({
                "width": $("#" + tableId).find("thead tr th:eq(2)").css("width")
            });
            trDom.find("td:eq(2)").append(input3);

            var save = $("<button id = '" + id + "'>"+i18n.common_term_save_label+"</button>");

            var saveOpt = $('<div>').append(save);
            trDom.find("td:last").append(saveOpt);

            $("#" + tableId).find("tbody").append(trDom);
            input.focus();

            save.bind("click", function () {
                if (!checkPublicParamName(trDom, input.val())) {
                    return;
                }
                if (!checkOutParamDefaultValue(trDom, input2.val())) {
                    return;
                }
                if (!checkParamDescription(trDom, input3.val())) {
                    return;
                }

                if (input.val() != "" || input2.val() != "" || input3.val() != "") {
                    var tempTemplate = template.getOutputById(input.val());
                    if (!tempTemplate) {
                        trDom.find("td:first").text(input.val());
                        temp.properties.outputName = input.val();
                        trDom.data("id", input.val());
                        trDom.find("td:eq(1)").text(input2.val());
                        temp.properties.value = input2.val();
                        trDom.find("td:eq(2)").text(input3.val());
                        temp.properties.description = input3.val();
                        $("#" + id).remove(); //移除保存按钮
                        template.addOutput(temp);
                        var editDom = $('<img class="template-output-edit btn-link" src="../theme/default/images/design-modify.png">');
                        var delDom = $('<img class="template-output-delete btn-link" src="../theme/default/images/design-delete.png">');

                        var opts = $('<div>').append(editDom).append(delDom);
                        trDom.find("td:last").append(opts);

                        editDom.editOutPutPraOpt(template); //修改输出参数
                        delDom.deleteOutPutPraOpt(template); //删除输出参数
                    } else {
                        trDom.find("td:first").append("<div style='color: red;'>" + i18n.common_term_sameParaName_valid + "</div>");
                        return;
                    }
                } else {
                    trDom.remove();
                }
            });
        });
    };

    $.fn.addDeployOpt = function (tableId, template) {
        var dom = this;
        dom.unbind("click");
        dom.bind("click", function () {
            var trDom = $("<tr><td class='textOverflow' style='width: 50px'></td>" +
                "<td class='textOverflow' style='width: 55px'></td>" +
                "<td class='textOverflow' style='width: 43px'></td>" +
                "<td class='textOverflow' style='width: 30px'></td>" +
                "<td></td></tr>");
            var deployTableTrLength = $("#template-deploy-table").find("tr").length;
            //公共参数最多可以输入100条
            if (deployTableTrLength > 100) {
                return;
            }
            var id = template.createId();
            var temp = new ParameterDefine(template.getParameters());
            temp.id = id;

            var input = $("<input type='text' value=''>");
            input.css({
                "width": $("#" + tableId).find("thead tr th:first").css("width")
            });
            trDom.find("td:first").append(input);

            var input2 = $("<select>" +
                "<option value='String'>String</option>" +
                "<option value='Integer'>Integer</option>" +
                "<option value='Double'>Double</option>" +
                "<option value='IP'>IP</option>" +
                "<option value='HostName'>HostName</option>" +
                "</select>");
            input2.css({
                "width": $("#" + tableId).find("thead tr th:eq(1)").css("width")
            });
            trDom.find("td:eq(1)").append(input2);

            var input3 = $("<input type='text' value=''>");
            input3.css({
                "width": $("#" + tableId).find("thead tr th:eq(2)").css("width")
            });
            trDom.find("td:eq(2)").append(input3);

            var input4 = $("<input type='text' value=''>");
            input4.css({
                "width": $("#" + tableId).find("thead tr th:eq(3)").css("width")
            });
            trDom.find("td:eq(3)").append(input4);

            var save = $("<button>"+i18n.common_term_save_label+"</button>");

            var saveOpt = $('<div>').append(save);
            trDom.find("td:eq(4)").append(saveOpt);

            $("#" + tableId).find("tbody").append(trDom);
            input.focus();

            save.bind("click", function () {
                if (!checkPublicParamName(trDom, input.val())) {
                    return;
                }

                if (!checkPublicParamDefaultValue(trDom, input2.val(), input3.val())) {
                    return;
                }

                if (!checkParamDescription(trDom, input4.val())) {
                    return;
                }

                if (input.val() != "" || input2.val() != "" || input3.val() != "" || input4.val() != "") {
                    var tempTemplate = template.getParameterById(input.val());
                    if (!tempTemplate) {
                        trDom.find("td:first").text(input.val());
                        temp.properties.parameterName = input.val();
                        trDom.data("id", input.val());
                        trDom.find("td:eq(1)").text(input2.val());
                        temp.properties.type = input2.val();
                        trDom.find("td:eq(2)").text(input3.val());
                        temp.properties.defaultValue = input3.val();
                        trDom.find("td:eq(3)").text(input4.val());
                        temp.properties.description = input4.val();
                        trDom.find("button").remove();
                        template.addParameter(temp);
                        var editDom = $('<img class="template-deploy-edit btn-link" src="../theme/default/images/design-modify.png">');
                        var delDom = $('<img class="template-deploy-delete btn-link" src="../theme/default/images/design-delete.png">');

                        var opts = $('<div>').append(editDom).append(delDom);
                        trDom.find("td:last").append(opts);

                        editDom.editDeployOpt(template);
                        delDom.deleteDeployOpt(template);
                    } else {
                        var insertContent = "<span>"+i18n.common_term_sameParaName_valid+"</span>";
                        setValidorMsg(trDom, false, insertContent);
                        return;
                    }
                } else {
                    trDom.remove();
                }
            });
        });
    };

    $.fn.deleteDeployOpt = function (template) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                var parms = template.getParameterById(trDom.data("id"));
                template.delParameter(parms);
                trDom.remove();
            });
        });
    };

    $.fn.editDeployOpt = function (template) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                var table = $(item).closest("table");
                var deployTableTrLength = $("#template-deploy-table").find("tr").length;
                if (deployTableTrLength > 100) {
                    return;
                }
                var input = $("<input type='text' value=''>");
                trDom.find(".btn-link").css("display", "none");
                var parms = template.getParameterById(trDom.data("id"));
                input.val(parms.properties.parameterName);
                input.css({
                    "width": table.find("thead tr th:first").css("width")
                });
                trDom.find("td:first").html(input);
                trDom.find("td:first").css("width", "50px");

                var input2 = $("<select>" +
                    "<option value='String'>String</option>" +
                    "<option value='Integer'>Integer</option>" +
                    "<option value='Double'>Double</option>" +
                    "<option value='IP'>IP</option>" +
                    "<option value='HostName'>HostName</option>" +
                    "</select>");
                input2.val(parms.properties.type);
                input2.css({
                    "width": table.find("thead tr th:eq(1)").css("width")
                });
                trDom.find("td:eq(1)").html(input2);
                trDom.find("td:eq(1)").css("width", "55px");

                var input3 = $("<input type='text' value=''>");
                input3.val(parms.properties.defaultValue);
                input3.css({
                    "width": table.find("thead tr th:eq(2)").css("width")
                });
                trDom.find("td:eq(2)").html(input3);
                trDom.find("td:eq(2)").css("width", "43px");

                var input4 = $("<input type='text' value=''>");
                input4.val(parms.properties.description);
                input4.css({
                    "width": table.find("thead tr th:eq(3)").css("width")
                });
                trDom.find("td:eq(3)").html(input4);
                trDom.find("td:eq(3)").css("width", "30px");

                var reSave = $("<button>"+i18n.common_term_save_label+"</button>");
                var opts = $('<div>').append(reSave);
                trDom.find("td:last").append(opts);

                table.find("tbody").append(trDom);
                input.focus();

                reSave.bind("click", function () {
                    if (!checkPublicParamName(trDom, input.val())) {
                        return;
                    }

                    if (!checkPublicParamDefaultValue(trDom, input2.val(), input3.val())) {
                        return;
                    }

                    if (!checkParamDescription(trDom, input4.val())) {
                        return;
                    }
                    if (input.val() != "" || input2.val() != "" || input3.val() != "" || input4.val() != "") {
                        var tempTemplate = template.getParameterById(input.val());
                        if (!tempTemplate || (tempTemplate && parms.properties.parameterName == input.val())) {
                            trDom.find("td:first").text(input.val());
                            parms.properties.parameterName = input.val();
                            trDom.data("id", input.val());
                            trDom.find("td:eq(1)").text(input2.val());
                            parms.properties.type = input2.val();
                            trDom.find("td:eq(2)").text(input3.val());
                            parms.properties.defaultValue = input3.val();
                            trDom.find("td:eq(3)").text(input4.val());
                            parms.properties.description = input4.val();
                            template.updateParameterById(parms);
                            trDom.find("button").remove();
                            var editDom = $('<img id="' + trDom.data("id") + '" class="template-deploy-edit btn-link" src="../theme/default/images/design-modify.png">');
                            var delDom = $('<img id="' + trDom.data("id") + '" class="template-deploy-delete btn-link" src="../theme/default/images/design-delete.png">');
                            var opts = $('<div>').append(editDom).append(delDom);
                            trDom.find("td:last").append(opts);

                            editDom.editDeployOpt(template);
                            delDom.deleteDeployOpt(template);
                        } else {
                            var insertContent = "<span>"+i18n.common_term_sameParaName_valid+"</span>";
                            setValidorMsg(trDom, false, insertContent);
                            return;
                        }
                    } else {
                        trDom.remove();
                    }
                });
            });
        });
    };

    $.fn.deleteOutPutPraOpt = function (template) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                var output = template.getOutputById(trDom.data("id"));
                template.delOutput(output);
                trDom.remove();
            });
        });
    };

    $.fn.editOutPutPraOpt = function (template) {
        var dom = this;
        dom.unbind("click");
        dom.each(function (index, item) {
            $(item).bind("click", function () {
                var trDom = $(item).closest("tr");
                var table = $(item).closest("table");
                var outputTableTrLength = $("#template-output-table").find("tr").length;
                if (outputTableTrLength > 50) {
                    return;
                }
                var input = $("<input type='text' value=''>");
                trDom.find(".btn-link").css("display", "none");

                var output = template.getOutputById(trDom.data("id"));
                input.val(output.properties.outputName);
                input.css({
                    "width": table.find("thead tr th:first").css("width")
                });
                trDom.find("td:first").html(input);

                var input2 = $("<input type='text' value=''>");
                input2.val(output.properties.value);
                input2.css({
                    "width": table.find("thead tr th:first").css("width")
                });
                trDom.find("td:eq(1)").html(input2);

                var input3 = $("<input type='text' value=''>");
                input3.val(output.properties.description);
                input3.css({
                    "width": table.find("thead tr th:first").css("width")
                });
                trDom.find("td:eq(2)").html(input3);

                var reSave = $("<button>"+i18n.common_term_save_label+"</button>");
                var opts = $('<div>').append(reSave);
                trDom.find("td:last").append(opts);

                table.find("tbody").append(trDom);
                input.focus();

                reSave.bind("click", function () {
                    if (!checkPublicParamName(trDom, input.val())) {
                        return;
                    }
                    if (!checkOutParamDefaultValue(trDom, input2.val())) {
                        return;
                    }
                    if (!checkParamDescription(trDom, input3.val())) {
                        return;
                    }
                    if (input.val() != "" || input2.val() != "" || input3.val() != "") {
                        //如果当前新输入的值与修改的值一样，但与其他对象不一样，则添加
                        var tempTemplate = template.getParameterById(input.val());
                        if (!tempTemplate || (tempTemplate && output.properties.outputName == input.val())) {
                            trDom.find("td:first").text(input.val());
                            output.properties.outputName = input.val();
                            trDom.data("id", input.val());
                            trDom.find("td:eq(1)").text(input2.val());
                            output.properties.value = input2.val();
                            trDom.find("td:eq(2)").text(input3.val());
                            output.properties.description = input3.val();
                            template.updateOutputById(output);
                            trDom.find("button").css("display", "none");
                            var editDom = $('<img id="' + trDom.data("id") + '" class="template-output-edit btn-link" src="../theme/default/images/design-modify.png">');
                            var delDom = $('<img id="' + trDom.data("id") + '" class="template-output-delete btn-link" src="../theme/default/images/design-delete.png">');
                            var opts = $('<div>').append(editDom).append(delDom);
                            trDom.find("td:last").append(opts);

                            editDom.editOutPutPraOpt(template);
                            delDom.deleteOutPutPraOpt(template);
                        } else {
                            trDom.find("td:first").append("<div style='color: red;'>" + i18n.common_term_sameParaName_valid + "</div>");
                            return;
                        }
                    } else {
                        trDom.remove();
                    }
                });
            });
        });
    };

    function addCommand(mxcell, type, id, value) {
        if (type === "postCommands") {
            mxcell.resource.addPostCommand(id, value);
        } else if (type === "startCommands") {
            mxcell.resource.addStartCommand(id, value);
        } else if (type === "stopCommands") {
            mxcell.resource.addStopCommand(id, value);
        } else {
            return;
        }
    }

    function getCommand(mxcell, type, id) {
        if (type === "postCommands") {
            return mxcell.resource.getPostCommand(id);
        }
        if (type === "startCommands") {
            return mxcell.resource.getStartCommand(id);
        }
        if (type === "stopCommands") {
            return mxcell.resource.getStopCommand(id);
        }
        return "";
    }

    function deleteCommand(mxcell, type, id) {
        if (type === "postCommands") {
            mxcell.resource.delPostCommand(id);
        } else if (type === "startCommands") {
            mxcell.resource.delStartCommand(id);
        } else if (type === "stopCommands") {
            mxcell.resource.delStopCommand(id);
        } else {
            return;
        }
    }

    function updateCommand(mxcell, type, id, value) {
        if (type === "postCommands") {
            mxcell.resource.updatePostCommand(id, value);
        } else if (type === "startCommands") {
            mxcell.resource.updateStartCommand(id, value);
        } else if (type === "stopCommands") {
            mxcell.resource.updateStopCommand(id, value);
        } else {
            return;
        }
    }

    function setValidorMsg (trDom, validResult, validMsg) {
        if (!validResult) {
            if (trDom.next().length == 0) {
                trDom.after("<div style='color: red;max-width:240px;'>" + validMsg +"</div>");
            }

            if (trDom.next().find("span").length != 0) {
                trDom.next().find("span").html(validMsg);
            }

            return;
        }

        if (trDom.next().length != 0 && trDom.next().find("span").length != 0) {
            trDom.next().remove();
        }
    }

    /**
     * 检查输出参数的值,是否符合要求
     * @param value 要校验的字符串
     * @param outPutList [["aaa", "bb"], ...] -- 表示有引用参数的情况
     * @return false -- 表示校验不通过<BR>
     * true -- 校验通过
     *
     */
    function splitOutputValueMarker(value, outPutList) {
        if (value == null || value == "") {
            return true;
        }
        // 去空格
        var index = 0;
        var tempIndex = 0;
        var nextIndex = 0;
        var markerCount = 0;
        while (markerCount < 2) {
            // 下一个井号的索引
            nextIndex = value.indexOf('#', tempIndex);
            // 后面没有#号
            if (nextIndex < 0) {
            // 没有再找到#号，退出循环
                break;
            }
            // 下一个分段
            tempIndex = nextIndex + 1;
            // 如果#好前面是 \ 杠，则此#表示转义，需要查找下一个
            var ch = value.charAt(nextIndex - 1);
            if (ch == '\\') {
                continue;
            }
            // 找到点号，计数加一
            markerCount++;
            if (markerCount == 1) {
                // 第一个#号后面不可以有空格
                if (value.charAt(nextIndex + 1) == " ") {
                    return false;
                }
                // 设置第一个#号所在的位置
                index = nextIndex;
            } else if (markerCount == 2) {
                // 第二个#号前面不可以有空格
                if (ch == " ") {
                    return false;
                }
            }
        }
        // 对于#号前面在内容，也要保存到outputlist中
        if (index > 0) {
            if (outPutList != null) {
                outPutList.push([value.substring(0, index)]);
            }
        }
        // 没有#号的情况
        if (markerCount == 0) {
            if (outPutList != null) {
                outPutList.push([value]);
            }
            return true;
        }
        // 只有一个#的情况，返回false
        if (markerCount == 1) {
            return false;
        }
        // 有两个#好的情况，获取两个#号中间的内容
        var subValue = $.trim(value.substring(index + 1, nextIndex));
        // 判断是否符合 xxx.xxx的格式
        tempIndex = 0;
        var dotNextIndex = 0;
        var dotIndex = 0;
        var dotCount = 0;
        while (dotCount <= 1) {
            // 下一个井号的索引
            dotNextIndex = subValue.indexOf('.', tempIndex);
            // 检查tempIndex后是否有.号
            if (dotNextIndex <= 0) {
                // 如果点号的位置不正确
                if ((0 == dotIndex) || (dotIndex == subValue.length - 1)) {
                    return false;
                }
                // 判断是否需要输出list
                if (outPutList != null) {
                    outPutList.push([subValue.substring(0, dotIndex), subValue.substring(dotIndex + 1)]);
                }
                // 没有再找到点号，且符合要求，退出循环
                break;
            }
            // 下一个分段
            tempIndex = dotNextIndex + 1;
            // 如果#好前面是 \ 杠，则此#表示转义，需要查找下一个
            var ch = subValue.charAt(dotNextIndex - 1);
            if (ch == '\\') {
                continue;
            } else if (ch == " " || subValue.charAt(dotNextIndex + 1) == " ") {
            // 点号前后还可以有空格
                return false;
            }
            // 找到点号，计数加一
            dotCount++;
            dotIndex = dotNextIndex;
        }
        // 如果不只一个dot，返回false
        if (dotCount != 1) {
            return false;
        }
        // 递归
        return splitOutputValueMarker(value.substring(nextIndex + 1), outPutList);
    }

    function checkParamDescription (trDom, value) {
        // 校验参数名称
        var desc =  $.trim(value);
        var validResult = (desc.length <= 1024);

        var insertContent = "<span>"+i18n.common_term_desc_label+":"+i18n.sprintf(i18n.common_term_maxLength_valid, 1024)+"</span>";

        setValidorMsg(trDom, validResult, insertContent);

        return validResult;
    }

    function checkPublicParamName (trDom, value) {
        // 校验参数名称
        var pName =  $.trim(value);
        var validResult = (/^[A-Za-z_]{1}[\w\d_]{0,255}$/.test(pName) && pName.length >= 1 && pName.length <= 64);

        var insertContent = "<span>"+i18n.common_term_name_label+":"+i18n.common_term_composition1_valid+ (i18n.common_term_startWithEnOrUnderline_valid || "只能以英文或下划线开头。") + i18n.sprintf(i18n.common_term_length_valid, 1, 64)+"</span>";

        setValidorMsg(trDom, validResult, insertContent);

        return validResult;
    }

    function checkOutParamDefaultValue(trDom, value) {
        var validResult = value != null && $.trim(value) != "" && splitOutputValueMarker($.trim(value), null);

        var insertContent = "<span>"+(i18n.template_term_outputValueFormatError_label || "输出值格式不正确。")+"</span>";

        setValidorMsg(trDom, validResult, insertContent);

        return validResult;
    }

    function checkPublicParamDefaultValue(trDom, type, value) {
        var validResult = checkDeploy(type, value);

        var insertContent = "<span>"+(i18n.template_app_add_para_publicPara_valid || "默认值格式不正确。")+"</span>";

        setValidorMsg(trDom, validResult, insertContent);

        return validResult;
    }

    //对公共参数的类型的值进行校验
    function checkDeploy(str, input) {
        var regexIp = /^(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])){3}$/;
        var regexString = /^.{0,256}$/;
        var regexInteger = /^\d$|^[1-9]\d$|^[1-9]\d{2}$|^[1-9]\d{3}$|^[1-9]\d{4}$|^[1-9]\d{5}$|^[1-9]\d{6}$|^[1-9]\d{7}$|^[1-9]\d{8}$|^1\d{9}$|^20\d{8}$|^21[0-3]\d{7}$|^214[0-6]\d{6}$|^2147[0-3]\d{5}$|^21474[0-7]\d{4}$|^214748[0-2]\d{3}$|^2147483[0-5]\d{2}$|^21474836[0-3]\d$|^214748364[0-7]$|^-[1-9]$|^-[1-9]\d$|^-[1-9]\d{2}$|^-[1-9]\d{3}$|^-[1-9]\d{4}$|^-[1-9]\d{5}$|^-[1-9]\d{6}$|^-[1-9]\d{7}$|^-[1-9]\d{8}$|^-1\d{9}$|^-20\d{8}$|^-21[0-3]\d{7}$|^-214[0-6]\d{6}$|^-2147[0-3]\d{5}$|^-21474[0-7]\d{4}$|^-214748[0-2]\d{3}$|^-2147483[0-5]\d{2}$|^-21474836[0-3]\d$|^-214748364[0-8]$/;
        var regexDouble = /^-?([1-9]\d{0,307}|1[0-6]\d{306}|17[0-8]\d{305})(\.\d{1,308})?$|^-?0\.\d{1,308}$/;
        var regexHostName = /^[a-zA-Z\-]{0,15}$|^[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,14}$|^[a-zA-Z0-9\-]{0,14}[a-zA-Z\-]{1}$|^[a-zA-Z0-9\-]{0,1}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,13}$|^[a-zA-Z0-9\-]{0,2}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,12}$|^[a-zA-Z0-9\-]{0,3}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,11}$|^[a-zA-Z0-9\-]{0,4}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,10}$|^[a-zA-Z0-9\-]{0,5}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,9}$|^[a-zA-Z0-9\-]{0,6}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,8}$|^[a-zA-Z0-9\-]{0,7}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,7}$|^[a-zA-Z0-9\-]{0,8}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,6}$|^[a-zA-Z0-9\-]{0,9}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,5}$|^[a-zA-Z0-9\-]{0,10}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,4}$|^[a-zA-Z0-9\-]{0,11}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,3}$|^[a-zA-Z0-9\-]{0,12}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,2}$|^[a-zA-Z0-9\-]{0,13}[a-zA-Z\-]{1}[a-zA-Z0-9\-]{0,1}$/;

        if ($.trim(input) == "") {
            return true;
        }
        if (str == "IP") {
            if (regexIp.test(input)) {
                return true;
            }
        } else if (str == "String") {
            if (regexString.test(input)) {
                return true;
            }
        } else if (str == "Integer") {
            if (regexInteger.test(input)) {
                return true;
            }
        } else if (str == "Double") {
            if (regexDouble.test(input)) {
                return true;
            }
        } else if (str == "HostName") {
            if (regexHostName.test(input)) {
                return true;
            }
        } else {
            return false;
        }
    }

    //校验不通过弹出提示消息
    function alertCheckMessage(str) {
        var msg = "";
        switch (str) {
        case "IP":
            msg = i18n.common_term_errorIP_valid;
            break;
        case "String":
            msg = i18n.common_term_noSpecialCharacter_valid;
            break;
        case "Integer":
            msg = i18n.sprintf(i18n.common_term_rangeInteger_valid, -2147483648, 2147483647);
            break;
        case "Double":
            msg = i18n.sprintf(i18n.common_term_range_valid, -1.78E308, 1.78E308);
            break;
        case "HostName":
            msg = i18n.common_term_compositionNoAllDigi_valid + i18n.sprintf(i18n.common_term_maxLength_valid, 15);
            break;
        default:
            msg = "";
            break;
        }
        return msg;
    }

    //对输出参数的值进行校验
    function outputCheck(str) {
        if (str != "") {
            var strS = str.substring(0, 1);
            var strE = str.substring(str.length - 1, str.length);
            var strC = str.substring(0, str.length);
            var regexp = /^[\\u4e00-\\u9fa5a-zA-Z_0-9]{1,64}$/; //支持 数字、字母、下划线、中文
            //只輸入#
            if (strS === "#" && strE === "#" && str.length > 1 && regexp.test(strC)) { //开始与结束输入#，中间字段不包含特殊字符
                return true;
            } else if (str.length > 0 && regexp.test(str)) { //开头不是输入#
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
});
