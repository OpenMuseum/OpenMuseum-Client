'use strict';

angular
    .module('sfMap')
    .directive('sfLeafletMap', LeafletMapDirective);

    /** @ngInject */
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

        function LeafletMapController() {
            var baseLayers = {},
                currentLayer,
                icons = {},
                layersControl,
                zoomControl,
                map,
                mapMaxZoom = 5,
                mapMinZoom = 3,
                overlaysControl;

            init();
            bindGlobalEventListeners();
            bindMapEventListeners();

            function init() {
                var baseLayersControls = {},
                    layers = LayersDataService.getLayers(),
                    mapBounds,
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

                    if (layer.id === LayersDataService.getCurrentLayer().id) {
                        currentLayer = mapLayer;
                    }

                    baseLayers[layer.id] = mapLayer;
                    baseLayersControls[layer.name] = mapLayer;
                });

                map = L.map('main-map', {
                    crs: L.CRS.Simple,
                    layers: [currentLayer],
                    maxZoom: mapMaxZoom,
                    minZoom: mapMinZoom,
                    center: [0, 0],
                    zoom: 3,
                    zoomControl: false
                });

                layersControl = createLayersControl(baseLayersControls);
                overlaysControl = createLayersControl();

                createZoomControl();
                addOverlays(currentLayer);

                southWest = map.unproject([0, 4444], mapMaxZoom);
                northEast = map.unproject([6108, 0], mapMaxZoom);
                mapBounds = L.latLngBounds(southWest, northEast);

                map.setMaxBounds(mapBounds);
                map.setView(mapBounds.getCenter(), 4);
            }

            function bindGlobalEventListeners() {
                $rootScope.$on('layer:changed', onLayerChanged);
            }

            function bindMapEventListeners() {
                map.on('baselayerchange', function(e) {
                    $rootScope.$emit('layer:changed', {
                        oldLayer: currentLayer.options.id,
                        newLayer: e.layer.options.id
                    });
                });
            }

            /**
             * @param {Object} event
             * @param {Object} data
             * @param {string} data.newLayer
             * @param {string} data.oldLayer
             */
            function onLayerChanged(event, data) {
                var newLayer = baseLayers[data.newLayer],
                    oldLayer = baseLayers[data.oldLayer];

                currentLayer = newLayer;

                removeOverlays(oldLayer);
                addOverlays(newLayer);
            }

            function createZoomControl() {
                zoomControl = L.control.zoom({position: 'bottomleft'});
                zoomControl.addTo(map);
            }

            /**
             * @param {Object} [baseControls]
             *
             * @returns {Control.Layers}
             */
            function createLayersControl(baseControls) {
                var base = baseControls || [],
                    layersControl = L.control.layers(base, [], {position: 'topleft'});

                layersControl.addTo(map);

                return layersControl;
            }

            /**
             * @param {TileLayer} layer
             *
             * @returns void
             */
            function addOverlays(layer) {
                if (_.has(layer.options, 'overlays')) {
                    pushOverlaysToMap(layer.options.overlays);
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
                        pushOverlaysToMap(layers);
                    });
                }

                function pushOverlaysToMap(layers) {
                    _.forIn(layers, function(value, key) {
                        map.addLayer(value);
                        overlaysControl.addOverlay(value, key);
                    });
                }
            }

            /**
             * @param {TileLayer} layer
             *
             * @returns void
             */
            function removeOverlays(layer) {
                _.forIn(layer.options.overlays, function(value) {
                    map.removeLayer(value);
                    overlaysControl.removeLayer(value);
                });
            }

            /**
             * @param {Object} point
             * @param {number} point.x
             * @param {number} point.y
             * @param {string} point.desc
             * @param {string} overlayKey - Unique overlay key
             *
             * @returns {Marker}
             */
            function createMarker(point, overlayKey) {
                var coords = map.unproject([point.x, point.y], mapMaxZoom),
                    options = {
                        icon: getIcon(overlayKey)
                    };

                return L.marker(coords, options).bindPopup(point.desc);
            }

            /**
             * @param {string} key - Unique overlay key
             *
             * @returns {DivIcon}
             */
            function getIcon(key) {
                if (!_.has(icons, key)) {
                    icons[key] = L.divIcon({
                        iconSize: [17, 17],
                        className: 'overlay-icon overlay-icon--' + key
                    });
                }

                return icons[key];
            }
        }

        function linkFunc(scope, el, attr, ctrl) {

        }
    }
