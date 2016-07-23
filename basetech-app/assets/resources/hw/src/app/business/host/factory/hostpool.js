define(function () {
       var service =  function ($http, $modal) {
		   "use strict";
		   /**
			*  将list转化为map，id为key
			*/
		   console.log("enter in hostpool.js");
		   function list2Map(list) {
			   var map = {};
			   for (var i in list) {
				   var item = list[i];
				   map[item.id] = {};
				   for (var attr in item) {
					   map[item.id][attr] = item[attr];
				   }
			   }
			   return map;
		   }

		   function modalOpen(template, ctrl, resolve, $modal, size) {
			   var modalInstance = $modal.open({
				   templateUrl: template,
				   backdrop: "static",
				   controller: ctrl,
				   resolve: resolve,
				   size: size,
			   });
		   }

		   function postData(api, data, $modal, $modalInstance, $state, $http, handler) {
			   $http.post(api, data)
				   .success(function (dataFromServer, status, headers, config) {
					   if (dataFromServer.success == true) {
						   console.log(dataFromServer);
						   if (handler != undefined) {
							   handler();
						   }
						   if ($modalInstance != undefined) {
							   $modalInstance.close(dataFromServer);
							   $state.reload();
						   }
					   } else {
						   alert("出错了!", "详情：" + dataFromServer.errorMessage, $modal);
					   }
				   })
				   .error(function (data, status, headers, config) {
					   alert("出错了!", "Submitting form failed!", $modal);
				   });
		   }

		   this.getAll = function (callback,$http) {
			   console.log($http);
			   $http.get('/api/hosts').success(function (data) {
				   callback(list2Map(data.result));
			   });
		   };
		   this.create = function ($modal) {
			   console.log("enter create......")
			   var dependencies = [
				   'app/business/host/controllers/newHostCtrl'
			   ];

			   require(dependencies, function (NewHostCtrl) {
				   modalOpen("/view/hostpool/new_host.html", NewHostCtrl, null, $modal, "md");
			   });


		   };
		   this.doCreate = function ($modalInstance, data) {
			   postData("/api/host/new", data, $modal, $modalInstance, $state, $http);
		   };
		   this.doDelete = function (hostid) {
			   $http.delete("/api/host/delete/" + hostid);
		   };
	   }
		   return service;
	   }
	);
