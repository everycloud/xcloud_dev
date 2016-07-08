define(function () {
    "use strict";
    var taskCenterService = function (exception, $q, camel) {
        //查询任务列表
        this.queryTasks = function (options, monitor, autoRequest) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                url: {
                    s: "/goku/rest/v1.5/{vdc_id}/jobs",
                    o: {
                        vdc_id: options.vdcId
                    }
                },
                params: {
                    "start": options.start,
                    "limit": options.limit,
                    "locale": options.locale,
                    "start-time": options.queryStartTime,
                    "end-time": options.queryEndTime,
                    "status": options.status,
                    "condition": options.multiSearch
                },
                "monitor": monitor,
                "autoRequest": autoRequest,
                userId: options.userId
            });
            deferred1.success(function (data) {
                deferred.resolve(data);
            });
            deferred1.fail(function (jqXHR, textStatus, errorThrown) {
                if (!exception.isException(jqXHR)) {
                    deferred.resolve(null);
                    return;
                }
                exception.doException(jqXHR, null);
            });
            return deferred.promise;
        };
    };
    return taskCenterService;
});