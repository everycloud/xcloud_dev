function teamCtrl($scope, teams, $cookieStore, $state, $http, $state, $stateParams) {
    teams.getAll(function(teams) {
        $scope.teams = teams;
        $scope.currentTeam = $state.params["team"];
        if ($scope.currentTeam != null && $scope.currentTeam != 0) {
            $scope.currentTeamName = $scope.teams[$scope.currentTeam].name;
        } else {
            $scope.currentTeamName = "所有团队";
        }
    });

    $scope.switchTeam = function(id) {
        $state.go($state.current, {
            team: id
        });
    };
}

angular
    .module('together')
    .controller('TeamCtrl', teamCtrl)