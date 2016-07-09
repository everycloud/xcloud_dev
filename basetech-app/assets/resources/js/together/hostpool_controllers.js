
function hostpoolCtrl($scope, hostpool){
    hostpool.getAll(function(hosts) {
        $scope.hosts = hosts;
    });
    $scope.addHost = function(){
        hostpool.create();
    }
    $scope.delHost = function(hostid){
        hostpool.doDelete(hostid);
    }

}

function newHostCtrl($scope, hostpool, $modalInstance){
    $scope.save = function(item, event) {
        console.log("saving new host...");
        console.log($scope.form);
        if (!$scope.form.hostPool.name) {
            $scope.form.hostPool.name = "";
        }
        hostpool.doCreate($modalInstance, $scope.form);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}

 
angular
    .module('together')
    .controller('HostpoolCtrl', hostpoolCtrl)
    .controller("NewHostCtrl", newHostCtrl)
