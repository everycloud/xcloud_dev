/*global define*/
define(["app/business/ecs/services/monitorService"], function (monitorService) {
    "use strict";
    //这里不采用依赖注入的方式是必须在module中去加载，影响性能
    var service = function (exception, $q, camel) {
        this.queryAppResMonitor = function (options) {
            var deferred = $q.defer();
            var deferred1 = camel.get({
                "url": {
                    s: "/goku/rest/v1.5/{vdc_id}/apps/{id}/monitors?cloud-infra={cloud_infra_id}",
                    o: {
                        "vdc_id": options.user.vdcId,
                        "id": options.appId,
                        "cloud_infra_id": options.cloudInfraId,
                        "vpc_id": options.vpcId
                    }
                },
                "userId": options.user.id
            });
            deferred1.success(function (data, textStatus, jqXHR) {
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

        this.isValidMonitorNumber = function (value) {
            if ((undefined === value) || (null === value)) {
                return false;
            }
            if ("" === value) {
                return false;
            }
            if (isNaN(value)) {
                return false;
            }
            return true;
        };

        //历史监控数据是否都为无效数据(都为null)
        this.checkHistoryValid = function (array) {
            if (!array || (array.length === 0)) {
                return false;
            }
            var len = array.length;
            //只要有一个数据有效,即认为合法,返回true
            for (var i = 0; i < len; i++) {
                if (array[i] && (array[i].value !== null) && (array[i].value !== "")) {
                    return true;
                }
            }
            return false;
        };

        //返回界面可见的值 value的目标值是数据 非法情况下呈现空字符串
        this.getVisibleValue = function (value) {
            if ((null === value) || (undefined === value)) {
                return "";
            }
            if (isNaN(value)) {
                return "";
            }
            return value;
        };

        this.calculateMax = function (metricArray) {
            if (!metricArray || (metricArray.length <= 0)) {
                return {};
            }

            var formatMetricArray = [];
            var localTime;
            var max = null;
            //参与平均计算的有效数据个数
            var validCount = 0;
            var validTotal = 0;
            var ave = null;
            var metricValue = null;
            var current = parseFloat(metricArray[metricArray.length - 1].value);
            for (var i = 0; i < metricArray.length; i++) {
                localTime = parseInt(metricArray[i].time, 10);
                metricValue = parseFloat(metricArray[i].value);
                if (isNaN(metricValue)) {
                    formatMetricArray.push([localTime, null]);
                } else {
                    formatMetricArray.push([localTime, metricValue]);
                    if (!max) {
                        max = metricValue;
                    } else {
                        if (metricValue > max) {
                            max = metricValue;
                        }
                    }
                    validCount++;
                    validTotal += metricValue;
                }
            }
            if (validCount > 0) {
                ave = validTotal / validCount;
            }

            var result = {
                "history": formatMetricArray,
                "ave": (null === ave ? "" : ave),
                "max": (null === max ? "" : max),
                "current": (isNaN(current) ? "" : current)
            };

            if (result.ave !== "") {
                result.ave = monitorService.progressPercent(result.ave);
            }
            if (result.max !== "") {
                result.max = monitorService.progressPercent(result.max);
            }
            if (result.current !== "") {
                result.current = monitorService.progressPercent(result.current);
            }

            return result;
        };
    };

    service.$injector = ["exception", "$q", "camel"];
    return service;
});
