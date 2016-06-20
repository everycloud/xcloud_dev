
function testCaseCtrl($scope,  $stateParams, $sce) {
    $scope.mode = $sce.trustAsResourceUrl($stateParams.mode);
    $scope.param1 = $stateParams.param1;
    $scope.param2 = $stateParams.param2;
    if($scope.mode == "test_trend"){
    	var appname = $scope.param1;
    	var branch = $scope.param2;
    	var url = "/view/test/test_trend.html#/testchange/" + appname + "/" + branch;
    	$scope.url = $sce.trustAsResourceUrl(url);
    }else if($scope.mode == "test_diff"){
    	
    }
}

function testDiffCtrl($scope, $stateParams, $state, testdiff){
	$scope.appname = $stateParams.appname;
	$scope.projectid = $stateParams.projectid;
	$scope.accesstime = $stateParams.accesstime;
	$scope.baseversion = $stateParams.baseversion;
	$scope.baseversion1 = $stateParams.baseversion1;
	$scope.baseversion2 = $stateParams.baseversion2;
	$scope.statename = $state.current.name;
	window.scope = $scope;
	if($state.current.name == "testDiff"){
		testdiff.getTestDiffDetail($stateParams.appname,$stateParams.projectid,$stateParams.accesstime,$stateParams.baseversion, function(diffinfo){
			$scope.diffinfo = diffinfo;
			window.diffinfo = diffinfo;
		});
	}else if ($state.current.name == "baseDiff"){
		testdiff.getBaseDiffDetail($stateParams.appname,$stateParams.baseversion1,$stateParams.baseversion2,function(diffinfo){
			$scope.diffinfo = diffinfo;
		});
	}
	testdiff.getTestCaseRunInfo($stateParams.appname, function(res){
		$scope.testVersionTime = res;
	});
	testdiff.getTestBaseVersions($stateParams.appname, function(res){
		$scope.baseVersion = res;
	});
	$scope.setTestDiffHref = function(){
		var url = '#/testdiff/' + $scope.diffinfo.info.appname + '/' + $scope.version_select + '/' + $scope.time_select + '/' + $scope.base_version_select;
		window.location.href = url;
	},
	$scope.setBaseDiffHref = function(){
		var url = '#/basediff/' + $scope.diffinfo.info.appname + '/' + $scope.base_version_1_select + '/' + $scope.base_version_2_select;
		window.location.href = url;
	}
    $scope.trendUrl = "/view/test/test_trend.html#/testchange/" + $scope.appname + "/" + $scope.projectid;
}


function baseSetCtrl($scope, $stateParams, baseset,testdiff){
	$scope.appname = $stateParams.appname;
	$scope.projectid = $stateParams.projectid;
	$scope.testBaseConfirmed = {};
	baseset.getBase($stateParams.appname,$stateParams.projectid,function(baseinfo){
		$scope.baseinfo = baseinfo;
		window.baseinfo = baseinfo;
	});
	
	$scope.baseConfirmed = function(){
		var arr = new Array();
		var output = [];

		for (var key in $scope.testBaseConfirmed) {
 
    		output.push(key);
		}
	 	$.post("/testShow/testBaseConfirmed", 
	 	{	
	 		productName: $scope.appname, 
	 		productVersion : $scope.projectid,
	 		testBaseConfirmed : output
	 		
	 	},
	 	function(res){
	 		var url = '#/projectDetail/' + $scope.projectid ;
			window.location.href = url;
	 	});
	}
	testdiff.getTestBaseVersions($stateParams.appname, function(res){
		$scope.baseVersion = res;
	});
	$scope.setBaseDiffHref = function(){
		var url = '#/basediff/' + $scope.baseinfo.productName + '/' + $scope.base_version_1_select + '/' + $scope.base_version_2_select;
		//window.url = url;
		window.location.href = url;
	};
	$scope.selectAllChanged = function(){
      $scope.testBaseConfirmed = {};
      if($("input[type=checkbox]#boxSelectAll:checkbox")[0].checked){
         for(var key in baseinfo.testCompareEntityMap){
            var value = baseinfo.testCompareEntityMap[key];
            $scope.testBaseConfirmed[value.testCaseEntity.caseId] = true;
         }
      }
    }
}

