'use strict';

angular
    .module('sfServices')
    .factory('LayersDataService', LayersDataService);

/** @ngInject */
function LayersDataService($http, $q, Layer) {
    var currentLayer = {},
        layers = [];

    return {
        getLayers: getLayers,
        getLayerById: getLayerById,
        getDefaultLayer: getDefaultLayer,
        getCurrentLayer: getCurrentLayer,
        setCurrentLayer: setCurrentLayer
    };

    ///////////////

    /**
     * @returns {jQuery.Promise}
     */
    function getLayers() {
        var deferred = $q.defer();

        if (_.isEmpty(layers)) {
            _loadLayers(deferred);
        } else {
            deferred.resolve(layers);
        }

        return deferred.promise;
    }

    /**
     * @param {string} id
     *
     * @returns {LayerModel}
     */
    function getLayerById(id) {
        return _.findWhere(layers, {
            id: id
        });
    }

    /**
     * @returns {LayerModel}
     */
    function getDefaultLayer() {
        return _.findWhere(layers, {
            default: true
        });
    }

    /**
     * @returns {LayerModel}
     */
    function getCurrentLayer() {
        return currentLayer;
    }

    /**
     * @param {LayerModel} layer
     */
    function setCurrentLayer(layer) {
        currentLayer = layer;
    }

    /**
     * @returns {jQuery.Promise}
     */
    function _loadLayers(deferred) {
        //return $http.get('http://openmuseum.azurewebsites.net/api/Layers')
        return $http.get('./api/layers.json')
            .then(loadLayersComplete)
            .catch(loadLayersFailed);

        function loadLayersComplete(response) {
            _.forEach(response.data, function(layerData) {
                layers.push(new Layer(layerData));
            });
            deferred.resolve(layers);
        }

        function loadLayersFailed(error) {
            deferred.reject(error);
            throw new Error('XHR Failed for loadLayers: ' + error.data);
        }
    }
}
