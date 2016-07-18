define([""], function () {
    var i18n = $("html").scope().i18n;
    var COMMON = {
        "METRIC_DESC": {
            "cpu_usage": i18n.perform_term_CPUusageRate_label + "(%)",
            "mem_usage": i18n.perform_term_memUsageRate_label + "(%)",
            "nic_byte_in": i18n.common_term_netInRate_label + "(KB/s)",
            "nic_byte_out": i18n.common_term_netOutRate_label + "(KB/s)",
            "disk_io_in": i18n.common_term_diskInKbps_label,
            "disk_io_out": i18n.common_term_diskOutKbps_label,
            "disk_usage": i18n.perform_term_diskUsageRate_label + "(%)",
            "disk_in_ps": i18n.common_term_diskIOwriteNumS_label,
            "disk_out_ps": i18n.common_term_diskIOreadNumS_label,
            "cpu_ready_time": i18n.perform_term_CPUwait_label + "(S)",
            "disk_read_delay": i18n.common_term_diskReadDelay_label + "(S)",
            "disk_write_delay": i18n.common_term_diskWriteDelay_label + "(S)"
        },
        "LINE_COLORS": ["#ED9121", "#6d73e1", "#1fbe5c", "#0487c4", "#ff0000", "#ff72ff", "#7272ff", "#d840d8", "#99ff00", "#3b0059"],
        /*构造折线图
         */
        "getLinePoltConfig": function (id, ymax) {
            if (!ymax || ymax == undefined) {
                ymax = null;
            }
            var chartConfig = {
                "id": id,
                "width": "500px",
                "height": "240px",
                "data": [],
                "caption": {},
                "tips": {
                    "tipType": "hover",
                    "content": '%y.2'
                },
                "grid": {
                    show: true,
                    borderWidth: {
                        top: 1,
                        right: 0,
                        bottom: 1,
                        left: 1
                    }},
                "series": {
                    "points": {
                        "show": false,
                        "symbol": "ring"
                    },
                    "lines": {
                        "show": true
                    }
                },
                "xaxis": {
                    "show": true,
                    "position": "bottom",
                    "mode": "time",
                    "timeformat": "%Y/%m/%d %H:%M",
                    "min": null,//坐标轴最小值
                    "max": null,//坐标轴最大值
                    "ticks": 5,
                    "font": {
                        size: 9,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "yaxis": {
                    "show": true,
                    "min": 0,//坐标轴最小值
                    "max": ymax,//坐标轴最大值
                    "font": {
                        size: 11,
                        lineHeight: 13,
                        family: "Microsoft YaHei",
                        color: "#666666"
                    }
                },
                "legend": {
                    "show": true,
                    "noColumns": 1,
                    "labelBoxBorderColor": "red"
                }
            }
            return chartConfig;
        }
    };
    return COMMON;
});