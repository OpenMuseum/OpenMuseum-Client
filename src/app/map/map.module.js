define([
    'angular',
    './map.controller',
    './maps.service',
    './leaflet-map.directive'
], function (angular,
             MapController,
             MapsDataService,
             LeafletMapDirective) {
    'use strict';

     angular
         .module('app.map', [])
         .controller('MapController', MapController)
         .factory('MapsDataService', MapsDataService)
         .directive('leafletMap', LeafletMapDirective);
});
