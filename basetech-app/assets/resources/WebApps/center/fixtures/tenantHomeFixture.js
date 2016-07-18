define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    var orgInfo = {
        vdcInfo: {
            allQuota: false,
            quotaInfo: [
                {
                    quotaName: "CPU",
                    limit: 150
                },
                {
                    quotaName: "MEMORY",
                    limit: 819200
                },
                {
                    quotaName: "STORAGE",
                    limit: 51200
                },
                {
                    quotaName: "VM",
                    limit: 28
                }
            ],
            quotaUsage: [
                {
                    quotaName: "CPU",
                    value: 10
                },
                {
                    quotaName: "MEMORY",
                    value: 5600
                },
                {
                    quotaName: "STORAGE",
                    value: 3072
                },
                {
                    quotaName: "VM",
                    value: 2
                }
            ]
        }
    };

    var allVmProcessMonitor = {
        "cpuRate": [[1403020800000, 1000], [1403107200000, 6], [1403193600000, 23], [1403280000000, 76], [1403366400000, 300], [1403452800000, 4], [1403539200000, 87]],
        "memRate": [[1403020800000, 20], [1403107200000, 455], [1403193600000, 4], [1403280000000, 54], [1403366400000, 45], [1403452800000, 44], [1403539200000, 847]],
        "diskRate": [[1403020800000, 353], [1403107200000, 535], [1403193600000, 535], [1403280000000, 34], [1403366400000, 4], [1403452800000, 44], [1403539200000, 847]]
    };

    var vmcreateStatus2 = [[1403020800000, 1000], [1403107200000, 6], [1403193600000, 23], [1403280000000, 76], [1403366400000, 300], [1403452800000, 4], [1403539200000, 87]];

    var vmcreateStatus = [[1403020800000, 23], [1403107200000, 65], [1403193600000, 3], [1403280000000, 43], [1403366400000, 109], [1403452800000, 78], [1403539200000, 43]];
    var quotas = [{
        "resourceName": "CPU核数",
        "useRate": "80%",
        "total": "50",
        "used": "21",
        "unused": "29"
    }, {
        "resourceName": "内存",
        "useRate": "78%",
        "total": "10GB",
        "used": "1GB",
        "unused": "9GB"
    }, {
        "resourceName": "存储容量",
        "useRate": "76%",
        "total": "1000GB",
        "used": "350GB",
        "unused": "650GB"
    }, {
        "resourceName": "弹性IP个数",
        "useRate": "65%",
        "total": "6000",
        "used": "1000",
        "unused": "5000"
    }, {
        "resourceName": "VPC个数",
        "useRate": "50%",
        "total": "20",
        "used": "12",
        "unused": "8"
    }];
    var allNews = {
        "list": [{
            "id": "systemNews1",
            "time": "2014-04-04 12：00",
            "publisher": "admin",
            "title": "2014年04月05日 00：00至2014年04月07日 08：00 端午节假期，系统全局下电维护。",
            "content": "2014年04月05日 00：00至2014年04月07日 08：00 端午节假期，系统全局下电维护。\n请提前将桌面云上的文档保存，做好关机工作。\n谢谢你的配合。"
        }, {
            "id": "systemNews2",
            "time": "2014-04-04 12：00",
            "publisher": "admin",
            "title": "2014年04月05日 00：00至2014年04月07日 08：00 端午节假期，系统全局下电维护。",
            "content": "2014年04月05日 00：00至2014年04月07日 08：00 端午节假期，系统全局下电维护。\n请提前将桌面云上的文档保存，做好关机工作。\n谢谢你的配合。"
        }, {
            "id": "systemNews3",
            "time": "2014-04-04 12：00",
            "publisher": "admin",
            "title": "2014年04月05日 00：00至2014年04月07日 08：00 端午节假期，系统全局下电维护。",
            "content": "2014年04月05日 00：00至2014年04月07日 08：00 端午节假期，系统全局下电维护。\n请提前将桌面云上的文档保存，做好关机工作。\n谢谢你的配合。"
        }],
        "totle": 3
    };
    fixture({
        "GET /goku/rest/v1.5/{vdc_id}/homeNews": function (original, response) {
            response(200, "success", allNews, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/quotas": function (original, response) {
            response(200, "success", quotas, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/vmCreateStatistic": function (original, response) {
            response(200, "success", vmcreateStatus, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/vmCreateStatistic2": function (original, response) {
            response(200, "success", vmcreateStatus2, {})
        },
        "GET /goku/rest/v1.5/{vdc_id}/vmProcessMonitor": function (original, response) {
            response(200, "success", allVmProcessMonitor, {})
        },
        // 查询组织配额
        "GET /goku/rest/v1.5/vdcs/{id}": function (original, response) {
            response(200, "success", orgInfo, {});
        }
    });

    return fixture;
});