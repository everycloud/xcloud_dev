function timestamp2Date(ts) {
    if (ts == null) {
        return "";
    }
    var date = new Date(ts);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var dates = "0" + date.getDate();
    var formattedDate = year + '-' + month.substr(month.length - 2) + '-' + dates.substr(dates.length - 2);
    return formattedDate;
}

function timestamp2Time(ts) {
    if (ts == null) {
        return "";
    }
    var date = new Date(ts);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
    return timestamp2Date(ts) + " " + formattedTime;
}

function showUserNick(id, users) {
    if (id != undefined && id != 0 && users != undefined) {
        return users[id].nick;
    }
}

function showEmpId(id, users) {
    if (id != undefined && id != 0 && users != undefined) {
        return users[id].empId;
    }
}

function showTeamName(id, teams) {
    if (id != undefined && id != 0 && teams != undefined) {
        return teams[id].name;
    }
};

function alert(title, msg, modal) {
    if (!title)
        title = "出错了！";
    modal.open({
        templateUrl: '/view/common/alert.html',
        backdrop: "static",
        controller: alertCtrl,
        resolve: {
            title: function() {
                return title
            },
            msg: function() {
                return msg
            }
        }
    });
}

function ModalInstanceCtrl($scope, $modalInstance) {
    $scope.ok = function(result) {
        $modalInstance.close(result);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

function reassignCtrl($scope, $modalInstance, users, $http, $state, req, $modal, requirements) {
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function(result) {
        $modalInstance.close(result);
    };
    $scope.assign = function(item, event) {
        console.log("saving review...");
        console.log($scope.form);
        $scope.form.reqId = req.id;
        requirements.doReassign($modalInstance, $scope.form);
    };
    $scope.form = {};
    users.getAll(function(users) {
        $scope.users = users;
        $scope.form.assignee = $scope.users[req.assignee];
    });
}

function commentCtrl($scope, $modalInstance, reference, type, $http, $state, $modal, comments) {
    $scope.holder = {};
    $scope.form = {};
    $scope.comment = "";
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function(result) {
        $modalInstance.close(result);
    };
    $scope.save = function(item, event) {
        $scope.form.reference = reference;
        $scope.form.type = type;
        $scope.form.comment = $scope.holder.editor.getMarkdown();
        comments.doCreate($modalInstance, $scope.form);
    };
    $scope.timestamp2Time = timestamp2Time;
}

function commentModifyCtrl($scope, $modalInstance, commentId, $http, $state, comments, $modal) {
    $scope.holder = {};
    comments.getById(function(comment) {
        $scope.comment = comment;
    }, commentId);
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function(result) {
        $modalInstance.close(result);
    };
    $scope.save = function(item, event) {
        $scope.comment.content = $scope.holder.editor.getMarkdown();
        comments.doEdit($modalInstance, $scope.comment);
    };
    $scope.timestamp2Time = timestamp2Time;
}


function confirmCtrl($scope, $modalInstance, title, msg) {
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function(result) {
        $modalInstance.close(result);
    };
    $scope.title = title;
    $scope.content = msg;
}

function alertCtrl($scope, $modalInstance, title, msg) {
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function(result) {
        $modalInstance.close(result);
    };
    $scope.title = title;
    $scope.error = msg;
}

function filterCtrl($scope, $state) {}

function navCtrl($scope, $state) {
    $scope.search = function() {
        $state.go("searchResults", {
            text: $scope.content
        })
    }
}

function searchResultsCtrl($scope, $stateParams, search, $sce, $state,SearchResultType,SearchResultURL) {
    $scope.SearchResultURL = SearchResultURL;
    $scope.SearchResultType = SearchResultType;
    $scope.text = $stateParams.text;
    $scope.page = 1;
    $scope.encodedText = btoa(unescape(encodeURIComponent($scope.text)));
    $scope.changePage = function() {
        search.searchAll(function(data) {
            $scope.hitCount = data.result.hits.total;
            $scope.hits = data.result.hits.hits;
            if ($scope.hitCount > 0) {
                for (var i in $scope.hits) {
                    if (Object.keys($scope.hits[i].highlight).length > 0) {
                        $scope.hits[i].highlight = $sce.trustAsHtml($scope.hits[i].highlight[Object.keys($scope.hits[i].highlight)[0]][0]);
                    }
                }
            }
        }, $scope.encodedText, $scope.page-1);
    };
    
    $scope.changePage();
}


angular
    .module('together')
    .controller('AlertCtrl', alertCtrl)
    .controller('ConfirmCtrl', confirmCtrl)
    .controller('CommentCtrl', commentCtrl)
    .controller('CommentModifyCtrl', commentModifyCtrl)
    .controller('FilterCtrl', filterCtrl)
    .controller('NavCtrl', navCtrl)
    .controller('SearchResultsCtrl', searchResultsCtrl)