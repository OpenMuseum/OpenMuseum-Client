'use strict';

angular
    .module('sfMap')
    .factory('sfLayersDataService', LayersDataService);

LayersDataService.$inject = ['$http'];

function LayersDataService($http) {
    var factory = {
        getLayers: getLayers
    };

    return factory;

    ///////////////

    function getLayers() {
        return $http.get('http://openmuseum.azurewebsites.net/api/Layers')
            .then(getLayersComplete)
            .catch(getLayersFailed);

        function getLayersComplete(response) {
            return response.data;
        }

        function getLayersFailed(error) {
            //logger.error('XHR Failed for getMaps: ' + error.data);
        }
    }
}