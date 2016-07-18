define(["can/util/fixture/fixture"], function (fixture) {
    fixture({
        "POST /goku/rest/v1.5/{vdc_id}/alarms/statistic": function (request, response) {
            //上传适配包
            var info = {
                "value": [
                    {
                        "staticType": {
                            "critical": "1",
                            "major": "2",
                            "minor": "3",
                            "warning": "5"
                        }
                    }
                ]
            };
            response(200, "success", info, {})
        }
    });

    return fixture;
})
;