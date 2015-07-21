define([], function () {
    'use strict';

    MapController.$inject = ['MapsDataService'];

    function MapController(MapsDataService) {
        var ctrl = this;

        ctrl.currentMap = {};
        ctrl.maps = [];

        activate();

        ///////////////

        function activate() {
            return getMaps().then(function(maps) {
                setCurrentMap(maps[0]);
                //logger.info('Activated Map View');
            });
        }

        function getMaps() {
            return MapsDataService.getMaps()
                .then(function(data) {
                    ctrl.maps = data;

                    return ctrl.maps;
                });
        }

        function setCurrentMap(map) {
            ctrl.currentMap = map;
        }
    }

    return MapController;
});

