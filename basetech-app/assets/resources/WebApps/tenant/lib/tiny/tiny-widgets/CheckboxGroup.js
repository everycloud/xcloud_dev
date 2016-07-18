define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget","tiny-common/util",
 "tiny-widgets/Tip" ,"tiny-lib/encoder"], function(angular, $, Class, Widget,util,Tip, encoder) {
    var DEFAULT_CONFIG = {
        "template" : '<div class="tiny-checkboxgroup"></div>',
        "spacing" : {"width":"0"},
        "layout" : "horizon",
        "values" : []
    };
    var checkboxGroup = Widget.extend({
        "init" : function(options) {
            var checkboxGroupThis = this;
            var options = _.extend({}, DEFAULT_CONFIG, options);
            checkboxGroupThis.checkAllId=false;
            checkboxGroupThis._super(options);
            checkboxGroupThis._setOptions(options);
            $("#" + options["id"]).append(checkboxGroupThis._element);
        },
        "_optionHtmlFactory" : function(checkboxGroup, checkboxId,checked,disabled,chkboxIconStyle,textDisabled,iconURL, text) {
            var checkboxGroupThis = this;
            var options = checkboxGroupThis.options; 
            var height = $.encoder.encodeForCSS("height", options["spacing"].height, true);
            var width =  $.encoder.encodeForCSS("min-width", options["spacing"].width, true);
            var html = '';
            html += '<div class="tiny-checkboxgroup-style ' +checkboxGroup+ '"  style="height: ' + height + '; min-width:' + width + ';">'
                  +    '<div class="tiny-checkboxgroup-mark" id="'+ checkboxId +'"  tiny-checked='+checked+' tiny-disabled='+disabled+' >' 
                  +       '<div class="tiny-checkboxIcon '+chkboxIconStyle+'">' 
                  +       '</div>' 
                  +       '<label style="float: left">';
            if (void 0 !== iconURL) {
                iconURL = $.encoder.encodeForHTMLAttribute("class", iconURL, true);
                if(disabled){
                    html += '<span class = "tiny-checkbox-icon tiny-img-disabled'+' '+iconURL+'"></span>';
                } else {
                    html += '<span class = "tiny-checkbox-icon'+' '+iconURL+'"></span>';
                }
            }
            if (!!text) {
                html +=      '<label class="tiny-text ' +textDisabled+ '">' + text + '</label>' 
                      +   '</label>';
            }
            html +=    '</div>' 
                 + '</div>';
            return html;
        },
        "_setOption" : function(key, value) {
            var checkboxGroupThis = this;
            checkboxGroupThis._super(key, value);
            var checkboxGroupThis = this;
            var options = checkboxGroupThis.options;
            switch (key) {
                case 'id':
                    checkboxGroupThis._updateId(value);
                    break;
                case 'all-select':
                    checkboxGroupThis._updateSelectAll(options, true);
                    break;
                case 'values':
                    checkboxGroupThis._updateValues(options);
                    break;
                case 'spacing':
                    checkboxGroupThis._element.find(".tiny-checkboxgroup-style").css("min-width",value["width"]);
                    checkboxGroupThis._element.find(".tiny-checkboxgroup-style").css("height",value["height"]);
                    break;
                default:break;
            }
        },
        "_updateValues" : function(options) {
            var checkboxGroupThis = this;
            checkboxGroupThis.elementContent="";
            checkboxGroupThis.tooltipObj=[];
            for (var i = 0; i < options["values"].length; i++) {
                var isVertical=("horizon" != options["layout"].toLowerCase());
                if (isVertical) {
                    checkboxGroupThis.elementContent += '<div class="tiny-checkbox-vertical">';
                }
                var elementLength = options["values"][i].length || 1;
                for (var j = 0; j < elementLength; j++) {
                    var value = options["values"][i][j] || options["values"][i];
                    var checkboxId = value["key"];    
                    checkboxGroupThis.elementContent += checkboxGroupThis._valuesDispose(value,false);
                    if(value["tooltip"]){
                        (checkboxGroupThis.tooltipObj).push({"checkboxId":checkboxId,"value":value["tooltip"],"tipWidth":value["tipWidth"]});
                    };
                };
                if (isVertical) {
                    checkboxGroupThis.elementContent += '</div>';
                };
            };
            
            //如果不存在selectAll属性，生成Dom,并且处理tooltip
            if(!options["all-select"]){
                checkboxGroupThis._element.html(checkboxGroupThis.elementContent);
                checkboxGroupThis.tooltipDispose();
            };

            checkboxGroupThis._updateSelectAll(options, false);
        },
        
        // priority为true时, 表示以selectAll值为准; 值为false时, 表示以value值为准.
        "_updateSelectAll" : function(options, priority){
            var checkboxGroupThis = this;
            //如果存在selectAll属性,构建全选框
            var selectAll = options["all-select"];
            if(_.isObject(selectAll)){
                checkboxGroupThis.checkAllId=selectAll["key"];
                var selectAllHtml = '<div class="tiny-checkbox-vertical">'+checkboxGroupThis._valuesDispose(selectAll,true)+'</div>';
                //对位置信息进行处理
                if("bottom" != selectAll["position"]){
                    checkboxGroupThis.elementContent = selectAllHtml+checkboxGroupThis.elementContent;
                }else{
                    checkboxGroupThis.elementContent += selectAllHtml
                };
                if(selectAll["tooltip"]){
                    (checkboxGroupThis.tooltipObj).push({"checkboxId":selectAll["key"],"value":selectAll["tooltip"]});
                }
            };
            checkboxGroupThis._element.html(checkboxGroupThis.elementContent);
            checkboxGroupThis.tooltipDispose();

            if (checkboxGroupThis.checkAllId) {
                //获取全选框元素
                var chkAllId = checkboxGroupThis.checkAllId;
                checkboxGroupThis.$checkAllselector = checkboxGroupThis._element.find("[id ="+chkAllId+"]");
                checkboxGroupThis.$checkAllicon = checkboxGroupThis.$checkAllselector.find(".tiny-checkboxIcon");
            }
            
            //当存在全选框设置时，对全选框属性进行设置
            if(checkboxGroupThis.checkAllId && priority){
                //对全选中属性进行处理
                checkboxGroupThis.checkedAll(!!selectAll["checked"]);
            };
            if (checkboxGroupThis.checkAllId && !priority) {
                checkboxGroupThis._updataChecked(checkboxGroupThis.$checkAllselector,checkboxGroupThis.$checkAllicon,true,!!selectAll["disable"],!!selectAll["checked"]);
                for (var i = 0, len = options["values"].length; i < len; i++) {
                    if (!options["values"][i]["checked"]) {
                        checkboxGroupThis._updataChecked(checkboxGroupThis.$checkAllselector,checkboxGroupThis.$checkAllicon,false,!!selectAll["disable"],true);
                        break;
                    }
                }
            }
        },
        
        //tooltip事件处理
        "tooltipDispose" : function(){
        var checkboxGroupThis = this;
        var tooltipObj = checkboxGroupThis.tooltipObj;
        //处理tooltip           
          if(tooltipObj.length){
              for(var i=0;i<tooltipObj.length;i++){
                  var $selectortootip = checkboxGroupThis._element.find("[id="+tooltipObj[i].checkboxId+"]").find(".tiny-text");
                  $selectortootip.addClass("tiny-checkbox-tooltip");
                  var tip=new Tip({
                      "content":tooltipObj[i].value,
                      "element":$selectortootip,
                      "width" : tooltipObj[i].tipWidth
                  });
              };
          };
        },
        
        //处理Values和SelectAll属性，为HTML元素拼装做准备
        "_valuesDispose" :function(value,isSelectAll){
            var checkboxGroupThis = this;
            var options = checkboxGroupThis.options;
            var checkboxGroup =  isSelectAll ? $.encoder.encodeForHTMLAttribute("class", value["cls"], true) : "tiny-checkbox-horizon";
            var checkboxId = $.encoder.encodeForHTMLAttribute("id", value["key"]+"", true);
            var text = value["text"];                    
            var iconURL = value["icon-class"];   //不做编码处理，因为该变量是否定义，会在后续代码逻辑中做判断
            var tooltip = value["tooltip"];      //tooltip可为任意字符，不用进行转换
            var checked = util.isTrue(value["checked"]);
            var disabled = util.isTrue(value["disable"]);
            var chkboxIconStyle;
            var textDisabled="";
            if(disabled){
                chkboxIconStyle = checked ? "tiny-checkbox-checked-disabled" : "tiny-checkbox-unchecked-disabled";
                textDisabled="tiny-checkbox-content-disabled";
            }
            else{
                chkboxIconStyle = checked ? "tiny-checkbox-checked" : "tiny-checkbox-unchecked";
            }
            return  checkboxGroupThis._optionHtmlFactory(checkboxGroup, checkboxId,checked,disabled,chkboxIconStyle,textDisabled,iconURL, text);
        },
        //click和change事件处理
        "_addBehavior" : function() {
            var checkboxGroupThis = this;
            var options = checkboxGroupThis.options;
            var chkAllId;
            var $checkAllselector;
            var $checkAllicon;
            var ischeckAll;
            var isDisabled;
            checkboxGroupThis._element.on("click", ".tiny-checkboxgroup-mark", function(event) {
                var thisId = $(this).attr("id");
                var $clickElement = $(this).find(".tiny-checkboxIcon");
                chkAllId = checkboxGroupThis.checkAllId;
                if($(this).attr("tiny-disabled")==="true"){
                    return;
                };        
                var checkedoption = $(this).attr("tiny-checked");
                //点击复选框
                if ("true" == checkedoption) {
                    //点击的是全选框情况
                    if(thisId == chkAllId) {
                        checkboxGroupThis.checkedAll("false");
                    } else {
                    	//去勾选当前项
                        $clickElement.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-unchecked");
                        $(this).attr("tiny-checked", false);
                        //存在全选框,对其进行处理
                        if(chkAllId){
                            checkboxGroupThis._checkedFalseDispose();
                        }
                   }                    
                }
               if ("false" == checkedoption){
                   //点击的是全选框情况
                   if(thisId == chkAllId) {
                       checkboxGroupThis.checkedAll("true");
                   } else {
                       //勾选当前项
                       $clickElement.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-checked");
                       $(this).attr("tiny-checked", true);
                       if(chkAllId){    
                           checkboxGroupThis._checkedTrueDispose();
                      }
                   }                   
              }
              $clickElement.trigger("clickEvt");
              $clickElement.trigger("changeEvt");
          });
          //处理click事件
          checkboxGroupThis._element.on("clickEvt", function(event) {
            checkboxGroupThis.trigger("click", [event]);
            if ("function" == ( typeof options["click"])) {
                options["click"](event);
            }
          });
          //处理change事件
          checkboxGroupThis._element.on("changeEvt", function(event) {
              checkboxGroupThis.trigger("change", [event]);
            if ("function" == ( typeof options["change"])) {
                options["change"](event);
            }
         });
       },
     
        //方法：
        //设置、获取checked属性，获取已选的key值数组
        "opChecked" : function(valueId,checkedNew){
            var checkboxGroupThis = this;
            var $selectorValues = checkboxGroupThis._element.find("[id="+valueId+"]");
            var $selectorcheckIcon = $selectorValues.find(".tiny-checkboxIcon");
            var isChecked = $selectorValues.attr("tiny-checked");
            var isDisabled = $selectorValues.attr("tiny-disabled");
            if(arguments.length === 0){
                return;
            };
            if(_.isString(valueId)){
                if(_.isUndefined( checkedNew )){
                    //获取checked key值列表
                    if("checked" == valueId){
                        var $checkedElements = checkboxGroupThis._element.find("[tiny-checked='true']");
                        var checkedArray = _.map($checkedElements, function(checked){
                            return $(checked).attr("id");
                        });
                        if(checkboxGroupThis.checkAllId){
                            checkedArray = _.without(checkedArray,checkboxGroupThis.checkAllId);
                        };
                        return checkedArray;
                    }
                    //获取checked属性
                    if(isChecked=="true"){
                        return true;
                    }
                    return false;
               }
                    //设置checked属性
                    return checkboxGroupThis._updataChecked($selectorValues,$selectorcheckIcon,checkedNew,isDisabled,isChecked);
            }
        },
        "_updataChecked" :　function($selectorValues,$selectorcheckIcon,checkedNew,isDisabled,isChecked){
            var checkboxGroupThis = this;
            if(String(isChecked)==String(checkedNew)){
                return;
            };
            var chkAllId = checkboxGroupThis.checkAllId;
            if("true" == String(checkedNew)){
                $selectorValues.attr("tiny-checked",true);
                if("true" == String(isDisabled)){
                    $selectorcheckIcon.removeClass("tiny-checkbox-unchecked-disabled").addClass("tiny-checkbox-checked-disabled");
                }else{
                    $selectorcheckIcon.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-checked");
                }                
                if(chkAllId){
                    checkboxGroupThis._checkedTrueDispose();
                };
            };
           if("false" == String(checkedNew)){
               $selectorValues.attr("tiny-checked",false);
               if("true" == String(isDisabled)){
                   $selectorcheckIcon.removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-unchecked-disabled");
               }else{
                      $selectorcheckIcon.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-unchecked");
               };
               if(chkAllId){
                    checkboxGroupThis._checkedFalseDispose();
               }
           };
        },

        //设置、获取disabled属性
        "opDisabled" : function(valueId,disabledNew){
            var checkboxGroupThis = this;
            var $selectorValues = checkboxGroupThis._element.find("[id="+valueId+"]");
            var $selectorcheckIcon = $selectorValues.find(".tiny-checkboxIcon");
            var isChecked = $selectorValues.attr("tiny-checked");
            var isDisabled = $selectorValues.attr("tiny-disabled");
            if(arguments.length === 0){
                return;
            };
            if(_.isString(valueId)){
                if(_.isUndefined( disabledNew )){
                    //获取disabled属性
                    var isDisabled = $selectorValues.attr("tiny-checked");
                    if(isDisabled=="true"){
                        return true;
                    }
                    return false;
                 }
                    //设置disabled属性
                    checkboxGroupThis._updataDisabled($selectorValues,$selectorcheckIcon,disabledNew,isDisabled,isChecked);
            };
        },
        "_updataDisabled" :　function($selectorValues,$selectorcheckIcon,disabledNew,isDisabled,isChecked){ 
            var checkboxGroupThis = this;
            var $selectorImg = $selectorValues.find(".tiny-checkbox-icon");
            var $selectorText = $selectorValues.find(".tiny-text");
            if(isDisabled==String(disabledNew)){
                return;
            };
            if("true" == String(disabledNew)){
                $selectorValues.attr("tiny-disabled",true);
                $selectorImg.addClass("tiny-img-disabled");
                $selectorText.addClass("tiny-checkbox-content-disabled");
                if("true" == String(isChecked)){
                    $selectorcheckIcon.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-checked-disabled");
                    return;
                };
                $selectorcheckIcon.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-unchecked-disabled");
            };
            if("false" == String(disabledNew)){
                $selectorValues.attr("tiny-disabled",false);
                $selectorImg.removeClass("tiny-img-disabled");
                $selectorText.removeClass("tiny-checkbox-content-disabled");
                if("true" == String(isChecked)){
                    $selectorcheckIcon.removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-checked");                    
                    return;
                };
                $selectorcheckIcon.removeClass("tiny-checkbox-unchecked-disabled").addClass("tiny-checkbox-unchecked");
            };
        },
        //当有勾选时处理全选框
        "_checkedTrueDispose" :　function(){
            var checkboxGroupThis=this;
            var $checkAllselector=checkboxGroupThis.$checkAllselector;
            var $checkAllicon=checkboxGroupThis.$checkAllicon;
            var isDisabled = ($checkAllselector.attr("tiny-disabled") == "true") ? true :false;
            var ischeckAll = ($checkAllselector.attr("tiny-checked") == "true") ? true :false;
                //全选框是否需要勾选
                var $unchecked = checkboxGroupThis._element.find("[tiny-checked='false']");
                //全选框勾选
                if (1 == $unchecked.length) {
                    $checkAllselector.attr("tiny-checked", true);
                    if (isDisabled) {
                        $checkAllicon.removeClass("tiny-checkbox-unchecked-disabled").addClass("tiny-checkbox-checked-disabled");
                    } else {
                        $checkAllicon.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-checked");
                    };
                };
        },
        //当去勾选时处理全选框
        "_checkedFalseDispose" :　function(){
            var checkboxGroupThis=this;
            var $checkAllselector=checkboxGroupThis.$checkAllselector;
            var $checkAllicon=checkboxGroupThis.$checkAllicon;
            var isDisabled = ($checkAllselector.attr("tiny-disabled") == "true") ? true :false;
            var ischeckAll = ($checkAllselector.attr("tiny-checked") == "true") ? true :false;
            //全选框去勾选
            if(ischeckAll){
                $checkAllselector.attr("tiny-checked", false);
                if(isDisabled){
                    $checkAllicon.removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-unchecked-disabled");
                }else{
                    $checkAllicon.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-unchecked");
                };
            };
        },

        //设置全选框的checked属性
        "checkedAll" : function(checkValue){
            var checkboxGroupThis=this;
            if("true" == String(checkValue)){
                //设置为全选
                var $uncheckedElement = checkboxGroupThis._element.find("[tiny-checked='false']");
                _.each($uncheckedElement,function(element){
                    isDisabled = $(element).attr("tiny-disabled");
                    $(element).attr("tiny-checked","true");
                    var $checkIcon = $(element).find(".tiny-checkboxIcon")
                    if("true" == String(isDisabled)){
                        $checkIcon.removeClass("tiny-checkbox-unchecked-disabled").addClass("tiny-checkbox-checked-disabled");                        
                    }else{
                        $checkIcon.removeClass("tiny-checkbox-unchecked").addClass("tiny-checkbox-checked");
                    }
                });
                return;
            };
            if("false" == String(checkValue)){
                var $checkedElement = checkboxGroupThis._element.find("[tiny-checked='true']");
                _.each($checkedElement,function(element){
                    isDisabled = $(element).attr("tiny-disabled");
                    $(element).attr("tiny-checked","false");
                    var $checkIcon = $(element).find(".tiny-checkboxIcon")
                    if("true" == String(isDisabled)){
                        $checkIcon.removeClass("tiny-checkbox-checked-disabled").addClass("tiny-checkbox-unchecked-disabled");                        
                    }else{
                        $checkIcon.removeClass("tiny-checkbox-checked").addClass("tiny-checkbox-unchecked");
                    }
                });
                return;
            };
        }
    });
    return checkboxGroup;
});
