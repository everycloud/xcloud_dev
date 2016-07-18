define(function () {
    "use strict";

    function DepsProvider() {
        this.$get = ["$q", "$rootScope", "$controllerProvider", "$provide",
            function ($q, $rootScope, $controllerProvider, $provide) {
                return {
                    "dependCtr": function (module, name) {
                        var deferred = $q.defer();
                        var dependencies = [module];
                        // Load the dependencies
                        require(dependencies, function (detail) {
                            // all dependencies have now been loaded by so resolve the promise
                            $rootScope.$apply(function () {
                                $controllerProvider.register(name, detail);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    },
                    "dependSrv": function (module, name) {
                        var deferred = $q.defer();
                        var dependencies = [module];
                        // Load the dependencies
                        require(dependencies, function (detail) {
                            // all dependencies have now been loaded by so resolve the promise
                            $rootScope.$apply(function () {
                                $provide.service(name, detail);
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                };
            }
        ];
    }

    return DepsProvider;
});