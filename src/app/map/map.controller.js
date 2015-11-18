'use strict';

angular
    .module('sfMap')
    .controller('MapController', MapController);

/** @ngInject */
function MapController($state, $stateParams, LayersDataService) {
    var vm = this;

    init();

    ///////////////

    function init() {
        var layer;

        if (_.has($stateParams, 'layerId') && !_.isEmpty($stateParams.layerId)) {
            layer = LayersDataService.getLayerById($stateParams.layerId);
        } else {
            layer = LayersDataService.getDefaultLayer();
        }

        LayersDataService.setCurrentLayer(layer);

        $state.go('main.map', {layerId: layer.id}); // TODO: Use routing service
    }
}