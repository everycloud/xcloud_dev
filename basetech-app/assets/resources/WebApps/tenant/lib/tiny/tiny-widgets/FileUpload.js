define(["tiny-lib/angular", "tiny-lib/jquery", "tiny-lib/underscore","tiny-widgets/Widget", "tiny-widgets/Progressbar", 
"language/widgetsLanguage", "tiny-common/UnifyValid", "tiny-lib/encoder"], 
function(angular, $, _, Widget, Progressbar, language, UnifyValid, encoder) {
	var DEFAULT_CONFIG = {
		"template" : '<div class = "tiny-fileUpload"></div>',
		"fileObjName" : "tinyfileName"
	};
	var FileUpload = Widget.extend({
		"init" : function(options) {
			var fileUploadThis = this;
			var option = _.extend({}, DEFAULT_CONFIG, options);
			fileUploadThis._super(option);
			
			//生成控件DOM
			fileUploadThis._generateFileHtml(String(option["multi"]));
			
			//设置文件disable属性
			if("true" === String(options.disable)) {
				fileUploadThis.setDisable(true);
			}
			
			//控件校验validate定义
			if (options.validate || options.tooltip) {
				if(options.validate) {
					fileUploadThis._parseValidateParam(fileUploadThis.$fileNameInputSel, options.validate, options.extendFunction||undefined);
                    fileUploadThis.$fileSelectFr.attr("validator", options.validate);
                    fileUploadThis.$fileSelectFr.attr("isValidTip", options.isvalidtip);
                    fileUploadThis.$fileSelectFr.attr("errorMsg", options["errorMsg"] || "");
                    fileUploadThis.$fileSelectFr.attr("extendFunction", options["extendFunction"]);
				}				
                UnifyValid.instantValid(fileUploadThis.$fileNameInputSel, fileUploadThis.$fileSelectFr, 
                	options["validate"], options["tooltip"]||"", true, 
                options["errorMsg"]||undefined, options["extendFunction"]||undefined, undefined, options["tipWidth"]||undefined);
            }
            
			//单文件/多文件上传事件添加
			if ("true" !== String(options["multi"])) {				
				fileUploadThis._addBehaviorFile();
			} else {				
				fileUploadThis._addBehaviorMultiFile();
			}			
			$("#" + options["id"]).append(fileUploadThis._element);
		},
		"_generateFileHtml" : function(value) {
			var fileUploadThis = this;
			var options = fileUploadThis.options;
			if ("true" !== value) {
				fileUploadThis._opSingleHtml();
				fileUploadThis._element.append(fileUploadThis.singleFrameHtml);
				fileUploadThis.$formSel = fileUploadThis._element.find("form");
				fileUploadThis.$fileNameInputSel = fileUploadThis._element.find(".tiny-file-input");
				fileUploadThis.$fileSelectFr = fileUploadThis._element.find(".tiny-file-select");
				fileUploadThis.$fileSelectSel = fileUploadThis._element.find("#file_upload");
				fileUploadThis.$fileSubmitSel = fileUploadThis._element.find(".tiny-submit-button");
			} else {
				fileUploadThis._opMultiHtml();
				fileUploadThis._element.append(fileUploadThis.multiFrameHtml);
				fileUploadThis.$formSel = fileUploadThis._element.find("#tiny-file-upload-form");
				fileUploadThis.$fileSelectSel = fileUploadThis._element.find("#file_upload");
				fileUploadThis.$formStatusSel = fileUploadThis._element.find("#tiny-file-status");
				fileUploadThis.$formWaitingSel = fileUploadThis._element.find("#file-waiting-status");
				fileUploadThis.$formUploadingSel = fileUploadThis._element.find("#file-uploading-status");
				fileUploadThis.$formUploadList = fileUploadThis._element.find(".tiny-file-upload-list");
				fileUploadThis.$formUploadSel = fileUploadThis._element.find(".tiny-file-multi-select");
				
				//设置总进度
				if ("false" !== String(options["enableTotalProgress"])) {
					fileUploadThis.$totalProgSel = fileUploadThis._element.find("#total-progress");
					var width = "500px", height = "10px";
					fileUploadThis._creatProgressbar(fileUploadThis.$totalProgSel, width, height);
				}
				fileUploadThis.selectFileQueue = [];
				fileUploadThis.selectFileNameQueue = [];
			}
		},
		"setDisable" : function(value) {
			var fileUploadThis = this;
			
			//设置为disable状态
			if("true" === String(value)) {
				
				//单文件
				if("true" !== String(fileUploadThis.options["multi"])) {
					fileUploadThis.$fileSelectSel.prop("disabled", "true");
				    fileUploadThis._element.find(".tiny-file-upload-button").addClass("tiny-button-buttonDefaultDisabled");
				    fileUploadThis.$fileNameInputSel.css("background-color", "#ededed");
				} 
				
				//多文件
				else {
					fileUploadThis.$fileSelectSel.prop("disabled", "true");
					fileUploadThis._element.find(".tiny-file-upload-multi").addClass("tiny-button-buttonDefaultDisabled");
					fileUploadThis._element.find(".tiny-file-upload-button").addClass("tiny-button-buttonDefaultDisabled");
				}				
			} 
			
			//设置为非disable状态
			else {
				
				//单文件
				if("true" !== String(fileUploadThis.options["multi"])) {
					fileUploadThis.$fileSelectSel.prop("disabled", false);
				    fileUploadThis._element.find(".tiny-file-upload-button").removeClass("tiny-button-buttonDefaultDisabled");
				    fileUploadThis.$fileNameInputSel.css("background-color", "");
				}
				
				//多文件
				else {
					fileUploadThis.$fileSelectSel.prop("disabled", false);
					fileUploadThis._element.find(".tiny-file-upload-multi").removeClass("tiny-button-buttonDefaultDisabled");
					fileUploadThis._element.find(".tiny-file-upload-button").removeClass("tiny-button-buttonDefaultDisabled");
				}
			}
		},
		"_opSingleHtml" : function() {
			var fileUploadThis = this, options = fileUploadThis.options;
			var singleHtml = "";
			
			//set Width
			if(void 0 !== options.width) {
				var totalWidth = parseInt(options.width, 10 );
			}
			
			//默认宽度设置			
			var fileleftWidth = 270;
			var fileInputWidth = 260;
			if(isNaN(totalWidth)){
				totalWidth = 300;				
			}else{
				fileleftWidth = totalWidth - 30;
				fileInputWidth = totalWidth - 40;
			}
			
			//set method
			var method = $.encoder.encodeForHTMLAttribute("method", options.method, true) || "post";
			
			//set Name
			var name = $.encoder.encodeForHTMLAttribute("name", options.fileObjName, true);
			var action = options["action"];
			singleHtml += '<div class= "tiny-file-upload">' + '<div class = "tiny-file-select" style="width :'+totalWidth+'px">';
			
			//支持用户外部自定义form（设置showform为false即可）
			if("false" !== String("showform")) {
				singleHtml += '<form target="iframePostForm" enctype="multipart/form-data" method="'+method+'" action="' +action+ '">';
			}
			
			//表单
			singleHtml += 
			'<div class="tiny-file-box" style="width :'+fileleftWidth+'px">'  + '<input type="text" class = "tiny-file-input" readonly = true; style="width :'+fileInputWidth+'px">' + '</div>' 
			+ '<div class = "tiny-file-select-button-container">'
			+ '<input type="file" name="'+name+'" id="file_upload" class = "tiny-file-select-button"/>' + '</div>'
			if("false" !== String("showform")) {
				singleHtml += '</form>';
			}
			singleHtml += '</div>';
			if("false" !== String(options.showSubmitBtn)){		
			
			    //点击上传按钮
			    singleHtml += '<a href="javascript:void(0)" class= "tiny-file-upload-button tiny-file-upload-single">' + '<div class="tiny-button">' + '<div class="tiny-right">' + '<div class="tiny-center">' 
			    + '<div class="tiny-leftImg" style="display: none;"></div>' + '<span class="tiny-button-buttonCenterText">' + language.upload + '</span>' + '<div class="tiny-rightImg" style="display: none;"></div>' 
			    + '</div>' + '</div>' + '</div>' + '</a>' + '</div>';
		    }
		    fileUploadThis.singleFrameHtml = $(singleHtml);
		},
		"setDetail" : function(detail) {
			var fileUploadThis = this;
			switch (detail) {
				case "success":
					fileUploadThis._setSuccessDetail(detail);
					break;
				case "error":
					fileUploadThis._setErrorDetail(detail);
					break;
				default:
					if (!isNaN(parseFloat(detail))) {
						fileUploadThis._setProgress(detail)
					}
					break;
			}
		},
		"_setUploadingDetail" : function() {
			var fileUploadThis = this;
			fileUploadThis.$uploadingHtml = $('<div class="tiny-file-single-detail-line">' + '<div class="tiny-file-statusicon tiny-uploading-icon"></div>' + '<span class = "tiny-file-upload-state">' + language.uploading + '</span>' + '<span class= "tiny-file-bytes-uploaded"></span>' + '<a href="javascript:void(0)" class="tiny-file-upload-cancel">' + language.cancelBtnTitile + '</a>' + '</div>');
			fileUploadThis.$detailHtml = fileUploadThis.$uploadingHtml;
			fileUploadThis.$progressHtml = fileUploadThis.$uploadingHtml.find(".tiny-file-bytes-uploaded");
			fileUploadThis._element.append(fileUploadThis.$detailHtml);
			
			//change input image 
			fileUploadThis.$fileNameInputSel.addClass("tiny-file-selected");
		},
		"_setProgress" : function(bytes) {
			var fileUploadThis = this;
			fileUploadThis.$progressHtml.text(language.uploaded + bytes);
		},
		"_setSuccessDetail" : function() {
			var fileUploadThis = this;
			fileUploadThis.$successHtml = $('<div class = "tiny-file-single-detail-line">' + '<div class="tiny-file-statusicon tiny-upload-success-icon"></div>' + '<span class = "tiny-file-upload-state">' + language.uploadSuccess + '</span>' + '<a href="javascript:void(0)" class="tiny-file-upload-remove">' + language.del + '</a>' + '</div>');
			fileUploadThis.$detailHtml.remove();
			fileUploadThis.$detailHtml = fileUploadThis.$successHtml;
			fileUploadThis._element.append(fileUploadThis.$detailHtml);
			
			//change input image 
			fileUploadThis.$fileNameInputSel.removeClass("tiny-file-selected");
		},
		"_setErrorDetail" : function() {
			var fileUploadThis = this;
			fileUploadThis.$errorHtml = $('<div class = "tiny-file-single-detail-line">' + '<div class="tiny-file-statusicon tiny-upload-error-icon"></div>' + '<span class = "tiny-file-upload-state">' + language.uploadFail + '</span>' + '<a href="javascript:void(0)" class="tiny-file-upload-cancel">' + language.cancelBtnTitile + '</a>' + '</div>');
			fileUploadThis.$detailHtml.remove();
			fileUploadThis.$detailHtml = fileUploadThis.$errorHtml;
			fileUploadThis._element.append(fileUploadThis.$detailHtml);
			
			//change input image 
			fileUploadThis.$fileNameInputSel.removeClass("tiny-file-selected");
		},
		
		"_parseValidateParam" : function(element, validate, extendFunction) {
			var fileUploadThis = this, options = fileUploadThis.options;
			element[0].attrObj = {};
			element[0].attrMsgObj = {};

			//add extend function
			if (extendFunction) {
				for (var e = 0, len = extendFunction.length; e < len; e++) {
					UnifyValid.addFunction(extendFunction[e], null);
				}
			}			
			var attrArray = UnifyValid.atrrKeys;
			var errorMsg = options.errorMsg;
			var validArray = validate.split(";");
			for (var i = 0, len = validArray.length; i < len; i++) {
                
				//maxLength(5,6):"please input ..."
				var value = validArray[i].split(":");
				var errorMsgNew = value[1];

				//maxLength(5,6)
				var attr = value[0].split("(");

				var attrName = $.trim(attr[0]);
				var attrParam = [];
				if (attr[1]) {
					attrParam = attr[1].split(")");
				}

				//delete ""
				attrParam.pop();
				var errorMsgNew = errorMsgNew || errorMsg || "";
				
				//根据不同类型名进行属性赋值
				if(attrName === "fileType") {
					options.fileType = attrParam[0];
					options.fileTypeErrorMsg = errorMsgNew;
				}
				else if(attrName === "maxFileSize") {
					options.maxSize = attrParam[0];
					options.maxSizeErrorMsg = errorMsgNew;
				}
				else if(attrName === "minFileSize") {
					options.minSize = attrParam[0];
					options.minSizeErrorMsg = errorMsgNew;
				} 
				else {
					if (_.contains(attrArray, attrName)) {
					for(var j = 0, paramLen = attrParam.length; j < paramLen; j++) {
						$.trim(attrParam[j]);
					}
					errorMsgNew = errorMsgNew || ERROR_INFOMATION[attrName] || "";
					_.extend(element[0].attrObj, _.object([attrName+i], [attrParam]));
					_.extend(element[0].attrMsgObj, _.object([attrName+i], [errorMsgNew]));
				}
				}
			}
		},
		
		//错误处理
		"_errorHandle" : function(errorMsg) {
			var fileUploadThis = this;
			if(fileUploadThis.$fileSelectFr[0].validTip) {
				fileUploadThis.$fileSelectFr[0].validTip.remove();
			}
			if(void 0 !== errorMsg) {
			    fileUploadThis.$fileSelectFr[0].validTip = UnifyValid._addTip(fileUploadThis.$fileSelectFr,
				    "<div class='valid_div'><span class='valid_tip_error'></span><span class='valid_text_error'>" 
				    + errorMsg + "</span></div>", undefined, fileUploadThis.options.tipWidth||undefined);
				fileUploadThis.$fileNameInputSel.addClass("valid_error_input");
				fileUploadThis.$fileSelectFr.attr("hasValidTip", true);
				fileUploadThis.$fileSelectFr[0].validTipRecord = fileUploadThis.$fileSelectFr[0].validTip;
			}	
		},
	
		//正确处理
		"_correctHandle" : function() {
			var fileUploadThis = this;
			if(fileUploadThis.$fileSelectFr[0].validTip) {
			    fileUploadThis.$fileSelectFr[0].validTip.hide();
				fileUploadThis.$fileSelectFr[0].validTip = null;
				fileUploadThis.$fileSelectFr[0].validTipRecord = null;
				fileUploadThis.$fileNameInputSel.removeClass("valid_error_input");
				fileUploadThis.$fileSelectFr.attr("hasValidTip", false);
			}
		},
		
		"_getFileSize" : function(fileObj) {
			
			//文件大小默认为-1（代表文件大小获取不到）
			var fileSize = -1;
			
		    //IE9-浏览器不支持文件大小限制API,需要通过ActiveX插件获取文件大小
			if(fileObj.files) {
				fileSize = fileObj.files[0].size;
			} else {
			    try{
				    var fso = new ActiveXObject("Scripting.FileSystemObject");
					fileObj.select();
                    objValue = document.selection.createRange().text;
                    fileSize = parseInt(fso.getFile(objValue).size, 10);
				}
				catch(err) {
				    fileSize = -1;
				}
		  }
		 
		  return fileSize;
		},
		
		"_addBehaviorFile" : function() {
			var fileUploadThis = this, options = fileUploadThis.options;
			fileUploadThis.validate = false;
			
			//如果定义了tip,绑定focus事件来显示tooltip
			fileUploadThis.$fileNameInputSel.on("focus", function() {
				fileUploadThis.$fileNameInputSel.trigger("focusEvt",[]);
			});
			
			//输入框blur事件，去掉tip提示，显示错误信息
			fileUploadThis.$fileNameInputSel.on("blur", function(evt) {
				fileUploadThis.$fileNameInputSel.trigger("blurEvt",[]);
				
			    //如果存在本次记录的validTip,则显示错误信息
			    if(fileUploadThis.$fileSelectFr[0].validTipRecord) {
			    	fileUploadThis.$fileSelectFr[0].validTip.show();
			        fileUploadThis.$fileNameInputSel.addClass("valid_error_input");
			    }	
			});	
			
			//select file
			fileUploadThis._element.on("change", "#file_upload", function() {				
				var filePath = this.value; 
				
				//未选择到文件
				if("" == filePath) {
					return;
				}
				var fileName = filePath.slice(filePath.lastIndexOf("\\") + 1);
			
				var file = this.files ? this.files[0] : {name:fileName};
				var fileSize = fileUploadThis._getFileSize(this);
				if(fileSize != -1) {
					//MAX-SIZE!!
				    if (options["maxSize"]) {
					    var maxSize = parseInt(options["maxSize"], 10);
					    //not Num or beyond restrain
					    if (isNaN(maxSize) || (maxSize < fileSize)) {
						    fileUploadThis.$fileNameInputSel.val(fileName);
						
						    //如果存在错误提示信息参数，进行错误提示
						    fileUploadThis._errorHandle(options.maxSizeErrorMsg);
						    $(this).trigger("selErrorEvt", [file,"EXCEED_FILE_SIZE"]);
						    return ;
					   } else {
						    fileUploadThis._correctHandle();
					   }
				   }
				
				   //MIN-SIZE!!
				   if (options["minSize"]) {
					   var minSize = parseInt(options["minSize"], 10);
					   if (isNaN(minSize) || (minSize > fileSize)) {
						   fileUploadThis.$fileNameInputSel.val(fileName);
						
						   //如果存在错误提示信息参数，进行错误提示
						   fileUploadThis._errorHandle(options.minSizeErrorMsg);		
						   $(this).trigger("selErrorEvt", [file,"SMALL_FILE_SIZE"]);
						   return ;
					  } else {
						fileUploadThis._correctHandle();
					  }
				  } else {
					  fileUploadThis._correctHandle();
				  }
				}
				   
				//fileType
				if (options["fileType"]) {
					var fileType = fileName.substring(fileName.lastIndexOf("."), fileName.length).toUpperCase(), typeArray = [], typeArrayLen = 0, 
					isSelType = false;
					typeArray = options["fileType"].split(";"),
					typeArrayLen = typeArray.length;
					for (var i = 0; i < typeArrayLen; i++) {
						if (typeArray[i].toUpperCase() == fileType) {
							isSelType = true;
							break;
						}
					}					
					
					//如果类型不正确	
					if (!isSelType) {
						fileUploadThis.$fileNameInputSel.val(fileName);
						
						//如果存在错误提示信息参数，进行错误提示
						fileUploadThis._errorHandle(options.fileTypeErrorMsg);											
						$(this).trigger("selErrorEvt", [file,"INVALID_FILE_TYPE"]);
						return;
					} else {
						fileUploadThis._correctHandle();
					}
				}
				
				//trigger select Event
				$(this).trigger("selEvt", [file]);
				
				//for single避免多个iframe出现的情况
				if (!fileUploadThis.$fileiframeSel) {
				    fileUploadThis.$fileiframeSel = $('<iframe name="iframePostForm" style="display:none;"></iframe>');
				    fileUploadThis._element.append(fileUploadThis.$fileiframeSel);
				}
				fileUploadThis.validate = true;
				fileUploadThis.$fileNameInputSel.val(fileName);
				fileUploadThis.file = file;
			});
			fileUploadThis._element.on("click", ".tiny-file-upload-button", function() {
				fileUploadThis._element.trigger("submitEvt");				
			});
			fileUploadThis._element.on("submitEvt",function(){
				
				//防止错误提交，重复提交
				if (!fileUploadThis.validate) {
					return;
				}
				
				//for single
				if (fileUploadThis.$detailHtml) {
					fileUploadThis.$detailHtml.remove();
				}
				
				//set progress
				if ("false" !== String(options["enableDetail"])) {
					fileUploadThis._setUploadingDetail();
					if ("false" !== String(options["enableProgress"])) {
					    fileUploadThis._setProgress("0KB");
				    }
				}
				
				if(void 0 !== options.formData) {
					fileUploadThis.addFormData(options.formData);
				}
				$(this).trigger("beforeSubmitEvt", [fileUploadThis.file]);
				fileUploadThis.$formSel.submit();
				$(this).trigger("afterSubmitEvt", [fileUploadThis.file]);
				fileUploadThis.$fileiframeSel.on("load", function() {
					var result = $(this.contentWindow.document.body).text() || {};
					$(this).trigger("completeEvt", [result]);
					fileUploadThis._destroyFileInfo();												
				});
			});
			fileUploadThis._element.on("click", ".tiny-file-upload-cancel", function(event) {
				fileUploadThis.$detailHtml.hide();
				fileUploadThis.$fileNameInputSel.val("");
				fileUploadThis.$fileNameInputSel.removeClass("tiny-file-selected");
				$(this).trigger("cancelEvt", [event]);
			});
			fileUploadThis._element.on("click", ".tiny-file-upload-remove", function(event) {
				fileUploadThis.$detailHtml.hide();
				fileUploadThis.$fileNameInputSel.val("");
				$(this).trigger("removeEvt", [event]);
			});
			//处理selectError事件
			fileUploadThis._element.on("selErrorEvt", function(event,file,errorMsg) {
				if ("function" == ( typeof options["selectError"])) {
					options["selectError"](event,file,errorMsg);
				}
			});
			//处理select事件
			fileUploadThis._element.on("selEvt", function(event,file) {
				if ("function" == ( typeof options["select"])) {
					options["select"](event,file);
				}
			});
			//处理beforeSubmit事件
			fileUploadThis._element.on("beforeSubmitEvt", function(event, file) {
				if ("function" == ( typeof options["beforeSubmit"])) {
					options["beforeSubmit"](event, file);
				}
			});
			//处理afterSubmitEvt事件
			fileUploadThis._element.on("afterSubmitEvt", function(event) {
				if ("function" == ( typeof options["afterSubmit"])) {
					options["afterSubmit"](event);
				}
			});
			//处理complete事件
			fileUploadThis._element.on("completeEvt", function(event, result) {
				if ("function" == ( typeof options["complete"])) {
					options["complete"](event, result);
				}
			});
			//处理remove事件
			fileUploadThis._element.on("removeEvt", function(event) {
				if ("function" == ( typeof options["remove"])) {
					options["remove"](event);
				}
			});
			//处理cancel事件
			fileUploadThis._element.on("cancelEvt", function(event) {
				if ("function" == ( typeof options["cancel"])) {
					options["cancel"](event);
				}
			});
		},
		
		//multi file code
		"_opMultiHtml" : function() {
			var fileUploadThis = this, options = fileUploadThis.options, 			
			method = $.encoder.encodeForHTMLAttribute("method", options.method, true) || "post";
			
			//set Name 
			var name = $.encoder.encodeForHTMLAttribute("name", options.fileObjName, true);	
			var action = options["action"];		
			var multiHtml = "";
			if("false" !== String("showform")) {
				multiHtml += '<form id="tiny-file-upload-form" target="iframePostForm"  method="'+method+'" enctype="multipart/form-data" action="' + action + '">';
			}
			//select button
			 multiHtml += '<div class="tiny-file-upload-list"></div>';
			 if("false" !== String("showform")) {
			 	multiHtml += '</form>';
			 }
			 multiHtml +=
			  '<div class = "tiny-file-multi-select">' 
			 + '<input type="file" id="file_upload" class = "tiny-file-multi-select-button" name="'+name+'"/>'
			 + '<a href="javascript:void(0)" class= "tiny-file-upload-multi">' 
			 + '<div class="tiny-button">' + '<div class="tiny-right">' + '<div class="tiny-center">' 
			 + '<div class="tiny-leftImg" style="display: none;"></div>' 
			 + '<span class="tiny-button-buttonCenterText">' + language.selectFile + '</span>' 
			 + '<div class="tiny-rightImg" style="display: none;"></div>' + '</div>' + '</div>' + '</div>' 
			 + '</a>' + '</div>'
			
			//submit button			
			if("false" !== String(options.showSubmitBtn)){		
			    multiHtml += '<div class = "tiny-file-multi-submit">'
			                +'<a href="javascript:void(0)" class= "tiny-file-upload-button">' 
			                + '<div class="tiny-button">' 
			                + '<div class="tiny-right">' 
			                + '<div class="tiny-center">' 
			                + '<div class="tiny-leftImg" style="display: none;"></div>' 
			                + '<span class="tiny-button-buttonCenterText">' + language.upload + '</span>' 
			                + '<div class="tiny-rightImg" style="display: none;"></div>' 
			                + '</div>' 
			                + '</div>' + '</div>' 
			                + '</a>' + '</div>'; 
			}
			multiHtml += '<div style = "clear:both;"></div>';
			
			//generate total progressbar 
			if ("false" !== String(options["enableTotalProgress"])) {
				multiHtml += '<div style="margin-top:10px;">'+'<span style="margin-right:10px;">' + language.totalProgress + '</span>' 
				+ '<div id = "total-progress" style = "display:inline-block;position: relative;"></div>' 
				+ '<div class = "tiny-file-progressDetail"></div></div>'
				+ '<div id = "tiny-file-status"></div>'
			    + '<div id = "file-waiting-status" style="display:none;"></div>' ;
			} else{
				multiHtml += '<div id = "tiny-file-status"></div>'
			               + '<div id = "file-waiting-status" style="display:none;"></div>';			               
			}	
			multiHtml += '<div id = "file-uploading-status" style = "display:none;"></div>';		
			fileUploadThis.multiFrameHtml = $(multiHtml);
		},
		"_opMultiWaitingHtml" : function(id, name) {
			var multiDetailHtml = $('<div id = "tiny-file' + id + '" status = "waiting" class="tiny-file-status-line">' + '<div class="tiny-file-statusicon tiny-upload-waiting-icon" style="position: relative;bottom: 3px;"></div>' + '<span class = "tiny-file-multi-name" style="margin-left: 5px;">' + name + '</span>' + '<span class = "tiny-file-upload-state" style="margin-left: 20px;color: #5b5b5b;">' + language.uploadWaiting + '</span>' + '<a href="javascript:void(0)" class="tiny-file-multi-upload-cancel" style = "margin-left: 20px;">' + language.cancelBtnTitile + '</a>' + '</div>');
			return multiDetailHtml;
		},
		"_opMultiSuccessHtml" : function(id, name) {
			var multiSuccessHtml = $('<div id = ' + id + ' status = "success" class="tiny-file-status-line">' + '<div class="tiny-file-statusicon tiny-upload-success-icon"></div>' + '<span class = "tiny-file-multi-name" style = "margin-left:5px;">' + name + '</span>' + '<a href="javascript:void(0)" class="tiny-file-multi-upload-remove" style = "margin-left:20px;">' + language.del + '</a>' + '</div>');
			return multiSuccessHtml;
		},
		"_opMultiErrorHtml" : function(id, name) {
			var multiErrorHtml = $('<div id = ' + id + ' status = "error" class="tiny-file-status-line">' + '<div class="tiny-file-statusicon tiny-upload-error-icon"></div>' + '<span class = "tiny-file-multi-name" style = "margin-left:5px;">' + name + '</span>' + '<span class = "tiny-file-upload-state" style = "color: #BE0000;margin-left:20px;">' + language.multiFailed + '</span>' + '<a href="javascript:void(0)" class="tiny-file-multi-upload-reload" style = "margin-left:20px;">' + language.reload + '</a>' + '<a href="javascript:void(0)" class="tiny-file-multi-upload-cancel" style = "margin-left:10px;">' + language.cancelBtnTitile + '</a>' + '</div>');
			return multiErrorHtml;
		},
		"_opMultiProgressHtml" : function(id, name) {
			var multiProgressHtmlStr = '<div id = "tiny-file' + id + '" status = "uploading" class="tiny-file-status-line">' 
			+ '<div class="tiny-file-statusicon tiny-uploading-icon"></div>' 
			+ '<span class = "tiny-file-multi-name" style = "margin-left:5px;">' + name + '</span>';
			if ("false" !== String(this.options["enableProgress"])) {
				multiProgressHtmlStr += '<div id="tiny-file-status' + id + '" class = "tiny-file-status-all"></div>';
			}
			multiProgressHtmlStr += '<a href="javascript:void(0)" class="tiny-file-multi-upload-cancel">' + language.cancelBtnTitile + '</a>' + '</div>';
			return $(multiProgressHtmlStr);
		},
		"_creatProgressbar" : function($selector, width, height) {
			var fileUploadThis = this;
			
			//creat progressbar
			var progressbar = new Progressbar({
				"width" : width,
				"height" : height
			});
			$selector.html(progressbar.getDom());
		},
		"submit" : function() {
			this._element.trigger("submitEvt");
		},
		"empty" : function() {
			var fileUploadThis = this;
			if("true" === String(fileUploadThis.options.multi)) {
				fileUploadThis._destroyMultiList();
				
				//删除显示内容
				var fileListChild = fileUploadThis.$formStatusSel.children();
				if(fileListChild.length !== 0) {
					fileListChild.remove();
				}
				else if(fileUploadThis.$formWaitingSel.children().length !== 0) {
					fileUploadThis.$formWaitingSel.children().remove();
				}
			} else {
				//重置form表单
                fileUploadThis.$formSel[0].reset();
            
               
				if(null !== fileUploadThis.$fileiframeSel) {
					fileUploadThis._destroyFileInfo();		
				}			    
			}				
		},
		"getFileObject" : function() {
			var fileUploadThis = this, options = fileUploadThis.options, fileObject;
			
			//分别判断单文件和多文件获取的表单DOM对象
			if("true" !== String(options["multi"])) {
				fileObject = fileUploadThis.$fileSelectSel;
			} else {
				fileObject = fileUploadThis.$formUploadList;
			}
			return fileObject;
		},
		"_destroyFileInfo" : function() {
			var fileUploadThis = this;
			//删除iframe和上传文件的信息
			fileUploadThis.validate = false;
			
			//删除文件	
			fileUploadThis.file = null;
			if(fileUploadThis.$fileiframeSel) {
				fileUploadThis.$fileiframeSel.remove();
			    fileUploadThis.$fileiframeSel = null;    //清除引用
			}			
			
			//addon input delete
			if(fileUploadThis.$formDatainput) {
				fileUploadThis.$formDatainput.remove();
			    fileUploadThis.$formDatainput = null;	
			}					
		},
		"_destroyMultiList" : function() {
			var fileUploadThis = this;			
			
			//删除 文件上传列表中的信息
			var fileListChild = fileUploadThis.$formUploadList.children();
			if(fileListChild.length !== 0){
				fileUploadThis.$formUploadList.children().remove();
			    fileUploadThis.selectFileNameQueue = [];
			}			
					
			//delete iframe	
			if(fileUploadThis.$fileiframeSel) {
				fileUploadThis.$fileiframeSel.remove();
			    fileUploadThis.$fileiframeSel = null;    //清除引用
			}	
					
			//删除---文件上传控件增加文件
			if(fileUploadThis.$formDatainput) {						
			    fileUploadThis.$formDatainput.remove();
				fileUploadThis.$formDatainput = null;
			}	
		},
		"setTotalProgress" : function(uploadSize, totalSize) {
			var fileUploadThis = this;
			if ((!isNaN(parseFloat(totalSize))) && (!isNaN(parseFloat(uploadSize)))) {
				fileUploadThis._element.find(".tiny-file-progressDetail").html(language.uploadProgress + uploadSize + ' ' + language.totalSize + totalSize);
				fileUploadThis._element.find("#total-progress").find(".tiny-progressbar").widget().opProgress(parseFloat(uploadSize) / parseFloat(totalSize) * 100);
			}
		},
		"addFormData" : function(formData){
			var fileUploadThis = this, options = fileUploadThis.options,
			submitList;
			//对单文件和多文件传入的表单内容放置位置作以区别
			if("true" !== String(options["multi"])) {
				submitList = fileUploadThis.$formSel;
			} else {
				submitList = fileUploadThis.multiFrameHtml;
			}
			
			//用户传入的formData可为1.JSON字符串--将用户传入的数据在控件生成的input中拼装
			//                 2.DOM/jQuery对象--直接加入要提交的表单中
			if(!fileUploadThis.$formDatainput) {
				fileUploadThis.$formDatainput = $('<input type = "hidden" name = "tinyFormDatas"/>');
			}			
			fileUploadThis.$formDatainput.val(JSON.stringify(formData));			    
			submitList.append(fileUploadThis.$formDatainput);
		},
		"addFormDom" : function(formDom){
			var fileUploadThis = this, options = fileUploadThis.options, 
			submitList;
			//对单文件和多文件传入的表单内容放置位置作以区别
			if("true" !== String(options["multi"])) {
				submitList = fileUploadThis.$formSel;
			} else {
				submitList = fileUploadThis.multiFrameHtml;
			}
			for(var i = 0, len = formDom.length; i < len; i++){
				submitList.append(formDom[i]);
			}			
		},
		"setMultiQueueDetail" : function(filePath, detail) {
			var fileUploadThis = this;
			
			var selectLength = fileUploadThis.selectFileQueue.length;
			var correId;
			for (var i = 0; i < selectLength; i++) {
				if (filePath == fileUploadThis.selectFileQueue[i].filePath) {
					correId = fileUploadThis.selectFileQueue[i].orderId;
					break;
				}
			}
			var $fileThisSel = fileUploadThis._element.find("#" + correId), fileName = $fileThisSel.find(".tiny-file-multi-name").html();
			switch (detail) {
				case "success":
					var successHtml = fileUploadThis._opMultiSuccessHtml(correId, fileName);
					$fileThisSel.replaceWith(successHtml);
					break;
				case "error":
					var errorHtml = fileUploadThis._opMultiErrorHtml(correId, fileName);
					$fileThisSel.replaceWith(errorHtml);
					break;
				default:
					if (!isNaN(parseFloat(detail))) {
						$fileThisSel.find(".tiny-progressbar").widget().option("value", parseFloat(detail));
					}
					break;
			}
		},
		"_findFileDetail" : function(orderId) {
			var fileUploadThis = this, queuelength = fileUploadThis.selectFileQueue.length;
			for (var i = 0; i < queuelength; i++) {
				if (orderId == fileUploadThis.selectFileQueue[i].orderId) {
					return fileUploadThis.selectFileQueue[i];
				}
			}
		},
		"_addBehaviorMultiFile" : function() {
			var fileUploadThis = this, options = fileUploadThis.options;
			fileUploadThis.selectNum = 0;
			
			//select file
			fileUploadThis._element.on("change", ".tiny-file-multi-select-button", function() {
				var filePath = this.value; 
				
				//未选择到文件
				if("" === filePath) {
					return;
				}
				var fileName = filePath.slice(filePath.lastIndexOf("\\") + 1);
				var file = this.files ? this.files[0] : {name:fileName};
				var size = fileUploadThis._getFileSize(this);
				if(size != -1) {
				    
				    //max-size restrict
				    if (options["maxSize"]) {
					    var maxSize = parseInt(options["maxSize"], 10);
					    if (isNaN(maxSize)||(maxSize < 0) || (maxSize < size)) {
						    $(this).trigger("selErrorEvt", [file,"EXCEED_FILE_SIZE"]);
						    return ;
					    }
				    }
				
				    //min-size restrict
				    if (options["minSize"]) {
					    var minSize = parseInt(options["minSize"], 10);
					    if (isNaN(minSize) ||(minSize < 0)|| (minSize > size)) {
						    $(this).trigger("selErrorEvt", [file,"SMALL_FILE_SIZE"]);
						    return ;
					    }
				    }			
				} 
				
				//fileType
				var fileType = fileName.substring(fileName.lastIndexOf("."), fileName.length).toLowerCase();
				if (options["fileType"]) {
					var typeArray = [], typeArrayLen = 0, isSelType = false;
					typeArray = options["fileType"].split(";");
					typeArrayLen = typeArray.length;
					for (var i = 0; i < typeArrayLen; i++) {
						if (typeArray[i].toLowerCase() == fileType) {
							isSelType = true;
							break;
						}
					}
					if (!isSelType) {
						$(this).trigger("selErrorEvt", [file,"INVALID_FILE_TYPE"]);	
						return ;
					}
				}
				
				//max-count restrict 
				if (options["maxCount"]) {
					var maxNum = parseInt(options["maxCount"], 10);
					
					//NaN || beyond restrain
					if (isNaN(maxNum) ||(maxNum < 0)|| (maxNum < fileUploadThis.selectFileNameQueue.length)) {
						$(this).trigger("selErrorEvt", [file,"EXCCED_FILE_COUNT"]);	
						return ;
					}
				}
				
				//is repeat
				if("false" !== String(options.enableRepeat)) {
					if (_.contains(fileUploadThis.selectFileNameQueue, filePath)) {
					    $(this).trigger("selErrorEvt", [file,"REPEAT_FILE"]);
					    return ;
				   }
				}
				
				$(this).trigger("selEvt", [file]);
				if (!fileUploadThis.$fileiframeSel) {
					fileUploadThis.$fileiframeSel = $('<iframe name="iframePostForm" style="display:none;"></iframe>');
					fileUploadThis._element.append(fileUploadThis.$fileiframeSel);
				}
				
				fileUploadThis.selectFileNameQueue.push(filePath);
				var order = fileUploadThis.selectFileNameQueue.length;
				
				//generate waiting HTML&&uploading HTML
				if(void 0 !== options.listTemplate) {
                	var multiWaitingHtml = _.template(options.listTemplate,{"name" : fileName,"size" : size, "type" : fileType, "file" : file});
                	fileUploadThis.$formStatusSel.append(multiWaitingHtml);
                }				
                else if ("false" !== String(options["enableDetail"])) {
				    var multiWaitingHtml = fileUploadThis._opMultiWaitingHtml(order, fileName);
				    var multiUploadingHtml = fileUploadThis._opMultiProgressHtml(order, fileName);
				    if ("false" !== String(options["enableProgress"])) {
					    var $selector = multiUploadingHtml.find("#tiny-file-status" + order), width = "130px", height = "10px";
					    fileUploadThis._creatProgressbar($selector, width, height);
				    }
				    if("none" === fileUploadThis.$formWaitingSel.css("display")) {
				    	fileUploadThis.$formWaitingSel.show();
				    }				    
				    fileUploadThis.$formWaitingSel.append(multiWaitingHtml);
				    fileUploadThis.$formUploadingSel.append(multiUploadingHtml);
				}                
				fileUploadThis.selectNum++;	
				fileUploadThis.$formUploadList.append($(this));	
				var fileObjNameEncodered =  $.encoder.encodeForHTMLAttribute("name", options.fileObjName, true);	
				var $newFileInput = $('<input type="file" class="tiny-file-multi-select-button" name="'+fileObjNameEncodered+'"/>');
				fileUploadThis.$formUploadSel.append($newFileInput);			
				fileUploadThis.selectFileQueue.push({
					"filePath" : filePath,
					"fileName" : fileName,
					"orderId" : "tiny-file" + order,					
					"fileInput" : $(this),
					"uploadingHtml" : multiUploadingHtml
				});	
			});
			fileUploadThis._element.on("click", ".tiny-file-upload-button", function(event) {
			    $(this).trigger("submitEvt");
			});
			fileUploadThis._element.on("submitEvt", function(){
				
				//未选择有效文件，返回
				if(fileUploadThis.selectFileNameQueue.length == 0){
					return;
				}
				
				//set progress
				if("false" !== String(options.enableDetail)) {
			        for (var i = 0; i < fileUploadThis.selectNum; i++) {
					    fileUploadThis.$formWaitingSel[0].lastChild.remove();
				    }
				    fileUploadThis.$formWaitingSel.append(fileUploadThis.$formUploadingSel.children());
				    fileUploadThis.$formUploadingSel.children().remove();
				}				
				
				//check how many files are selected to set uploading status when submit
				fileUploadThis.selectNum = 0;
				if(void 0 !== options.formData) {
					fileUploadThis.addFormData(options.formData);
				}
				$(this).trigger("beforeSubmitEvt", [event, fileUploadThis.selectFileQueue]);
				fileUploadThis.$formSel.submit();
				$(this).trigger("afterSubmitEvt", [event, fileUploadThis.selectFileQueue]);
				fileUploadThis.$fileiframeSel.on("load", function() {
					var result =  $(this.contentWindow.document.body).text() || {};
					$(this).trigger("completeEvt", [result]);					
					fileUploadThis._destroyMultiList();					
				});
			});
			fileUploadThis._element.on("click", ".tiny-file-multi-upload-remove", function(event) {
				var $thisSel = $(this).parent(), removeId = $thisSel.attr("id"), corrFileDetail = fileUploadThis._findFileDetail(removeId);
				
				//去掉本行详情
				$thisSel.remove();
				
				//去掉在队列中的该文件信息
				fileUploadThis.selectFileQueue = _.without(fileUploadThis.selectFileQueue, corrFileDetail);
				
				//触发删除事件
				$(this).trigger("removeEvt", [event, corrFileDetail]);
			});
			
			//取消事件
			fileUploadThis._element.on("click", ".tiny-file-multi-upload-cancel", function(event) {
				var $thisSel = $(this).parent(), cancelId = $thisSel.attr("id"), corrFileDetail = fileUploadThis._findFileDetail(cancelId);
				
				//remove waiting status
				if ("waiting" == $thisSel.attr("status")) {
					fileUploadThis.selectNum--;
					
					//去掉该文件在 uploading队列 和 文件上传队列中的DOM 
				    corrFileDetail.uploadingHtml.remove();				
				    corrFileDetail.fileInput.remove();
				}
				
				//去掉本行详情
				$thisSel.remove();	
				
				//去掉在队列中的该文件信息
				fileUploadThis.selectFileQueue = _.without(fileUploadThis.selectFileQueue, corrFileDetail);
				fileUploadThis.selectFileNameQueue = _.without(fileUploadThis.selectFileNameQueue, corrFileDetail.filePath);
				
				//触发取消事件
				$(this).trigger("cancelEvt", [event, corrFileDetail]);
			});
			fileUploadThis._element.on("click", ".tiny-file-multi-upload-reload", function(event) {
				var $thisSel = $(this).parent(), reloadId = $thisSel.attr("id"), corrFileDetail = fileUploadThis._findFileDetail(reloadId),			
				
				//set progress 0
				$uploadingSel = corrFileDetail.uploadingHtml;
				$progreeSel = $uploadingSel.find(".tiny-progressbar-fillimage-green");				
				if ($progreeSel) {
					$uploadingSel.find(".tiny-progressbar-lablebox").html("0%");
					$progreeSel.remove();
				}
				$(this).parent().replaceWith(corrFileDetail.uploadingHtml);
				$(this).trigger("reloadEvt", [event, corrFileDetail]);
			});
			
			//处理selectError事件
			fileUploadThis._element.on("selErrorEvt", function(event,file,errorMsg) {
				if ("function" == ( typeof options["selectError"])) {
					options["selectError"](event,file,errorMsg);
				}
			});
			
			//处理select事件
			fileUploadThis._element.on("selEvt", function(event,file) {
				if ("function" == ( typeof options["select"])) {
					options["select"](event,file);
				}
			});
			
			//处理beforeSubmit事件
			fileUploadThis._element.on("beforeSubmitEvt", function(event) {
				if ("function" == ( typeof options["beforeSubmit"])) {
					options["beforeSubmit"](event, fileUploadThis.selectFileQueue);
				}
			});
			//处理afterSubmitEvt事件
			fileUploadThis._element.on("afterSubmitEvt", function(event) {
				if ("function" == ( typeof options["afterSubmit"])) {
					options["afterSubmit"](event, fileUploadThis.selectFileQueue);
				}
			});
			//处理complete事件
			fileUploadThis._element.on("completeEvt", function(event, result) {
				if ("function" == ( typeof options["complete"])) {
					options["complete"](event, result, fileUploadThis.selectFileQueue);
				}
			});
			//处理remove事件
			fileUploadThis._element.on("removeEvt", function(event, corrFilePath) {
				if ("function" == ( typeof options["remove"])) {
					options["remove"](event, corrFilePath, fileUploadThis.selectFileQueue);
				}
			});
			//处理cancel事件
			fileUploadThis._element.on("cancelEvt", function(event, corrFilePath) {
				if ("function" == ( typeof options["cancel"])) {
					options["cancel"](event, corrFilePath, fileUploadThis.selectFileQueue);
				}
			});
			//处理reload事件
			fileUploadThis._element.on("reloadEvt", function(event, corrFilePath) {
				if ("function" == ( typeof options["reload"])) {
					options["reload"](event, corrFilePath, fileUploadThis.selectFileQueue);
				}
			});
		}
	});
	return FileUpload;
}); 