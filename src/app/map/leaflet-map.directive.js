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
            var layersControl,
                zoomControl,
                map;

            init();

            function init() {
                var baseLayersControls = {},
                    currentLayer = LayersDataService.getCurrentLayer(),
                    initialLayer = {},
                    layers = LayersDataService.getLayers(),
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

                    if (layer.id === currentLayer.id) {
                        initialLayer = mapLayer;
                    }

                    baseLayersControls[layer.name] = mapLayer;
                    mapLayers.push(mapLayer);
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

                addOverlaysToMap(initialLayer);

                southWest = map.unproject([0, 4444], mapMaxZoom);
                northEast = map.unproject([6108, 0], mapMaxZoom);
                mapBounds = L.latLngBounds(southWest, northEast);

                map.setMaxBounds(mapBounds);
                map.setView(mapBounds.getCenter(), 4);

                createZoomControl();
                createLayersControl(baseLayersControls);
            }

            function createZoomControl() {
                zoomControl = L.control.zoom({position: 'bottomleft'});
                zoomControl.addTo(map);
            }

            function createLayersControl(baseControls) {
                layersControl = L.control.layers(baseControls, [], {position: 'topleft'});
                layersControl.addTo(map);
            }

            function addOverlaysToMap(layer) {
                if (_.has(layer.options, 'overlays')) {
                    addOverlays(layer.options.overlays);
                } else {
                    layer.options.model.getOverlays().then(function(overlays) {
                        var layers = {};

                        _.forEach(overlays, function(overlay) {
                            var points = [];

                            _.forEach(overlay.points, function(point) {
                                points.push(createMarker(point));
                            });

                            layers[overlay.name] = L.layerGroup(points);
                        });

                        layer.options.overlays = layers;
                        addOverlays(layers);
                    });
                }
            }

            function addOverlays(layers) {
                _.forIn(layers, function(value, key) {
                    map.addLayer(value);
                    layersControl.addOverlay(value, key);
                });
            }

            function createMarker(data) {
                var coords = map.unproject([data.x, data.y], 5);

                return L.marker(coords).bindPopup(data.desc);
            }
        }

        function linkFunc(scope, el, attr, ctrl) {

        }
    }