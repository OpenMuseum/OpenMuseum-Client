define([
    'leaflet'
], function () {
    'use strict';

    function LeafletMapDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: './src/app/map/leaflet-map.directive.html',
            link: linkFunc,
            controller: LeafletMapController,
            controllerAs: 'leafletCtrl',
            bindToController: true
        };

        return directive;

        ///////////////

        function linkFunc(scope, el, attr, ctrl) {
            var map;
            var mapBounds;
            var mapMinZoom = 3;
            var mapMaxZoom = 5;

            map = L.map('main-map', {
                maxZoom: mapMaxZoom,
                minZoom: mapMinZoom
            });
            map.setView([0, 0], 3);

            mapBounds = new L.LatLngBounds(map.unproject([0, 4444], mapMaxZoom), map.unproject([6108, 0], mapMaxZoom));

            map.setMaxBounds(mapBounds);

            var paris1550 = L.tileLayer('https://dl.dropboxusercontent.com/u/4605143/paris1550/{z}/{x}/{y}.png', {
                minZoom: mapMinZoom,
                maxZoom: mapMaxZoom,
                //bounds: mapBounds,
                noWrap: true
            });

            map.addLayer(paris1550);
        }
    }

    function LeafletMapController() {
        var ctrl = this;
    }

    return LeafletMapDirective;
});
