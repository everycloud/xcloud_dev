define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/Class", "tiny-widgets/Widget", "tiny-common/util", "tiny-widgets/Tip"], 
function(angular, $, Class, Widget, util, Tip) {
	i=0;
	var DEFAULT_CONFIG = {
		"width" : "50px",
		"height" : "25px",
		"text" : "",
		"checked" : false,
		"template" : 
		'<div class="tiny-radio">' 
		+ '<div class="tiny-radio-mark" name="" tiny-radio-id="">' 
		+'<table class="radioWrapperTable"><tbody><tr>'
		+'<td vertical-align="middle">'
		+   '<div class="tiny-radioIcon tiny-radio-unchecked">' 
		+   '</div>'
		+'</td><td vertical-align="middle">' 
		+   '<label class="tiny-radio-content">'
		+      '<label class="tiny-text"></label>' 
		+   '</label>'
		+'</td></tr></tbody></table>' 
		+   '</div>' 
		+ '</div>'
	};
	
	var Radio = Widget.extend({
		"init" : function(options) {
			var radioThis = this;
			var options = _.extend({}, DEFAULT_CONFIG, options);
			radioThis._super(options);
			radioThis._setOptions(options);
			$("#" + options["id"]).append(radioThis._element);
		},
		"_setOption" : function(key, value) {
			var radioThis = this;
			radioThis._super(key, value);
			switch (key) {
				case "id":
				    radioThis._updateId(value);
					break;
				case "name":
					radioThis._updateName(value);
					break;
				case "icon-class":
					radioThis._updateIcon(value);
					break;
				case "text":
					radioThis._updateText(value);
					break
				case "checked":
					radioThis._updateChecked(value);
					break;
				case "width":
					radioThis._element.css("min-width", value);
					break;
				case "height":
					radioThis._element.css("height", value);
					break;
				case "disable" :
					radioThis._updateDisable();
					break;
				case "tooltip":
					radioThis._updateTooltip(value);
					break;
				default:
					break;
			}
		},
		"_updateId" : function(id) {
			var radioThis = this,options = radioThis.options;
			if(!$("#" + options["id"])){
			   return;
			}
			radioThis._element.attr("id", id);
		},
		"_updateName" : function(name) {
			var radioThis = this;
			var options = radioThis.options;
			var $selectedMark = radioThis._element.find(".tiny-radio-mark");
			$selectedMark.attr("name", name);
			i++;
			var value = options["value"];
			if(((void 0 !== value)) && ("" !== value)){
				var id = value;
			} else {
				var id=name+"_radio"+i;
			}			
			$selectedMark.attr("tiny-radio-id", id);
		},
		"_updateText" : function(text) {
			var radioThis = this;
			radioThis._element.find(".tiny-text").html(text);
		},
		"_updateIcon" : function(iconClass) {
			var radioThis = this;
			//if exsit icon,remove
			if(radioThis.$radioIcon){
				radioThis.$radioIcon.remove();
			}
			radioThis.$radioIcon = $('<span class = "tiny-radio-icon"></span>');						
			radioThis.$radioIcon.addClass(iconClass);	
			$radioContent = radioThis._element.find(".tiny-radio-content");
			$radioContent.prepend(radioThis.$radioIcon);		
		},
		"_updateChecked" : function(checked) {
			var radioThis = this;
			var options = radioThis.options;
			var checkedThisId = radioThis._element.find(".tiny-radio-mark").attr("tiny-radio-id");
			var $selector = $("[class=tiny-radio-mark][name=" + options["name"] + "][tiny-radio-id!=" + checkedThisId + "]");
			var $checkeds = $selector.find("[checked=checked]");
			var num = $checkeds.length;
			var isChecked = (util.isTrue(checked)) || (checked == "checked");
			var $checkedThis = radioThis._element.find(".tiny-radioIcon");
			if(!isChecked) {
				$checkedThis.removeClass("tiny-radio-checked").addClass("tiny-radio-unchecked");
			    $checkedThis.attr("checked", false);			    
			    options["checked"] = false;		
				return;
			}
			$checkedThis.removeClass("tiny-radio-unchecked").addClass("tiny-radio-checked");
			$checkedThis.attr("checked", true);
			options["checked"] = true;		
			
			//之前没有选中项
			if(0 == num) {
				return;
			}
			if("disabled" == $checkeds.attr("disabled")){
				$checkeds.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-unchecked-disabled");	
				$checkeds.closest(".tiny-radio").widget().options["checked"] = false;			
			}
			else{
				$checkeds.removeClass("tiny-radio-checked").addClass("tiny-radio-unchecked");
				$checkeds.closest(".tiny-radio").widget().options["checked"] = false;
			}			
			$checkeds.attr("checked", false);
		},
		
		"opChecked" : function() {
			var radioThis = this;
			if(arguments.length === 0){
			    var $markDom = $("[class=tiny-radio-mark][name=" + radioThis.options["name"] + "]");
			    var $checkedDom = $markDom.find("[checked=checked]");
			    var checkedVaule = null;
			    if($checkedDom.length !== 0){
				    checkedVaule = $checkedDom.closest(".tiny-radio-mark").attr("tiny-radio-id");
			    }
			    return checkedVaule;
			}
		},
		"_updateDisable" : function() {
			var radioThis = this;
			var options = radioThis.options;
			var $selector = radioThis._element.find(".tiny-radio-mark");
			var $selectedRadio = $selector.find(".tiny-radioIcon");
			if (util.isTrue(options["disable"])) {
				if ("checked" == $selectedRadio.attr("checked")) {
					$selectedRadio.removeClass("tiny-radio-checked").addClass("tiny-radio-checked-disabled");
				} else {
					$selectedRadio.removeClass("tiny-radio-unchecked").addClass("tiny-radio-unchecked-disabled");
				}
				$selectedRadio.attr("disabled", "true");
				$selector.find(".tiny-text").addClass("tiny-radio-content-disabled");
				if(radioThis.$radioIcon){
					radioThis.$radioIcon.addClass("tiny-img-disabled");
				}				
				return;
			};
				if ("checked" == $selectedRadio.attr("checked")) {
					$selectedRadio.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-checked");					
				} else {
					$selectedRadio.removeClass("tiny-radio-unchecked-disabled").addClass("tiny-radio-unchecked");
				}
				$selectedRadio.removeAttr("disabled");
				$selector.find(".tiny-text").removeClass("tiny-radio-content-disabled");
				if(radioThis.$radioIcon){
					radioThis.$radioIcon.removeClass("tiny-img-disabled");	
				}				
		},
		"_updateTooltip" : function(value) {
			var radioThis = this;
			radioThis.tip = new Tip({
				"content" : value,
				"element" : radioThis._element.find(".tiny-radio-mark"),
				"width" : radioThis.options.tipWidth
			});
		},
		"_addBehavior" : function() {
			var radioThis = this;
			var options = radioThis.options;
			var $selectorEvent = radioThis._element.find(".tiny-radio-mark");
			radioThis._element.on("click", ".tiny-radio-mark", function(event) {				
				var $clickElement = $(this).find(".tiny-radioIcon");
				if ($clickElement.attr("disabled")) {
			        return;
				};
				//on,off方法实现事件的开启
                $selectorEvent.trigger("clickEvt", [event]);
				if (!($clickElement.attr("checked"))) {					
					//去掉先前选中项
					var $precheckedElement = $("[class=tiny-radio-mark][name=" + options["name"] + "]").find("[checked=checked]");
					if($precheckedElement.length !== 0){
						if($precheckedElement.attr("disabled") === "disabled") {
							$precheckedElement.removeClass("tiny-radio-checked-disabled").addClass("tiny-radio-unchecked-disabled");
						} else {
							$precheckedElement.removeClass("tiny-radio-checked").addClass("tiny-radio-unchecked");
						}						
					    $precheckedElement.attr("checked", false);
					    $precheckedElement.closest(".tiny-radio").widget().options["checked"] = false;
					}
						
					//勾选当前项
					$clickElement.removeClass("tiny-radio-unchecked").addClass("tiny-radio-checked");
					$clickElement.attr("checked", true);	
					options["checked"] = true;				
					$selectorEvent.trigger("changeEvt");
				}
			});
			//处理click事件
			radioThis._element.on("clickEvt", function(event) {
				var radioObj = $(event.currentTarget).widget();
				radioThis.trigger("click", [radioObj]);
				if ("function" == ( typeof options["click"])) {
					options["click"](radioObj);
				}
			});
			//处理change事件
			radioThis._element.on("changeEvt", function(event) {
				radioThis.trigger("change", [event]);
				if ("function" == ( typeof options["change"])) {
					options["change"](event);
				}
			});
		}
	});
	return Radio;

});
