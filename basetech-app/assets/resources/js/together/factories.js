/**
 *  将list转化为map，id为key
 */
function list2Map(list) {
    var map = {};
    for (var i in list) {
        var item = list[i];
        map[item.id] = {};
        for (attr in item) {
            map[item.id][attr] = item[attr];
        }
    }
    return map;
}

function modalOpen(template, ctrl, resolve, $modal, size) {
    var modalInstance = $modal.open({
        templateUrl: template,
        backdrop: "static",
        controller: ctrl,
        resolve: resolve,
        size: size,
    });
}

function postData(api, data, $modal, $modalInstance, $state, $http, handler) {
    $http.post(api, data)
        .success(function(dataFromServer, status, headers, config) {
            if (dataFromServer.success == true) {
                console.log(dataFromServer);
                if (handler != undefined) {
                    handler();
                }
                if ($modalInstance != undefined) {
                    $modalInstance.close(dataFromServer);
                    $state.reload();
                }
            } else {
                alert("出错了!", "详情：" + dataFromServer.errorMessage, $modal);
            }
        })
        .error(function(data, status, headers, config) {
            alert("出错了!", "Submitting form failed!", $modal);
        });
}

function hostpool($http, $modal, $state) {
    return {
        getAll: function(callback) {
            $http.get('/api/hosts').success(function(data) {
                callback(list2Map(data.result));
            });
        },
        create: function() {
            modalOpen("/view/hostpool/new_host.html", newHostCtrl, null, $modal, "md");
        },
        doCreate: function($modalInstance, data) {
            postData("/api/host/new", data, $modal, $modalInstance, $state, $http);
        },
        doDelete: function(hostid) {
            $http.delete("/api/host/delete/" + hostid);
        }
    };
}

angular
    .module('together')
    .factory('hostpool', hostpool)
