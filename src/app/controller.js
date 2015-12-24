'use strict';

angular
    .module('sarFortress')
    .controller('MainController', MainController);

/** @ngInject */
function MainController($state, LayersDataService) {
    LayersDataService.getLayers().then(function() {
        init();
    });

    function init() {
        var layer;

        if (_.has($state.params, 'layerId') && !_.isEmpty($state.params.layerId)) {
            layer = LayersDataService.getLayerById($state.params.layerId);

            if (!layer) {
                layer = LayersDataService.getDefaultLayer();
            }
        } else {
            layer = LayersDataService.getDefaultLayer();
        }

        LayersDataService.setCurrentLayer(layer);

        $state.go('main.map', {layerId: layer.id}); // TODO: Use routing service
    }
}