'use strict';

angular
    .module('sfMap')
    .controller('sfMapController', MapController);

MapController.$inject = ['sfLayersDataService'];

function MapController(LayersDataService) {
    var vm = this;

    vm.currentLayer = {};
    vm.layers = [];

    activate();

    ///////////////

    function activate() {
        return getLayers().then(function(layers) {
            setCurrentLayer(layers[0]);
            //logger.info('Activated Map View');
        });
    }

    function getLayers() {
        return LayersDataService.getLayers()
            .then(function(data) {
                vm.layers = data;

                return vm.layers;
            });
    }

    function setCurrentLayer(layer) {
        vm.currentLayer = layer;
    }
}