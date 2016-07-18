define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/jquery.dataTables", "tiny-widgets/Pagination", "tiny-lib/Class", "tiny-lib/underscore", "tiny-widgets/Widget","tiny-lib/ColReorderWithResize","tiny-lib/ColVis","tiny-common/util","language/widgetsLanguage"], function(angular, jquery, datatable, 
          Pagination, Class, _, Widget, ColReorderWithResize, ColVis, util, language)
{

    $.fn.extend({
        /**
         * 给元素添加title属性，值是它包含的文本内容
         */
        "addTitle":function(){
            var $this = $(this);
            $this.attr("title",$this.text());
            return $this;
        }    
    });
    
    var detail_show_action_div = "<div class='btn_detail_switch default_show_style'></div>";
    var detail_close_action_div = "<div class='btn_detail_switch default_hide_style'></div>";
    
    var SWITCH_DETAIL_CLASS = "btn_detail_switch";
    
     var DETAIL_ROW_CLASS = "info_row";
        

    var DEFAULT_CONFIG = {
        "template" : '<div class="tinyTablediv" id="<%=id%>" ><div class="tinyTable_tablecaption"></div><table class="tinyTable"> <thead></thead> <tbody> </tbody> </table></div>',
        "display" : true,
        "caption" : "",
        "columns" : [],
        "data" : [],
        "enable-pagination" : true,
        "pagination-style" : "simple",
        "length-change" : true,
        "length-menu" : [10, 25, 50, 100],
        "display-length" : 10,
        "enable-filter" : false,
        "hide-total-records" : false,
        "total-items":0,
        "cur-page" : {"pageIndex":1},
        "renderRow":function(nRow, aData, iDataIndex){},
        "callback":function(evtObj) {
        },
        "changeSelect":null,
        "request-config" : {
            "enableRefresh" : false,
            "refreshInterval" : 30000,
            "sAjaxDataProp":""
        },
        "columns-visibility":false,
        "columns-draggable":false,
        "show-details":false,
        "column-sorting":[],
        "getDataList":""
    };

    var DEFAULT_DATATABLE_CONFIG = {
        "aaSorting": [],
        "aaData" : [],
        "aoColumns" : [],
        "bPaginate" : false,
        "sPaginationType" : "simple", /*simple fullnumbers*/
        "bLengthChange" : false,
        "aLengthMenu" : [10, 25, 50, 100],
        "iDisplayLength" : 10,
        "bFilter" : false,
        "bAutoWidth": false, 
        //以下属性不对外开放
        "sDom":"lfrtip",
        "bSort" : true,
        "refreshStopped" : false,
        "bInfo" : false,
        "lastResponseData" : {},
        "oLanguage": {
        "sEmptyTable": language.emptyTable
         }
    };
    $.fn.dataTableExt.oPagination.simple = {
        "fnInit" : function(oSettings, nPaging, fnCallbackDraw) {
            var options = {
                "type" : oSettings.sPaginationType,
                "prev-text" : "上一页",
                "next-text" : "下一页",
                "hide-display-length" : !oSettings.oInit.bPageSizeChange,
                "hide-total-records" : oSettings.oInit.bHideTotalRecords,
                "cur-page" : oSettings.oInit.curPage,
                // 若用户设置了total-records,则以用户的设置为准（后台分页场景）;否则按实际数据条数计算（前台分页场景）
                "total-records": _.isUndefined(oSettings.oInit.totalRecords) ? oSettings.aiDisplayMaster.length : oSettings.oInit.totalRecords,
                "display" : oSettings.bPaginate,
                "display-length" : oSettings._iDisplayLength,
                "callback" : function(obj) {
                    oSettings.oApi._fnPageChange(oSettings, obj.currentPage - 1);
                    fnCallbackDraw(oSettings);
                    if(arguments[1] != "" && oSettings.oInit.callback){
                    oSettings.oInit.callback(obj);    
                    oSettings.oApi._fnDraw(oSettings);
                    }
                    
                    var widgetObj =  $(oSettings.nTableWrapper.parentNode).widget();
                    if (widgetObj){
                        widgetObj.dataTableConfig.curPage = {pageIndex: obj.currentPage};
                    }
                },
                "length-options" : oSettings.aLengthMenu
            };
            var pag = new Pagination(options);
            oSettings.pag = pag;
            $(nPaging).append(pag.getDom());
        },
        "fnUpdate" : function(oSettings, fnCallbackDraw) {
        }
    };

        $.fn.dataTableExt.oPagination.fullnumbers = {
        "fnInit" : function(oSettings, nPaging, fnCallbackDraw) {
            var options = {
                "type" : "full_numbers",
                "prev-text" : "上一页",
                "next-text" : "下一页",
                "hide-display-length" : !oSettings.oInit.bPageSizeChange,
                "hide-total-records" : oSettings.oInit.bHideTotalRecords,
                // 若用户设置了total-records,则以用户的设置为准（后台分页场景）;否则按实际数据条数计算（前台分页场景）
                "total-records": _.isUndefined(oSettings.oInit.totalRecords) ? oSettings.aiDisplayMaster.length : oSettings.oInit.totalRecords,
                "cur-page" : oSettings.oInit.curPage,
                "display" : oSettings.bPaginate,
                "display-length" : oSettings._iDisplayLength,
                "callback" : function(obj) {
                    oSettings.oApi._fnPageChange(oSettings, obj.currentPage - 1);
                    fnCallbackDraw(oSettings);
                   
                    if(arguments[1] != "" && oSettings.oInit.callback){
                        oSettings.oInit.callback(obj);	
                        oSettings.oApi._fnDraw(oSettings);
                    }
                    
                    var widgetObj =  $(oSettings.nTableWrapper.parentNode).widget();
                    if (widgetObj){
                        widgetObj.dataTableConfig.curPage = {pageIndex: obj.currentPage};
                    }
                },
                "change-select" : function(obj) {
                    /* Redraw the table */
                    oSettings._iDisplayLength = obj.displayLength;
                    oSettings.oApi._fnCalculateEnd(oSettings);
                    /* If we have space to show extra rows (backing up from the
                     * end point - then do so */
                    if (oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay()) {
                        oSettings._iDisplayStart = oSettings.fnDisplayEnd() - oSettings._iDisplayLength;
                        if (oSettings._iDisplayStart < 0) {
                            oSettings._iDisplayStart = 0;
                        }
                    }
                    if (oSettings._iDisplayLength == -1) {
                        oSettings._iDisplayStart = 0;
                    }
                    oSettings.oApi._fnDraw(oSettings);
                   if(oSettings.oInit.changeSelect){
                        oSettings.oInit.changeSelect(obj);
                   }
                   
                },
                "length-options" : oSettings.aLengthMenu
            };
            
            var pag = new Pagination(options);
            oSettings.pag = pag;
            $(nPaging).append(pag.getDom());
        },
        
        "fnUpdate" : function(oSettings, fnCallbackDraw) {
            
        }
    };

    var Table = Widget.extend({

        "init" : function(options) {

            var widgetThis = this;
              
            widgetThis.id = _.uniqueId('tinyTableId_');

            widgetThis._super(_.extend({}, DEFAULT_CONFIG, options));

            widgetThis._initDataTableConfig(widgetThis.options);
            
            if (widgetThis.options.id) {
                var el = $("#" + widgetThis.options.id);
                if (el[0]) {
                    el.append( widgetThis._element);
                }
                el = null;
            }
            widgetThis._setTableCaption(widgetThis.options.caption);
            widgetThis._updateTable();
            widgetThis._toggleCss();
            widgetThis._doOpButtonsDomInit();
        },

        //获取表格实例
        "_getTableoInit": function () {
            var widgetThis = this;
            var $dataTable = $("table.tinyTable:lt(" + widgetThis.tableIndex + "):last", widgetThis.getDom());
            $dataTable = $dataTable.dataTable();
            return $dataTable;
        },

        "_getoSettings": function () {
            var widgetThis = this;
            var oInit = widgetThis._getTableoInit();
            return oInit.fnSettings();
        },

        "_fnDrawCallback": function (oSetting) {
            //每次重绘初始化多选项
            var $table = $(oSetting.nTable);
            $table.find(".dataTables_checkboxs").removeClass("table_checkbox_select");
            $table.find("tr.odd,tr.even").removeClass("clickTrColor");
            $table.find(".dataTables_checkbox_title").attr("class", "dataTables_checkbox_title");

        },

        "_doCheckboxInit": function (config) {
            var oCheckboxColums = {
                "sTitle": "<div class='dataTables_checkbox_title' ></div>",
                "mData": function () {
                    return '<div class="dataTables_checkboxs"></div>'
                },
                "bSortable": false,
                "sWidth": "30px",
                "sClass": "center"
            };
                config.aoColumns.unshift(oCheckboxColums)
        },

        "_setSelectRow": function ($tr) {
            var widgetThis = this;
            var bRowSelected = $tr.hasClass("clickTrColor");
            if (widgetThis.options.checkbox) {
                $tr.find(".dataTables_checkboxs").addClass('table_checkbox_select');
            }
            if (!bRowSelected) {
                $tr.addClass("clickTrColor");
            }
        },

        "_cancelSelectRow": function ($tr) {
            var widgetThis = this;
            var bRowSelected = $tr.hasClass("clickTrColor");
            $tr.find(".dataTables_checkboxs").removeClass('table_checkbox_select');
            if (bRowSelected) {
                $tr.removeClass("clickTrColor");
            }
        },

        "_doCheckboxsHandle": function ($td, $tr, $trSiblings) {
            var widgetThis = this;
            var bselect = $td.find(".dataTables_checkboxs").hasClass("table_checkbox_select");
            if ($td.find(".dataTables_checkboxs").length > 0) {
                if (bselect) {
                    widgetThis._cancelSelectRow($tr);
                } else {
                    widgetThis._setSelectRow($tr);
                }
            } else {
                widgetThis._doCheckbosxOther($tr, $trSiblings);
            }
            //处理全选状态
            widgetThis._doAllCheckState();
        },

        "_doAllCheckState": function () {
            var widgetThis = this;
            //获取当前页总数与选择总数比较
            var iSelect = widgetThis._getSelectedNums();
            var iCurrent = widgetThis._getCurrentNums();
            var oSetting = widgetThis._getoSettings();
            var nTable = oSetting.nTable;
            var nAll = $(nTable).find(".dataTables_checkbox_title");
            nAll.removeClass("table_checkbox_select");
            nAll.removeClass("table_part_select");
            if (iSelect == iCurrent) {
                nAll.addClass("table_checkbox_select");
            } else if (iSelect < iCurrent && iSelect > 0) {
                nAll.addClass("table_part_select");
            }
        },

        "_doCheckbosxOther": function ($tr, $trSiblings) {
            var widgetThis = this;
            $trSiblings.removeClass("clickTrColor");
            $trSiblings.find(".dataTables_checkboxs").removeClass("table_checkbox_select");
            widgetThis._setSelectRow($tr);
        },

        "_getSelectedNums": function () {
            var widgetThis = this;
            var oSetting = widgetThis._getoSettings();
            var nTable = oSetting.nTable;
            return $(nTable).find("td .table_checkbox_select").length;
        },

        "_getCurrentNums": function () {
            var widgetThis = this;
            var oSetting = widgetThis._getoSettings();
            var nTable = oSetting.nTable;
            return $(nTable).find(".dataTables_checkboxs").length;
        },

        "_doOpAreaInit": function (config) {
            var oOpAreaColums = {
                "sTitle": "",
                "mData": function () {
                    return '<div class="dataTables_opArea"></div>'
                },
                "bSortable": false
            };
            config.aoColumns.push(oOpAreaColums)
        },

        "_doOpButtonsDomInit": function () {
            var widgetThis = this;
            //清空原有的
            if (widgetThis._oPAreaElement) {
                widgetThis._oPAreaElement.remove();
            }
            var aoOption = getOption();
            if (aoOption == undefined) {
                return;
            }
            var nTableDiv = widgetThis._element;
            doMoreButton(aoOption);
            initDom(aoOption);

            function getOption() {
                return widgetThis.options.opAreaConfig;
            }

            function doMoreButton(aoOption) {
                var size = aoOption.length;
                var oMoreButton = {
                    template: '<div class="moreButton"></div>',
                    clickActive: function () {
                        var nSub = widgetThis._oPAreaElement.find(".OpButton_panel_sub");
                        nSub.toggle()

                    },
                    id: widgetThis.options.id + '_MoreButton'
                };

                if (size > 3) {
                    aoOption.splice(3, 0, oMoreButton);
                }
            }

            function initDom(aoOption) {
                var nDiv = $('<div class="OpButton_main"></div>');
                var nDivPanel = $('<div class="OpButton_panel"></div>');
                var nDivSubPanel = $('<div class="OpButton_panel_sub"></div>');
                var ntriangle = $('<div class="OpButton_triangle"></div>');
                var oEvent = {};

                _.each(aoOption, function (element, index) {
                    if (index < 4) {
                        addButtonDiv(nDivPanel, element);
                    } else {
                        addButtonDiv(nDivSubPanel, element);
                    }

                    oEvent = getEventObjs(oEvent, element);
                })

                proxyEvent(nDiv, oEvent);
                nDivSubPanel.append(ntriangle);
                nDiv.append(nDivPanel);
                nDiv.append(nDivSubPanel);
                nTableDiv.append(nDiv);
                widgetThis._oPAreaElement = nDiv;
            }

            function addButtonDiv(nSuper, oConfig) {
                var sTemplate = oConfig.template;
                var sID = oConfig.id;
                var nSubButtonDiv = $('<div class="sub_OpButton"></div>');
                var nButtonDiv = $('<div class="OpButton"></div>');

                nSubButtonDiv.prop('id', sID);
                nSubButtonDiv.html(sTemplate);
                nButtonDiv.append(nSubButtonDiv);
                nSuper.append(nButtonDiv);
            }


            function getEventObjs(oEvent, oConfig) {
                var sID = oConfig.id;
                var fClickActive = oConfig.clickActive;
                var obj = {};
                obj[sID] = fClickActive;
                return _.extend(oEvent, obj);
            }

            function proxyEvent(nElement, oEvent) {
                nElement.on('click', 'div[class=sub_OpButton]', function (event) {
                    var nSrc = $(this);
                    var sID = $(nSrc).attr('id');
                    if (oEvent[sID]) {
                        oEvent[sID].apply();
                    }

                });

                nElement.on('mouseover', 'div', function () {
                    widgetThis._doOpElementShow(true);
                    widgetThis._lastHoverTr.addClass("Table_hover");
                });

                nElement.on('mouseleave', 'div', function () {
                    widgetThis._doOpElementShow(false);
                    widgetThis._lastHoverTr.removeClass("Table_hover");
                })
            }
        },
        "_doOpElementShow": function (isshow, nTr) {
            var widgetThis = this;
            var nOp = widgetThis._oPAreaElement;
            if (isshow) {
                nOp.show();
                if (nTr) {
                    nTr.addClass('Table_hover');
                }
            } else {
                nOp.hide();
                if (nTr) {
                    nTr.removeClass('Table_hover');
                }
            }
        },
        /*
         OPArea操作对象
         */
        "_doOpAreaHandle": {
            "mouseover": function (widgetThis, nNode) {
                var trSiblings = nNode.siblings();
                if (widgetThis.options.opAreaConfig == undefined || nNode.is("tr:has(td.info_row)") || trSiblings.filter(".odd,.even").length == 0
                    || nNode.hasClass('clickTrColor')) {
                    return;
                }
                var src = nNode;
                var nTarget = src.find("div[class=dataTables_opArea]");
                var oPosition = nTarget.offset();
                var height = widgetThis._oPAreaElement.height();
                var elePos = {
                    top: oPosition.top - height / 2
                }
                widgetThis._oPAreaElement.offset(elePos);
                widgetThis._doOpElementShow(true, nNode);
            },
            "mouseleave": function (widgetThis, nNode) {
                if (widgetThis.options.opAreaConfig == undefined) {
                    return;
                }
                widgetThis._doOpElementShow(false, nNode);

                widgetThis._lastHoverTr = nNode;
            },
            "click": function (widgetThis) {
                if (widgetThis.options.opAreaConfig) {
                    widgetThis._doOpElementShow(false);

                }
            }

        },
        //处理鼠标点击某行及鼠标移上去之后的样式改变



        "_toggleCss":function() {
            var widgetThis = this;
            $('th:has(span.sorting_disabled)',widgetThis._element).css("cursor","default");
            if (widgetThis.Initopts.bcolDrag) {
                widgetThis._element.on("mouseover", "table.tinyTable>thead>tr>th", function() {
                    var ColIndex = $(this).index();
                    var tableArr =$(this).parent().parent().parent().parent().parent().parent();
                    var tableThis =tableArr.find("div.dataTables_scrollBody:first");
                    var tableThisClass = _.uniqueId('tableThis-');
                    tableThis.addClass(tableThisClass);
                    var nTrs = $("div."+tableThisClass+">"+"table.tinyTable>tbody>tr:not(tr:has(td.info_row))");
                    var selectorStr = "td:eq(" + ColIndex + ")";
                    $(this).css("border-right", "1px dotted #000");
                    _.each(nTrs, function(trElement) {
                        $(selectorStr, trElement).css("border-right", "1px dotted #000");
                    });
                });
                widgetThis._element.on("mouseleave", "th", function() {
                    var ColIndex = $(this).index();
                    var tableArr =$(this).parent().parent().parent().parent().parent().parent();
                    var tableThis =tableArr.find("div.dataTables_scrollBody:first");
                    var tableThisClass = _.uniqueId('tableThis-');
                    tableThis.addClass(tableThisClass);
                    var nTrs = $("div."+tableThisClass+">"+"table.tinyTable>tbody>tr:not(tr:has(td.info_row))");
                    var selectorStr = "td:eq(" + ColIndex + ")";
                    $(this).css("border-right-color", "transparent");
                    _.each(nTrs, function(trElement) {
                        $(selectorStr, trElement).css("border-right-color", "transparent");
                    });
                });

                widgetThis._element.on("mouseup", "th", function() {
                    var ColIndex = $(this).index();
                    var nTrs = $("tr", widgetThis._element);
                    var selectorStr = "td:eq(" + ColIndex + ")";
                    $(this).css("border-right-color", "transparent");
                    _.each(nTrs, function(trElement) {
                        $(selectorStr, trElement).css("border-right-color", "transparent");
                    });
                });

                widgetThis._element.on("click", "th", function() {
                    var ColIndex = $(this).index();
                    var tableArr =$(this).parent().parent().parent().parent().parent().parent();
                    var tableThis =tableArr.find("div.dataTables_scrollBody:first");
                    var tableThisClass = _.uniqueId('tableThis-');
                    tableThis.addClass(tableThisClass);
                    var nTrs = $("div."+tableThisClass+">"+"table.tinyTable>tbody>tr:not(tr:has(td.info_row))");
                    var selectorStr = "td:eq(" + ColIndex + ")";
                    $(this).css("border-right", "1px dotted #000");
                    _.each(nTrs, function(trElement) {
                        $(selectorStr, trElement).css("border-right", "1px dotted #000");
                    });
                });
            }

            widgetThis._element.on("click", "td", function (event) {
                var $td = $(this);
                var nTr = $(this).parent('tr')[0];
                var $tr = $(nTr);
                var trSiblings = $tr.siblings();
                if ($tr.is("tr:has(td.info_row)") || trSiblings.filter(".odd,.even").length == 0) {
                    return;
                }
                var oSetting = widgetThis._getoSettings();
                if (widgetThis.options.checkbox) {
                    widgetThis._doCheckboxsHandle($td, $tr, trSiblings);
                } else {
                    trSiblings.removeClass('clickTrColor');
                    $tr.addClass('clickTrColor');
                }
                widgetThis._doOpAreaHandle.click(widgetThis, $tr);


                var oData = oSetting.oInstance.fnGetData(nTr);
                if (widgetThis.options.cellClickActive) {
                    widgetThis.options.cellClickActive.call(this, event, oData);
                }

            });

            if (widgetThis.options.checkbox) {
                widgetThis._element.on("click", "div.dataTables_checkbox_title", function (event) {
                    var oSetting = widgetThis._getoSettings();
                    var trSiblings = $(oSetting.nTable).find("tr.odd,tr.even");
                    var nAllCheckbox = $(this);
                    var bAllChe = $(this).hasClass("table_checkbox_select");
                    if (bAllChe) {
                        nAllCheckbox.removeClass("table_checkbox_select");
                        _.each(trSiblings, function (element, index) {
                            widgetThis._cancelSelectRow($(element));
                        });
                    } else {
                        nAllCheckbox.removeClass("table_part_select");
                        nAllCheckbox.addClass("table_checkbox_select");
                        _.each(trSiblings, function (element, index) {
                            widgetThis._setSelectRow($(element));
                        });
                    }

                    if (widgetThis.options.cellClickActive) {
                        widgetThis.options.cellClickActive.call(this, event);
                    }
                });
            }

            widgetThis._element.on("mouseover", "tr", function (event) {
                widgetThis._doOpAreaHandle.mouseover(widgetThis, $(this));
            });

            widgetThis._element.on("mouseleave", "tr", function (event) {
                widgetThis._doOpAreaHandle.mouseleave(widgetThis, $(this));
            });
        },

        "getTableCheckedNums": function () {
            var widgetThis = this;
            return widgetThis._getSelectedNums();
        },

        "getTableCheckedItems": function () {
            var widgetThis = this;
            var oSetting = widgetThis._getoSettings();
            var nTable = oSetting.nTable;
            var aaData = [];
            $(nTable).find("tr.clickTrColor").each(function () {
                var aData = oSetting.oInstance.fnGetData(this);
                aaData.push(aData);
            })
            return aaData;
        },

        "setSelectedRow": function (key, value) {
            var widgetThis = this;
            var oSettings = widgetThis._getoSettings();
            var aoData = oSettings.aoData;
            var userKey = key;
            var userValue = value;
            _.each(aoData, function (value, key) {
                if (value._aData && value._aData[userKey] === userValue) {
                    widgetThis._setSelectRow($(value.nTr));
                }
            })
        },
        /*
         * 向后台发送请求，更新表格数据
         */
        
        "refreshDataTable" : function() {

            var widgetThis = this;

            widgetThis.options.refreshStopped = false;

            var defaultAjaxConfig = {};
            !_.isUndefined(widgetThis.options["request-config"].contentType) && (defaultAjaxConfig.contentType = widgetThis.options["request-config"].contentType);
            !_.isUndefined(widgetThis.options["request-config"].httpMethod) && (defaultAjaxConfig.type = widgetThis.options["request-config"].httpMethod);
            !_.isUndefined(widgetThis.options["request-config"].async) && (defaultAjaxConfig.async = widgetThis.options["request-config"].async);
            !_.isUndefined(widgetThis.options["request-config"].dataType) && (defaultAjaxConfig.dataType = widgetThis.options["request-config"].dataType);
            !_.isUndefined(widgetThis.options["request-config"].data) && (defaultAjaxConfig.data = widgetThis.options["request-config"].data);
            !_.isUndefined(widgetThis.options["request-config"].url) && (defaultAjaxConfig.url = widgetThis.options["request-config"].url);
            !_.isUndefined(widgetThis.options["request-config"].cache) && (defaultAjaxConfig.cache = widgetThis.options["request-config"].cache);
            defaultAjaxConfig.success = widgetThis.getSuccessFn(widgetThis.options);
            defaultAjaxConfig.error = widgetThis.getSuccessFn(widgetThis.options);
            $.ajax(defaultAjaxConfig);
        },


        "getSuccessFn":function(options) {
            var widgetThis = this;
            if (options["request-config"] && options["request-config"].success) {
                return _.bind(options["request-config"].success, widgetThis);
            } else {
                return _.bind(widgetThis.onResponseSuccess, widgetThis);
            }
        },


       
        "getErrorFn":function(options) {
            var widgetThis = this;
            if (options["request-config"] && options["request-config"].error) {
                return _.bind(options["request-config"].error, widgetThis);
            } else {
                return _.bind(widgetThis.onResponseError, widgetThis);
            }
        },

        
        "generateRequestConfig" : function(lastResponseData) {

            var widgetThis = this;

            return {
                "url" : widgetThis.options["request-config"].url,
                "data" : widgetThis.options["request-config"].data
            };
        },
        

        "startRefresh" : function() {

            var widgetThis = this;

            widgetThis.options.refreshStopped = false;

            widgetThis.refreshDataTable();

        },
        
        "getDataFn":function(){
            var widgetThis = this;
            if(widgetThis.options["getDataList"]){
                return _.bind(widgetThis.options["getDataList"],widgetThis);
            }else{
                return _.bind(widgetThis.getDataList,widgetThis);
            }
        },

        "onResponseSuccess" : function(resultData) {

            var widgetThis = this;
            if( ! resultData )
            {
                //空数据，不更新
                return;
            }
            var getDataList = widgetThis.getDataFn();
            var responseData = getDataList(resultData);
            var $table = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
            var dataTableObj = $table.dataTable();
            if(widgetThis.dataTableConfig.showDetails){
                widgetThis.handleDetailData(responseData,$table,dataTableObj);        
            }else{
               widgetThis.handleResponseData(responseData);
            }
            if (widgetThis.options["request-config"].enableRefresh) {
                //判断是否进行下一次刷新
                var isContinueRefresh = widgetThis.checkContinueRefresh();
                if (isContinueRefresh) {
                    widgetThis.startRefreshTimeout();
                }
            }
            widgetThis.lastResponseData = resultData;
        },

        "handleResponseData" : function(responseData) {

            var widgetThis = this;

            //更新表格数据，默认不更新表头
            widgetThis._setOption("data", responseData);

        },
        
      
        "handleDetailData" : function(currentSteps,$table,dataTableObj ) {
            var widgetThis = this;
            
            if ((!_.isArray(currentSteps)) || (currentSteps.length <= 0 )) {
                //空数据，不更新
                return;
            }
            
            if(!widgetThis.dataTableConfig.showDetails){
                dataTableObj.fnAddData(currentSteps);
                return;        
            }


            var trArr = $table.find("tbody tr").filter(".even,.odd").filter(":not(:has(.dataTables_empty))");

            _.each(currentSteps, function(step, index) {

                // 更新
                if (index < trArr.length) {
                    var tr = trArr[index];
                    // 是否已经打开详情
                    if (dataTableObj.fnIsOpen(tr)) {
                        widgetThis.options.renderRow.apply(widgetThis, [tr, step, index, true]);
                        if (step.detail.contentType === 'url') {
                            var detail = $("<div class='td-padding'></div>").html("");
                            $(tr).next().find("." + DETAIL_ROW_CLASS).html(detail).append("<div class='detail-background-after'></div>").prepend("<div class='detail-background-before'></div>");
                            $(".td-padding", $(tr).next()).load(step.detail.content);
                        } else {
                            var detail = $("<div class='td-padding'></div>").html(step.detail.content);
                            $(tr).next().find("." + DETAIL_ROW_CLASS).html(detail).append("<div class='detail-background-after'></div>").prepend("<div class='detail-background-before'></div>");
                        }
                    } else {
                        widgetThis.options.renderRow.apply(widgetThis, [tr, step, index]);
                    }
                    tr = null;
                } else// 新增一行
                {
                    dataTableObj.fnAddData(step);
                }

            });

        },

        "setRenderRowFn":function(optRenderRow){
            var widgetThis = this;
            if(_.isUndefined(optRenderRow)){
             if(widgetThis.dataTableConfig.showDetails){
              widgetThis.dataTableConfig.fnCreatedRow = _.bind(widgetThis.renderDetailTd, widgetThis);
             }
            }else{
             if(widgetThis.dataTableConfig.showDetails){
                 function renderFn(nRow, aData, iDataIndex){
                  var widgetThis = this;
                  optRenderRow.apply(widgetThis,arguments);    
                  widgetThis.renderDetailTd.apply(widgetThis,arguments);
                 }
                 widgetThis.dataTableConfig.fnCreatedRow = _.bind(renderFn, widgetThis);
             }
             else{
                 widgetThis.dataTableConfig.fnCreatedRow = _.bind(optRenderRow, widgetThis);
             }
            }
        },
       
		"renderDetailTd":function(nRow, aData, iDataIndex, opened) {
			var widgetThis = this;
			var $table = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
			var $detail_td = $("td:eq(0)", nRow);
			var defaultDiv = [];
			var detailColIndex = widgetThis.dataTableConfig.showDetails.colIndex;
			var detailColDom = "";
			var domPendType = widgetThis.dataTableConfig.showDetails.domPendType;
			var openClick = widgetThis.dataTableConfig.showDetails.openClick;
			var closeClick = widgetThis.dataTableConfig.showDetails.closeClick;
			var closeId = widgetThis.dataTableConfig.showDetails.closeId;
			if(!_.isUndefined(detailColIndex)){
                $detail_td = $(nRow).children('td:eq('+detailColIndex+')');
				detailColDom = $detail_td.html();
			}
			if (opened) {
			   if(widgetThis.dataTableConfig.showDetails === true){
			     $detail_td.html(detail_close_action_div);}
				else{
				   switch(domPendType){
				   case "append":
				    $detail_td.prepend(detail_close_action_div);
				    break;
				    case "prepend":
				     $detail_td.append(detail_close_action_div);
				    break;
				    default:
				    {
				     $detail_td.html(detail_close_action_div);		
				     $("div.btn_detail_switch",$detail_td).removeClass("default_hide_style").append(detailColDom);
				     if($("." + SWITCH_DETAIL_CLASS, nRow).length>1){
			           $("." + SWITCH_DETAIL_CLASS+":first", nRow).removeClass(SWITCH_DETAIL_CLASS);
			          }
				    }
				   }}
			} else {
				if(widgetThis.dataTableConfig.showDetails === true){
				   $detail_td.html(detail_show_action_div);
				}else{
				switch(domPendType){
				   case "append":
				    $detail_td.prepend(detail_show_action_div);
				    break;
				    case "prepend":
				     $detail_td.append(detail_show_action_div);
				    break;
				    default:
				    {
				     $detail_td.html(detail_show_action_div);
				     $("div.btn_detail_switch",$detail_td).removeClass("default_show_style").append(detailColDom);
				     if($("." + SWITCH_DETAIL_CLASS, nRow).length>1){
			           $("." + SWITCH_DETAIL_CLASS+":first", nRow).removeClass(SWITCH_DETAIL_CLASS);
			          }
				    }
				   }
			}}
			$("." + SWITCH_DETAIL_CLASS+":last", nRow).click(function(event) {
				var $thisEl = $(this);
				var jqEvent =  event;
				var dataTableObj = $table.dataTable();
				var nRow = $thisEl.parents("tr").get(0);
				if (!dataTableObj.fnIsOpen(nRow)) {
					
					if (!_.isUndefined(aData.detail) && aData.detail.contentType === 'url') {
						var detail = $("<div class='td-padding'></div>").html("");
						dataTableObj.fnOpen(nRow, detail, DETAIL_ROW_CLASS);
                        $(".td-padding", $(nRow).next()).load(aData.detail.content, function(response, status, xhr) {
                            if (status == 'error') {
                                widgetThis.checkInvalidRequest(xhr.responseText);
                                return;
                            }
                            if(typeof aData.detail.completeFn === "function") {
                                aData.detail.completeFn(response, status, xhr);
                            }
                        });
					} else {
						var detail = $("<div class='td-padding'></div>").html(aData.detail.content);
						dataTableObj.fnOpen(nRow, detail, DETAIL_ROW_CLASS);
					}
					$(nRow).next().find("." + DETAIL_ROW_CLASS).append("<div class='detail-background-after'></div>").prepend("<div class='detail-background-before'></div>");
					defaultDiv = $thisEl.parents("td:first").find("div.default_show_style");
					if(defaultDiv.length>0){
					defaultDiv.removeClass("default_show_style").addClass("default_hide_style");
					}
				    if(!_.isUndefined($("#"+closeId))){
					$("#"+closeId,detail).click(function(){
						var $this = $(this);
                           	 var nRow = $this.parents("tr").prev().get(0);
                           	 $(".btn_detail_switch:last",nRow).trigger("click");
					});	
					}
					if(!_.isUndefined(openClick)){
					 openClick(jqEvent);	
					}
				} else {
					dataTableObj.fnClose(nRow);
					defaultDiv = $thisEl.parents("td:first").find("div.default_hide_style");
					if(defaultDiv.length>0){
					defaultDiv.removeClass("default_hide_style").addClass("default_show_style");
					}
					if(!_.isUndefined(closeClick)){
					 closeClick(jqEvent);	
					}
				}
                
				$thisEl = null;
				nRow = null;
				jqEvent = null;
				dataTableObj = null;
			});
			nRow = null;
		},

         
        
        "onResponseError" : function(error, msg) {

            var widgetThis = this;

            alert("Get table data failed:" + error.status + ", " + msg);

        },


       
        "getDataList" : function(responseData) {

            var widgetThis = this;

            if (!responseData) {
                return null;
            }

            var prop = widgetThis.options["request-config"].sAjaxDataProp;

            var data = responseData[prop];

            return data;

        },


        "checkContinueRefresh" : function() {

            var widgetThis = this;

            return (!widgetThis.options.refreshStopped ) && widgetThis.options["request-config"].enableRefresh && (widgetThis.getRefreshInterval() > 0 );

        },

        "getRefreshInterval" : function() {
            var widgetThis = this;
            return widgetThis.options["request-config"].refreshInterval;
        },

        /**
         * 启动循环刷新表格数据
         */
        "startRefreshTimeout" : function() {

            var widgetThis = this;

            widgetThis.refreshTimeoutId = window.setTimeout(function() {
                widgetThis.refreshDataTable();
            }, widgetThis.getRefreshInterval());

        },
        /**
         * 停止循环刷新
         */
        "stopRefresh" : function() {

            var widgetThis = this;

            window.clearTimeout(widgetThis.refreshTimeoutId);

            widgetThis.options.refreshStopped = true;
        },

       
    
        "_initDataTableConfig" : function(option) {
            var widgetThis = this;

            widgetThis.dataTableConfig = $.extend(true, {}, DEFAULT_DATATABLE_CONFIG);
            widgetThis.Initopts = {
                "bColVis" : false,
                "bcolDrag" : false
            };
            // 若用户设置了tableLanguage且为对象，则整合用户设置的tableLanguage到dataTableConfig.oLanguage中
           if (!_.isUndefined(option["tableLanguage"]) && $.isPlainObject(option["tableLanguage"])) {
               widgetThis.dataTableConfig.oLanguage = $.extend(true, widgetThis.dataTableConfig.oLanguage, option["tableLanguage"]);
           }
 
            //用来标记每一个表格控件dom中table.tinyTable的个数，为后续取对应的dom做准备，对于列拖动的表格，有3个，其他情况下是2个
            widgetThis.tableIndex = 2;
            !_.isUndefined(option["id"]) && (widgetThis.dataTableConfig.wrapperId = option["id"]);
            !_.isUndefined(option["data"]) && (widgetThis.dataTableConfig.aaData = $.extend(true, [], option["data"]));
            !_.isUndefined(option["columns"]) && (widgetThis.dataTableConfig.aoColumns = $.extend(true, [], option["columns"]));
            
            if (!_.isUndefined(option["enablePagination"])) {
                widgetThis.dataTableConfig.bPaginate = option["enablePagination"];
            }else if(!_.isUndefined(option["enable-pagination"])) {
                widgetThis.dataTableConfig.bPaginate = option["enable-pagination"];
            }
            
            if (!_.isUndefined(option["lengthChange"])) {
                widgetThis.dataTableConfig.bPageSizeChange = option["lengthChange"];
                widgetThis.dataTableConfig.bLengthChange = false;
            }else if (!_.isUndefined(option["length-change"])) {
                widgetThis.dataTableConfig.bPageSizeChange = option["length-change"];
                widgetThis.dataTableConfig.bLengthChange = false;
            }
            
            if (!_.isUndefined(option["hideTotalRecords"])) {
                widgetThis.dataTableConfig.bHideTotalRecords = option["hideTotalRecords"];
            }else if(!_.isUndefined(option["hide-total-records"])) {
                widgetThis.dataTableConfig.bHideTotalRecords = option["hide-total-records"];
            }     
            
            if (!_.isUndefined(option["lengthMenu"])) {
                widgetThis.dataTableConfig.aLengthMenu = $.extend(true, [], option["lengthMenu"]);
            }else if(!_.isUndefined(option["length-menu"])) {
                widgetThis.dataTableConfig.aLengthMenu = $.extend(true, [], option["length-menu"]);
            } 
            
            if (!_.isUndefined(option["displayLength"])) {
                widgetThis.dataTableConfig.iDisplayLength = option["displayLength"];
            }else if(!_.isUndefined(option["display-length"])) {
                widgetThis.dataTableConfig.iDisplayLength = option["display-length"];
            }
            
            if(!_.isUndefined(option["totalRecords"])) {
                widgetThis.dataTableConfig.totalRecords = option["totalRecords"];
                widgetThis.dataTableConfig.totalItems = option["totalRecords"];
            }else if(!_.isUndefined(option["total-records"])) {
                widgetThis.dataTableConfig.totalRecords = option["total-records"];
                widgetThis.dataTableConfig.totalItems = option["total-records"];
            }
            
            if (!_.isUndefined(option["curPage"])) {
                widgetThis.dataTableConfig.curPage = $.extend(true, {}, option["curPage"]);
            }else if(!_.isUndefined(option["cur-page"])) {
                widgetThis.dataTableConfig.curPage = $.extend(true, {}, option["cur-page"]);
            }
            
            if (!_.isUndefined(option["enableFilter"])) {
                widgetThis.dataTableConfig.bFilter = option["enableFilter"];
            }else if(!_.isUndefined(option["enable-filter"])) {
                widgetThis.dataTableConfig.bFilter = option["enable-filter"];
            }
            
            if (!_.isUndefined(option["columnSorting"])) {
                widgetThis.dataTableConfig.aaSorting = $.extend(true, [], option["columnSorting"]); 
            }else if(!_.isUndefined(option["column-sorting"])) {
                widgetThis.dataTableConfig.aaSorting = $.extend(true, [], option["column-sorting"]); 
            }
            
            if (!_.isUndefined(option["paginationStyle"])) {
                widgetThis.dataTableConfig.sPaginationType = widgetThis._getPaginationStyle(option["paginationStyle"])
            }else if(!_.isUndefined(option["pagination-style"])) {
                widgetThis.dataTableConfig.sPaginationType = widgetThis._getPaginationStyle(option["pagination-style"]);
            }
            
            if (!_.isUndefined(option["showDetails"])) {
                widgetThis.dataTableConfig.showDetails = option["showDetails"];
            }else{
                widgetThis.dataTableConfig.showDetails = !_.isUndefined(option["show-details"])?option["show-details"]:false;
            } 
            
            widgetThis.setRenderRowFn(option["renderRow"]);
            
            if (!_.isUndefined(option["callback"])) {
                widgetThis.dataTableConfig.callback = option["callback"];
            }else{
                widgetThis.dataTableConfig.callback = function(evtObj) {
                };
            }
            
            if (!_.isUndefined(option["changeSelect"])) {
                widgetThis.dataTableConfig.changeSelect = option["changeSelect"];
            }
            
            if (!_.isUndefined(option["columnsDraggable"])) {
                widgetThis.setColDrag(option["columnsDraggable"], widgetThis.dataTableConfig);
            } else {
                widgetThis.setColDrag(option["columns-draggable"], widgetThis.dataTableConfig);
            }
            
            if (!_.isUndefined(option["columnsVisibility"])) {
                widgetThis.setColVis(option["columnsVisibility"], widgetThis.dataTableConfig,widgetThis.Initopts.bcolDrag);
            } else {
                widgetThis.setColVis(option["columns-visibility"], widgetThis.dataTableConfig,widgetThis.Initopts.bcolDrag);
            }
            
            if (widgetThis.dataTableConfig.bPaginate == false){
                widgetThis.dataTableConfig.iDisplayLength = 1e10;
            }
            
            if (!_.isUndefined(option["opAreaConfig"])) {
                widgetThis._doOpAreaInit(widgetThis.dataTableConfig);
           } else if(!_.isUndefined(option["op-area-config"])) {
                widgetThis._doOpAreaInit(widgetThis.dataTableConfig);
            }

            if (widgetThis.options.checkbox === true) {
                widgetThis._doCheckboxInit(widgetThis.dataTableConfig);
            }
        },


        
        "setColDrag":function(draggable, dataTableConfig) {
            var widgetThis = this;
            var initDragSet = widgetThis.Initopts.bcolDrag;
            if (draggable && !initDragSet) {
                dataTableConfig.sDom += "R";
                dataTableConfig.sScrollX = "100%";
                widgetThis.tableIndex = 3;
                widgetThis.Initopts.bcolDrag = true;
            } else if (!draggable && initDragSet) {
                var sDomStrLen = dataTableConfig.sDom.length;
                dataTableConfig.sDom = dataTableConfig.sDom.substring(0, sDomStrLen - 1);
                delete dataTableConfig.sScrollX;
            }
        },

         
        
        
        "setColVis":function(colVis, dataTableConfig,draggable) {
            var widgetThis = this;
            var initColVis = widgetThis.Initopts.bColVis;
            if (util.isTrue(colVis) || (colVis != null && typeof (colVis) == "object")) {//当colVis设为true或者是一个非null且为对象时
                var ColVisSet = true;
            }
            var oStr = {};
            if (ColVisSet && !initColVis) {
                if (dataTableConfig.sDom.indexOf("C") == -1) {
                    oStr = widgetThis._getFrontAndEndStr(dataTableConfig.sDom, 't');
                    if (oStr) {
                        dataTableConfig.sDom = oStr.frontStr + "tC" + oStr.endStr;
                    }
                }
                dataTableConfig.oColVis = {
                    buttonText : "<div></div>",
                    sAlign : "right"
                };
                if ( typeof (colVis) == "object") {
                    _.extend(dataTableConfig.oColVis, colVis);
                }
                widgetThis.Initopts.bColVis = true;
                /* 定位列隐藏按钮*/
                dataTableConfig.fnDrawCallback = function(o) {

                    var nColVis = $('div.ColVis', o.nTableWrapper)[0];
                    nColVis.style.width = "16px";
                    nColVis.style.top = draggable?($('div.dataTables_scroll', o.nTableWrapper).position().top) + "px":($('table.tinyTable', o.nTableWrapper).position().top) + "px";
                    nColVis.style.right = "0px";
                    nColVis.style.position = "absolute";
                    nColVis.style.height = "25px";
                }
            } else if (!ColVisSet && initColVis) {
                oStr = widgetThis._getFrontAndEndStr(dataTableConfig.sDom, 'C');
                if (oStr) {
                    dataTableConfig.sDom = oStr.frontStr + oStr.endStr;
                }
                delete dataTableConfig.oColVis;
            }

        },


       
        "_getFrontAndEndStr":function(mainStr, searchStr) {
            var widgetThis = this;
            var foundOffset = mainStr.indexOf(searchStr);
            if (foundOffset == -1) {
                return null;
            }
            var oStr = {};
            oStr.frontStr = mainStr.substring(0, foundOffset);
            oStr.endStr = mainStr.substring(foundOffset + searchStr.length, mainStr.length);
            return oStr;
        },

       
        "_setTableCaption" : function(value) {
            var widgetThis = this;

            $(".tinyTable_tablecaption", widgetThis.getDom()).text(value);

            if (_.isUndefined(value)||value == "") {
                $(".tinyTable_tablecaption",widgetThis.getDom())[0].style.padding = '0px';
            } else {
                $(".tinyTable_tablecaption",widgetThis.getDom())[0].style.padding = '5px';
            }
        },


        "_updateTable" : function() {
            var widgetThis = this;
            var $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());

            if ($.fn.DataTable.fnIsDataTable($dataTable.get(0))) {
                //清除整个表格
                $dataTable.dataTable().fnDestroy(true);
            }
            
            $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());

            //绘制表头
            var $thead = $dataTable.find("thead");
            $thead.html("");
            widgetThis.getDom().append('<table class="tinyTable"> <thead></thead> <tbody> </tbody> </table>');
            //头部已变化，内容清空
            $dataTable.find("tbody").html("");

            var $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
            if (! $.fn.DataTable.fnIsDataTable($dataTable.get(0))) {
                //如果有表头配置，就绘制表格
                var aoColumns = widgetThis.dataTableConfig.aoColumns;
                if (_.isArray(aoColumns) && aoColumns.length > 0) {
                    //初始化表格
                    $dataTable.dataTable(widgetThis.dataTableConfig);
                }
            }
        },


        "_updateBody" : function() {

            var widgetThis = this;

            var $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());

            //是否已经绘制过
            if ($.fn.DataTable.fnIsDataTable($dataTable.get(0))) {
                var dataTableObj = $dataTable.dataTable();

                //清除原有表格数据
                dataTableObj.fnClearTable();

                //添加当前的数据
                var aaData = widgetThis.dataTableConfig.aaData;
                if(aaData){
                    dataTableObj.fnAddData(aaData);

                }
            }
            widgetThis.autoFitDataTable();
        },



        
        "addTableRows":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             $dataTable.fnAddData.apply($dataTable,arguments);
             
        },
        
        "closeRowDetails":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             $dataTable.fnClose.apply($dataTable,arguments);
             
        },
        
        "deleteTableRow":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             $dataTable.fnDeleteRow.apply($dataTable,arguments);
        },
        
         "getTableData":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             return $dataTable.fnGetData.apply($dataTable,arguments);
             
        },
        
         "clearTable":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             $dataTable.fnClearTable.apply($dataTable,arguments);
        },
        
        
         "update":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             $dataTable.fnUpdate.apply($dataTable,arguments);
        },
        
        "getPosition":function(){
            
             var widgetThis = this;
             $dataTable = $("table.tinyTable:lt("+ widgetThis.tableIndex+"):last", widgetThis.getDom());
             $dataTable = $dataTable.dataTable();
             return $dataTable.fnGetPosition.apply($dataTable,arguments);
        },
        
        "autoFitDataTable" : function() {

            var widgetThis = this;
            
        },

        "_setOption" : function(key, value) {

            var widgetThis = this;

            widgetThis._super(key, value);
            switch( key ) {
                case "id" :
                    widgetThis._updateId(value);
                    break;
                case "display":
                    widgetThis._hideOrShowTable(value);
                    break;
                case 'caption':
                    widgetThis._setTableCaption(value);
                    break;
                case "column-sorting" :
                    widgetThis.dataTableConfig.aaSorting = $.extend(true, [], value);
                    widgetThis._updateTable();
                   
                    break;
                case "show-details" :
                    widgetThis.options["show-details"] = value;
                    widgetThis._updateTable();
                    
                    break;    
                case "columns" :
                    widgetThis.dataTableConfig.aoColumns = $.extend(true, [], value);
                    widgetThis._updateTable();
                    
                    break;
                case "columns-draggable" :
                    widgetThis.setColDrag(value, widgetThis.dataTableConfig);
                    widgetThis._updateTable();
                    
                    break;
                case "columns-visibility" :
                    widgetThis.setColVis(value, widgetThis.dataTableConfig);
                    widgetThis._updateTable();
                   
                    break;
                case "renderRow":
                    widgetThis.dataTableConfig.fnCreatedRow = value;
                    widgetThis._updateTable();
                    
                    break;
                case "data" :
                    widgetThis.dataTableConfig.aaData =  $.extend(true, [], value);
                    widgetThis._updateBody();
                    break;

                case "hide-total-records":
                    widgetThis.dataTableConfig.bHideTotalRecords = value;
                    widgetThis._updateTable();
                    
                    break;

                case "total-records":
                    widgetThis.dataTableConfig.totalItems = value;
                    widgetThis.dataTableConfig.totalRecords = value;
                    widgetThis._updateTable();
                    break;

                case "cur-page":
                    widgetThis.dataTableConfig.curPage =  $.extend(true, {}, value);
                    widgetThis._updateTable();
                    
                    break;

                case "enable-pagination":
                    widgetThis.dataTableConfig.bPaginate = value;
                    widgetThis._updateTable();
                    
                    break;
                case "pagination-style":
                    widgetThis.dataTableConfig.sPaginationType = widgetThis._getPaginationStyle(value);
                    widgetThis._updateTable();
                    
                    break;
                case "length-change":
                    widgetThis.dataTableConfig.bPageSizeChange = value;
                    widgetThis._updateTable();
                    
                    break;
                case "length-menu":
                    widgetThis.dataTableConfig.aLengthMenu = $.extend(true, [], value);
                    widgetThis._updateTable();
                   
                    break;

                case "display-length":
                    widgetThis.dataTableConfig.iDisplayLength = value;
                    widgetThis._updateTable();
                    
                    break;

                case "enable-filter":
                    widgetThis.dataTableConfig.bFilter = value;
                    widgetThis._updateTable();
                    
                    break;
                case "opAreaConfig":
                    widgetThis._doOpButtonsDomInit();
                    break;
            }

            return;
        },

        /**
         *获取类型
         */
        
        "_getPaginationStyle" : function(styleName) {
            if (styleName == "simple") {
                return styleName;
            } else {
                return "fullnumbers";
            }
        },

        
        "_getPagination" : function() {
            var widgetThis = this;
            return widgetThis.getDom().find(".eViewPagination_paginationContainer").widget();
        }

    });

    return Table;

});
