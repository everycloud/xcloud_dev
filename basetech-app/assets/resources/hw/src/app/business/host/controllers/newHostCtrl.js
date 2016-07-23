/* global define */
define([
        'tiny-lib/angular',
        ],
        function (angular) {
	"use strict";

	var newHostCtrl = ["$scope","hostpool","$modalInstance",
	                   function ($scope, hostpool, $modalInstance){
		console.log("enter in newHostCtrl");
		$scope.save = function(item, event) {
			console.log("saving new host...");
			console.log($scope.form);
			if (!$scope.form.hostPool.name) {
				$scope.form.hostPool.name = "";
			}
			hostpool.doCreate($modalInstance, $scope.form);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

	];



	return newHostCtrl;
}
);