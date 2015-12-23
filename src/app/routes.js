'use strict';

angular
    .module('sarFortress')
    .config(AppRouting);

/** @ngInject */
function AppRouting($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'app/main.html',
            controller: 'MainController as vm'
        })

        .state('main.map', {
            url: ':layerId',
            templateUrl: 'app/map/map.html',
            controller: 'MapController as vm'
        });
}