function testDiffCtrlV2($scope, $stateParams, $state, testdiff){
	$scope.appname = $stateParams.appname;
	$scope.projectid = $stateParams.projectid;
	$scope.accesstime = $stateParams.accesstime;
	$scope.baseversion = $stateParams.baseversion;
	$scope.baseversion1 = $stateParams.baseversion1;
	$scope.baseversion2 = $stateParams.baseversion2;
	$scope.statename = $state.current.name;
	
    $scope.status = {};
	$scope.status.firstOpen = true;
	$scope.status.secondOpen = true;
	$scope.status.thirdOpen = true;
	window.scope = $scope;
	var dealMessageDes = function(){
		if($scope.diffinfo.currentCases == undefined)
			return;
		for(var ind in $scope.diffinfo.currentCases){
			var message = $scope.diffinfo.currentCases[ind].message;
			if(message == undefined || message == "")
				continue;
			var endIndex = message.indexOf('\n');
			var messageDescription = message.substr(0,endIndex);
			$scope.diffinfo.currentCases[ind].message_description = messageDescription;
		}
	}
	if ($state.current.name == "baseDiff" || $state.current.name == "baseDiffV2"){
		testdiff.getBaseDiffDetail($stateParams.appname,$stateParams.baseversion1,$stateParams.baseversion2,function(diffinfo){
			$scope.diffinfo = diffinfo;
			dealMessageDes();
			$scope.diffinfoSafe = diffinfo;
			$scope.allCurrent();
			$scope.allChanged();
		});
	}else if($state.current.name == "testDiffV2" || $state.current.name == "testDiff"){
		testdiff.getTestDiffDetail($stateParams.appname,$stateParams.projectid,$stateParams.accesstime,$stateParams.baseversion, function(diffinfo){
			$scope.diffinfo = diffinfo;
			dealMessageDes();
			$scope.diffinfoSafe = diffinfo;
			window.diffinfo = diffinfo;
			$scope.allCurrent();
			$scope.allChanged();
		});
	}
    var restoreClass = function() {
        $scope.allCurrentClass = "btn btn-white";
        $scope.failedClass = "btn btn-white";
        $scope.succeedClass = "btn btn-white";
    };
    var restoreClass2 = function() {
        $scope.allChangedClass = "btn btn-white";
        $scope.addedClass = "btn btn-white";
        $scope.missedClass = "btn btn-white";
        $scope.timeChangedClass = "btn btn-white";
        $scope.allBaseClass = "btn btn-white";
        $scope.sameBaseClass = "btn btn-white";
    };
	$scope.allCurrent = function(){
		//$scope.caseShow = $.merge([], $scope.diffinfo.changedCases);
		//$.merge($scope.caseShow, $scope.diffinfo.otherCases) ;
		$scope.caseShow = $scope.diffinfo.currentCases;
		$scope.caseShowSafe = $scope.caseShow;
		window.caseShow = $scope.caseShow;
        restoreClass();
        $scope.allCurrentClass = "btn btn-info";
	};
	$scope.failed = function(){
		$scope.caseShow = $scope.diffinfo.currentCases.filter(function(e) {
            if (e.result != "success" && e.result != "") return e;
        });
		$scope.caseShowSafe = $scope.caseShow;
        restoreClass();
        window.caseShow = $scope.caseShow;
        $scope.failedClass = "btn btn-info";
	};
	$scope.succeed = function(){
		$scope.caseShow = $scope.diffinfo.currentCases.filter(function(e) {
            if (e.result == "success" || e.result == "") return e;
        });
		$scope.caseShowSafe = $scope.caseShow;
        restoreClass();
        window.caseShow = $scope.caseShow;
        $scope.succeedClass = "btn btn-info";
	};
	$scope.allChanged = function(){
		$scope.caseShow2 = $scope.diffinfo.currentCases.filter(function(e) {
            if (e.changeInfo == "CaseMissed" || e.changeInfo == "CaseAdded" || e.changeInfo == "TimeChanged") return e;
        });
        $.merge($scope.caseShow2, $scope.diffinfo.missedCases);
		$scope.caseShowSafe2 = $scope.caseShow2;
        restoreClass2();
        $scope.allChangedClass = "btn btn-info";
	};
	$scope.missed = function(){
		$scope.caseShow2 = $scope.diffinfo.missedCases;
		$scope.caseShowSafe2 = $scope.caseShow2;
        restoreClass2();
        $scope.missedClass = "btn btn-info";
	};
	$scope.added = function(){
		$scope.caseShow2 = $scope.diffinfo.currentCases.filter(function(e) {
            if (e.changeInfo == "CaseAdded") return e;
        });
		$scope.caseShowSafe2 = $scope.caseShow2;
        restoreClass2();
        $scope.addedClass = "btn btn-info";
	};
	$scope.timechanged = function(){
		$scope.caseShow2 = $scope.diffinfo.currentCases.filter(function(e) {
            if (e.changeInfo == "TimeChanged") return e;
        });
		$scope.caseShowSafe2 = $scope.caseShow2;
        restoreClass2();
        $scope.timeChangedClass = "btn btn-info";
	};
	$scope.allBase = function(){
		$scope.caseShow2 = $.merge([], $scope.diffinfo.currentCases);
		$.merge($scope.caseShow2, $scope.diffinfo.missedCases);
		$scope.caseShowSafe2 = $scope.caseShow2;
		window.caseShow2 = $scope.caseShow2;
        restoreClass2();
        $scope.allBaseClass = "btn btn-info";
	};
	$scope.sameBase = function(){
		$scope.caseShow2 = $scope.diffinfo.currentCases.filter(function(e) {
            if (e.changeInfo == "") return e;
        });
		$scope.caseShowSafe2 = $scope.caseShow2;
        restoreClass2();
        $scope.sameBaseClass = "btn btn-info";
	};
	testdiff.getTestCaseRunInfo($stateParams.appname, function(res){
		$scope.testVersionTime = res;
	});
	testdiff.getTestBaseVersions($stateParams.appname, function(res){
		$scope.baseVersion = res;
	});
	$scope.setTestDiffHref = function(){
		var url = '#/testdiff/' + $scope.diffinfo.info.appname + '/' + $scope.version_select + '/' + $scope.time_select + '/' + $scope.base_version_select;
		window.location.href = url;
	};
	$scope.setBaseDiffHref = function(){
		var url = '#/basediff/' + $scope.diffinfo.info.appname + '/' + $scope.base_version_1_select + '/' + $scope.base_version_2_select;
		window.location.href = url;
	};
	$scope.encodeHtml = function(s){
		var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]|\n\t/g;
		return (typeof s != "string") ? s :
          s.replace(REGX_HTML_ENCODE,
                    function($0){
                    	if($0 == "\n\t")
                    		return "<br/>";
                        var c = $0.charCodeAt(0), r = ["&#"];
                        c = (c == 0x20) ? 0xA0 : c;
                        r.push(c); r.push(";");
                        //return r.join("");
                    });
	}
    $scope.trendUrl = "/view/test/test_trend.html#/testchange/" + $scope.appname + "/" + $scope.projectid;
}

angular
    .module('together')
    .controller('TestCaseCtrl', testCaseCtrl)
    .controller('TestDiffCtrl', testDiffCtrl)
    .controller('TestDiffCtrlV2', testDiffCtrlV2)
    .controller('BaseSetCtrl', baseSetCtrl)