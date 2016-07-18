/**
 * 提供菜单注册的所有服务
 */
define([], function () {
    var SCENE_CONFIG = {
        itAllInOne: {
            val: "FUSIONSPHERE_allInOne",
            desc: "it场景下,allinone部署方式，对应center"
        },
        itTop: {
            val: "FUSIONSPHERE_top",
            desc: "it场景下,top部署方式，对应cloudmanager"
        },
        itLocal: {
            val: "FUSIONSPHERE_local",
            desc: "it场景下,allinone部署方式，对应fusionmanager"
        },
        itServiceCenter: {
            val: "FUSIONSPHERE_serviceCenter",
            desc: "it场景下,serviceCenter部署方式，对应fusionmanager"
        },
        ictAllInOne: {
            val: "OPENSTACK_allInOne",
            desc: "ict场景下,allinone部署方式，对应center"
        },
        ictTop: {
            val: "OPENSTACK_top",
            desc: "ict场景下,top部署方式，对应cloudmanager"
        },
        ictLocal: {
            val: "OPENSTACK_local",
            desc: "ict场景下,allinone部署方式，对应fusionmanager"
        },
        ictServiceCenter: {
            val: "OPENSTACK_serviceCenter",
            desc: "ict场景下,serviceCenter部署方式，对应fusionmanager"
        }
    };

    return SCENE_CONFIG;
});