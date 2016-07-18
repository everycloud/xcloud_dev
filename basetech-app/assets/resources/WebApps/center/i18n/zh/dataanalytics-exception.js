define([], function() {
	var exceptionMap = {
		"0000000001" : {
			"cause" : "内部错误。",
			"desc" : "内部错误。",
			"solution" : ""
		},
		"0000010002" : {
			"cause" : "参数错误。",
			"desc" : "参数错误。",
			"solution" : "请检查输入参数，确认输入参数无误。"
		}
	};
	return exceptionMap;
})