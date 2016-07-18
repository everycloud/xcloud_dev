define(["can/util/fixture/fixture"], function (fixture) {


    fixture({
        //getVLAN
        "POST /goku/rest/v1.5/ticket/login": function (original, response) {
            var result =
            { "loginStatus": ""}
            response(200, "success", d, {});
        }
    });

    return fixture;
});
