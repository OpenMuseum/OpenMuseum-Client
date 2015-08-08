define([], function () {
    'use strict';

    MapsDataService.$inject = ['$http'];

    function MapsDataService($http) {
        var factory = {
            getMaps: getMaps
        };

        return factory;

        ///////////////

        function getMaps() {
            return $http.get('/api/maps.json')
                .then(getMapsComplete)
                .catch(getMapsFailed);

            function getMapsComplete(response) {
                return response.data.maps;
            }

            function getMapsFailed(error) {
                //logger.error('XHR Failed for getMaps: ' + error.data);
            }
        }
    }

    return MapsDataService;
});
