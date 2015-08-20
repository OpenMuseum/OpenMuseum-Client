define([
    'angular',
    './map.controller',
    './layers.service',
    './leaflet-map.directive'
], function (angular,
             MapController,
             LayersDataService,
             LeafletMapDirective) {
    'use strict';

     angular
         .module('app.map', [])
         .controller('MapController', MapController)
         .factory('LayersDataService', LayersDataService)
         .directive('leafletMap', LeafletMapDirective);
});
