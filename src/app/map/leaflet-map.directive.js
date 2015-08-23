define([
    'leaflet',
    'lodash'
], function () {
    'use strict';

    function LeafletMapDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: './src/app/map/leaflet-map.directive.html',
            scope: {
                layers: '='
            },
            link: linkFunc,
            controller: LeafletMapController,
            controllerAs: 'leafletCtrl',
            bindToController: true
        };

        return directive;

        ///////////////

        function linkFunc(scope, el, attr, ctrl) {
            var layersControls = {};
            var map;
            var mapBounds;
            var mapLayers = [];
            var mapMaxZoom = 5;
            var mapMinZoom = 3;
            var northEast;
            var southWest;

            _.forEach(ctrl.layers, function (layer) {
                var mapLayer = L.tileLayer(layer.url, {
                    minZoom: mapMinZoom,
                    maxZoom: mapMaxZoom,
                    noWrap: true,
                    continuousWorld: true
                });

                layersControls[layer.name] = mapLayer;

                mapLayers.push(mapLayer);
            });

            map = L.map('main-map', {
                crs: L.CRS.Simple,
                layers: mapLayers,
                maxZoom: mapMaxZoom,
                minZoom: mapMinZoom,
                center: [0, 0],
                zoom: 3
            });

            southWest = map.unproject([0, 4444], mapMaxZoom);
            northEast = map.unproject([6108, 0], mapMaxZoom);
            mapBounds = L.latLngBounds(southWest, northEast);

            map.setMaxBounds(mapBounds);
            map.setView(mapBounds.getCenter(), 4);

            L.control.layers(layersControls).addTo(map);
        }
    }

    function LeafletMapController() {
        var ctrl = this;
    }

    return LeafletMapDirective;
});
