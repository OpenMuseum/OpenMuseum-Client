'use strict';

angular
    .module('sfModels')
    .factory('Layer', LayerModel);

/** @ngInject */
function LayerModel($http, $q) {
    function Layer(data) {
        this.default = false;
        this.height = null;
        this.id = null;
        this.name = '';
        this.overlays = [];
        this.url = '';
        this.width = null;

        if (data) {
            this.setData(data);
        }
    }

    Layer.prototype = {
        setData: function(data) {
            _.assign(this, data);
        },
        getOverlays: function() {
            var deferred = $q.defer();

            if (_.isEmpty(this.overlays)) {
                this._loadOverlays(this.id, deferred);
            } else {
                deferred.resolve(this.overlays);
            }

            return deferred.promise;
        },
        _loadOverlays: function(layerId, deferred) {
            var layer = this;

            return $http.get('./api/overlays/' + layerId + '.json')
                .then(loadOverlaysComplete)
                .catch(loadOverlaysFailed);

            function loadOverlaysComplete(response) {
                layer.overlays = response.data;
                deferred.resolve(layer.overlays);
            }

            function loadOverlaysFailed(error) {
                //logger.error('XHR Failed for loadOverlays: ' + error.data);
            }
        }
    };

    return Layer;
}