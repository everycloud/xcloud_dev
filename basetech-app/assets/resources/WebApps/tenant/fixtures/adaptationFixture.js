define(["can/util/fixture/fixture"], function (fixture) {
    var progress = 1;
    fixture({
        "POST /goku/rest/v1.5/irm/adaptors": function (request, response) {
            //上传适配包
            var info = {
                code: "0",
                message: "msg",
                progress: 1,
                id: "FusionAdaptor V1.1.00.8.31_forFusionManager.zip"
            };
            response(200, "success", info, {})
        },
        "GET /goku/rest/v1.5/irm/adaptors/{id}/progress": function (request, response) {
            //适配包安装进度查询核查
            progress %= 10;
            if (progress === 1 && window.adaptationFixtureTimer) {
                window.adaptationFixtureTimer = setInterval(function () {
                    if (progress != 0) {
                        progress++;
                    } else {
                        clearInterval(window.adaptationFixtureTimer);
                    }
                }, 1000);
            }
            var info = {
                code: "0",
                message: "msg",
                progress: progress
            };
            response(200, "success", info, {})
        },
        "GET /goku/rest/v1.5/irm/adaptors": function (request, response) {
            //查询适配包列表
            var info = {
                code: "0",
                message: "msg",
                packageList: [
                    {
                        "id": 123,
                        "name": "FusionAdaptor V1.1.00.8.31_forFusionManager.zip",
                        "status": "3",
                        "installDate": "2014-01-26 21:08:20 UTC+08:00"
                    }
                ]
            };
            response(200, "success", info, {})
        },
        "DELETE /goku/rest/v1.5/irm/adaptors/{id}": function (request, response) {
            //卸载适配包
            var info = {
                code: "0",
                message: "msg",
                progress: 1
            };
            response(200, "success", info, {})
        },
        "GET /goku/rest/v1.5/irm/adaptors/{id}": function (request, response) {
            //查询适配包信息(支持的设备列表)
            var device = {
                vendor: "Huawei",//厂商
                model: "ascend p444",//型号
                type: "1"
            };
            var info = {
                code: "0",
                message: "msg",
                deviceList: [ device, device]
            };
            response(200, "success", info, {})
        }
    });

    return fixture;
})
;