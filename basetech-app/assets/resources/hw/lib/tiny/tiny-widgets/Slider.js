define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/jquery.slider", "tiny-lib/Class", "tiny-lib/underscore", "tiny-widgets/Widget"], 
function(angular, $, jSlider, Class, _, Widget) {

	// 引用了第三方控件jslider

	var DEFAULT_CONFIG = {
		"width":300
	};

	var SELIDER_DEFAULT_CONFIG = {
      "from": 1,
      "to": 10,
      "step": 1,
      "smooth": true,
      "limits": true,
      "round": 0,
      "format": { format: "#,##0.##" },
      "value": "5;7",
      "dimension": ""
	};

	var tpl_data = _.template('<div class="tinySlider"><div class="slider-wrapper">' +
	    '<div class="slider-right">' +
	      '<div class="slider-center">' +
	        ' <% if(leftCaption) {%> <span class="slider-left-text"><%-leftCaption%></span> <%}%> ' +
	        '<div id="tinySlider"></div>' +
	         ' <% if(rightCaption) {%> <span class="slider-right-text"><%-rightCaption%></span> <%}%> ' +
	      '</div>' +
	    '</div>' +
	  '</div></div>');


	var slider = Widget.extend({
		"init" : function(options) {
			var widgetThis = this;
			var options = _.extend({}, DEFAULT_CONFIG, options);
            widgetThis._super(options);
			widgetThis._setOptions(options);
		},

		"_setOption" : function(key, value) {
			var widgetThis = this;
			widgetThis._super(key, value);
			switch( key ) {
				case "id":
					widgetThis._updateId(value);
					break;
				case "cls":
					widgetThis._element.addClass(value);
					break;
			}
			return;
		},

		"_generateElement":function()
		{
			var widgetThis = this;
			var sliderOption = _.extend({}, SELIDER_DEFAULT_CONFIG);
			!_.isUndefined(widgetThis.options.from) && ( sliderOption.from = widgetThis.options.from) ;
			!_.isUndefined(widgetThis.options.to) && ( sliderOption.to = widgetThis.options.to);
			!_.isUndefined(widgetThis.options.step) && ( sliderOption.step = widgetThis.options.step) ;
			!_.isUndefined(widgetThis.options.scale) && ( sliderOption.scale = widgetThis.options.scale) ;
			!_.isUndefined(widgetThis.options.smooth) && ( sliderOption.smooth = widgetThis.options.smooth) ;
			!_.isUndefined(widgetThis.options.limits) && ( sliderOption.limits = widgetThis.options.limits) ;
			!_.isUndefined(widgetThis.options.round) && ( sliderOption.round = widgetThis.options.round) ;
			!_.isUndefined(widgetThis.options.format) && ( sliderOption.format = widgetThis.options.format) ;
			!_.isUndefined(widgetThis.options.value) && ( value = widgetThis.options.value);
			!_.isUndefined(widgetThis.options.disable) && (sliderOption.disabled=widgetThis.options.disable);
			!_.isUndefined(widgetThis.options.dimension) && (sliderOption.dimension=widgetThis.options.dimension);
			var html = tpl_data({leftCaption:widgetThis.options.leftCaption, rightCaption:widgetThis.options.rightCaption});
			widgetThis.$html = $(html);
			$('#' + widgetThis.options["id"]).append(widgetThis.$html);
		    widgetThis.$tinySliderSel = widgetThis.$html.find("#tinySlider");
		    widgetThis.$html.find("#tinySlider").width(widgetThis.options.width);
		   var leftWidth = 0, rigthWidth = 0, width = 0;
		   if ( widgetThis.options.leftCaption )
		   {
		   		leftWidth = widgetThis.$html.find(".slider-left-text").width();
		   		leftWidth = (leftWidth > 50 ) ? leftWidth : 50;
		   		width += leftWidth + 20;
		   }

		   if (widgetThis.options.rightCaption )
		   {
		   	    rigthWidth = widgetThis.$html.find(".slider-right-text").width();
		   	    rigthWidth = (rigthWidth > 50 ) ? rigthWidth : 50;
		   	    width += rigthWidth + 20;
		   }
	       width += widgetThis.options.width + 20 ;
	       widgetThis.$html.find(".slider-center").width(width);
		   widgetThis.$tinySliderSel.attr("value", value);
		   widgetThis.value = value;
		   widgetThis.$tinySliderSel.slider(sliderOption);
		   return  widgetThis.$html;
		},
		"option":function(value,newValue){
			var widgetThis = this;
			if("value" !== value){
				return;
			}
			// get value
			if (_.isUndefined(newValue)){
				return widgetThis.$tinySliderSel.slider("value");
			}

			// set value is number
			if (typeof(newValue) == "number"){
				widgetThis.$tinySliderSel.slider("value",newValue);
			}
			else{ // value is string,maybe "100" or "100;200"
				var allvalue=newValue.split(";");
				widgetThis.$tinySliderSel.slider("value",allvalue[0],allvalue[1]);
			}
			widgetThis.value = newValue;
			return newValue;
		},
		"_addBehavior" :function(){
			var widgetThis =this,options=widgetThis.options,mousedownFlag = false;
			widgetThis.$tinySliderSel.find(".jslider-pointer").on("mousedown",function(){
				mousedownFlag = true;
			});
			$(document).on("mouseup",function(event){
				if(!mousedownFlag){
					return;
				}
				var value = widgetThis.$tinySliderSel.slider("value");
				if(value !== widgetThis.value) {
					widgetThis.value = value;
					widgetThis.trigger("changeEvt",[event,widgetThis.value]);
				}
				mousedownFlag = false;
			});
			widgetThis.on("changeEvt",function(event,changeVal,a,b) {
				widgetThis.trigger("change",[event,changeVal]);
				if ("function" == ( typeof options["change"])){
					options["change"](event,changeVal);
				}
			});
		}
	});
	return slider;
});