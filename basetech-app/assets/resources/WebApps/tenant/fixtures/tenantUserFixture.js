define(['jquery',"can/util/fixture/fixture"], function ($,fixture) {
    var userData = {
        "userList": [
            {
                "id": "1",
                "name": "usermanager",
                "userType": "NATIVE_USER",
                "createTime": "2014-1-17",
                "onLineStatus": "ONLINE",
                "lockStatus": "LOCKED",
                "email": "cxm@huawei.com",
                "phoneNumber": "13820893456",
                "description": "shenzhen user",
                "roleList": [
                    {
                        "id": "1",
                        "name": "usermanager",
                        "type": "SERVICE_ROLE",
                        "secRoleType": "ORG_SEC_ADMIN_ROLE",
                        "defaultRole": "false",
                        "desc": "组织管理员：默认的业务管理角色，具有业务管理类的所有权限。"
                    }
                ]
            },
            {
                "id": "2",
                "name": "user",
                "userType": "NATIVE_USER",
                "createTime": "2014-1-17",
                "onLineStatus": "OFFLINE",
                "lockStatus": "UNLOCKED",
                "email": "cxm2@huawei.com",
                "phoneNumber": "13820893457",
                "description": "xi'an user",
                "roleList": [{
                        "id": "2",
                        "name": "viewer",
                        "type": "SYSTEM_ROLE",
                        "secRoleType": "ORG_SYS_ADMIN_ROLE",
                        "defaultRole": "true",
                        "desc": "组织业务员：默认的业务管理角色，具有首页配置和查看、监控、资源、应用等权限，不具有VPC、用户权限。"
                    }
                ]
            }
        ],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords": 2
    };
    //用户详细信息
    var userInfoData =  {
        "userInfo" : {
            "id" : "2",
            "name" : "user",
            "userType" : "LDAP_USER",
            "createTime" : "2014-1-17",
            "onLineStatus" : "OFFLINE",
            "lockStatus" : "UNLOCKED",
            "email" : "cxm2@huawei.com",
            "phoneNumber" : "987654321",
            "description" : "xi'an user"
        },
        "roleList" :  [{
            "id":"2",
            "name":"viewer",
            "type":"SYSTEM_ROLE",
            "secRoleType": "ORG_SYS_ADMIN_ROLE",
            "defaultRole": "true",
            "description":"Default service management role, which has operation rights including homepage configuration and viewing, monitor, resourecs, application. This role does not have VPC and user rights."
        }],
        "controlInfo" : {
            "startDate" : "2014-03-13",
            "endDate" : "2014-03-17",
            "startTime" : "17:25:28",
            "endTime" : "19:25:28",
            "ipConfigType" : "IP_ADDRESS",
            "ipRange" : "192.168.2.2"
        }
    };
    //用户详细信息
    var userManagerInfoData =  {
        "userInfo" : {
            "id" : "1",
            "name" : "userManager",
            "userType" : "LDAP_USER",
            "createTime" : "2014-1-17",
            "onLineStatus" : "OFFLINE",
            "lockStatus" : "UNLOCKED",
            "email" : "cxm@huawei.com",
            "phoneNumber" : "13590988769",
            "description" : "shenzhen user"
        },
        "roleList" :  [{
            "id":"1",
            "name":"usermanager",
            "type":"SERVICE_ROLE",
            "secRoleType": "ORG_SEC_ADMIN_ROLE",
            "defaultRole": "false",
            "description":"Default service management role, which has service management rights."
        }],
        "controlInfo" : {
            "startDate" : "2014-03-13",
            "endDate" : "2014-03-17",
            "startTime" : "17:25:28",
            "endTime" : "19:25:28",
            "ipConfigType" : "IP_ADDRESS",
            "ipRange" : "192.168.2.1"
        }
    };
    var roleData = {
        "roleList": [{
            "id":"1",
            "name":"usermanager",
            "type":"SERVICE_ROLE",
            "defaultRole" : true,
            "description":"role_role_view_para_desc_content_orgmanager_value"
        },{
            "id":"2",
            "name":"viewer",
            "type":"SERVICE_ROLE",
            "defaultRole" : true,
            "description":"role_role_view_para_desc_content_user_value"
        }],
        "curPage": 1,
        "displayLength": 10,
        "totalRecords" : 2
    };

    fixture({
        "GET /uportal/user/query": function (request, response) {
            var curPage = request.data.curPage;
            var displayLength = request.data.displayLength;
            var res = {};
            res.curPage = curPage;
            res.displayLength = displayLength;
            res.totalRecords = userData.userList.length;
            res.userListRes = [];

            for (var index = (curPage - 1) * displayLength; index < curPage * displayLength && index < userData.userList.length; index++) {
                res.userListRes.push(userData.userList[index])
            }
            response(200, "success", res, {})
        },

        "GET /uportal/user/query/{id}": function (original, response) {
            var id = fixture.getId(original);
            var res = {};
            for (var index in userData.userList) {
                var user = userData.userList[index];
                if (user.id === id) {
                    res.id = user.id;
                    res.name = user.name;
                    res.userType = user.userType;
                    res.onlineState = user.onlineState;
                    break;
                }
            }
            response(200, "success", res, {})
        },

        //查询用户详情
        "GET /goku/rest/v1.5/{vdc_id}/users/{userId}": function (request, response) {
            var id = request.data.userId;
            if(id == "1"){
                response(200, "success", userManagerInfoData, {})
            }else{
                response(200, "success", userInfoData, {})
            }
        },
        //创建用户
        "POST /goku/rest/v1.5/{vdc_id}/users": function (request, response) {
            response(200, "success", {}, {})
        },
        //查询用户列表
        "POST /goku/rest/v1.5/{vdc_id}/users/list": function (request, response) {
            var json = $.parseJSON(request.data);
            var start = parseInt(json.start, 10);
            var limit = parseInt(json.limit, 10);
            var resp = {
                code: "0",
                userList: userData.userList,
                total: 0
            };
            resp.code = 0;
            resp.total = 50;
            response(200, "success", resp, {});
        },
        //删除用户
        "DELETE /goku/rest/v1.5/{vdc_id}/users/{id}": function (request, response) {
            response(200, "success", {}, {});
        },

        //修改用户
        "put /goku/rest/v1.5/{vdc_id}/users/{id}": function (request, response) {
            response(200, "success", {}, {});
        },

        //重置密码
        "put /goku/rest/v1.5/{vdc_id}/users/{id}/password?action={value}": function (request, response) {
            response(200, "success", {}, {});
        },

        //更新用户锁定状态
        "put /goku/rest/v1.5/{vdc_id}/users/{id}/lock-status": function (request, response) {
            response(200, "success", {}, {});
        },

        "POST /uportal/user/modify": function (request, response) {
            var id = request.data.id;
            var name = request.data.name;
            var createTime = request.data.createTime;
            var description = request.data.description;
            var res = {};

            for (var index = 0; index < userData.userList.length; index++) {
                if (userData.userList[index].id === id) {
                    userData.userList[index].name = name;
                    userData.userList[index].createTime = createTime;
                    userData.userList[index].description = description;
                }
            }
            response(200, "success", {}, {})
        },

        "POST /uportal/user/create": function (request, response) {
            var id = "" + (userData.userList.length + 1);
            var name = request.data.name;
            var password = request.data.password;
            var confirmPassword = request.data.confirmPassword;
            var phone = request.data.phone;
            var email = request.data.email;
            var createTime = Date.now();
            var description = request.data.description;
            var user = {
                "id": id,
                "name": name,
                "userType": "系统管理员",
                "domainType": "本地认证",
                "onlineState": "在线",
                "createTime": createTime,
                "description": description,
                "operation": ""
            };
            userData.userList.push(user);
            response(200, "success", {}, {})
        },
        //查询角色列表
        "GET /goku/rest/v1.5/{vdc_id}/roles?type={type}": function (request, response) {
            var res = {};
            res.roleList = roleData.roleList;
            response(200, "success", res, {})
        }
    });

    return fixture;
});