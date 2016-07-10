
function AppsCtrl($scope, apps){
	$scope.createBtn = {
            "id": "app_manager_create_id",
            "text": "创建应用",
            "click": function () {
               
            },
            "tooltip": "",
            "disable": false
        };
}

angular
    .module('together')
    .controller('AppsCtrl', AppsCtrl)