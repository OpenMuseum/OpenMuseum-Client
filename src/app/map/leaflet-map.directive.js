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
            var icons = {},
                layersControl,
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
                                points.push(createMarker(point, overlay.name.toLowerCase()));
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

            /**
             * @param {Object} point
             * @param {number} point.x
             * @param {number} point.y
             * @param {string} point.desc
             * @param {string} overlayKey - Unique overlay key
             *
             * @returns {L.marker}
             */
            function createMarker(point, overlayKey) {
                var coords = map.unproject([point.x, point.y], 5),
                    options = {
                        icon: getIcon(overlayKey)
                    };

                return L.marker(coords, options).bindPopup(point.desc);
            }

            /**
             * @param {string} key - Unique overlay key
             *
             * @returns {L.divIcon}
             */
            function getIcon(key) {
                if (!_.has(icons, key)) {
                    icons[key] = L.divIcon({
                        className: key + '-overlay-icon overlay-icon'
                    });
                }

                return icons[key];
            }
        }

        function linkFunc(scope, el, attr, ctrl) {

        }
    }