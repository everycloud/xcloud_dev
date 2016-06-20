function userCtrl($scope, users, $cookieStore) {
    users.getCurrent(function(user) {
        $scope.nick = user.nick;
        $scope.empId = user.empId;
        $scope.image = "https://work.alibaba-inc.com/photo/" + user.empId + ".80x80.jpg";
        $cookieStore.put("userID", user.id);
    });
}

function userDetailCtrl(users, $scope, $stateParams, projects, requirements, defects, products, applications, $cookieStore) {

    if ($stateParams.id == undefined) {
        $scope.id = $cookieStore.get("userID");
    } else {
        $scope.id = $stateParams.id;
        users.getById(function(user) {
            $scope.user = user;
        }, $scope.id);

    }

    projects.getInProgressByUser($scope.id, function(projects) {
        $scope.projects = projects;
        var count = 0;
        for (var k in projects) {
            ++count;
        }
        $scope.projectCount = count;
    });
    requirements.getInProgressByAssignee($scope.id, function(requirements) {
        $scope.requirements = requirements;
        var count = 0;
        for (var k in requirements) {
            ++count;
        }
        $scope.requirementCount = count;
    });
    defects.getInProgressByAssignee($scope.id, function(defects) {
        $scope.defects = defects;
        var count = 0;
        for (var k in defects) {
            ++count;
        }
        $scope.defectCount = count;
    });
    defects.getInProgressBySubmitter($scope.id, function(defects) {
        $scope.defectsSubmitted = defects;
    });
    products.getByUser(function(products) {
        $scope.products = products;
        var count = 0;
        for (var k in products) {
            ++count;
        }
        $scope.productCount = count;
    }, $scope.id);
    applications.getByUser(function(apps) {
        $scope.apps = apps;
        var count = 0;
        for (var k in apps) {
            ++count;
        }
        $scope.appCount = count;
    }, $scope.id);
}

angular
    .module('together')
    .controller('UserCtrl', userCtrl)
    .controller('UserDetailCtrl', userDetailCtrl)