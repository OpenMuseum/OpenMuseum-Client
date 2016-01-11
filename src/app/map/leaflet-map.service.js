'use strict';

angular
    .module('sfMap')
    .factory('LeafletMapService', LeafletMapService);

/** @ngInject */
function LeafletMapService() {
    var icons = {},
        map,
        mapMaxZoom = 5,
        mapMinZoom = 3,
        overlaysControl,
        zoomControl;

    return {
        addOverlays: addOverlays,
        createLayer: createLayer,
        createLayersControl: createLayersControl,
        createMap: createMap,
        createOverlaysControl: createOverlaysControl,
        createZoomControl: createZoomControl,
        getMap: getMap,
        removeOverlays: removeOverlays,
        updateBounds: updateBounds
    };

    /// PUBLIC METHODS

    /**
     * @public
     * @param {TileLayer} layer
     *
     * @returns void
     */
    function addOverlays(layer) {
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

            _.forIn(layers, function(value, key) {
                map.addLayer(value);
                overlaysControl.addOverlay(value, key);
            });
        });
    }

    /**
     * @public
     * @param {Layer} model
     *
     * @returns {TileLayer}
     */
    function createLayer(model) {
        return L.tileLayer(model.url, {
            id: model.id,
            model: model,
            minZoom: mapMinZoom,
            maxZoom: mapMaxZoom,
            noWrap: true,
            continuousWorld: true
        });
    }

    /**
     * @public
     * @param {Object} [baseControls]
     *
     * @returns {Control.Layers}
     */
    function createLayersControl(baseControls) {
        var base = baseControls || {},
            layersControl = L.control.layers(base, [], { position: 'topleft' });

        layersControl.addTo(map);

        return layersControl;
    }

    /**
     * @public
     * @param {Object} params
     * @param {HTMLElement} params.element
     * @param {TileLayer[]} params.layers
     *
     * @returns {Map}
     */
    function createMap(params) {
        map = L.map(params.element, {
            crs: L.CRS.Simple,
            layers: params.layers,
            maxZoom: mapMaxZoom,
            minZoom: mapMinZoom,
            center: [0, 0],
            zoom: 3,
            zoomControl: false
        });

        return map;
    }

    /**
     * @public
     */
    function createOverlaysControl() {
        overlaysControl = createLayersControl();

        return overlaysControl;
    }

    /**
     * @public
     *
     * @returns {Control.zoom}
     */
    function createZoomControl() {
        zoomControl = L.control.zoom({ position: 'bottomleft' });
        zoomControl.addTo(map);

        return zoomControl;
    }

    /**
     * @public
     *
     * @returns {Map}
     */
    function getMap() {
        return map;
    }

    /**
     * @public
     * @param {TileLayer} layer
     *
     * @returns void
     */
    function removeOverlays(layer) {
        _.forIn(layer.options.overlays, function(overlay) {
            map.removeLayer(overlay);
            overlaysControl.removeLayer(overlay);
        });
    }

    /**
     * @public
     */
    function updateBounds() {
        var southWest = map.unproject([0, 4444], mapMaxZoom),
            northEast = map.unproject([6108, 0], mapMaxZoom),
            mapBounds = L.latLngBounds(southWest, northEast);

        map.setMaxBounds(mapBounds);
        map.setView(mapBounds.getCenter(), 4);
    }

    /// PRIVATE METHODS

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
