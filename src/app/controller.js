'use strict';

angular
    .module('sarFortress')
    .controller('MainController', MainController);

MainController.$inject = ['$state', '$stateParams', 'LayersDataService'];

function MainController($state, $stateParams, LayersDataService) {
    var vm = this;

    init();

    ///////////////

    function init() {
        var layer;

        if (_.has($stateParams, 'layerId')) {
            layer = LayersDataService.getLayerById($stateParams.layerId);
        } else {
            layer = LayersDataService.getDefaultLayer();
        }

        LayersDataService.setCurrentLayer(layer);

        $state.go('main.map', {layerId: layer.id}); // TODO: Use routing service
    }
}