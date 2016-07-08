define(["tiny-directives/Directive", "tiny-widgets/FileUpload"], function(Directive, FileUploadWidget) {
	var DEFAULT_CONFIG = {
		"directiveName" : "tinyFileupload",
		"widgetClass" : FileUploadWidget,
		"constantProperties" : ["id", "multi","action","enableDetail","enableProgress","fileType","showSubmitBtn","width","method",
		"maxCount","maxSize","minSize","selectError","select","beforeSubmit","afterSubmit","complete","cancel","remove","reload",
		"enableRepeat","listTemplate", "formData", "enableTotalProgress", "disable", "tooltip", "tipWidth", "validate", "fileObjName", "showform"],
		"scope" : {
			"model" : "=tinyFileupload",
			"id" :"=",
			"tooltip" : "=",
			"tipWidth" : "=",
			"validate" : "=",
			"multi" : "=",
			"action" : "=",
			"width" : "=",
			"method" : "=",
			"formData" : "=",
			"enableDetail" : "=",
			"listTemplate" : "=",
			"fileObjName" : "=",
			"enableTotalProgress" : "=",
			"enableProgress" : "=",
			"enableRepeat" : "=",
			"showSubmitBtn" : "=",
			"fileType" : "=",
			"disable" : "=",
			"maxCount" : "=",
			"maxSize" : "=",
			"minSize" : "=",
			"selectError" : "=",
			"select" : "=",
			"beforeSubmit" : "=",
			"afterSubmit" : "=",
			"complete" : "=",
			"cancel" : "=",
			"remove" : "=",
			"reload" : "=",
			"showform" : "="
		},
		"replace" : true,
		"template":"<div></div>"
	};

	var FileUpload = Directive.extend({
		"init" : function(options) {
			var directiveThis = this;
			directiveThis._super(_.extend({}, DEFAULT_CONFIG, options));
		},
		"compile" : function(element, attrMap, transclude) {
            var directiveThis = this;
            return directiveThis.link;
        },
		"link": function( scope, element, attrMap ){
			var fileUploadThis = this,constants = _.pick(scope, fileUploadThis.constantProperties);
			
			//filter undefined scope
			var validProperName = [];
			_.filter(constants,function(value,key){
				if(value !== undefined) {
					validProperName.push(key);
				}
                return value !== undefined;
			});
			fileUploadThis = new fileUploadThis.widgetClass(_.pick(constants,validProperName));
			element.append(fileUploadThis._element);			
			fileUploadThis._element.prop("id",scope.id);
        }
	});
	new FileUpload().toAngularDirective();
	return FileUpload;
});
