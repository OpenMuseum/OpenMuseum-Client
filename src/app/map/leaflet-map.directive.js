'use strict';

angular
    .module('sfMap')
    .directive('sfLeafletMap', LeafletMapDirective);

    LeafletMapDirective.$inject = ['$rootScope', 'LayersDataService'];

    function LeafletMapDirective($rootScope, LayersDataService) {
        var directive = {
            restrict: 'E',
            replace: true,
            template: '<div id="main-map"></div>',
            scope: {},
            link: linkFunc,
            controller: ['$scope', LeafletMapController]
        };

        return directive;

        ///////////////

        function LeafletMapController($scope) {
            init();

            function init() {
                var currentLayer = LayersDataService.getCurrentLayer(),
                    initialLayer,
                    layers = LayersDataService.getLayers(),
                    layersControls = {},
                    map,
                    mapBounds,
                    mapLayers = [],
                    mapMaxZoom = 5,
                    mapMinZoom = 3,
                    northEast,
                    southWest;

                _.forEach(layers, function (layer) {
                    var mapLayer = L.tileLayer(layer.url, {
                        id: layer.id,
                        model: layer,
                        minZoom: mapMinZoom,
                        maxZoom: mapMaxZoom,
                        noWrap: true,
                        continuousWorld: true
                    });

                    layer.getOverlays();

                    layersControls[layer.name] = mapLayer;

                    mapLayers.push(mapLayer);
                });

                initialLayer = _.find(mapLayers, function(layer) {
                    return layer.options.id === currentLayer.id;
                });

                map = L.map('main-map', {
                    crs: L.CRS.Simple,
                    layers: [initialLayer],
                    maxZoom: mapMaxZoom,
                    minZoom: mapMinZoom,
                    center: [0, 0],
                    zoom: 3,
                    zoomControl: false
                });

                southWest = map.unproject([0, 4444], mapMaxZoom);
                northEast = map.unproject([6108, 0], mapMaxZoom);
                mapBounds = L.latLngBounds(southWest, northEast);

                map.setMaxBounds(mapBounds);
                map.setView(mapBounds.getCenter(), 4);

                L.control.zoom({position: 'bottomleft'}).addTo(map);
                L.control.layers(layersControls, [], {position: 'topleft'}).addTo(map);
            }
        }

        function linkFunc(scope, el, attr, ctrl) {

        }
    }