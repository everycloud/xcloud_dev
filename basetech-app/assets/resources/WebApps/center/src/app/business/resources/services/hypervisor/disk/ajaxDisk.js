define(["app/services/ajaxBase",
    "fixtures/monitorAlarmFixture"],
    function (ajax) {
        "use strict";

        ajax.disk = {
            getDisk : function(condition,onOK, onErr){
                var ret = ajax.send("post",
                    "/goku/rest/v1.5/irm/{tenant_id}/volumes/action",
                    {tenant_id:1},{"list":condition});
                ajax.finish(ret, onOK, onErr);
            },
            export : function(onOK, onErr){
                var exportVolume = {};
                exportVolume.source = "MANAGER";
                var ret = ajax.send("post",
                    "/goku/rest/v1.5/irm/{tenant_id}/reports/resource-reports/action?locale={locale}",
                    {tenant_id:1,locale:"zh_CN"},{"exportVolume":exportVolume});
                ajax.finish(ret, onOK, onErr);
            }
        }

        return ajax;
    });

