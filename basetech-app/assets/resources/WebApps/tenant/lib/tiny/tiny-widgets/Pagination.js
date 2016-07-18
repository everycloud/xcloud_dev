/**
 * Tiny Pagination widget. 版本日期  2014-6-13:
 * 
 * [DOM组成说明]：
 * 控件整体Dom结构，部分子DOM参考代码中的模板定义
 * <div class='tiny-Pagination-Container'>..... ... 控件整体
 *     <div class='tiny-Pagination-left-Panel'>.. .....控件左侧，simple模式下包裹总消息条数文本；fullnumber模式下包裹每页显示消息条数选择框和总消息条数文本
 *     </div>..........................................
 *     <div class='tiny-Pagination-Right-Panel'>.......控件右侧，simple模式下包裹分页链接；fullnumber模式下包裹分页链接和goto跳转
 *         <div class='tiny-Pagination-Link-Panel'>....分页链接部分，simple模式下包裹一个combobox控件和向前向后按钮；fullnumber模式下包裹一系列页码按钮
 *         </div>......................................
 *     </div>..........................................
 * </div>..............................................
 * 
 * [属性]：
 * type:               设置分页控件的类型，可选值"simple"，"full_numbers"，默认值："simple"，不支持动态修改
 * display:            设置控件显示与否，Boolean类型，默认值：true，支持动态修改
 * length-options:     设置每页显示数据条数选项，Array类型，默认值： [20,40,60,80,100]，不支持动态修改
 *                     注意：display-length属性的值（即设置的每页显示数据条数）不在数组元素值中时，会将其添加到数组中。
 * display-length:     设置每页显示数据条数，Number类型，默认值: 20，支持动态修改
 * total-records:      设置所有数据条数，Number类型，默认值: 0，支持动态修改 
 * cur-page:           设置当前页码，对象类型，默认值：{pageIndex:1}，支持动态修改
 * hide-total-records: 设置是否隐藏数据条数，Boolean类型，默认值：false，支持动态修改
 * hide-display-length:设置是否隐藏每页显示条数选择框，只对full_numbers类型的分页有用，简单分页没有此属性。Boolean类型，默认值：false，支持动态修改
 * 
 * [事件]：
 * callback(evtObj, evt)： 当前显示页改变时的回调函数。evtObj对象返回选择的当前显示页、总页数和每页显示数据长度三个信息。evt标注是否是事件触发。
 * change-select(evtObj)： 每页显示数据条数改变时的回调函数。evtObj对象返回选择的当前显示页、总页数和每页显示数据长度三个信息。
 * 
 * [内部事件]：
 * inputBox.keyup :            goto跳转输入框的页码输入
 * $(gotoTemplate).click ：            点击goto跳转页按钮
 * select控件的change事件：                     每页显示数据条数选择框内容变化时触发change事件
 * combobox控件的select事件：               combobox控件点选时触发的select事件
 * combobox.$inputText.keyup：   在combobox控件中输入页码
 * lnk.click:                  点击链接页（包括Previous和Next按钮）按钮
 * 
 **/
