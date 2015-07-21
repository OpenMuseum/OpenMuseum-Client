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
            var map = L.map('main-map');
            var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 8,
                maxZoom: 12
            });

            map.setView(new L.LatLng(51.3, 0.7),9);
            map.addLayer(osm);
        }
    }

    function LeafletMapController() {
        var ctrl = this;
    }

    return LeafletMapDirective;
});
