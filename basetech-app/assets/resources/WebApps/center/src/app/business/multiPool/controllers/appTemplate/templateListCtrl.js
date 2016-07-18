/**
 */
define([
        'tiny-lib/jquery',
        'tiny-lib/angular',
        "tiny-directives/Textbox",
        "tiny-directives/Button",
        "tiny-widgets/Window",
        "tiny-directives/Progressbar",
        "tiny-directives/Checkbox",
        "tiny-directives/Table",
        "app/business/resources/controllers/constants",
        "fixtures/appFixture"],
    function ($, angular, Textbox, Button, Window, Progressbar, Checkbox, Table, constants) {
        "use strict";

        var templateListCtrl = ["$rootScope", "$scope", "$compile", "$state", "camel", "exception", function ($rootScope, $scope, $compile, $state, camel, exception) {
            $scope.templateList = [];
            var user = $("html").scope().user;
            $scope.openstack = (user.cloudType === "OPENSTACK" ? true : false);
            var searchString = "";
             // 当前页码信息
             var page = {
                 "currentPage": 1,
                 "displayLength": 10,
                 "getStart": function () {
                     return page.currentPage == 0 ? 0 : (page.currentPage - 1) * page.displayLength;
                 }
             };

            $scope.createBtn = {
                "id": "appTemplateListCreateId",
                "text": "创建",
                "tooltip": "",
                "disable": false,
                "click": function () {
                    if (!$scope.openstack) {
                        //IT场景
                        $state.go("service.design.navigation", {"mode": "create"});
                    }
                    else {
                        createOrUpdateTemplate("create",null);
                    }
                }
            };

            $scope.importBtn = {
                "id": "appTemplateListImportId",
                "text": "导入",
                "tooltip": "",
                "disable": false,
                "click": function () {
                    $state.go("service.importTemplate.navigation");
                }
            };

             $scope.visibility = {
                 "id": "appTemplateListSearchAzId",
                 "values":[{
                     "selectId":"",
                     "label":"所有可见范围",
                     "checked":true
                 },
                 {
                     "selectId":"SystemVisible",
                     "label":"系统可见"
                 },
                 {
                     "selectId":"OrgVisible",
                     "label":"组织可见"
                 }],
                 "change":function(){
                     page.currentPage = 1;
                     getAppTemplate();
                 }
             };

             $scope.status = {
                 "id": "appTemplateListSearchRangeId",
                 "values":[{
                     "selectId": "",
                     "label": "所有状态",
                     "checked": true
                 },{
                     "selectId": "Draft",
                     "label": "草稿"
                 },{
                     "selectId": "Published",
                     "label": "已发布"
                 }],
                 "change": function(){
                     page.currentPage = 1;
                     getAppTemplate();
                 }
             };

             $scope.searchBox = {
                 "id": "appTemplateListSearchId",
                 "placeholder":"输入模板名称:",
                 "width":"250",
                 "suggestSize":10,
                 "maxLength":256,
                 "suggest":function(content){
                 },
                 "search":function(searchName){
                     page.currentPage = 1;
                     searchString = searchName;
                     getAppTemplate();
                 }
             };

             $scope.refresh = {
                 "id": "appTemplateListRefreshId",
                 "title": "刷新",
                 "click": function(){
                     getAppTemplate();
                 }
             };

             $scope.visibleRange = {
                 "label": "可见范围:",
                 "value": "组织"
             };

             $scope.creator = {
                 "label": "创建用户:",
                 "value": "ORGAdmin"
             };

             $scope.createTime = {
                 "label": "创建时间:",
                 "value": "2014-12-12 10:30"
             };

             $scope.description = {
                 "label": "描述:",
                 "value": "你知道我不知道你知道"
             };

             //发布或取消发布应用模板
             $scope.publishTemplate = function(id, publish){
                 if (!id){
                     return false;
                 }
                 var params = {
                     "publish":{
                         "status": (publish?'Published':'Draft')
                     }
                 };

                 var defered = camel.post({
                     "url": {
                         "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}/actions",
                         "o": {"tenant_id": "all", "id": id}
                     },
                     "userId": user.id,
                     "params":JSON.stringify(params)
                 });

                 defered.success(function(data){
                     getAppTemplate();
                 });
                 defered.fail(function(data){
                     if (!exception.isException(data)){
                         exception.doFaultPopUp();
                         return;
                     }
                     exception.doException(data);
                 });
             };

             $scope.create = function(id){
                 if (user.cloudType != "OPENSTACK"){
                     $state.go("appCreateByTemplate.navigate", {"id": id, "fromFlag": constants.fromFlag.FROM_TEMPLATE_LIST});
                 }
                 else {
                     $state.go("createByOpenstack.navigate", {"id": id, "fromFlag": constants.fromFlag.FROM_TEMPLATE_LIST});
                 }
             };

            //模板修改
            $scope.modify = function (id) {
                if ($scope.openstack) {
                    //查询模板详情
                    var defered = camel.get({
                        "url": {
                            "s": " /goku/rest/v1.5/{tenant_id}/apptemplates/{id}/contents",
                            "o": {"tenant_id": "all", "id": id}
                        },
                        "userId": user.id
                    });

                    defered.success(function (data) {
                        createOrUpdateTemplate("modify", data, id)
                    });
                    defered.fail(function (data) {
                        if (!exception.isException(data)) {
                            exception.doFaultPopUp();
                            return;
                        }
                        exception.doException(data);
                    });


                } else {
                    $state.go("service.design.navigation", {"id": id, "mode": "modify"});
                }


            };

             //模板查看
             $scope.view = function(id){
                 $state.go("service.design.navigation", {"id": id, "mode": "view"});
             };

             //创建或修改模板
             function createOrUpdateTemplate(opt,params,id){
                 var str ="";
                 if("create" == opt){
                     str="创建模板";
                 }else{
                     str="修改模板";
                 }
                 var options = {
                     "winId": "app-templateList-createTemplate-winId",
                     "id":"createTemplate",
                     "appId":id,
                     "opt":opt,
                     "param":params,
                     "exception":exception,
                     "fromFlag": "1",  //表示从模板列表,"2"表示从概览弹出
                     "title": str,
                     "width": "1000px",
                     "height": "750px",
                     "content-type": "url",
                     "content": "app/business/multiPool/views/appTemplate/createTemplate.html",
                     "buttons": null,
                     "close": function(){
                         getAppTemplate();
                     }
                 };
                 var win = new Window(options);
                 win.show();
             }
             $scope.appPagination = {
                 "id":"tempPaginationId",
                 "prevText" : "prev",
                 "nextText" : "next",
                 "type1" : "full_numbers",
                 "curPage":1,
                 "totalRecords":2,
                 "display":true,
                 "options":[10, 20],
                 "hideTotalRecords":false,
                 "hideDisplayLength":false,
                 "displayLength":10,
                 "callback":function(evtObj){
                     page.currentPage = evtObj.currentPage;
                     page.displayLength = evtObj.displayLength;
                     getAppTemplate();
                 },
                 "changeSelect":function(evtObj){
                     page.currentPage = evtObj.currentPage;
                     page.displayLength = evtObj.displayLength;
                     getAppTemplate();
                 }
             };

             var moreBtnPublished = {
                 "text": "<span>更多</span>",
                 "type": "button",
                 "content": [{
                     title: "<div class='msg-info'>复制</div>",
                     click: function (evt, item, widgetThis) {
                         var options = {
                             "winId": "app-templateList-copyTemplate-winId",
                             "id": widgetThis.options.id,
                             "title": "复制",
                             "width": "640px",
                             "height": "480px",
                             "content-type": "url",
                             "content": "app/business/multiPool/views/appTemplate/copyTemplate.html",
                             "buttons": null,
                             "close": function(){
                                 getAppTemplate();
                             }
                         };
                         var win = new Window(options);
                         win.show();
                     }
                 },{
                     title: "<div class='msg-info'>导出</div>",
                     click: function (evt, item, widgetThis) {
                         exportTemplate(widgetThis.options.id);
                     }
                 },
                 {
                     title: "<div class='msg-info'>查看模板内容</div>",
                     click: function (evt, item, widgetThis) {
                         var options = {
                             "winId": "app-templateList-templateContent-winId",
                             "id": widgetThis.options.id,
                             "title": "查看模板内容",
                             "width": "1000px",
                             "height": "750px",
                             "content-type": "url",
                             "content": "app/business/multiPool/views/appTemplate/TemplateContent.html",
                             "buttons": null,
                             "close": function(){
                             }
                         };
                         var win = new Window(options);
                         win.show();
                     }
                 }],
                 "clickCallback":function(){}
             };

             function exportTemplate(id){
                 if (!id) {
                     return false;
                 }

                 var appTemplate = getTemplateById(id);
                 if (!appTemplate){
                     return false;
                 }

                 var deferred = camel.get({
                     "url": {
                         "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}/files",
                         "o": {
                             "tenant_id": "all",
                             "id": id
                         }
                     },
                     "userId": user.id,
                     "params": {}
                 });

                 deferred.success(function(data){
                     if (!data){
                         return;
                     }

                     var exportResultData = {
                         "progress": "100%",
                         "path": "../../download/" + data.filePath,
                         "name": appTemplate.name
                     };
                     var options = {
                         "winId": "app-templateList-export-winId",
                         "exportResultData": exportResultData,
                         "title": "导出模板2",
                         "width": "600px",
                         "height": "450px",
                         "content-type": "url",
                         "content": "app/business/multiPool/views/appTemplate/templateExport.html",
                         "buttons": null,
                         "close": function(){
                         }
                     };
                     var win = new Window(options);
                     win.show();
                 });
                 deferred.fail(function(data){
                     if (!exception.isException(data)){
                         exception.doFaultPopUp();
                         return;
                     }
                     exception.doException(data);
                 });
             }

             function copyTemplate(id){
                 if (!id) {
                     return false;
                 }

                 var deferred = camel.post({
                     "url": {"s": "/goku/rest/v1.5/orgs/{authOrg}/apptemplates/{id}", "o": {"authOrg": "all", "id": id}},
                     "params": {
                         "authUser": "all"
                     }
                 });
                 deferred.success(function(data){
                     $scope.$apply(function(){
                         getAppTemplate();
                     });
                 });
                 deferred.fail(function(data){
                 });
             }

             function deleteTemplate(id){
                 if (!id){
                     return false;
                 }

                 var defered = camel["delete"]({
                     "url": {
                         "s": "/goku/rest/v1.5/{tenant_id}/apptemplates/{id}",
                         "o": {"tenant_id": user.orgId, "id": id}
                     },
                     "userId": user.id,
                     "params":{
                     }
                 });
                 defered.success(function(data){
                     getAppTemplate();
                 });
                 defered.fail(function(data){
                     if (!exception.isException(data)){
                         exception.doFaultPopUp();
                         return;
                     }
                     exception.doException(data);
                 });
             }

             var moreBtnUnPublished = {
                 "text": "<span>更多</span>",
                 "type": "button",
                 "content": [{
                     title: "<div class='msg-info'>删除</div>",
                     click: function (evt, item, widgetThis) {
                         deleteTemplate(widgetThis.options.id);
                     }
                 }],
                 "clickCallback":function(){}
             };

             function getTemplateById(id){
                 if (!id || !$scope.templateList){
                     return null;
                 }

                 var template = null;
                 for (var i = 0;i < $scope.templateList.length;i++){
                     template = $scope.templateList[i];
                     if (template && (id == template.id)) {
                         return template;
                     }
                 }

                 return null;
             }

             function getAppTemplate(){
                 var visibility = ($("#appTemplateListSearchAzId").widget() && $("#appTemplateListSearchAzId").widget().getSelectedId()) || "";
                 var status = ($("#appTemplateListSearchRangeId").widget() && $("#appTemplateListSearchRangeId").widget().getSelectedId()) || "";
                 var deferred = camel.get({
                     "url": {"s": "/goku/rest/v1.5/{tenant_id}/apptemplates?visible={visibility}&status={status}&name={name}&limit={limit}&start={start}",
                         "o": {
                             tenant_id: "all",
                             "visibility": visibility,
                             "status": status,
                             "name": searchString,
                             "limit": page.displayLength,
                             "start": page.getStart()
                         }},
                     "params": {},
                     "userId": $scope.user.id
                 });

                 deferred.success(function(data){
                     var templateList = [];
                     if (data.appTemplates) {
                         var template = null;
                         for (var i = 0;i < data.appTemplates.length;i++){
                             template = data.appTemplates[i];
                             if (!template){
                                 continue;
                             }
                             if (template.status == 'Published'){
                                 template.moreBtn = moreBtnPublished;
                             }
                             else {
                                 template.moreBtn = moreBtnUnPublished;
                             }
                             templateList.push(template);
                         }
                     }
                     $scope.$apply(function(){
                         //组合
                         $scope.templateList = templateList;
                         $scope.appPagination.totalRecords = data.total;
                     });
                 });
                 deferred.fail(function(data){
                     if (!exception.isException(data)){
                         exception.doFaultPopUp();
                         return;
                     }
                     exception.doException(data);
                 });
             };

             getAppTemplate();
         }];

         return templateListCtrl;
     });