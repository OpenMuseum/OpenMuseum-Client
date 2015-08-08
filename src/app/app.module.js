define([
    'angular',
    'angular-route',
    'app.routes',
    'map/map.module'
], function (angular,
             ngRoute,
             AppRouting) {
    'use strict';

    angular
        .module('app', [
            'app.map',
            'ngRoute'
        ])
        .config(AppRouting);
});
