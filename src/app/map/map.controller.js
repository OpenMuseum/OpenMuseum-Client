define([], function () {
    'use strict';

    MapController.$inject = ['LayersDataService'];

    function MapController(LayersDataService) {
        var ctrl = this;

        ctrl.currentLayer = {};
        ctrl.layers = [];

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
                    ctrl.layers = data;

                    return ctrl.layers;
                });
        }

        function setCurrentLayer(layer) {
            ctrl.currentLayer = layer;
        }
    }

    return MapController;
});

