'use strict';

angular
    .module('sarFortress')
    .config(AppRouting);

AppRouting.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

function AppRouting($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('main', {
            abstract: true,
            url: '/',
            templateUrl: './src/app/main.html',
            controller: 'MainController as vm',
            resolve: {
                layers: function(LayersDataService) {
                    return LayersDataService.loadLayers();
                }
            }
        })

        .state('main.map', {
            url: ':layerId',
            templateUrl: './src/app/map/map.html',
            controller: 'MapController as vm'
        });
}
