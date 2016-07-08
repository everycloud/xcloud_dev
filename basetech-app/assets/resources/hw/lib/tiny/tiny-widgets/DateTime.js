define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/jquery-ui-datepicker", "tiny-widgets/Widget", "tiny-widgets/Tip", 
"language/widgetsLanguage"], 
function(angular, jQuery, $ui, Widget, Tip, widgetsLanguage) {    
    var DEFAULT_CONFIG = {
        "ampm" :　false,
        "showClear" : true,
        "timeFormat" : 'hh:mm',
        "dateFormat" : widgetsLanguage.regional.dateFormat,        
        "type" :　'datetime',
        "template" :
        '<div class="tiny-datetime-enableclass">'
        +'<input type="text" class="tiny-datetime-input" readonly="true"/>'
        +'</div>'
    };
    
    var DateTimeChooser = Widget.extend({
        "init" : function(options) {
            var DTChooserThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            DTChooserThis._super(options);
            DTChooserThis._updateType(options.type);
            if("time" === options.type) {
                options = _.extend({}, options, {defaultTime : new Date()});
            }
            DTChooserThis._setOptions(options);
            
            //为不同类型的时间日期添加不同的事件
            if ( "datetime" == options["type"]) {
                DTChooserThis._dateTimeBehavior();
            }
            if("time" == options["type"]) {
                DTChooserThis._timeBehavior();
            }
            $("#" + options["id"]).append(DTChooserThis._element);
        },
        
        "_setOption" : function(key, value) {
            var DTChooserThis = this;
            DTChooserThis._super(key, value);
            switch (key) {
                case "defaultDate":
                    DTChooserThis._updateDate(value);
                    break;
                case "defaultTime":
                    DTChooserThis._updateTime(value);
                    break;                    
                case "minDate":
                    DTChooserThis._updateMinDateTime(value);
                    break;
                case "maxDate":
                    DTChooserThis._updateMaxDateTime(value);
                    break;                
                case "disable":
                    DTChooserThis._updateDisable(value);
                    break;    
                default:
                    break;
            }
        },
        
        //日期公共参数配置(包括datePicker参数和国际化资源)
        "_getDateConfig" : function() {
            var DTChooserThis = this;
            var options = DTChooserThis.options;
            var dateOptions = {
               buttonImageOnly: true,
               buttonImage: "../themes/default/images/space.gif",
               changeMonth: true,
               changeYear: true,
               dateFormat: options.dateFormat,
               ampm : options.ampm,
               showAnim: "show",
               showOtherMonths: true,
               selectOtherMonths: false,
               isTimeVisible : false,
               showOn : 'both',
               showClear : options.showClear,
               onClose : function(date) {
                   DTChooserThis._element.trigger("onClose", [date]);
               },
                
               //中英文设置
               okBtn : widgetsLanguage.regional.okBtn,
               closeText : widgetsLanguage.regional.closeText,
               prevText : widgetsLanguage.regional.prevText,
               nextText : widgetsLanguage.regional.nextText,
               currentText : widgetsLanguage.regional.currentText,
               monthNames : widgetsLanguage.regional.monthNames,
               monthNamesShort : widgetsLanguage.regional.monthNamesShort,
               dayNames : widgetsLanguage.regional.dayNames,
               dayNamesShort : widgetsLanguage.regional.dayNamesShort,
               dayNamesMin : widgetsLanguage.regional.dayNamesMin,
               weekHeader : widgetsLanguage.regional.weekHeader,
               firstDay : (options.firstDay === void 0) ? widgetsLanguage.regional.firstDay : options.firstDay,
               isRTL : widgetsLanguage.regional.isRTL,
               showMonthAfterYear : widgetsLanguage.regional.showMonthAfterYear,
               yearSuffix : widgetsLanguage.regional.yearSuffix,
               monthSuffix : widgetsLanguage.regional.monthSuffix
            };
            return dateOptions;
        },
        
        //时间参数配置
        "_getTimeConfig" : function() {    
            var DTChooserThis = this, options = DTChooserThis.options,
            editorTimeValue = DTChooserThis._setDefaultTime(options.defaultTime);
            var timeOptions = {
                isTimeVisible : true,
                timeFormatArray : options.timeFormat.split(':'),
                HOURS : DTChooserThis.HOURS,
                MINU : DTChooserThis.MINU,
                SECS : DTChooserThis.SECS,
                MSECS : DTChooserThis.MSECS,
                AMPM : DTChooserThis.AMPM,
                defaultTimeValue : editorTimeValue,
                onSelectTimeUp : function(inputElement) { 
                    DTChooserThis.focusInput = $(inputElement); 
                    DTChooserThis._changeValue("UP");
                },
                onSelectTimeDown : function(inputElement) {
                    DTChooserThis.focusInput = $(inputElement); 
                    DTChooserThis._changeValue("DOWN");
                },
                
                //最大最小值检测函数调用（用户改变时间日期时调用）
                onDateTimeRestict : function() {
                    DTChooserThis._dateTimeRestict();
                }
            };
            return timeOptions;
        },
        
        "_dateTimeRestict" : function() {
            var DTChooserThis = this, options = DTChooserThis.options; 
            
            if(options.maxDate) {
                DTChooserThis._setMaxDateTime(options.maxDate);
            }
            if(options.minDate) {
                DTChooserThis._setMinDateTime(options.minDate);
            }
        },
        
        //该部分的更新依赖于dateFormat/timeFormat/ampm/onClose事件
        "_updateType" :　function(type) {
            var DTChooserThis = this, options = DTChooserThis.options; 
            
            //onClose event
            if("date" == type){
               DTChooserThis.$selectedInput = DTChooserThis._element.find("input");
               DTChooserThis._element.on("onClose", function(event, date) {
                   if ("function" == ( typeof options["onClose"])) {
                       options["onClose"](date);
                   }
               });
               var datepickerConfig = DTChooserThis._getDateConfig();
               DTChooserThis.$selectedInput.datepicker(datepickerConfig);
                      
               //宽度设置
               DTChooserThis._setDateTimeWidth(options.width || 110);
            }
         
           //时间显示方式
           if("time" == type) {
              DTChooserThis._timeHtmlFactory();
              DTChooserThis._element.widget(DTChooserThis);
              DTChooserThis.$selectedInput = DTChooserThis._element.find("input");
              
              //宽度设置
              DTChooserThis._setTimeWidth(options.width || 118);
           }
        
          //时间日期显示方式
          if("datetime" == type) {
            DTChooserThis.$selectedInput = DTChooserThis._element.find("input");
            
            //初始时间设置
            var dateTimeConfig = $.extend({}, DTChooserThis._getDateConfig(), DTChooserThis._getTimeConfig()); 
            DTChooserThis.$selectedInput.datepicker(dateTimeConfig);
            DTChooserThis.pickerWidget = DTChooserThis._element.find("input").datepicker( "widget" );         
          
            //宽度设置
            DTChooserThis._setDateTimeWidth(options.width || 175);
         }
     },
    
     //清空输入框中内容(用于非时间方式,时间方式可通过设置defaultTime为空方式清空)
     "empty" : function() {
        var DTChooserThis = this, options = DTChooserThis.options;
        
        //date/dateTime
        if("time" !== options.type) {
            DTChooserThis.$selectedInput.val("");
        }        
    },
   
//设置最大/最小日期时间开始   
    "_updateMinDateTime"　: function(value) {
        var DTChooserThis = this, type = DTChooserThis.options.type;
        if("datetime" === type) {
            DTChooserThis.setMinDateTime(value);
        }
        if("date" === type) {
            DTChooserThis.setMinDate(value);
        }
        if("time" === type) {
            DTChooserThis.setMinTime(value);
        }
    }, 
   
    "_updateMaxDateTime" : function(value) {
        var DTChooserThis = this, type = DTChooserThis.options.type;
        if("datetime" === type) {
            DTChooserThis.setMaxDateTime(value);
        }
        if("date" === type) {
            DTChooserThis.setMaxDate(value);
        }
        if("time" === type) {
            DTChooserThis.setMaxTime(value);
        }
    },
    
    //设置该解析值,用于在jQueryUIdatePicker中设置边界时间
    //设置最大解析值
    "_getMaxParseTime" : function() {
        this.$selectedInput[0].MAXHOURS = this.HOURS;
        this.$selectedInput[0].MAXMINU = this.MINU;
        this.$selectedInput[0].MAXSECS = this.SECS;
        this.$selectedInput[0].MAXMSECS = this.MSECS;
        this.$selectedInput[0].MAXAMPM = this.AMPM;
    },
    
    //设置最小解析值
    "_getMinParseTime" : function() {
        this.$selectedInput[0].MINHOURS = this.HOURS;
        this.$selectedInput[0].MINMINU = this.MINU;
        this.$selectedInput[0].MINSECS = this.SECS;
        this.$selectedInput[0].MINMSECS = this.MSECS;
        this.$selectedInput[0].MINAMPM = this.AMPM;
    },
    
    //设置最大日期&&时间
    "setMaxDateTime" : function(maxDateTime) {
        this.$selectedInput.datepicker( "option", "maxDate", maxDateTime); 
        var dateObj = new Date(maxDateTime);
        this.$selectedInput[0].minMaxDate = $.datepicker.formatDate(this.options.dateFormat, dateObj);
        this.$selectedInput[0].maxDateTime = dateObj;
        this._parseTimeValue(maxDateTime);
        this._getMaxParseTime();        
        this._setMaxDateTime(maxDateTime);         
    },
    
    //设置最小日期时间--时间
    "_setMaxDateTime" : function(maxDateTime) {
        var DTChooserThis = this;       
        DTChooserThis.options.maxDateTime = maxDateTime;           
        DTChooserThis.$selectedInput[0].timeSetting = false;
        if(Date.parse(DTChooserThis.$selectedInput.val()) > Date.parse(maxDateTime)) {
            DTChooserThis._updateTime(maxDateTime);            
            DTChooserThis.$selectedInput[0].timeSetting = true;
        };    
    },
    
    //设置最小日期&&时间
    "setMinDateTime" : function(minDateTime) {
        this.$selectedInput.datepicker( "option", "minDate", minDateTime); 
        var dateObj = new Date(minDateTime);
        this.$selectedInput[0].minMaxDate = $.datepicker.formatDate(this.options.dateFormat, dateObj);
        this.$selectedInput[0].minDateTime = dateObj;
        this._parseTimeValue(minDateTime);
        this._getMinParseTime();  
        this._setMinDateTime(minDateTime);       
    },
    
    //设置最小日期时间--时间
    "_setMinDateTime" : function(minDateTime) {
        var DTChooserThis = this;       
        DTChooserThis.options.minDate = minDateTime;           
        DTChooserThis.$selectedInput[0].timeSetting = false;
        if(Date.parse(DTChooserThis.$selectedInput.val()) < Date.parse(minDateTime)) {
            DTChooserThis._updateTime(minDateTime);            
            DTChooserThis.$selectedInput[0].timeSetting = true;
        };    
    },
    
    //设置最大时间
    "setMaxTime" : function(maxTime) {
        this.options.maxDate = maxTime;
        if(this._checkMaxTime(this.editorValue, maxTime)) {
            this._updateTime(maxTime);
        }
    },
    
    //设置最小时间
    "setMinTime" : function(minTime) {
        this.options.minDate = minTime;
        if(this._checkMinTime(this.editorValue, minTime)) {
            this._updateTime(minTime);
        }
    }, 
      
    //检测最大时间
    "_checkMaxTime" : function(currTime, maxTime) {
        var dateStr = "2014/03/26",
        currDateTime = dateStr + " " + currTime,
        maxDateTime = dateStr + " " +maxTime;
        if(Date.parse(currDateTime) >= Date.parse(maxDateTime)) {
            return true;
        }
    },
    
    //检测最小时间
    "_checkMinTime" : function(currTime, minTime) {
        var dateStr = "2014/03/26",
        currDateTime = dateStr + " " +currTime,
        minDateTime = dateStr + " " +minTime;
        if(Date.parse(currDateTime) < Date.parse(minDateTime)) {
            return true;
        }
    },
    //设置最大日期
    "setMaxDate" : function(maxDate) {
        this.$selectedInput.datepicker( "option", "maxDate", maxDate);
    },
    
    //设置最小日期
    "setMinDate" : function(minDate) {
        this.$selectedInput.datepicker( "option", "minDate", minDate);
    },       
 //设置最大/最小日期时间结束
    
 //disable状态设置
    "_updateDisable" : function(disable) {
        var DTChooserThis = this;
        if(String(disable) === "true"){
            DTChooserThis.$selectedInput.attr("disabled",true);
            DTChooserThis._element.addClass("tiny-datetime-container-disable");
            DTChooserThis.options.disable = true;
            DTChooserThis.$selectedInput[0].disable = true;
            if("time" == DTChooserThis.options.type) {
                DTChooserThis._element.find(".tiny-time-editor input").prop("disabled", true);
            }
        }
        else{
            DTChooserThis.$selectedInput.attr("disabled",false);
            DTChooserThis._element.removeClass("tiny-datetime-container-disable");
            DTChooserThis.options.disable = false;
            DTChooserThis.$selectedInput[0].disable = false;
            if("time" == DTChooserThis.options.type) {
                DTChooserThis._element.find(".tiny-time-editor input").prop("disabled", false);
            }
        }        
    },

 //设置日期时间开始  
    //设置日期接口
    "_updateDate" : function(dateValue) {
        var DTChooserThis = this, options = DTChooserThis.options;
        
        //date
        if("date" === options.type) {
            DTChooserThis._setDate(dateValue);
        }
        
        //time
        if("datetime" === options.type) {
            
            //设置日期    
            var date = DTChooserThis._getDefaultDate(dateValue);
            DTChooserThis.$selectedInput[0].dateStr = date;
            if(void 0 === DTChooserThis.editorValue) {
                //设置时间
                DTChooserThis._setDefaultTime(options.defaultTime);
                var time = DTChooserThis._setInputsTime();
            
                //改变editorValue
                DTChooserThis.editorValue = time;
                DTChooserThis.$selectedInput[0].timeValue = time;
            } else {
                
                //获取此时时间
                var time = DTChooserThis.editorValue;
            }            
            
            //设置在时间日历框中的时间
            DTChooserThis.$selectedInput.val(date+" "+time);
        } 
    },
    
    //设置时间接口
    "_updateTime" : function(timeValue) {
        var DTChooserThis = this, options = DTChooserThis.options;
        //time
        if("time" === options.type) {
            DTChooserThis._setTime(timeValue);
        }
        
        //dateTime
        if("datetime" === options.type) {
            
            //获取当前日期 /默认时间         
            var date = DTChooserThis.$selectedInput[0].dateStr ||
             $.datepicker.formatDate(options["dateFormat"], DTChooserThis.defaultDate||new Date());        
            
            //设置时间
            DTChooserThis._setDefaultTime(timeValue);
            var time = DTChooserThis._setInputsTime(timeValue);
            
            //改变editorValue
            DTChooserThis.editorValue = time;
            DTChooserThis.$selectedInput[0].timeValue = time;
            DTChooserThis.$selectedInput.val(date+" "+time);
        }
    },
    
    //设置日期
    "_setDate" : function(value) {
        var DTChooserThis = this;
        var date = DTChooserThis._getDefaultDate(value);
           
        //如果有默认日期时，在input中显示该日期
        DTChooserThis.$selectedInput.val(date);
    },
    
    //设置时间
    "_setTime" : function(value) {
        var DTChooserThis = this;
        DTChooserThis._setTimeValue(value);
        var $timeEditor = DTChooserThis._element.find(".tiny-time-editor");
        $timeEditor.children().remove();
        $timeEditor.prepend(DTChooserThis.octet_html);             
    },
 //设置日期时间结束   
     
    //带日期方式时间日期宽度设置
    "_setDateTimeWidth" : function(value) {
        var DTChooserThis = this;
        var width = parseInt(value, 10);
        if(isNaN(width)) {
            return;
        } else {
            DTChooserThis._element.filter(".tiny-datetime-enableclass").width(width+"px");
            DTChooserThis._element.find(".tiny-datetime-input").width(width-30+"px");
        }
        
    },
    
    //时间方式宽度设置
    "_setTimeWidth" : function(value) {
        var DTChooserThis = this;
        var width = parseInt(value, 10);
        if(isNaN(width)) {
            return;
        } else {
            DTChooserThis._element.filter(".tiny-timet-container").width(width+"px");
            DTChooserThis._element.find(".tiny-time-editor").width(width-18+"px");
        }
    },
    
    "_timeHtmlFactory" : function() {
        var DTChooserThis = this;
        var elementContent = $('<div class="tiny-timet-container">'
        +'<input type="text" class="tiny-datetime-input" style="display:none;"/>'
        +'<div class="tiny-time-editor"></div>'
        +'<div id="time_button_up" class="tiny-time-upbtn tiny-time-updownbutt-style"></div>'
        +'<div id="time_button_down" class="tiny-time-downbtn tiny-time-updownbutt-style"></div>'
        +'</div>');
        DTChooserThis._element = elementContent;
    },
    
    "_dateTimeBehavior" :　function() {
        var DTChooserThis = this, options = DTChooserThis.options;
        DTChooserThis._element.on("onClose", function(event, date) {
            if ("function" == ( typeof options["onClose"])) {
                options["onClose"](date);
            }
        });
        
        //OK按钮的hover效果
        DTChooserThis.pickerWidget.on("mouseover", ".tiny-button-buttonClass", function() {
             $(this).addClass("tiny-button-hover");
        });
        DTChooserThis.pickerWidget.on("mouseout", ".tiny-button-buttonClass", function() {
            $(this).removeClass("tiny-button-hover");
            $(this).removeClass("tiny-button-active");
        });
        DTChooserThis.pickerWidget.on("mousedown", ".tiny-button-buttonClass", function() {
             $(this).removeClass("tiny-button-hover").addClass("tiny-button-active");
        });
        DTChooserThis.pickerWidget.on("mouseup", ".tiny-button-buttonClass", function() {
            $(this).removeClass("tiny-button-active");
        });
    },
    
    "_eventPrevent" : function(evt) {
                
        // If preventDefault exists, run it on the original event
        if ( evt.preventDefault ) {
            evt.preventDefault();

        // Support: IE
        // Otherwise set the returnValue property of the original event to false
        } else {
            evt.returnValue = false;
        }
    },
    
    "_eventStop" : function(evt) {
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    },
    
    "_timeBehavior" : function() {
        var DTChooserThis = this;
        var options = DTChooserThis.options;
        
        //时间输入框的焦点捕获事件
        DTChooserThis._element.on("focus", ".tiny-time-input", function(evt) {
           DTChooserThis.focusInput = $(this);           
        });
        
        //键盘事件——上下键调节时间
        DTChooserThis._element.on("keydown", ".tiny-time-input", function(evt) {
            //输入有效性验证
            if (!DTChooserThis._isValidKey(evt)) {
            	//中文输入情况下，keydown事件中值已填入，因此需要先做字符转化的处理
            	this.value = this.value.replace(/\D/g,'');
                DTChooserThis._eventPrevent(evt);
            };
            
            //输入数字个数限制
            if (((evt.keyCode >= 48) && (evt.keyCode <= 57)) || 
               ((evt.keyCode >= 96) && (evt.keyCode <= 105))) {
                   var inputLength = $(this).val().length;
                   var format = $(this).attr("format");
                   var maxLength = 2;
                   
                   //IE
                   if (document.selection) { 
                    var sel = document.selection.createRange(); 
                    if (sel.text.length > 0) { 
                        return;
                    } 
                }   
                
                //标准浏览器
                   if($(this)[0].selectionEnd !== $(this)[0].selectionStart) {
                       return;
                   }
                if("SSS" === format) {
                    maxLength = 3;
                } 
                if(maxLength === inputLength) {
                    DTChooserThis._eventPrevent(evt);
                }
            }
            if(38 == evt.keyCode){//向上键
                DTChooserThis._eventPrevent(evt);
                DTChooserThis._eventStop(evt);
                DTChooserThis._changeValue("UP");
                DTChooserThis.lastInputTime = DTChooserThis.editorValue;
                DTChooserThis.focusInput.select();
            }
            if(40 == evt.keyCode){//向下键
                DTChooserThis._eventPrevent(evt);
                DTChooserThis._eventStop(evt);
                DTChooserThis._changeValue("DOWN");
                DTChooserThis.lastInputTime = DTChooserThis.editorValue;
                DTChooserThis.focusInput.select();
            }
            if(9 == evt.keyCode){//TAB
                DTChooserThis._eventPrevent(evt);
                DTChooserThis._eventStop(evt);
                DTChooserThis._tabRange();
                DTChooserThis.focusInput.select();
            }
        });
        
        //鼠标右键粘贴/拖拽粘贴内容情况下统一时间
        DTChooserThis._element.on("blur", ".tiny-time-input", function(evt) {
            //输入数字大小限制
            var format = $(this).attr("format");
            var maxNum = $(this).attr("maxNum");
            if(maxNum !== "PM") {
                var inputNum = parseInt($(this).val(), 10);
                maxNum = parseInt($(this).attr("maxNum"), 10);
                if(isNaN(inputNum) || (inputNum > maxNum)) {
                    inputNum = maxNum;
                } else if((12 === maxNum)&&(inputNum === 0)) {
                    inputNum = 1;
                }
            }
            var value = DTChooserThis._formatTime(format,inputNum+"");
            $(this).val(value);    
            
            //设置输入框中时间
            DTChooserThis._conformTime();
        });
        
        //点击上下调节时间按钮事件
        DTChooserThis._element.on("click", "#time_button_down", function() {
            if(String(options["disable"]) === "true"){
                return;
            }
            DTChooserThis._changeValue("DOWN");
            DTChooserThis.lastInputTime = DTChooserThis.editorValue;
            DTChooserThis.focusInput.select();
        });
        
        DTChooserThis._element.on("click", "#time_button_up", function() {
            if(String(options["disable"]) === "true"){
                return;
            }
            DTChooserThis._changeValue("UP");
            DTChooserThis.lastInputTime = DTChooserThis.editorValue;
            DTChooserThis.focusInput.select();
        }); 
    },
    
    "_isValidKey" : function(e) {
        var valid = [
            8,        // backspace
            9,        //tab
            13,       // enter
            27,       // escape
            35,       // end
            36,       // home
            37,       // left arrow
            39,       // right arrow
            46,       // delete
            38,       // up Arrow
            40,       // down Arrow
            48, 96,   // 0
            49, 97,   // 1
            50, 98,   // 2
            51, 99,   // 3
            52, 100,  // 4
            53, 101,  // 5
            54, 102,  // 6
            55, 103,  // 7
            56, 104,  // 8
            57, 105,  // 9
        ];
        for (var i = 0, c; c = valid[i]; i++) {
            if (e.keyCode == c) return true;
        }
        return false;
    },    
    
    "_setTimeValue" : function(value) {
        var DTChooserThis = this;
        DTChooserThis._setDefaultTime(value);
        
        //将时间填入各个input框中
        value = DTChooserThis._setInputsTime();
        DTChooserThis.editorValue = value;  
        DTChooserThis.$selectedInput[0].timeValue = value;      
        DTChooserThis.$selectedInput.val(value);
        DTChooserThis.lastInputTime = DTChooserThis.editorValue;
    },
    
    //默认日期设置
    "_getDefaultDate" :　function(value) {
        var DTChooserThis = this;
        var options = DTChooserThis.options;
        
        //默认时间处理
        var defaultDate = value || new Date();
        DTChooserThis._setDefaultDate(defaultDate);//设定默认日期
        if (!DTChooserThis.defaultDate) {//如果输入默认日期不合法
            DTChooserThis.defaultDate = new Date();
        }
        var date = $.datepicker.formatDate(options["dateFormat"], DTChooserThis.defaultDate);
        DTChooserThis.date = date;
        return date;
    },
    
    //时间日期有效性判断
    "_validateDT" : function(isInputField) {
        var DTChooserThis = this;
        var options = DTChooserThis.options;
        var datetimeRegExp = null;
        if(isInputField) {
            if( "datetime" == options["type"] ) {
                datetimeRegExp = DTChooserThis._getDateRegExp() + "[\\s]" +
                DTChooserThis._getTimeRegExp();
            }
            if( "date" == options["type"] ) {
                datetimeRegExp = DTChooserThis._getDateRegExp(); 
            }
            if( "time" == options["type"] ) {
                datetimeRegExp = DTChooserThis._getTimeRegExp(); 
            }
        } else {
            datetimeRegExp = "^" + DTChooserThis._getTimeRegExp(); 
        }
        datetimeRegExp = new RegExp(datetimeRegExp);
        var msg = "";
        if(options["ampm"])
        {
            msg += " AM/PM";
        }
        var isValid = DTChooserThis._validate(datetimeRegExp, msg, isInputField);
        return isValid;
    },
    
    //日期校验表达式
    "_getDateRegExp" : function() {
        var DTChooserThis = this,
        options = DTChooserThis.options,
        exp = "^",i, temp,
        dformat = options["dateFormat"],
        seprator = dformat.toLowerCase().match(/[^a-z]/)[0],
        dformatsplit = dformat.split(seprator);
        for(var i =0; i<3; i++)
        {
            if('yyyy' == dformatsplit[i]) {
                exp += "(19|20)\\d\\d[" + seprator + "]";
            }
            if('yy' == dformatsplit[i]) {
                exp += "(19|20)\\d\\d[" + seprator + "]";
            }
            if('mm' == dformatsplit[i]) {
                exp += "(0[1-9]|1[012])[" + seprator + "]";
            }
            if('m' == dformatsplit[i]) {
                exp += "([1-9]|1[012])[" + seprator + "]";
            }
             if('dd' == dformatsplit[i]) {
                exp += "(0[1-9]|[12][0-9]|3[01])[" + seprator +
                "]";
            }
            if('d' == dformatsplit[i]) {
                exp += "([1-9]|[12][0-9]|3[01])[" + seprator +
                "]";
            }
        }
        exp = exp.substring(0, exp.length-3);
        return exp;
    },
    
    "_getTimeRegExp" : function()
    {
        var DTChooserThis = this;
        var options = DTChooserThis.options;
        var tformat = options["timeFormat"],exp;
        var tformatsplit = tformat.split(":");
        if('hh' == tformatsplit[0]) {
            if(options["ampm"]) {
                exp = "([0][1-9]|[1][012])[:]";
            } else {
                 exp = "([0-1]\\d|[2][0-3])[:]";
            }
        } else {
            if(options["ampm"]) {
                exp = "([1-9]|[1][12])[:]";
            } else
            {
               exp = "(\\d|[1]\\d|[2][0-3])[:]";
            }
        }
        if('mm' == tformatsplit[1]) {
            exp += "([0-5]\\d)";
        } else {
             exp += "(\\d|[1-5]\\d)";
        }
        if(tformatsplit.length >= 3) {
            if('ss' == tformatsplit[2]) {
                exp += "[:]([0-5]\\d)";
            } else {
                exp += "[:](\\d|[1-5]\\d)";
            }
        }
        if( (4 == tformatsplit.length)  &&
            ( 'l' == tformatsplit[3] )) {
            exp += "[:]([0-9][0-9][0-9])";
        }
        if(options["ampm"]) {
            exp += "[\\s](AM|PM)$"; 
        } else {
            exp += "$"; 
        }
        return exp;
    },
        
    "getDateTime" :　function() {
        var DTChooserThis = this;
        if("time" === DTChooserThis.options.type) {
            var dateTime = DTChooserThis.editorValue;
        } else {
            var dateTime = DTChooserThis.$selectedInput.val();
        }        
        return dateTime;
    },
    
    //设置默认日期
    "_setDefaultDate" : function(defaultDate) {
        var DTChooserThis = this;
        var options = DTChooserThis.options;
        if (defaultDate instanceof Date) {
             DTChooserThis.defaultDate = defaultDate;
             return;
        }
        if( 'time' == options["type"] ) {
            return;
        }
        var defaultDateArray = defaultDate.toString().split(' ');
        try
        {
            DTChooserThis.defaultDate = $.datepicker.parseDate(
            options["dateFormat"], defaultDateArray[0]);
        }
        catch(e)
        {
        }
    },
    
    //时间显示
    "_setDefaultTime" : function(value) {
        var DTChooserThis = this;
        
        //对默认时间进行取值，得到标准时间格式1.如果没有默认时间，取今天；2.如果有，解析
        var defaultDateTime = DTChooserThis._getDefaultTime(value);
        
        //根据设置的时间格式转化时间
        DTChooserThis._parseTimeValue(defaultDateTime);
        return defaultDateTime;
    },
    
    "_getDefaultTime" : function(time) {
        var DTChooserThis = this;
        
        //如果日期时间未定义,定义
        if(void 0 === time) {
            var defaultTime = new Date();
        } else {
            
            //将该时间字符串转换为日期对象,如果有效,说明正确;如果无效,加日期字符串继续转换
            var defaultTime = new Date(time); 
            if(defaultTime == "Invalid Date") {
            	//defaultTime 为  "16"形式
            	if(1 == time.split(":").length) {
            		time = time+":00";
            	}
                defaultTime = new Date("2014/03/26"+" "+time);
            }
        }
        return defaultTime;
    },
    
    "_formatTime" : function(format, inputNum) {
        var value;
        if("AMPM" === format) {
            if(("AM" !== inputNum) && ("PM" !== inputNum)){
                value = "AM";
            } else{
                value = inputNum;
            }
        } else if("H" === format) {
            value = inputNum;
        } else if("SSS" === format) {
            value = inputNum.length < 2 ? ("00" + inputNum) : inputNum.length < 3 ? (
                                "0" + inputNum) : inputNum;
        } else {
            value = inputNum.length <2 ? ("0" + inputNum) : inputNum;
        }
        return value;
    },
    
    //分解时间,并确定小时、分钟等
    "_parseTimeValue" : function(dateTimeValue) {
        var DTChooserThis = this;
        dateTimeValue = new Date(dateTimeValue);
        var hour =  dateTimeValue.getHours(), 
        minutes = dateTimeValue.getMinutes(),
        seconds = dateTimeValue.getSeconds(),
        milliSeconds = dateTimeValue.getMilliseconds(),
        isAmpm = DTChooserThis.options["ampm"];           
        
        //将小时转化为AMPM形式
        if(isAmpm)
        {
            var dd = 'AM';
            if(hour > 12) {
                hour = hour - 12;
                dd = 'PM';
            }
            if(hour == 12) {
                dd = 'PM';
            }
            if(hour == 0) {
                hour = 12;
            }
        }
        
        DTChooserThis.HOURS = parseInt(hour, 10);
        DTChooserThis.MINU = parseInt(minutes, 10);
        DTChooserThis.SECS = parseInt(seconds, 10);
        DTChooserThis.MSECS = parseInt(milliSeconds, 10);
        DTChooserThis.AMPM = dd;
    },
    
    "_parseTime" : function(date)
    {
        var isAmpm = false;
        var ddt = date.split(' ');
        var dateseprator = '';
        ddtlength = ddt.length;
        if( 3 === ddtlength ) {
            isAmpm = true;
            dateseprator = ddt[1]
        }
        else if(ddtlength == 2) {
            if( ('AM' == ddt[1].toUpperCase()) ||
                ('PM' == ddt[1].toUpperCase()) ) {
                isAmpm = true;
                dateseprator = ddt[0]
            } else {
                dateseprator = ddt[1]
            }
        } else {
            dateseprator = ddt[0]
        }
        dt = dateseprator.split(':');
        var dh = (typeof dt[0] === 'undefined') ? 0 : dt[0];
        var dmin = (typeof dt[1] === 'undefined') ? 0 : dt[1];
        var dsec = (typeof dt[2] === 'undefined') ? 0 : dt[2];
        var dms = (typeof dt[3] === 'undefined') ? 0 : dt[3];
        if(isAmpm) {
            return dh + ':' + dmin + ':' + dsec + ':' + dms + " " +
            ddt[ddtlength-1];
        } else {
            return dh + ':' + dmin + ':' + dsec + ':' + dms;
        }
    },
    
     "_setInputsTime" : function() {
        var DTChooserThis = this, options = DTChooserThis.options,
        TimeFormatArray = options["timeFormat"].split(':'),
        octets = [],maxHour = 23;        
        DTChooserThis.timeInputLength = TimeFormatArray.length;
        //设置最大小时数
        if(options["ampm"]) {
            maxHour = 12;
            DTChooserThis.timeInputLength += 1; 
        }
        
        //拼装时间微调框的DOM
        //小时 HH
        if( 2 == TimeFormatArray[0].length ) {
            DTChooserThis.HOURS = DTChooserThis.HOURS < 10 ? ("0" + DTChooserThis.HOURS) : DTChooserThis.HOURS;
            octets.push('<input type="text" class="tiny-time-input" format = "HH" maxNum = "' + maxHour + '" value="' + DTChooserThis.HOURS + '"/>');
        }
        
        //小时 H
        if( 1 == TimeFormatArray[0].length ) {
            octets.push('<input type="text" class="tiny-time-input" format = "H" maxNum = "' + maxHour + '" value="' + DTChooserThis.HOURS + '"/>');
        }
        
        //如果有分钟 MM
        if((TimeFormatArray.length >= 2) && (2 == TimeFormatArray[1].length) ) {
            DTChooserThis.MINU = DTChooserThis.MINU < 10 ? ("0" + DTChooserThis.MINU) : DTChooserThis.MINU;
            octets.push('<input type="text" class="tiny-time-input" format = "MM" maxNum = "59" value="' + DTChooserThis.MINU + '"/>');
        }
        
        //如果有秒 SS
        if( (TimeFormatArray.length >= 3 ) && ( 2 == TimeFormatArray[2].length )) {
            DTChooserThis.SECS = DTChooserThis.SECS < 10 ? ("0" + DTChooserThis.SECS) : DTChooserThis.SECS;
            octets.push('<input type="text" class="tiny-time-input" format = "SS" maxNum = "59" value="' + DTChooserThis.SECS + '"/>');
        }
        
        //如果有微秒 MS
        if( 4 == TimeFormatArray.length ) {
            DTChooserThis.MSECS = DTChooserThis.MSECS.length < 2 ? ("00" + DTChooserThis.MSECS) : DTChooserThis.MSECS.length <3 ? (
                                "0" + DTChooserThis.MSECS) : DTChooserThis.MSECS;
            octets.push('<input type="text" class="tiny-time-input" format = "SSS" maxNum = "999" value="' + DTChooserThis.SECS + '"/>');
        }
        DTChooserThis.octet_html = octets.join(':'); 
        
        //拼装组成时间值
        var value;
        switch(TimeFormatArray.length) {
            case 1:
                value = DTChooserThis.HOURS;
                break;
            case 2:
                value = DTChooserThis.HOURS + ":" + DTChooserThis.MINU;
                break;
            case 4:
                value = DTChooserThis.HOURS + ":" + DTChooserThis.MINU + ":" + DTChooserThis.SECS + ":" + DTChooserThis.MSECS ;
                break;
            default:
                value = DTChooserThis.HOURS + ":" + DTChooserThis.MINU + ":" + DTChooserThis.SECS;
                break;
        }
        
        //如果有AMPM：1.加AMPM部分的DOM;2.返回值加AMPM值
        if("true" === String(options["ampm"])) {
            
            //value值加AM/PM
            value += " "+ DTChooserThis.AMPM;
            
            //DOM拼接加AMPM部分
            DTChooserThis.octet_html += '<input type="text" class="tiny-time-input" format = "AMPM" maxNum = "PM" value="' + DTChooserThis.AMPM + '" />';
        }   
        DTChooserThis.octet_html = '<div>'+DTChooserThis.octet_html+'</div>';
        //返回得到的该value值
        DTChooserThis.editorValue = value;
        return value;
    },
        
    //tab键事件
    "_tabRange" : function() {
        var DTChooserThis = this,
        options = DTChooserThis.options,
        inputsNum = DTChooserThis.timeInputLength;
        DTChooserThis.inputsDiv = DTChooserThis._element.find(".tiny-time-editor input");
        if(!DTChooserThis.focusInput) {
            DTChooserThis.focusInput = $(DTChooserThis.inputsDiv[0]);
        }
        for(var i = 0; i < inputsNum; i++) {
            if(DTChooserThis.focusInput.attr("format") === $(DTChooserThis.inputsDiv[i]).attr("format")) 
            break;
        }
        if(inputsNum-1 == i) {
            DTChooserThis._element.find("input.tiny-time-input").first().focus();
        } else {
            DTChooserThis.focusInput.next().focus();
        }
    },
        
    "_changeValue" : function(method) {
        var DTChooserThis = this,
        options = DTChooserThis.options;       
       
        if(!DTChooserThis.focusInput) {
            DTChooserThis.inputsDiv = DTChooserThis._element.find(".tiny-time-editor input");
            DTChooserThis.focusInput = $(DTChooserThis.inputsDiv[0]);
        }
        var num = DTChooserThis.focusInput.val(),
        maxNum = DTChooserThis.focusInput.attr("maxnum"),
        minNum = 0, format = DTChooserThis.focusInput.attr("format");
        if("PM" == maxNum) {
            minNum = "AM";
        } else {
            num = parseInt(num, 10);
            maxNum = parseInt(maxNum, 10);
        }      
        if(12 == maxNum) {
            minNum = 1;
        }
        
        //调节后的时间微调框时间
        var value = DTChooserThis._getNum(num,maxNum,minNum, method);
        var formatValue = DTChooserThis._formatTime(format, value+"");                     
        DTChooserThis.focusInput.val(formatValue); 
        
        //输入框中时间
        if("time" == options["type"]) {
            DTChooserThis._timeRestrict();
        }                
    },
    
    //时间限制
    "_timeRestrict" : function() {
        var DTChooserThis = this, options = DTChooserThis.options, 
        timeValue = DTChooserThis._conformTime(); 
             
        //如果设置了最大时间值,检测
        if(options.maxDate) {
            if(DTChooserThis._checkMaxTime(timeValue, options.maxDate)){
                DTChooserThis._updateTime(options.maxDate);
            }
        }
        
        //如果设置了最小时间值,检测
        if(options.minDate) {
            if(DTChooserThis._checkMinTime(timeValue, options.minDate)){
                DTChooserThis._updateTime(options.minDate);
            }
        }     
        DTChooserThis.editorValue = timeValue;
    },
    
    //整合时间具体值
    "_conformTime" : function() {
        var DTChooserThis = this, inputValues = [], 
        options = DTChooserThis.options,
        num = DTChooserThis.timeInputLength;
        DTChooserThis.inputsDiv = DTChooserThis._element.find(".tiny-time-editor input");
        if(options["ampm"]) {
            num -= 1;
        }
        for(var i = 0; i < num; i++) {
            inputValues.push(DTChooserThis.inputsDiv[i].value);
        }
        var timeValue = inputValues.join(':');
        if(options["ampm"]) {
            timeValue = timeValue + " " +DTChooserThis.inputsDiv[num].value;
        }
        return timeValue;
    },
    
    //计算调节后的时间值
    "_getNum" : function(num, max, min, type) {
        var DTChooserThis = this;
        //对于AMPM，直接转换
        if("PM" == max) {
            if(num == 'AM') {
                return 'PM';
            } 
            else {
                return 'AM';
            }
        }
        
        //如果非数字的话，将num设置为0
        if(isNaN(num)) {
            num = 0;
        }
        
        //对于向上或向下做处理
        if ("UP" == type) {        	
            num = num + 1;
            if (void 0 !== max && num > max) {
                num = min;
            }
        }
        else if("DOWN" == type) {
            num = num - 1;
            if (void 0 !== min && num < min) {
                num = max;
            }
        }
        return num;
    },
    
    /**
     * 销毁dataTime面板
     */
    destroy: function() {
        var DTChooserThis = this;
        $.datepicker._destroyDatepicker(DTChooserThis.$selectedInput[0]);
    }
    
    });
    return DateTimeChooser;
});
