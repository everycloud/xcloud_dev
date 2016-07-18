define(["can/util/fixture/fixture"], function (fixture) {
    var labelGroupList = {
        "code": "0",
        "message": "",
        "tagGroups": [
            {
                "name": "Room Level",
                "values": ["Bulletproof","Not bulletproof"],
                "resources":{
                    "available_zone":["az001","az002"]
                }
            },
            {
                "name": "UPS Power supply",
                "values": ["Supported","Not supported"],
                "resources":{
                    "availableZone":["az003"]
                }
            }
        ]
    };

    var labelList = {
        "code": "0",
        "message": "",
        "tags": [
            {
                "name": "Room Level",
                "value": "Bulletproof",
                "resources":{
                    "availableZone":["az001"]
                }
            },
            {
                "name": "Room Level",
                "value": "Not bulletproof",
                "resources":{
                    "availableZone":["az002"]
                }
            }
        ]
    }

    fixture({
        "GET /goku/rest/v1.5/all/tag-groups?start=0&limit=10&name=": function (request, response) {
            var result =
            {
                "total":2,"tagGroups":[
                {"name":"SLA","values":["GOLD","SILVER","COPPER"],"resources":null},
                {"name":"FusionManager_MediaType","values":["SAN-Any"],"resources":{
                    "availableZone":[{"id":"4616189618054758401","cloudInfraId":"461618961805475840102900101"},
                        {"id":"4616189618054758401","cloudInfraId":"46161896180547584010755001"}]}}]
            }
            response(200, "success", result, {})
        },
        "GET /goku/rest/v1.5/all/tags?name=FusionManager_MediaType": function (request, response) {
            response(200, "success", {
                    "total":1,"tags":[{
                        "name":"FusionManager_MediaType","value":"SAN-Any","resources":
                        {"availableZone":[
                            {"id":"4616189618054758401","cloudInfraId":"461618961805475840102900101"},
                            {"id":"4616189618054758401","cloudInfraId":"46161896180547584010755001"}
                        ]}}]}
                , {})
        },
        "GET /goku/rest/v1.5/all/tags?name=SLA": function (request, response) {
            response(200, "success", {"total":3,"tags":[{"name":"SLA","value":"GOLD","resources":null},{"name":"SLA","value":"SILVER","resources":null},{"name":"SLA","value":"COPPER","resources":null}]}
                , {})
        }
    });

    return fixture;
});