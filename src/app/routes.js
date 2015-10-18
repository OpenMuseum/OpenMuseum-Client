'use strict';

angular
    .module('sarFortress')
    .config(AppRouting);

AppRouting.$inject = ['$routeProvider'];

function AppRouting($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: './src/app/map/map.view.html',
        controller: 'sfMapController as vm'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
}
