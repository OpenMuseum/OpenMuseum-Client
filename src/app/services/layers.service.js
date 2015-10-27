'use strict';

angular
    .module('sfServices')
    .factory('LayersDataService', LayersDataService);

LayersDataService.$inject = ['$http', '$q', 'Layer'];

function LayersDataService($http, $q, Layer) {
    var currentLayer = {},
        layers = [];

    return {
        getLayers: getLayers,
        getLayerById: getLayerById,
        getDefaultLayer: getDefaultLayer,
        getCurrentLayer: getCurrentLayer,
        setCurrentLayer: setCurrentLayer,
        loadLayers: loadLayers
    };

    ///////////////

    /**
     * @returns {Object[]}
     */
    function getLayers() {
        return layers;
    }

    /**
     * @param {string} id
     *
     * @returns {Object}
     */
    function getLayerById(id) {
        return _.findWhere(layers, {
            id: id
        });
    }

    /**
     * @returns {Object}
     */
    function getDefaultLayer() {
        return _.findWhere(layers, {
            default: true
        });
    }

    /**
     * @returns {Object}
     */
    function getCurrentLayer() {
        return currentLayer;
    }

    /**
     * @param {Object} layer
     */
    function setCurrentLayer(layer) {
        currentLayer = layer;
    }

    function loadLayers() {
        //return $http.get('http://openmuseum.azurewebsites.net/api/Layers')
        return $http.get('./api/layers.json')
            .then(getLayersComplete)
            .catch(getLayersFailed);

        function getLayersComplete(response) {
            _.forEach(response.data, function(layerData) {
                layers.push(new Layer(layerData));
            });
        }

        function getLayersFailed(error) {
            //logger.error('XHR Failed for getMaps: ' + error.data);
        }
    }
}