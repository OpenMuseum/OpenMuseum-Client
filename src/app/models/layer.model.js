'use strict';

angular
    .module('sfModels')
    .factory('Layer', LayerModel);

LayerModel.inject = ['$q'];

function LayerModel($q) {
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

        function loadOverlays() {
            // TODO
        }
    }

    Layer.prototype = {
        setData: function(data) {
            _.assign(this, data);
        },
        getOverlays: function() {
            var deferred = $q.defer();

            if (_.has(this, 'overlays')) {
                deferred.resolve(this.overlays);
            } else {
                this.loadOverlays(this.id, deferred);
            }

            return deferred.promise;
        }
    };

    return Layer;
}