'use strict';

angular
    .module('sfMap')
    .directive('sfLeafletMap', LeafletMapDirective);

/** @ngInject */
function LeafletMapDirective($rootScope, LayersDataService, LeafletMapService) {
    var baseLayers = {},
        currentLayer,
        directive = {
            restrict: 'E',
            replace: true,
            template: '<div id="main-map"></div>',
            scope: {},
            link: linkFunc,
            controller: ['$scope', LeafletMapController]
        };

    return directive;

    ///////////////

    function LeafletMapController() {
        init();

        function init() {
            bindEventListeners();
        }

        function bindEventListeners() {
            $rootScope.$on('layer:changed', onLayerChanged);
        }

        /**
         * @param {Object} event
         * @param {Object} data
         * @param {string} data.newLayer
         * @param {string} data.oldLayer
         */
        function onLayerChanged(event, data) {
            var newLayer = baseLayers[data.newLayer],
                oldLayer = baseLayers[data.oldLayer];

            currentLayer = newLayer;

            LeafletMapService.removeOverlays(oldLayer);
            LeafletMapService.addOverlays(newLayer);
        }
    }

    function linkFunc(scope, element, attrs, ctrl) {
        LayersDataService.getLayers().then(function(layers) {
            init(layers);
        });

        function init(layers) {
            var baseLayersControls = {},
                mapEl = element[0];

            _.forEach(layers, function (layer) {
                var mapLayer = LeafletMapService.createLayer(layer);

                if (layer.id === LayersDataService.getCurrentLayer().id) {
                    currentLayer = mapLayer;
                }

                baseLayers[layer.id] = mapLayer;
                baseLayersControls[layer.name] = mapLayer;
            });

            LeafletMapService.createMap({
                element: mapEl,
                layers: [currentLayer]
            });
            LeafletMapService.createLayersControl(baseLayersControls);
            LeafletMapService.createOverlaysControl();
            LeafletMapService.createZoomControl();
            LeafletMapService.addOverlays(currentLayer);
            LeafletMapService.updateBounds();

            bindMapEventListeners();
        }

        function bindMapEventListeners() {
            var map = LeafletMapService.getMap();

            map.on('baselayerchange', function(event) {
                $rootScope.$emit('layer:changed', {
                    oldLayer: currentLayer.options.id,
                    newLayer: event.layer.options.id
                });
            });
        }
    }
}