define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-widgets/Widget", "tiny-common/util", "tiny-widgets/Select","tiny-widgets/Combobox","language/widgetsLanguage"], 
function(angular, $, Widget, util, Select, Combobox, language) {
    // 控件整体dom
    var domTemplate = "<div class='tiny-Pagination-Container'>"
                    +    "<div class='tiny-Pagination-left-Panel'>"
                    +    "</div>"
                    +    "<div class='tiny-Pagination-Right-Panel'>"
                    +        "<div class='tiny-Pagination-Link-Panel'>"
                    +        "</div>"
                    +    "</div>"
                    + "</div>";
    // 数据总条数dom
    var totalRecordTemplate = '<label id="tinyPaginationTotalRecords" class="tiny-Pagination-Total-Record-Label" ><%=totalRecordText%>' 
                            + '</label>';
    // goto跳转部分的dom
    var gotoTemplate = '<div class="tiny-Pagination-GoTo-Link">'
                     +    '<a id="goToButton" class="tiny-Pagination-GoTo-Button tiny-Pagination-tiny-button">'
                     +        '<span><em class="tiny-Pagination-Goto-Buttom-Image"></em>'     // em标签作用是强调文本内容
                     +        '</span>'
                     +    '</a>'
                     + '<div>';
           
    var DEFAULT_CONFIG = {
        "template" :            domTemplate,
        "display" :             true,
        "type" :                "simple",
        "cur-page" :            {pageIndex : 1},
        "total-records" :       0,
        "length-options" :      [20, 40, 60, 80, 100],
        "display-length" :      20,
        "hide-display-length" : false,
        "hide-total-records" :  false,
        "callback" :            null,
        "change-select" :       null
    };
    
    var Pagination = Widget.extend({
        "init" : function(options) {
            var paginationThis = this;
            
            paginationThis._super(_.extend({}, DEFAULT_CONFIG, options));
            paginationThis._createPagination(paginationThis.options);             // 生成整个控件（包括所有事件的绑定）
            
            $("#" + paginationThis.options.id).append(paginationThis._element);
        },
        
        "_setOption" : function(key, value) {
            var paginationThis = this;
            paginationThis._super(key, value);
            
            switch (key) {
                case 'id':
                    paginationThis._updateId(value);
                    break;
                case 'display':
                    paginationThis._setDisplay(value);
                    break;
                case 'total-records':
                    paginationThis._setTotalRecords(value);
                    break;
                case 'cur-page':
                    paginationThis._validCurPage();
                    paginationThis._setCurPage(paginationThis.options["cur-page"].pageIndex); 
                    break;
                case 'display-length':
                    paginationThis._setDisplayLength(value);
                    break;
                case 'hide-total-records':
                    paginationThis._setDisplayOfTotalRecords(value);
                    break;
                case 'hide-display-length':
                    paginationThis._setDisplayOfLengthOptions(value);
                    break;
                default:
                    break;
            }
        },
        
        "_setDisplay" : function(display) {
            var paginationThis = this;

            if (util.isFalse(display)) {  
                paginationThis._element.hide();
            } else {
                paginationThis._element.show();
            }
        },
        
        /**
         * 设置总消息条数
         */
        "_setTotalRecords" : function(value) {
            var paginationThis = this;
            
            // 更新当前显示的总消息条数
            var totalRecordText = language.totRecText + paginationThis.options["total-records"];
            $("#tinyPaginationTotalRecords", paginationThis._element).html(totalRecordText);      
            
            paginationThis._drawLinkPanel();
        },
        
        /**
         * 设置当前显示页
         */
        "_setCurPage" : function(pageNum) {
            var paginationThis = this;
            
            if (isNaN(pageNum) || pageNum < 1) {
                return;
            }
            
            paginationThis._curPageChanged(pageNum, "");
        },
        
        /**
         * 根据设定的当前每页显示消息数，simple模式下，直接重绘控件右侧链接部分
         * full_numbers模式下，如果设定的当前每页显示消息数不在每页显示消息条数数组中，将设定值添加到数组中，并重绘整个控件，否则，只重绘控件右侧链接部分
         */
        "_setDisplayLength" : function(perPageCount) {  
            var paginationThis = this;
            var options = paginationThis.options;
            
            if (isNaN(perPageCount) || perPageCount < 1) {
                return;
            }
            
            if("simple" == options["type"]){
                paginationThis._drawLinkPanel();
                return;
            }
            
            perPageCount = parseInt(perPageCount, 10);
            if ($.inArray(perPageCount, options["length-options"]) != -1) {
                
                // 当前设置的每页显示条数在length-options数组当中并且当前每页显示消息条数等于传入参数值
                if(perPageCount == parseInt(paginationThis.select.$inputText.val())) {
                    return;
                }
                
                // 当前设置的每页显示条数在length-options数组当中并且当前每页显示消息条数不等于传入参数值，更新左侧选择框中值，并重画右侧链接部分
                paginationThis.select.$inputText.val(perPageCount);  
                paginationThis._drawLinkPanel();
                return;
            }
            
            // 将当前设置的每页显示条数添加到length-options数组当中，并重画整个控件
            options["length-options"].push(perPageCount); 
            options["length-options"].sort(function(a,b){return a-b});   // 对数组元素进行由小到大排序
            paginationThis._drawLeftPanel();
            paginationThis._drawLinkPanel();
        },
        
        /**
         * 设置是否显示总消息条数
         */
        "_setDisplayOfTotalRecords" : function(isHide) {
            var paginationThis = this;
            
            var totalRecPanel = paginationThis._element.find('label');
            if (util.isFalse(isHide)) {
                totalRecPanel.show();
            } else {
                totalRecPanel.hide();
            }
        },

        /**
         * 设置是否显示每页消息条数选择框
         */
        "_setDisplayOfLengthOptions" : function(isHide) {
            var paginationThis = this;
            
            if ("simple" == paginationThis.options["type"]) {
                return;
            }
            
            var lengthOptionPanel = paginationThis._element.find(".tiny-select");
            if (util.isFalse(isHide)) {
                lengthOptionPanel.show();
            } else {
                lengthOptionPanel.hide();
            }
        },
        
        /**
         * 创建整个控件
         */
        "_createPagination" : function() {
            var paginationThis = this;
            var options = paginationThis.options;
            var type = options["type"];
                             
            // 全显示时添加goTo部分dom
            if ("full_numbers" == type) {
                paginationThis._createGoToDom(); 
            }
            
            paginationThis._drawLeftPanel();// 绘制每页显示条数选择下拉框及总页数显示文本
            paginationThis._drawLinkPanel();// 绘制页码链接按钮及goto跳转部分
            
            // 将用户设置的每页显示消息条数存入每页显示条数记录数组中 
            if ("full_numbers" == type) {
                paginationThis._setDisplayLength(options["display-length"]);
            }
            
            paginationThis._setDisplay(options["display"]);// 是否显示控件
        },
        
        /**
         * 创建goto部分dom
         */
        "_createGoToDom" : function() {
        	var paginationThis = this;
            var $element = paginationThis._element;
            
            var $rightPanel = $element.find(".tiny-Pagination-Right-Panel");  
            paginationThis.$goToPanel = $('<div class="tiny-Pagination-GoTo-Parent"></div>');  
            $rightPanel.append(paginationThis.$goToPanel);
        },
        
        /**
         * 创建分页链接
         */
        "_drawLinkPanel" : function() {
            var paginationThis = this;
            
            var $element = paginationThis._element;
            paginationThis.$linkPanel = $element.find(".tiny-Pagination-Link-Panel");// 包裹上一页、下一页按钮及页码按钮dom的元素
            
            paginationThis.$linkPanel.empty();
            
            // 绘制简单类型的分页链接
            if("simple" == paginationThis.options["type"]){
                paginationThis._drawSimpleLink();
                return;
            }
            
            // 绘制full_numbers类型的分页 链接
            paginationThis._drawFullNumberLinks();
        },
        
        /**
         * 简单类型的分页
         */
        "_drawSimpleLink" : function(){
            var paginationThis = this;
            
            paginationThis._createPrevButton(); // 生成 "Previous"前一页按钮  
            paginationThis._createCombobox();   // 生成中间选择部分
            paginationThis._createNextButton(); // 生成 "Next"下一页按钮
        },
        
        /**
         * full_numbers类型的分页
         */
        "_drawFullNumberLinks" : function(){
            var paginationThis = this;
            
            paginationThis._createPrevButton();         // 生成 "Previous"前一页按钮
            paginationThis._createFullNumMidbuttons();  // 生成中间一系列分页按钮
            paginationThis._createNextButton();         // 生成 "Next"下一页按钮
            paginationThis._createGotoPanel();          // 生成goto跳转部分
        },
        
        /**
         * 计算总页数
         */
        "_calcTotalPageNum" : function() {
            var paginationThis = this;
            
            var totalRecordsNum = paginationThis.options["total-records"];
            var perPageNum      = paginationThis.options["display-length"];
            var totalPageNum    = Math.ceil(parseInt(totalRecordsNum, 10) / parseInt(perPageNum, 10));

            return (totalPageNum > 0) ? totalPageNum : 1;
        },

        /**
         * 根据当前页和要显示的数目，计算分页链接的起始页
         */
        "_getInterval" : function() {
            var paginationThis = this;
            var pageTotalNum = paginationThis._calcTotalPageNum();
            var start, end;
            var curPage = parseInt(paginationThis.options["cur-page"].pageIndex, 10);
            
            // 根据Agile规范：页数小于等于8，起、始按钮值分别设为1和最大页数
            if (pageTotalNum <= 8) {
                start = 1;
                end = pageTotalNum;
                return [start, end];  
            } 
           
            // 显示前五页按钮
            if (curPage <= 3) {
                start = 1;
                end = 5;
                return [start, end];
            }
            
            // 显示最后五页按钮
            if (curPage > pageTotalNum - 3) {
                start = pageTotalNum - 4;
                end = pageTotalNum;
                return [start, end];
            } 
            
            // 显示中间四个按钮
            start = curPage - 1;
            end = curPage + 2;
            return [start, end];
        },

        /**
         * 选中某一页时的处理函数
         */
        "_curPageChanged" : function(pageId, evt) {
            var paginationThis = this;
            
            paginationThis.options["cur-page"].pageIndex = pageId;
            paginationThis._drawLinkPanel();
            paginationThis._callBack(evt);
            
            // 如果是事件触发的选择某一页，阻止事件传播到包容对象
            // 如果是属性设置触发的选择某一页，则不用执行阻止事件冒泡
            if (evt) {
                evt.stopPropagation();  
            }
        },
        
        /**
         * 当前页改变触发的回调函数
         */
        "_callBack" : function(evt) {
            var paginationThis = this;
            var options = paginationThis.options;
                   
            var callbackFn = paginationThis.options["callback"];
            if ( typeof callbackFn != "function") {
                return;
            } 
            
            var evtObj = {};
            evtObj.currentPage   = parseInt(options["cur-page"].pageIndex, 10);
            evtObj.displayLength = parseInt(options["display-length"], 10);
            evtObj.totalRecords  = parseInt(options["total-records"], 10);
            
            callbackFn(evtObj, evt);
        },
        
        /**
         * 创建下拉框和总记录数目
         */
        "_drawLeftPanel" : function() {
            var paginationThis = this;
            var options = paginationThis.options;
            
            var $element = paginationThis._element;
            paginationThis.$leftPanel = $element.find(".tiny-Pagination-left-Panel");// 包裹每页显示条数选择下拉框dom的元素
            
            paginationThis.$leftPanel.empty();
            
            // full_numbers类型时，创建左边选择每页显示消息条数的选择框,并设置是否显示
            if ("full_numbers" == options["type"]) {
                paginationThis._createLeftSelect();  
                paginationThis._setDisplayOfLengthOptions(options["hide-display-length"]);     
            }
            
            var totalRecordText  = language.totRecText + parseInt(options["total-records"], 10);
            var totalRecTemplate = _.template(totalRecordTemplate)({totalRecordText:totalRecordText}); 
            paginationThis.$leftPanel.append($(totalRecTemplate));
            paginationThis._setDisplayOfTotalRecords(options["hide-total-records"]);
        },
       
        /**
          * full_numbers类型时，创建选择每页显示消息条数的选择框
          */ 
        "_createLeftSelect" : function() {
             var paginationThis = this;
             var options = paginationThis.options;
             
             // 生成选择框下拉菜单数据
             var perPageCountOptions = [];
             var perPageCountArray   = options["length-options"];
             for (var i = 0; i < perPageCountArray.length; i++) {
                 perPageCountOptions.push({label : perPageCountArray[i]});
             }
             
             var selectOpts = {
                 'mode'          : "single",
                 'width'         : "100px",
                 'values'        : perPageCountOptions,
                 'change'        : function(e) { 
                     options["display-length"] = parseInt(e.target.value, 10);  // e.target指触发此事件的元素
                     paginationThis._curPageChanged(1,"");         // 每页显示条数改变，重新绘制右边整个内容，并且将显示页设置为第一页
                     
                     if ( typeof (options["change-select"]) == "function") {
                         var evtObj = {};
                         evtObj.currentPage   = parseInt(options["cur-page"].pageIndex, 10);
                         evtObj.displayLength = options["display-length"];
                         evtObj.totalRecords  = parseInt(options["total-records"], 10);
                         options["change-select"](evtObj);
                     } 
                 }
             };
             paginationThis.select = new Select(selectOpts);
             
             paginationThis.select.$inputText.val(options["display-length"]);
             paginationThis.$leftPanel.append(paginationThis.select.getDom());
        },
        
        /**
         * full_numbers类型，点击分页链接按钮时触发的函数
         */ 
        "_fullNumClickHandler" : function(evt, pageId) {
            var paginationThis = this;
                
            // 判断左减和右增按钮是否已经变灰，如果已经变灰则鼠标点击事件不触发
            var target = $(evt.currentTarget);
            if (paginationThis._isPrevOrNextDisabled(target)) {
                evt.preventDefault();
                return;
            }
            
            paginationThis._curPageChanged(pageId, evt);
        },
        
        /**
         * 根据当前选中页灰化前一页、后一页按钮
         */ 
        "_updateBtnStatus" : function(pageNo) {
            var paginationThis = this;
            var totalPageNum   = paginationThis._calcTotalPageNum() ;
            var currentPage    = parseInt(pageNo, 10);
            
            // 首先，无论next按钮之前是灰化状态还是正常状态，都将next按钮重置为正常状态
            // 然后，如果当前显示页是最后一页，将next按钮灰化，否则，正常显示
            var nextButton = paginationThis._element.find('.tiny-Pagination-Next-Span-Simple') 
                             .removeClass('tiny-Pagination-Next-Span-Disabled');
            if (currentPage == totalPageNum) {
                nextButton.addClass('tiny-Pagination-Next-Span-Disabled');
            }
            
            // 首先，无论previous按钮之前是灰化状态还是正常状态，都将previous按钮重置为正常状态
            // 然后，如果当前显示页是最后一页，将previous按钮灰化，否则，正常显示
            var prevButton = paginationThis._element.find('.tiny-Pagination-Prev-Span-Simple')
                            .removeClass('tiny-Pagination-Prev-Span-Disabled');
            if (currentPage === 1) {
                prevButton.addClass('tiny-Pagination-Prev-Span-Disabled');
            }
            
        },
        
        /**
         * 判断Previous或Next按钮是否已置灰
         */ 
        "_isPrevOrNextDisabled" : function(target) {
            
            if (target.hasClass('tiny-Pagination-Prev-Span-Disabled') ||   
                target.hasClass('tiny-Pagination-Next-Span-Disabled')) {
                return true;
            }
            
            return false;
        },
        
        /**
         * 简单类型插件，点击Previous或Next按钮触发函数
         */ 
        "_simpleClickHandler" : function(evt, text) {
            var paginationThis = this;
            
            // 已经到最后一页或者第一页，点击按钮不做处理
            var target = $(evt.currentTarget);
            if (paginationThis._isPrevOrNextDisabled(target)) {
                return;
            }
            
            // 根据点击按钮类型，重新设置当前显示框中的页码值
            var comboboxInput  = paginationThis.combobox.$inputText;  
            var comboboxValue = parseInt(comboboxInput.val(), 10);  
            var totalPageNum = paginationThis._calcTotalPageNum();
            if (text === language.nextTitleText) {
                comboboxInput.val(++comboboxValue + '/' + totalPageNum);
            } else {
                comboboxInput.val(--comboboxValue + '/' + totalPageNum);
            }
            
            paginationThis.options["cur-page"].pageIndex  = comboboxValue;
            paginationThis._updateBtnStatus(comboboxValue);  
            
            paginationThis._callBack(evt);
        },
        
        /**
         * full_numbers模式下创建中间数字链接按钮
         */
        "_createFullNumLinkButton" : function(pageId){
            var paginationThis = this;
            var lnk = $("<a href = 'javascript:void(0)' class = 'tiny-Pagination-Link-Button' ><span>" + pageId + "</span></a>");
            lnk.on("click", function(evt) { paginationThis._fullNumClickHandler(evt, pageId); });
            
            // 根据要创建的按钮是否是当前显示页，给按钮添加不同类 
            if (pageId == paginationThis.options["cur-page"].pageIndex ) {
                lnk.addClass("tiny-Pagination-Link-Selected");
            } else {
                 lnk.addClass("tiny-Pagination-tiny-button");
            }
            
            paginationThis.$linkPanel.append(lnk);
        },
        
        /**
         * 创建简单模式下中间选择输入框
         */
        "_createSimpleCombox" : function(){
            var paginationThis = this;
            var options = paginationThis.options;
            var pageTotalNum = paginationThis._calcTotalPageNum(); 
            
            paginationThis.combobox = new Combobox({
                "value"  : options["cur-page"].pageIndex  + "/" + pageTotalNum,
                "width"  : "100px",
                "height" : "520px",     //下拉框中显示20个数据的高度
            });
             
            // 下拉框点选时触发事件的绑定
            paginationThis.combobox.on("select" , function(evt) {
                options["cur-page"].pageIndex = parseInt(paginationThis.combobox.getValue(), 10);  
                paginationThis._callBack(evt);
                paginationThis._updateBtnStatus(options["cur-page"].pageIndex );
            });
             
            // 直接输入页码时触发事件的绑定
            paginationThis.combobox.$inputText.off().on("keyup", function(e) {  
                var pageMax = paginationThis._calcTotalPageNum();
                var inputPageNum = parseInt(paginationThis.combobox.getValue(), 10);
                
                //按回退键删除输入框中内容，不做任何处理
                if (e.keyCode === 8) {
                    return;
                }
                
                if (1 <= inputPageNum && inputPageNum <= pageMax) {
                    options["cur-page"].pageIndex  = inputPageNum;
                }
                else if (inputPageNum > pageMax) {
                   options["cur-page"].pageIndex  = pageMax;
                }
                else if (inputPageNum == 0) {
                   options["cur-page"].pageIndex  = 1;
                }
                
                //按下enter键时，输入值生效
                if (e.keyCode === 13) {
                    paginationThis._curPageChanged(options["cur-page"].pageIndex ,e);
                    paginationThis._updateBtnStatus(options["cur-page"].pageIndex);
                    
                }
            });
            
            paginationThis.$linkPanel.append(paginationThis.combobox.getDom());
            $(".tiny-combobox", paginationThis.$linkPanel).addClass("tiny-Pagination-tiny-combobox");  //设置combobox控件右外边距 
        },
        
        /**
         * 创建Next或者Previous按钮
         */
        "_createNextOrPrevious" : function(pageId, appendOpts){
            var paginationThis = this;
            var addclass = '';
            var title = '';
            
            // 根据要创建按钮类型，设置对应属性参数值
            if (appendOpts.text === language.prevTitleText) {
                addclass = 'tiny-Pagination-Prev-Span-Simple tiny-Pagination-Prev-Span';
                title = language.prevTitleText;
            } else {
                addclass = 'tiny-Pagination-Next-Span-Simple tiny-Pagination-Next-Span';
                title = language.nextTitleText;
            }
            
            var lnk = $("<a class='tiny-Pagination-tiny-button " + addclass + "'></a>");
            lnk.attr('href', 'javascript:void(0)');
            
            if(paginationThis.options["type"] == "simple"){
                lnk.bind("click", function(evt) { paginationThis._simpleClickHandler(evt, appendOpts.text); });
            }else{
                lnk.bind("click", function(evt) { paginationThis._fullNumClickHandler(evt, pageId); }); 
            }
            
            if (appendOpts.classes) {
                lnk.addClass(appendOpts.classes);
                lnk.attr('title', title);
            }
            paginationThis.$linkPanel.append(lnk);
        },
        
        /**
         * cur-page合法性校验
         */
        "_validCurPage" : function() {
            var paginationThis = this;
            
            if(!$.isPlainObject(paginationThis.options["cur-page"]) || !paginationThis.options["cur-page"].hasOwnProperty("pageIndex")) {
                paginationThis.options["cur-page"] = {pageIndex : 1};
                return;
            }
            
            if(!parseInt(paginationThis.options["cur-page"].pageIndex)) {
                paginationThis.options["cur-page"] = {pageIndex : 1};
                return;
            }
            
            paginationThis.options["cur-page"].pageIndex = parseInt(paginationThis.options["cur-page"].pageIndex);
        },
        
        /**
         * 生成 "Previous"前一页按钮
         */ 
        "_createPrevButton" : function(){
            var paginationThis = this;
            var pageTotalNum = paginationThis._calcTotalPageNum() ;
            
            paginationThis._validCurPage();
            
            // 当前页与总页数的比较，不能超过总页数
            if (paginationThis.options["cur-page"].pageIndex > pageTotalNum) {
                paginationThis.options["cur-page"].pageIndex = pageTotalNum;
            };
            
            if (paginationThis.options["cur-page"].pageIndex < 1) {
                paginationThis.options["cur-page"].pageIndex = 1;
            };
            
            var curPageNum = paginationThis.options["cur-page"].pageIndex;
            // 正常生成Previous按钮，这里的第一个参数就是当前页减1，对应当前显示页的前一页。
            if (curPageNum > 1) {
                paginationThis._createNextOrPrevious(curPageNum - 1, {
                    text    : language.prevTitleText,
                    classes : "tiny-Pagination-Prev-Span"
                });
                return;
            } 
            
            // 当只有一页或当前页是1时，Previous按钮置灰
            paginationThis._createNextOrPrevious(curPageNum - 1, {
                text : language.prevTitleText,
                classes : "tiny-Pagination-Prev-Span-Disabled"
            });
        },
        
        /**
         * simple模式下的中间选择部分
         */ 
        "_createCombobox" : function(){
            var paginationThis = this;
            var totalPageNum = paginationThis._calcTotalPageNum() ;
            
            paginationThis._createSimpleCombox();      // 创建Combobox控件

            // 设置Combobox控件下拉框菜单
            var pageNumOption = [];
            for (var pageId = 1; pageId <= totalPageNum; pageId++) {
                pageNumOption.push(pageId + '/' + totalPageNum);
            }
            paginationThis.combobox.option("values", pageNumOption);
        },
        
        /**
         * 生成 "Next"下一页按钮
         */ 
        "_createNextButton" : function(){
            var paginationThis = this;
            var PageTotalNum = paginationThis._calcTotalPageNum() ;
            
            // 正常生成Next按钮，这里传入第一个参数是当前页加1，对应当前显示页的后一页
            if (paginationThis.options["cur-page"].pageIndex != PageTotalNum) {
                paginationThis._createNextOrPrevious(paginationThis.options["cur-page"].pageIndex + 1, {
                    text    : language.nextTitleText,
                    classes : "tiny-Pagination-Next-Span"
                });
                return;
            } 
            
            // 当前页是最后一页时，Next按钮置灰
            paginationThis._createNextOrPrevious(paginationThis.options["cur-page"].pageIndex + 1, {
                text : language.nextTitleText,
                classes : "tiny-Pagination-Next-Span-Disabled"
            });
        },
        
        /**
         * full_numbers模式下创建中间数字链接按钮
         */
        "_createFullNumMidbuttons" :function(){
            var paginationThis = this;
            var startAndEndPage = paginationThis._getInterval();  //获得显示的起始和结束页
            var PageTotalNum = paginationThis._calcTotalPageNum() ;
            
            // 只有一页的情况
            if (1 == PageTotalNum) {
                paginationThis._createFullNumLinkButton(1);
                paginationThis.options["cur-page"].pageIndex = 1;
                return;
            }
            
            var ellipseTextHtml = '<span class="tiny-Pagination-Ellipse-Text">...</span>';  //省略号文本
            // 当总页数大于8，并且中间连续按钮的起始位置没有和第一页相连时，创建第一页按钮和省略号 
            if (startAndEndPage[0] > 2 && PageTotalNum > 8) {
                paginationThis._createFullNumLinkButton(1);
                $(ellipseTextHtml).appendTo(paginationThis.$linkPanel);
            }
            
            // 创建中间页按钮
            for (var i = startAndEndPage[0]; i <= startAndEndPage[1]; i++) {
                paginationThis._createFullNumLinkButton(i);
            }

            // 当总页数大于8，并且中间连续按钮的结束位置没有和最后一页按钮相连时，创建省略号和最后页按钮
            if (startAndEndPage[1] < PageTotalNum && PageTotalNum > 8) {
                $(ellipseTextHtml).appendTo(paginationThis.$linkPanel);
                paginationThis._createFullNumLinkButton(PageTotalNum);
            }
        },
        
        /**
         * 生成 "GoTo"部分
         */ 
        "_createGotoPanel" : function(){
            var paginationThis = this;
            
            paginationThis.$goToPanel.empty();
            
            // 生成“Go”文本
            var gotoTextHtml = $('<span id="tiny-Pagination-goToTitle">' + language.gotoTitleText + '</span>');
            paginationThis.$goToPanel.append(gotoTextHtml);
            
            // 生成页数输入框
            paginationThis.inputBox = $('<input class="tiny-Pagination-Goto-Input-Text" type="text"/>');
            paginationThis.inputBox.val(paginationThis.options["cur-page"].pageIndex);
            paginationThis.$goToPanel.append(paginationThis.inputBox);
            
            // 生成跳转按钮
            paginationThis.inputButton = $(gotoTemplate);
            paginationThis.inputButton.attr('title', language.gotoTitleText);
            paginationThis.$goToPanel.append(paginationThis.inputButton);
        
            // 如果只有一页，则隐藏goToPanel
            var PageTotalNum = paginationThis._calcTotalPageNum();
            if (PageTotalNum === 1) {
                paginationThis.$goToPanel.hide();
            } else {
                paginationThis.$goToPanel.show();
            }
            
            // goto部分事件绑定
            paginationThis._addGotoBehaviors();
        },
        
        /**
         * 设置每页显示消息条数
         */
        "_addGotoBehaviors" : function() {
            var paginationThis = this;
            var options = paginationThis.options;
             // 输入跳转页数和Enter键的触发事件
            paginationThis.inputBox.on('keyup', function(e) {
                
                //按回退键删除输入框中内容，不做任何处理
                if (e.keyCode === 8) {
                    return;
                }
                
                var inputPage = $(this).val();
                var inputPageNum = parseInt(inputPage, 10);
                var pageMax = paginationThis._calcTotalPageNum();
                
                if (1 <= inputPageNum && inputPageNum <= pageMax) {
                    options["cur-page"].pageIndex  = inputPageNum;
                }
                else if (inputPageNum > pageMax) {
                   options["cur-page"].pageIndex  = pageMax;
                   $(this).val("" +pageMax);
                }
                else if (inputPageNum == 0) {
                   options["cur-page"].pageIndex  = 1;
                }
                
                // 按下enter键
                if (e.keyCode === 13) {
                    paginationThis._curPageChanged(options["cur-page"].pageIndex, e);
                }
            });
            
            // 点击跳页按钮的触发事件
            paginationThis.inputButton.bind('click', function(e) {
                var inputPageNum = paginationThis.inputBox.val();
                var page = parseInt(inputPageNum, 10);
                
                // 输入框中内容为空、输入框值为非数字(当直接给输入框中用鼠标粘贴字符时)
                if (!inputPageNum || !page) {    
                    paginationThis.inputBox.val(paginationThis.options["cur-page"].pageIndex);
                    return;
                }

                paginationThis._curPageChanged(page, e);
            });
        }
        
    });

    return Pagination;
});
