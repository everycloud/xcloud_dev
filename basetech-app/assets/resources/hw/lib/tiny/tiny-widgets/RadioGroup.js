define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget","tiny-common/util",
 "tiny-widgets/Tip","tiny-lib/encoder"], function(angular, $, Class, Widget,util, Tip, encoder) {
	var DEFAULT_CONFIG = {
		"template" : '<div class="tiny-radiogroup" id=""></div>',
		"spacing" : {"width":"0","height":"25px"},
		"layout" : "horizon",
		"values" : []
	}; 
	
	var RadioGroup = Widget.extend({
		"init" : function(options) {
			var radioGroupThis = this;
			var options = _.extend({}, DEFAULT_CONFIG, options);
			radioGroupThis._super(options);
			radioGroupThis._setOptions(options);
			$("#" + options["id"]).append(radioGroupThis._element);
		},
		
		//拼装控件DOM
		"_optionHtmlFactory" : function(radioGroup, radioId, iconClass, text, tooltip) {
			var radioGroupThis = this;
			var options = radioGroupThis.options;
			var height = $.encoder.encodeForCSS("height", options["spacing"].height, true);
			var width =  $.encoder.encodeForCSS("min-width", options["spacing"].width, true);
			var html = '';
			html += '<div class="tiny-radiogroup-style ' +radioGroup+ '"  style="height: ' + height + '; min-width:' + width + ';">'
			      +    '<div class="tiny-radiogroup-mark" id="' + radioId + '">' 
			      +       '<div class="tiny-radioIcon tiny-radio-unchecked">' 
			      +       '</div>' 
			      +       '<label style="float: left">';
			if (!!iconClass) {
				iconClass = $.encoder.encodeForHTMLAttribute("class", iconClass, true);
				html +=      '<span class = "tiny-radio-icon'+' '+iconClass+'"></span>';
			}
			if (!!text) {
				html +=      '<label class="tiny-text">' + text + '</label>' 
				      +   '</label>';
			}
			html +=    '</div>' 
			     + '</div>';
			return html;
		},
		
		//通过用户设置的外部属性进行控件更新
		"_setOption" : function(key, value) {
			var radioGroupThis = this;
			radioGroupThis._super(key, value);
			var options = radioGroupThis.options;
			switch (key) {	
				case 'id':
					radioGroupThis._updateId(value);
					break;			
				case 'values':
					radioGroupThis._updateValues(options);
					break;
				case 'spacing':
				    radioGroupThis._element.find(".tiny-radiogroup-style").css("min-width", value["width"]);
				    radioGroupThis._element.find(".tiny-radiogroup-style").css("height", value["height"]);
				    break;
                default:break;
			}
		},
		"_updateId" : function(id){
			var radioGroupThis = this,options = radioGroupThis.options;
			if(!$("#" + options["id"])){
			   return;
			}
			radioGroupThis._element.attr("id", id);
		},
		"opValue":function(id,value){			
			if (arguments.length === 0) {
				return;
			}			
			var $keySelector = this._element.find("#"+id);
			if(arguments.length === 1){				
			    return $keySelector.find(".tiny-text").text();
			}
			$keySelector.find(".tiny-text").text(value);
		},
		"_updateValues" : function(options) {
			var radioGroupThis = this;
			var elementContent = "";
			var disableObj=[];
			var tooltipObj=[];
			for (var i = 0; i < options["values"].length; i++) {
				var isHorizon=("horizon" != options["layout"].toLowerCase());
				if (isHorizon) {
					elementContent += '<div class="tiny-radiogroup-vertical">';
				}
				var elementLength = options["values"][i].length || 1;
				for (var j = 0; j < elementLength; j++) {
					var radioGroup = "tiny-radiogroup-horizon";
					var value = options["values"][i][j] || options["values"][i];
					var radioId = $.encoder.encodeForHTMLAttribute("id", value["key"]+"", true);
					var checked = util.isTrue(value["checked"]);
					var text = value["text"];					
					var iconClass = value["icon-class"];
					var tooltip = value["tooltip"];
					elementContent += radioGroupThis._optionHtmlFactory(radioGroup, radioId, iconClass, text, tooltip);
					if (checked) {
						var checkedRadioId = radioId;
					}					
					var disabled = util.isTrue(value["disable"]);
					if(disabled){
						disableObj.push(radioId);
					}
					if(value["tooltip"]){
						tooltipObj.push({"radioId":radioId,"value":value["tooltip"], "tipWidth":value["tipWidth"]});
					}
				};		
				if (isHorizon) {
					elementContent += '</div>';
				}
			}
			radioGroupThis._element.html(elementContent);
						
			//处理选中
			if(void 0 !== checkedRadioId) {
				var $selector = radioGroupThis._element.find("[id="+checkedRadioId+"]");				
				var $checkedSelector = $selector.find(".tiny-radioIcon");
			    
			    //处理选中部分的disable事件			    
			    //如果处于disable状态
			    if(_.contains(disableObj,checkedRadioId)) {
			    	$checkedSelector.removeClass("tiny-radio-unchecked").addClass("tiny-radio-checked-disabled");
			    	$checkedSelector.attr("disabled", "true");
                    $selector.find(".tiny-text").addClass("tiny-radio-content-disabled");
                    $selector.find(".tiny-radio-icon").addClass("tiny-img-disabled");
                    disableObj = _.without(disableObj, checkedRadioId);
                    $checkedSelector.attr("checked", true);
			    } else {
			    	
			    	//如果非disable状态			    	
			        $checkedSelector.removeClass("tiny-radio-unchecked").addClass("tiny-radio-checked");
			        $checkedSelector.attr("checked", true);
			    };
			};
			
			//处理未选中部分的disabled
			if(disableObj.length) {
				for(var i=0;i<disableObj.length;i++){
					$selectorun=radioGroupThis._element.find("[id="+disableObj[i]+"]");
					$selectorunChecked=$selectorun.find(".tiny-radioIcon"); 				
                	$selectorunChecked.removeClass("tiny-radio-unchecked").addClass("tiny-radio-unchecked-disabled");
                    $selectorunChecked.attr("disabled", "true");
                    $selectorun.find(".tiny-text").addClass("tiny-radio-content-disabled");
                    $selectorun.find(".tiny-radio-icon").addClass("tiny-img-disabled");
				};
		  };
		  
		  //处理tooltip		   
		  if(tooltipObj.length){
		      for(var i=0;i<tooltipObj.length;i++){
		          var $selectortootip = radioGroupThis._element.find("[id="+tooltipObj[i].radioId+"]");
		          $selectortootip.addClass("tiny-radio-tooltip");
		          var tip=new Tip({
		              "content":tooltipObj[i].value,
		              "element":$selectortootip,
		              "width": tooltipObj[i].tipWidth
		          });
		      };
		  };
		},
		
		//提供方法，设置或获取checked属性
		"opChecked" : function(valueId,checkedNew){
			var radioGroupThis = this;
			var $selectorValues = radioGroupThis._element.find("[id="+valueId+"]");
			var $selectorcheckIcon = $selectorValues.find(".tiny-radioIcon");
			if(arguments.length === 0){
				return;
			};
			if(_.isString(valueId)){
				if(_.isUndefined( checkedNew )){
					
				    //获取已勾选按钮Id
				    if("checked" == valueId) {
				    	var $checkedElement = radioGroupThis._element.find("[checked=checked]")[0]
				    	if($checkedElement) {
				    		var $selector = $checkedElement.parentNode;				    		
						    return $selector.getAttribute("id");
				    	};
				    }
					
			        var isChecked = ("checked" == $selectorcheckIcon.attr("checked")) ? true : false;
					//获取checked属性
			        if(isChecked){
			        	return true;
			        }
			        return false;
			   }   
			       //设置checked属性
			        if(String(checkedNew) == String(isChecked)){
			        	return;
			        }
			        if("true" == String(checkedNew)){
			        	
			        	//去掉先前选中项 
			        	var $precheckedElement = radioGroupThis._element.find("[checked=checked]");
					    if("disabled" == $precheckedElement.attr("disabled")){
						    $precheckedElement.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-unchecked-disabled");
					    }else{
						    $precheckedElement.removeClass("tiny-radio-checked").addClass("tiny-radio-unchecked");
					    }
					    $precheckedElement.attr("checked", false);
					    
					    
			            var isDisabled = ("disabled" == $selectorcheckIcon.attr("disabled")) ? true :false;
					    //处理当前项
			        	$selectorcheckIcon.attr("checked",true);
			        	if(isDisabled){
			        		return $selectorcheckIcon.removeClass("tiny-radio-unchecked-disabled").addClass("tiny-radio-checked-disabled");
			        	}
			        	return $selectorcheckIcon.removeClass("tiny-radio-unchecked").addClass("tiny-radio-checked");
			            }
			            else{
			        	    $selectorcheckIcon.attr("checked",false);
			        	if(isDisabled){
			        		return $selectorcheckIcon.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-unchecked-disabled");
			        	}
			        	return $selectorcheckIcon.removeClass("tiny-radio-checked").addClass("tiny-radio-unchecked");
			        }
			};
		},
		
		//设置、获取disabled属性
		"opDisabled" : function(valueId,disabledNew){
			var radioGroupThis = this;
			var $selectorValues = radioGroupThis._element.find("[id="+valueId+"]");
			var $selectorcheckIcon = $selectorValues.find(".tiny-radioIcon");
			var isChecked = ("checked" == $selectorcheckIcon.attr("checked")) ? true : false;
			var isDisabled = ("disabled" == $selectorcheckIcon.attr("disabled")) ? true :false;
			if(arguments.length === 0){
				return;
			};
			if(_.isString(valueId)){
				if(_.isUndefined( disabledNew )){
					
					//获取disabled属性
					var isDisabled = $selectorValues.attr("disabled");
			        if(isDisabled){
			        	return true;
			        }
			        return false;
			     }
			     
			        //设置disabled属性
			        if(String(disabledNew) == String(isDisabled)){
			        	return;
			        }
			        if("true" == String(disabledNew)){
			        	$selectorcheckIcon.attr("disabled",true);
			        	$selectorValues.find(".tiny-text").addClass("tiny-radio-content-disabled");
			        	$selectorValues.find(".tiny-radio-icon").addClass("tiny-img-disabled");
			        	if(isChecked){
			        		return $selectorcheckIcon.removeClass("tiny-radio-checked").addClass("tiny-radio-checked-disabled");
			        		
			        	}
			        	return $selectorcheckIcon.removeClass("tiny-radio-unchecked").addClass("tiny-radio-unchecked-disabled");
			        }
			        else{
			        	$selectorcheckIcon.attr("disabled",false);
			        	$selectorValues.find(".tiny-text").removeClass("tiny-radio-content-disabled");
			        	$selectorValues.find(".tiny-radio-icon").removeClass("tiny-img-disabled");
			        	if(isChecked){
			        		return $selectorcheckIcon.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-checked");
			        	}
			        	return $selectorcheckIcon.removeClass("tiny-radio-unchecked-disabled").addClass("tiny-radio-unchecked");
			        }
			 }
		},
		
		//为控件添加行为属性
		"_addBehavior" : function() {
			var radioGroupThis = this;
			var options = radioGroupThis.options;
			var $selectorEvent=radioGroupThis._element.find(".tiny-radiogroup-mark");
			radioGroupThis._element.on("click", ".tiny-radiogroup-mark", function(event) {
				$clickElement = $(this).find(".tiny-radioIcon");				
				if($clickElement.attr("disabled")){
				    return;
				};
				$clickElement.trigger("clickEvt");					
				if (!($clickElement.attr("checked"))) {
					//去掉先前选中项					var $precheckedElement = radioGroupThis._element.find("[checked=checked]");
					if("disabled" == $precheckedElement.attr("disabled")){
						$precheckedElement.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-unchecked-disabled");
					}else{
						$precheckedElement.removeClass("tiny-radio-checked").addClass("tiny-radio-unchecked");
					}
					$precheckedElement.attr("checked", false);
					
					//勾选当前项
					$clickElement.removeClass("tiny-radio-unchecked").addClass("tiny-radio-checked");
					$clickElement.attr("checked", true);					
				    $clickElement.trigger("changeEvt");					
			   }
		  });
		  //处理click事件
		  radioGroupThis._element.on("clickEvt", function(event) {
			radioGroupThis.trigger("click", [event]);
			if ("function" == ( typeof options["click"])) {
				options["click"](event);
			}
		  });
		  //处理change事件
		  radioGroupThis._element.on("changeEvt", function(event) {
		  	radioGroupThis.trigger("change", [event]);
			if ("function" == ( typeof options["change"])) {
			    options["change"](event);
			}
         });
	  }
	});
	return RadioGroup;
});
