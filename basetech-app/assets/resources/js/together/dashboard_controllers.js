

function dashboardCtrl($scope, $http, $state, calendarEvents, $cookieStore, requirements, sonar) {
    $scope.id = $cookieStore.get("userID");
}

angular
    .module('together')
    .controller('DashboardCtrl', dashboardCtrl)