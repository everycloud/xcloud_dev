/**
 * FM业务指令集
 */
define(["tiny-lib/angular",
        "tiny-directives/Directive",
        "language/keyID",
        "tiny-common/UnifyValid",
        "tiny-widgets/Button",
        "tiny-widgets/Textbox",
        "tiny-widgets/IP",
        "tiny-widgets/Searchbox",
        "tiny-widgets/Select",
        "tiny-widgets/FilterSelect",
        "tiny-widgets/Radio",
        "tiny-widgets/RadioGroup",
        "tiny-widgets/CheckboxGroup",
        "tiny-widgets/CirqueChart",
        "tiny-widgets/Tabs",
        "tiny-widgets/Step",
        "tiny-widgets/Window",
        "tiny-widgets/Layout",
        "tiny-widgets/Table"],
    function (angular, wcc, i18n, UnifyValid, Button, Textbox, IP, Searchbox, Select, FilterSelect, Radio, RadioGroup, CheckboxGroup, CirqueChart, Tabs, Step, Window, Layout, Table) {
        "use strict";

        Date.prototype.format = function(format){
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            };
            
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (this.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
            ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        }

        var mod = angular.module("directiveFM", []);
        mod.service('wcc', wcc);

        function setAttr(scope, attr, val) {
            try {
                eval(["scope." + attr, '=', 'val'].join(""));
            } catch (e) {
            }
        }

        function getAttr(scope, attr) {
            var data = null;
            try {
                data = scope.$eval(attr);
            } catch (e) {
            }

            return data;
        }

        function attr2id(attr) {
            return attr.replace(/[\.\/\\]/g, "_");
        }

        UnifyValid.addFunction("_fmExpValid", function (para) {
            var arr = para.split('$$');
            setAttr(this.scope(), arr[0], this.val());
            var check = getAttr(this.scope(), arr[1]);
            var ret = null == check ? true : check;
            if (true != ret) {
                setAttr(this.scope(), arr[0], null);
            }
            return ret;
        })

        function validString(value, exp, tips) {
            return "_fmExpValid(" + [value, exp].join('$$') + "):" + tips + ";";
        }

        var lib = {}
        lib.isNull = function (v) {
            if (null == v) {
                return true;
            }

            if ('string' == typeof v) {
                return 0 == v.length;
            }

            return false;
        }

        lib.ip2string = function (ip) {
            if ('number' != typeof ip) {
                return null;
            }

            return [
                    (ip >> 24) & 0xFF,
                    (ip >> 16) & 0xFF,
                    (ip >> 8) & 0xFF,
                    (ip) & 0xFF
            ].join('.');
        }

        lib.string2ip = function (str) {
            if ('string' != typeof str) {
                return null;
            }

            var arr = str.split('.');
            if (arr.length != 4) {
                return null;
            }

            return (parseInt(arr[0]) * 0x1000000) + (parseInt(arr[1]) * 0x10000)
                + (parseInt(arr[2]) * 0x100) + parseInt(arr[3]);
        }

        lib.formatIPv6 = function (str) {
            if (typeof str != 'string'){
                return;
            }
            
            if (str.indexOf(":") < 0) {
                return;
            }

            var arr = str.split(":");

            if (8 == arr.length) {
                var i = 0;
                for (; i < arr.length; i++) {
                    if ("" == arr[i]) {
                        arr[i] = '0';
                    }
                }
            } else if (arr.length < 8) {
                var diff = 8 - arr.length;
                var i = 0, pad = "::";
                for (; i < diff; i++) {
                    pad += ":";
                }
                return lib.formatIPv6(str.replace("::", pad));
            }

            arr.length = 8;
            return arr.join(":");
        }

        lib.getIPv6 = function (str, len) {
            if (typeof str != 'string'){
                return 0;
            }
            
            var arr = str.split(":");
            if (arr.length != 8) {
                return 0;
            }

            var l = Math.floor(len / 16);
            var i = 0, ans = 0;
            for (; i < l; i++) {
                ans = ans * 0x1000;
                var hex = parseInt(arr[i], 16);
                ans = ans + (isNaN(hex) ? 0 : hex);
            }
            return ans;
        }

        lib.checkIP = function (ip) {
            if ((null == ip) || ("" == ip)) {
                return true;
            }

            if ('number' == typeof ip) {
                ip = lib.ip2String(ip);
            }

            if ('127' == ip.substr(0, 3)) {
                return i18n.vpc_term_IPcantbe127_valid||"IP地址不能为127网段";
            }

            var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var reg = ip.match(exp);
            return reg ? true : i18n.common_term_formatIP_valid||"IP地址格式不正确";
        }

        lib.checkIPv6 = function (ip) {
            if ((null == ip) || ("" == ip)) {
                return true;
            }

            var str = ip + ":";
            var exp = /^([a-f0-9]*:){8}$/i;
            var reg = str.match(exp);
            return reg ? true : i18n.common_term_formatIPv6_valid||"IPV6地址格式不正确";
        }

        lib.checkMask = function (mask) {
            if ('number' == typeof mask) {
                mask = lib.ip2String(mask);
            }

            var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
            var reg = mask.match(exp);
            return reg ? true : i18n.common_term_formatSubnetMask_valid||"掩码格式不正确";
        }

        lib.maskBit = function (mask) {
            if ('string' == typeof mask) {
                mask = lib.string2ip(mask);
            }

            mask = (~mask) & 0xFFFFFFFF;

            var i = 0, a = 1;
            for (; i < 32; i++, a = a * 2) {
                if (mask < a) {
                    break;
                }
            }
            return 32 - i;
        }

        lib.checkXSS = function (s) {
            var ans = s.match(/(script)|[<>]/img);
            return ans ? (i18n.common_term_noCharacter_valid ? 
                i18n.sprintf(i18n.common_term_noCharacter_valid, ans.join()):
                "不能包含字符" + ans.join()): true;
        }
        
        lib.checkURL = function (s) {
            if ((null == s) || ("" == s)) {
                return true;
            }
            
            var ans = s.match(/(^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[-a-zA-Z0-9]{1,63})*(\.[-a-zA-Z0-9]{0,62}[a-zA-Z0-9])$)|(^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$)|(^[a-zA-Z0-9]$)/img);
            return ans ? true : (i18n.common_term_domainNameFormatError_valid||"域名格式不正确");
        }

        lib.checkZH = function (s) {
            var i = 1, str = "\\u4e00-\\u9fa5";
            for (; i < arguments.length; i++) {
                str += arguments[i];
            }

            var re = new RegExp("^[" + str + "]+$", "img")
            var ans = s.match(re);
            return ans ? true : (i18n.common_term_noCharacter_valid ? 
                i18n.sprintf(i18n.common_term_noCharacter_valid, s.replace(new RegExp("[" + str + "]+", "img"), "")):
                "不能包含字符" + s.replace(new RegExp("[" + str + "]+", "img")));
        }

        UnifyValid.addFunction("_fmIPCheck", function (para) {
            setAttr(this.scope(), para, this.val());
            var ret = lib.checkIP(this.val());
            if (true != ret) {
                setAttr(this.scope(), para, null);
            }
            return ret;
        })

        UnifyValid.addFunction("_fmIPv6Check", function (para) {
            setAttr(this.scope(), para, this.val());
            var ret = lib.checkIPv6(this.val());
            if (true != ret) {
                setAttr(this.scope(), para, null);
            }
            return ret;
        })

        mod.service('fmLib', function () {
            return lib;
        });

        mod.directive("fmTable", function ($compile) {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var _operate = "_operate";
                    var operateNode = "<div class='_operate' />";
                    var _radio = "_radio";
                    var radioNode = "<div class='_radio' />";
                    var _detail = "_detail";
                    var detailNode = "<div class='_detail default_show_style' />";

                    var bUseOperate = getAttr(scope, iAttrs.operate) ? true : false;
                    var bUseRadio = getAttr(scope, iAttrs.row) ? true : false;
                    var bUseDetail = getAttr(scope, iAttrs.detail) ? true : false;
                    var bUseTemplate = getAttr(scope, iAttrs.template) ? true : false;
                    
                    var bUseAllData = getAttr(scope, iAttrs.change) ? false : true;

                    var newCol = [];

                    function renderRow(row, line, index) {
                        // 创建行对象
                        var s = scope.$new();
                        s.row = line;
                        s.index = index;
                        s.row._showDetail = false;

                        // 表格对象
                        var $table = $("table.tinyTable:lt(" + this.tableIndex + "):last", this.getDom());
                        var dataTableObj = $table.dataTable();
                        var data = getAttr(scope, iAttrs.data);
                        var col = newCol;
                        
                        //Tips
                        $('td', row).each(function (i) {
                            if (i >= col.length){
                                return;
                            }
                            $(this).addClass(col[i].mData);
                            $(this).addTitle();
                        });

                        // 模板
                        if (bUseTemplate) {
                            $("<div></div>").load(getAttr(scope, iAttrs.template), function () {
                                var node = $compile(this)(s);
                                s.$digest();
                                var header = true;
                                for (var k in line) {
                                    var temp = node.find("dd." + k);
                                    if (temp.length > 0) {
                                        $("." + k, row).empty();
                                        $("." + k, row).append(temp.contents());
                                    }

                                    if (header){
                                        var head = node.find("dt." + k);
                                        if (head.length > 0) {
                                            $("th label span." + k, $table).empty();
                                            $("th label span." + k, $table).append(head.contents());
                                        }
                                        header = false;
                                    }
                                }
                                
                                // 更新Tips
                                $('td', row).each(function (i) {
                                    $(this).addTitle();
                                });
                            });
                        }

                        // 详情
                        if (bUseDetail) {
                            var func = getAttr(scope, iAttrs.detailClick);

                            var d = $("<div ng-show='row._showDetail'></div>")
                                .load(getAttr(scope, iAttrs.detail), function () {
                                    var node = $compile(this)(s);
                                    s.$digest();
                                });

                            $("div." + _detail, row).click(function () {
                                $(this).toggleClass('default_hide_style');
                                $(this).toggleClass('default_show_style');
                                s.row._showDetail = !s.row._showDetail;
                                s.$digest();
                                if (typeof func == 'function') {
                                    func(s, s.row._showDetail);
                                }
                            });

                            dataTableObj.fnOpen(row, d, "info_row");
                        }

                        // 操作
                        if (bUseOperate) {
                            var para = getAttr(scope, iAttrs.operate);
                            var spc = "<span>&nbsp&nbsp</span>";
                            var i = 0, arr = [];
                            for (i = 0; i < para.length; i++) {
                                arr.push("<a ng-click='" + para[i].func + "(row, index)'>" + para[i].name + "</a>");
                            }
                            var template = angular.element(arr.join(spc));
                            var node = $compile(template)(s);
                            $("div." + _operate, row).html(node);
                        }

                        // 单选
                        if (bUseRadio) {
                            var options = {
                                "id": ["id" , index, attr2id(iAttrs.data)].join("_"),
                                "value": "",
                                "name": attr2id(iAttrs.data),
                                "checked": 0 == index,
                                "click": function () {
                                    var row = getAttr(scope, iAttrs.row);
                                    if (typeof row == 'function') {
                                        row(data[index], index);
                                    } else {
                                        setAttr(scope, iAttrs.row, data[index]);
                                    }
                                }
                            };

                            if (0 == index) {
                                options.click();
                            }

                            var radio = new Radio(options);
                            $("div." + _radio, row).html(radio.getDom());
                        }
                        
                        //Tips
                        var $table = $("table.tinyTable:lt(" + this.tableIndex + "):last", this.getDom());
                        $("th label", $table).each(function (i) {
                            $(this).addTitle();
                        });
                    }

                    var opt = {
                        renderRow: renderRow,
                        paginationStyle: "full_numbers", // 只有此模式有lengthMenu
                        columnsDraggable: false
                    };
                    
                    if (!bUseAllData){
                        opt.callback = callback;
                        opt.changeSelect = callback;
                        
                        scope.$watch(iAttrs.total, function (newValue, oldValue) {
                            table.option("total-records", newValue);
                        });
                    }

                    var size = getAttr(scope, iAttrs.size);
                    if (typeof size == 'number') {
                        if (size > 0){
                            opt.lengthChange = false;
                            opt.displayLength = size;
                        }else{
                            opt.enablePagination = false;
                        }
                    } else if (typeof size == 'object') {
                        opt.lengthMenu = size;
                        opt.lengthChange = true;
                        opt.displayLength = size[0];
                    } else {
                        opt.lengthMenu = [10, 20, 50];
                        opt.displayLength = 10;
                    }

                    var table = new Table(opt);
                    table.rendTo(iElement);
                    
                    //Tips
                    var $table = $("table.tinyTable:lt(" + table.tableIndex + "):last", table.getDom());
                    $("th label", $table).each(function (i) {
                        $(this).addTitle();
                    });

                    var changeEvn = false;

                    function callback(e) {
                        changeEvn = true;
                        var data = table.option("data");
                        var total = table.option("total-records");
                        table.option("display-length", parseInt(e.displayLength));
                        table.option("cur-page", {"pageIndex": parseInt(e.currentPage)});

                        var func = getAttr(scope, iAttrs.change);
                        if (typeof func == 'function') {
                            func((e.currentPage - 1) * e.displayLength, e.displayLength, e.totalRecords);
                        }
                    }
                    
                    if (iAttrs.update) {
                        setAttr(scope, iAttrs.update, function(){
                            var cur = table.option("cur-page");
                            var e = {
                                currentPage : parseInt(cur.pageIndex),
                                displayLength : parseInt(table.option("display-length")),
                                totalRecords : parseInt(table.option("total-records"))
                            };
                            callback(e);
                        });
                    }

                    scope.$watch(iAttrs.data, function (newValue, oldValue) {
                        if (changeEvn) {
                            changeEvn = false;
                        } else {
                            // 非页码改变操作，恢复首页。
                            table.option("cur-page", {"pageIndex": 1});
                        }

                        if (newValue) {
                            if (bUseAllData) {
                                table.option("total-records", newValue.length);
                            }
                            
                            var i = 0, arr = [];
                            for (i = 0; i < newValue.length; i++) {
                                var e = newValue[i];
                                var o = {};
                                for (var j in e) {
                                    if (typeof e[j] == 'string') {
                                        o[j] = e[j].replace(/[<]/mg, "&#60;");
                                    } else {
                                        o[j] = e[j];
                                    }
                                }
                                o[_operate] = operateNode;
                                o[_radio] = radioNode;
                                o[_detail] = detailNode;
                                arr.push(o);
                            }

                            table.option("data", arr);
                        }
                    });

                    scope.$watchCollection(iAttrs.columns, function (newValue, oldValue) {
                        if (newValue) {
                            var i = 0, arr = [];
                            for (i = 0; i < newValue.length; i++) {
                                var e = newValue[i];
                                var o = {
                                    sTitle: e.sTitle || "",
                                    mData: e.mData || "",
                                    sWidth: e.sWidth || "",
                                    bSortable: e.bSortable || false,
                                    bVisible: null==e.bVisible ? true : e.bVisible
                                };
                                o.sTitle = "<span class='" + o.mData + "'>" + o.sTitle + "</span>";
                                arr.push(o);
                            }

                            if (i > 0) {
                                if (bUseOperate){
                                    arr.push({sTitle: scope.i18n.common_term_operation_label||"操作", mData: _operate,
                                        "sWidth": "", bSortable: false, bVisible:bUseOperate});
                                }
                                if (bUseRadio){
                                    arr.unshift({sTitle: "", mData: _radio,
                                        "sWidth": "26px", bSortable: false, bVisible:bUseRadio});
                                }
                                if (bUseDetail){
                                    arr.unshift({sTitle: "", mData: _detail,
                                        "sWidth": "16px", bSortable: false, bVisible:bUseDetail});
                                }
                            }
                            newCol = arr;
                            table.option("columns", arr);
                            
                            // Tips
                            var $table = $("table.tinyTable:lt(" + table.tableIndex + "):last", table.getDom());
                            $("th label", $table).each(function (i) {
                                $(this).addTitle();
                            });
                        }
                    });
                }
            };

            return config;
        });

        /*
         下拉列表
         */
        mod.directive("fmSelect", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var require = getAttr(scope, iAttrs.require);
                    require = (null == require ? true : require);

                    var filter = getAttr(scope, iAttrs.filter);
                    require = filter ? false : require;

                    var opt = {
                        values: [],
                        width: getAttr(scope, iAttrs.width) || "120",
                        height: 265,
                        disable: getAttr(scope, iAttrs.disable)||false,
                        validate: require ? "required:"+(iAttrs.valid ? getAttr(scope, iAttrs.valid):(i18n.common_term_null_valid||"必选项")):""
                    };

                    function update() {
                        var option = getAttr(scope, iAttrs.option);
                        opt.values = [];
                        for (var i in option) {
                            var e = option[i];
                            opt.values.push({
                                selectId: e.id || i, label: e.name || e.id, 
                                checked: e.checked || false,
                                disable: e.disable || false
                            });
                            if (e.checked) {
                                setAttr(scope, iAttrs.id, e.id);
                                setAttr(scope, iAttrs.name, e.name);
                                opt.dftLabel = e.name;
                            }
                        }
                    }

                    update();
                    var sel = filter ? new FilterSelect(opt) : new Select(opt);
                    sel.rendTo(iElement);

                    sel.on("change", function () {
                        setAttr(scope, iAttrs.id, sel.getSelectedId());
                        setAttr(scope, iAttrs.name, sel.getSelectedLabel());
                        scope.$digest();
                    });

                    scope.$watch(iAttrs.option, function (newValue, oldValue) {
                        update();
                        sel.option("values", opt.values);
                    });
                    
                    scope.$watch(iAttrs.disable, function (newValue, oldValue) {
                        sel.option("disable", newValue);
                    });

                    scope.$watch(iAttrs.id, function (newValue, oldValue) {
                        if (null == newValue) {
                            return;
                        }
                        sel.opChecked(newValue);
                        setAttr(scope, iAttrs.id, sel.getSelectedId());
                        setAttr(scope, iAttrs.name, sel.getSelectedLabel());
                        var change = getAttr(scope, iAttrs.change);
                        if (typeof change == 'function') {
                            change(sel.getSelectedId(), sel.getSelectedLabel());
                        }
                    });
                }
            };

            return config;
        });

        /*
         文本输入框
         */
        mod.directive("fmText", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    scope.lib = lib;

                    var require = getAttr(scope, iAttrs.require);
                    require = (null == require ? true : require);

                    var len = getAttr(scope, iAttrs.length) || 32;
                    var opt = {
                        value: getAttr(scope, iAttrs.value),
                        type: getAttr(scope, iAttrs.type) || "input",
                        disable: getAttr(scope, iAttrs.disable)||false,
                        width: getAttr(scope, iAttrs.width) || "120",
                        validate: (require ? "required:"+(i18n.common_term_null_valid||"不能为空")+";":"")
                            + "maxSize(" + len + "):"     
                    };
                    
                    if ('multi' == getAttr(scope, iAttrs.type)){
                        opt.height = 40;
                    }
                    
                    if (i18n.common_term_length_valid){
                        opt.validate += i18n.sprintf(i18n.common_term_maxLength_valid,{1:len}) + ";";
                    }else{
                        opt.validate += "不能超过" + len + "个字符;"
                    }

                    if (iAttrs.valid) {
                        if ("#XSS" == iAttrs.valid) {
                            iAttrs.valid = "lib.checkXSS(" + iAttrs.value + ")";
                        }
                        opt.validate += validString(iAttrs.value, iAttrs.valid, 
                            i18n.common_term_formatText_valid||"文本格式不正确");
                        opt.tooltip = getAttr(scope, iAttrs.tip) || 
                            (i18n.common_term_maxLength_valid ? i18n.sprintf(i18n.common_term_maxLength_valid,{1:len}):"长度范围1~" + len + "字符。");
                    } else {
                        opt.validate += "regularCheck('^\\w*$'):"+(i18n.common_term_composition1_valid+";"||"由数字、字母、下划线组成;");
                        opt.tooltip = getAttr(scope, iAttrs.tip) || 
                            (i18n.common_term_composition1_valid ? i18n.common_term_composition1_valid + i18n.sprintf(i18n.common_term_maxLength_valid,{1:len}):"由数字、字母、下划线组成，长度范围1~" + len + "字符。");
                    }

                    var text = new Textbox(opt);
                    text.rendTo(iElement);

                    function getVal() {
                        setAttr(scope, iAttrs.value, text.getValue());
                        scope.$digest();
                    }

                    setTimeout(getVal, 0);
                    text.on("change", getVal);
                    
                    scope.$watch(iAttrs.disable, function (newValue, oldValue) {
                        text.option("disable", newValue);
                    });

                    scope.$watch(iAttrs.value, function (newValue, oldValue) {
                        if (null != newValue){
                            text.option("value", newValue);
                        }
                    });
                }
            };

            return config;
        });

        /*
         数值输入框
         */
        mod.directive("fmDigit", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var require = getAttr(scope, iAttrs.require);
                    require = (null == require ? true : require);

                    var text = null;

                    function create() {
                        if (text) {
                            iElement.empty();
                            text = null;
                        }

                        var opt = {
                            value: getAttr(scope, iAttrs.value),
                            type: "input",
                            disable: getAttr(scope, iAttrs.disable)||false,
                            width: getAttr(scope, iAttrs.width) || "120",
                            tooltip: i18n.common_term_rangeInteger_valid ? 
                                i18n.sprintf(i18n.common_term_rangeInteger_valid,{1:getAttr(scope, iAttrs.min),2:getAttr(scope, iAttrs.max)})
                                :["输入", getAttr(scope, iAttrs.min), "~", getAttr(scope, iAttrs.max), "范围整数"].join(""),
                            validate: (require ? "required:"+(i18n.common_term_null_valid||"不能为空")+";":"")
                                + "regularCheck('^\\d*$'):"+(i18n.common_term_integer_valid||"请输入整数")+";"
                        };
                        
                        opt.validate += "maxValue(" + getAttr(scope, iAttrs.max) + "):"+opt.tooltip+";";
                        opt.validate += "minValue(" + getAttr(scope, iAttrs.min) + "):"+opt.tooltip+";";

                        text = new Textbox(opt);
                        text.rendTo(iElement);

                        function getVal() {
                            setAttr(scope, iAttrs.value, text.getValue());
                            scope.$digest();
                        }

                        setTimeout(getVal, 0);
                        text.on("change", getVal);
                    }

                    create();

                    scope.$watch(iAttrs.value, function (newValue, oldValue) {
                        if ((null != newValue) && text) {
                            text.option("value", newValue);
                        }
                    });
                    
                    scope.$watch(iAttrs.disable, function (newValue, oldValue) {
                        if (text){
                            text.option("disable", newValue);
                        }
                    });

                    scope.$watch(iAttrs.max, function (newValue, oldValue) {
                        create();
                    });

                    scope.$watch(iAttrs.min, function (newValue, oldValue) {
                        create();
                    });
                }
            };

            return config;
        });

        // IP框
        mod.directive("fmIpv4", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    scope.lib = lib;

                    var require = getAttr(scope, iAttrs.require);
                    require = (null == require ? true : require);

                    var opt = {
                        value: getAttr(scope, iAttrs.value),
                        type: "ipv4",
                        disable: getAttr(scope, iAttrs.disable)||false,
                        width: getAttr(scope, iAttrs.width) || "120",
                        validate: (require ? "required:"+(i18n.common_term_null_valid||"不能为空")+";":"") 
                            + "_fmIPCheck(" + iAttrs.value + "):"+(i18n.common_term_formatIP_valid||"IP地址格式不正确")+";"
                    };

                    if (iAttrs.valid) {
                        opt.validate += validString(iAttrs.value, iAttrs.valid, i18n.common_term_formatIP_valid||"IP地址格式不正确");
                    }

                    var ip = new IP(opt);
                    ip.rendTo(iElement);

                    function getVal() {
                        setAttr(scope, iAttrs.value, ip.getValue());
                        scope.$digest();
                    }

                    var event = false;
                    setTimeout(getVal, 0);
                    iElement.focusout(function () {
                        event = true;
                        getVal();
                        event = false;
                    });
                    
                    scope.$watch(iAttrs.disable, function (newValue, oldValue) {
                        ip.option("disable", newValue);
                    });

                    scope.$watch(iAttrs.value, function (newValue, oldValue) {
                        if (event) {
                            event = false;
                        }else{
                            if (null != newValue){
                                ip.option("value", newValue);
                            }
                        }
                    });
                }
            };

            return config;
        });

        // IPv6
        mod.directive("fmIpv6", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    scope.lib = lib;

                    var require = getAttr(scope, iAttrs.require);
                    require = (null == require ? true : require);

                    var opt = {
                        value: getAttr(scope, iAttrs.value),
                        type: "ipv6",
                        disable: getAttr(scope, iAttrs.disable)||false,
                        width: getAttr(scope, iAttrs.width) || "120",
                        validate: (require ? "required:"+(i18n.common_term_null_valid||"不能为空")+";":"") 
                            + "_fmIPv6Check(" + iAttrs.value + "):"+(i18n.common_term_formatIPv6_valid||"IPv6地址格式不正确")+";"
                    };

                    if (iAttrs.valid) {
                        opt.validate += validString(iAttrs.value, iAttrs.valid, i18n.common_term_formatIPv6_valid||"IPv6地址格式不正确");
                    }

                    var ip = new IP(opt);
                    ip.rendTo(iElement);

                    function getVal() {
                        setAttr(scope, iAttrs.value, lib.formatIPv6(ip.getValue()));
                        scope.$digest();
                    }

                    var ipv6 = iElement.find("input.tiny_input_ip_octet_v6");

                    function resize() {
                        ipv6.each(function (i) {
                            var my = $(this);
                            my.width(8 * (my.val().length + 1));
                        });
                    }

                    ipv6.focus(function () {
                        var my = $(this);
                        my.width(40);
                    });

                    ipv6.blur(function () {
                        resize();
                    });

                    setTimeout(function () {
                        getVal();
                        resize();
                    }, 0);

                    iElement.focusout(function () {
                        getVal();
                        resize();
                    });
                    
                    scope.$watch(iAttrs.disable, function (newValue, oldValue) {
                        ip.option("disable", newValue);
                    });

                    scope.$watch(iAttrs.value, function (newValue, oldValue) {
                        if (null != newValue){
                            ip.option("value", lib.formatIPv6(newValue));
                        }
                    });
                }
            };

            return config;
        });

        // 搜索框
        mod.directive("fmSearch", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var opt = {
                        placeholder: getAttr(scope, iAttrs.tip),
                        disable: false,
                        width: getAttr(scope, iAttrs.width) || "120",
                        maxLength: 64
                    };

                    opt.search = function (key) {
                        setAttr(scope, iAttrs.value, s.getValue());
                        var func = getAttr(scope, iAttrs.change);
                        if (typeof func == 'function') {
                            func(key);
                        }
                    };

                    var s = new Searchbox(opt);
                    s.rendTo(iElement);
                    setAttr(scope, iAttrs.value, s.getValue());

                    iElement.change(function () {
                        setAttr(scope, iAttrs.value, s.getValue());
                        scope.$digest();
                    });

                    scope.$watch(iAttrs.tip, function (newValue, oldValue) {
                        s.option("placeholder", newValue);
                        setAttr(scope, iAttrs.value, s.getValue());
                    });

                    scope.$watch(iAttrs.value, function (newValue, oldValue) {
                        s.setValue(newValue);
                    });
                }
            };

            return config;
        });

        /*
         单选
         */
        mod.directive("fmRadio", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var opt = {
                        layout: getAttr(scope, iAttrs.vertical) ? "vertical" : "horizon",
                        values: []
                    };
                    
                    if (iAttrs.spacing){
                        opt.spacing = getAttr(scope, iAttrs.spacing);
                    }
                    
                    function update(){
                        opt.values = [];
                        var option = getAttr(scope, iAttrs.option);
                        for (var i in option) {
                            var e = option[i];
                            opt.values.push({
                                key: e.id, text: e.name, 
                                checked: e.checked || false, 
                                disable: e.disable || false
                            })
                        }
                    }
                    
                    update();

                    var radio = new RadioGroup(opt);
                    radio.rendTo(iElement);

                    function getVal() {
                        var id = radio.opChecked("checked");
                        var name = radio.opValue(id);
                        setAttr(scope, iAttrs.id, id);
                        setAttr(scope, iAttrs.name, name);
                        var func = getAttr(scope, iAttrs.change);
                        if (typeof func == 'function') {
                            func(id, name);
                        }
                        scope.$digest();
                    }

                    setTimeout(getVal, 0);
                    radio.on("change", getVal);
                    
                    scope.$watch(iAttrs.id, function (newValue, oldValue) {
                        if (null != newValue){
                            radio.opChecked(newValue, true);
                        }
                    });
                    
                    scope.$watchCollection(iAttrs.option, function (newValue, oldValue) {
                        update();
                        radio.option("values", opt.values);
                    });
                }
            };

            return config;
        });

        /*
         多选
         */
        mod.directive("fmCheck", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var opt = {
                        layout: getAttr(scope, iAttrs.vertical) ? "vertical" : "horizon",
                        checkAllId: "_ALL_",
                        values: []
                    };
                    
                    if (iAttrs.spacing){
                        opt.spacing = getAttr(scope, iAttrs.spacing);
                    }
                    
                    var keyMap = {};
                    function update(){
                        opt.values = [];
                        var option = getAttr(scope, iAttrs.option);
                        keyMap = {};
                        for (var i in option) {
                            var e = option[i];
                            opt.values.push({
                                key: e.id, text: e.name, 
                                checked: e.checked || false, 
                                disable: e.disable || false
                            })
                            keyMap[e.id] = e.name;
                        }
                    }
                    
                    update();

                    var check = new CheckboxGroup(opt);
                    check.rendTo(iElement);

                    var event = false;

                    function getVal() {
                        event = true;
                        var id = check.opChecked("checked");
                        var name = [];
                        for (var i in id) {
                            name[i] = id[i];
                        }
                        setAttr(scope, iAttrs.id, id);
                        setAttr(scope, iAttrs.name, name);

                        var map = getAttr(scope, iAttrs.map);
                        if (map) {
                            for (var i in keyMap) {
                                map[i] = false;
                            }
                            for (var i in id) {
                                map[id[i]] = name[i];
                            }
                        }

                        var func = getAttr(scope, iAttrs.change);
                        if (typeof func == 'function') {
                            func(id, name);
                        }
                        scope.$digest();
                        event = false;
                    }

                    setTimeout(getVal, 0);
                    check.on("change", getVal);

                    scope.$watch(iAttrs.map, function (newValue, oldValue) {
                        if (event) {
                            event = false;
                            return;
                        }

                        check.checkedAll(false);
                        for (var i in newValue) {
                            if (newValue[i]){
                                check.opChecked(""+i, true);
                            }
                        }
                    });
                    
                    scope.$watchCollection(iAttrs.option, function (newValue, oldValue) {
                        update();
                        var map = getAttr(scope, iAttrs.map);
                        if (map) {
                            var id = check.opChecked("checked");
                            var name = [];
                            for (var i in id) {
                                name[i] = id[i];
                            }
                            for (var i in keyMap) {
                                map[i] = false;
                            }
                            for (var i in id) {
                                map[id[i]] = name[i];
                            }
                        }
                        check.option("values", opt.values);
                    });
                }
            };

            return config;
        });

        /*
         校验容器
         */
        mod.directive("fmValid", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var valid = getAttr(scope, iAttrs.valid);
                    var dom = iElement.find(".fm-valid");
                    dom.mousedown(function () {
                        valid = UnifyValid.FormValid(iElement);
                        setAttr(scope, iAttrs.valid, valid);
                        scope.$digest();
                    });

                    iElement.find(".fm-valid-clear").click(function () {
                        var err = iElement.find(".valid_error_input");
                        err.each(function (i) {
                            UnifyValid.clearValidate($(this));
                        });
                    });
                }
            };

            return config;
        });

        /*
         按钮
         */
        mod.directive("fmButton", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var opt = {
                        text: getAttr(scope, iAttrs.text)
                    };

                    var btn = new Button(opt);
                    btn.rendTo(iElement);

                    scope.$watch(iAttrs.text, function (newValue, oldValue) {
                        btn.option("text", newValue);
                    });
                    
                    if (iAttrs.disable){
                        scope.$watch(iAttrs.disable, function (newValue, oldValue) {
                            btn.option("disable", newValue);
                        });
                    }

                    btn.on("click", function(){
                        var click = getAttr(scope, iAttrs.click);
                        click();
                        scope.$digest();
                    });
                }
            };

            return config;
        });

        /*
         Step
         */
        mod.directive("fmStep", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var opt = {
                        width: getAttr(scope, iAttrs.width) || "600",
                        values: getAttr(scope, iAttrs.option) || []
                    };
                    var step = new Step(opt);
                    step.rendTo(iElement);

                    scope.$watch(iAttrs.value, function (newValue, oldValue) {
                        step.jump(newValue);
                    });
                    
                    scope.$watchCollection(iAttrs.option, function (newValue, oldValue) {
                        step.option('values', newValue);
                    });
                }
            };

            return config;
        });
        
        // 圆环图
        mod.directive("fmCirque", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    function init(){
                        iElement.empty();
                        scope.elementID = (scope.elementID||0)+1;
                        var id = getAttr(scope, iAttrs.id)||[scope.$id, scope.elementID].join('-');
                        iElement.attr("id", id);
                        var opt = {
                            id : id,
                            data : getAttr(scope, iAttrs.data),
                            centerText : getAttr(scope, iAttrs.centerText),
                            percent : getAttr(scope, iAttrs.percent)||false,
                            r : getAttr(scope, iAttrs.r)||50,
                            strokeWidth : getAttr(scope, iAttrs.strokeWidth)||20,
                            rotate : getAttr(scope, iAttrs.rotate)||0,
                            width : getAttr(scope, iAttrs.width)||240,
                            height : getAttr(scope, iAttrs.height)||180,
                            showShadow : getAttr(scope, iAttrs.showShadow)||false,
                            showLegend : getAttr(scope, iAttrs.showLegend)||false,
                            template : "" // Tiny BUG 显示调试信息
                        };

                        if (opt.data){
                            for (var i in opt.data){
                                var e = opt.data[i];
                                e.value = e.value||0;
                                e.name = e.name||"";
                            }
                            try{
                            var chart = new CirqueChart(opt);
                            chart.rendTo(iElement);
                            }catch(e){};
                        }
                    }
                    
                    init();
                    scope.$watch(iAttrs.centerText, function (newValue, oldValue) {
                        init();
                    });
                    scope.$watchCollection(iAttrs.data, function (newValue, oldValue) {
                        init();
                    });
                }
            };

            return config;
        });

        /*
         Tab页
         */
        mod.directive("fmTabs", function () {
            var config = {
                restrict: 'E',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    var opt = {
                        id: iElement.find(".tiny-tabs-container").attr("id"),
                        setActiveClass: false // 问题：true初始化不显示
                    };

                    iElement.find("div.tiny-tabs-titles ul li a").each(function (i) {
                        var my = $(this);
                        var attr = my.attr("active");
                        if (attr) {
                            attr = getAttr(scope, attr);
                            my.attr("active", attr);
                        }
                    });

                    var tab = new Tabs(opt);
                    iElement.find(".tiny-tabs-titles").click(function (e) {
                    });
                }
            };

            return config;
        });
        
        /*
         布局Layout
         */
        mod.directive("fmLayout", function ($state) {
            var config = {
                restrict: 'AE',
                template: '',
                link: function (scope, iElement, iAttrs) {
                    iElement.find(".tiny-layout-west").hide();
                    setTimeout(function (){
                        var lay = new Layout({
                            "id": iAttrs.id,
                            "subheight": 100
                        });
                        
                        setAttr(scope, iAttrs.layout, lay);
                        
                        function activeCurrent() {
                            try{
                            lay.opActive($(".tiny-layout-west a[ui-sref='" + $state.current.name + "']").last());
                            }catch(e){};
                        }
                        
                        activeCurrent();
                        
                        scope.$on("$stateChangeSuccess", function () {
                            lay && activeCurrent();
                        });
                        
                        iElement.find(".tiny-layout-west").show();
                    }, 1);
                }
            };

            return config;
        });
        
        // Tips
        mod.directive("fmTipsWidth", function () {
            var config = {
                restrict: 'A',
                template: '',
                link: function (scope, iElement, iAttrs) {              
                    var css = $("<style></style>");
                    var str = ".tiny-tips{width:" + (getAttr(scope, iAttrs.fmTipsWidth)||240) + "px;}";
                    str += ".tiny-tips span{word-wrap:break-word;white-space:normal;}";
                    str += ".tiny-tips div{word-wrap:break-word;white-space:normal;}";
                    css.text(str);
                    iElement.append(css);
                }
            };

            return config;
        });


        /*
         对话框
         */
        mod.directive("fmDialog", function (wcc) {
            var config = {
                restrict: 'E',
                link: function (scope, iElement, iAttrs) {
                    var id = 'fmWnd_' + attr2id(iAttrs.show);
                    var options = {
                        "content-type": "simple",
                        "content": "<div id='" + id + "'></div>",

                        "title": getAttr(scope, iAttrs.title),
                        "height": getAttr(scope, iAttrs.height) || "480",
                        "width": getAttr(scope, iAttrs.width) || "600",
                        "resizable": false,
                        "maximizable": false,
                        buttons: null
                    };

                    var win = null;

                    scope.$watch(iAttrs.title, function (newValue, oldValue) {
                        if (win) {
                            win.option("title", newValue);
                        } else {
                            options.title = newValue;
                        }
                    });

                    scope.$watch(iAttrs.show, function (newValue, oldValue) {
                        if (newValue) {
                            if (win) {
                                return;
                            }

                            win = new Window(options);
                            win.on("close", function () {
                                if (getAttr(scope, iAttrs.show)) {
                                    setAttr(scope, iAttrs.show, false);
                                    scope.$digest();
                                }
                            });
                            $("#" + id).append(iElement.contents());
                            win.show();
                        }
                        else {
                            if (win) {
                                iElement.append($("#" + id).contents());
                                win.destroy();
                                win = null;
                            }
                        }
                    });
                }
            };

            return config;
        });

        // help
        mod.directive("fmHelp", function (help) {
            var config = {
                restrict: 'EA',
                transclude: true,
                template: "<button type='button' class='close row'>×</button>"
                    + "<div class='help-content'></div>",
                link: function (scope, iElement, iAttrs) {
                    require(["app/business/help/configure"], function(configure){
                    
                    help.hide(iElement);
                    setAttr(scope, iAttrs.show, false);

                    iElement.find("button").click(function () {
                        setAttr(scope, iAttrs.show, false);
                        scope.$digest();
                    });

                    scope.$watch(iAttrs.show, function (newValue, oldValue) {
                        if (newValue) {
                            var locale = getAttr(scope, iAttrs.i18n);
                            if (scope.i18n){
                                locale = scope.i18n.locale || locale;
                            }
                            var url = configure.getHelp(getAttr(scope, iAttrs.help),
                                    ("IT" == scope.user.cloudType)
                                    ||("FUSIONSPHERE" == scope.user.cloudType) ? "IT" : "ICT",
                                    locale);
                            help.show(iElement, url);
                        } else {
                            help.hide(iElement);
                        }
                    })
                    
                    });
                }
            };

            return config;
        });
        return mod;
    });
