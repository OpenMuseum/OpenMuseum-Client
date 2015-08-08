define([], function () {
    'use strict';

    AppRouting.$inject = ['$routeProvider'];

    function AppRouting($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: './src/app/map/map.view.html',
            controller: 'MapController',
            controllerAs: 'mapCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }

    return AppRouting;
});
