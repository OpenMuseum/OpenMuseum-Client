'use strict';

describe('Leaflet Map Service', function () {
    var map,
        fakeLayer,
        Layer,
        LeafletMapService;

    function createFakeMap() {
        fakeLayer = L.tileLayer('http://{s}.fake.layer.org/{z}/{x}/{y}.png');

        return LeafletMapService.createMap({
            element: document.createElement('div'),
            layers: [fakeLayer]
        });
    }

    // Mock module dependencies
    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath = 'base/src/tests/fixtures/overlays';

        module('sfModels');
        module('sfMap');
    });

    // Mock other dependencies
    beforeEach(inject(function ($injector) {
        Layer = $injector.get('Layer');
        LeafletMapService = $injector.get('LeafletMapService');
    }));

    beforeEach(function () {
        map = createFakeMap();
    });

    it('should create map', function () {
        expect(map instanceof L.Map).toBeTruthy();
    });

    it('should return an existent map', function () {
        var existentMap = LeafletMapService.getMap();

        expect(existentMap instanceof L.Map).toBeTruthy();
    });

    it('should create layer', function () {
        var layerModel = new Layer({ id: 'paris-1550' }),
            layer = LeafletMapService.createLayer(layerModel);

        expect(layer instanceof L.TileLayer).toBeTruthy();
    });

    it('should create zoom control', function () {
        var zoomControl = LeafletMapService.createZoomControl();

        expect(zoomControl instanceof L.Control.Zoom).toBeTruthy();
    });

    it('should create base layers control', function () {
        var layersControl = LeafletMapService.createLayersControl({
            fakeControl: fakeLayer
        });

        expect(layersControl instanceof L.Control.Layers).toBeTruthy();
    });

    it('should create overlays control', function () {
        var overlaysControl = LeafletMapService.createOverlaysControl();

        expect(overlaysControl instanceof L.Control.Layers).toBeTruthy();
    });

    it('should add layer\'s overlays to the map', function () {
        var layerModel = new Layer({ id: 'paris-1550', url: 'fake-url' }),
            layer = LeafletMapService.createLayer(layerModel);

        spyOn(layerModel, 'getOverlays').and.callFake(function() {
            return {
                then: function(callback) {
                    callback( getJSONFixture('overlays_api.json'));

                    _.forIn(layer.options.overlays, function(overlay) {
                        expect(map.hasLayer(overlay)).toBeTruthy();
                    });
                }
            };
        });

        LeafletMapService.createOverlaysControl();
        LeafletMapService.addOverlays(layer);
    });

    it('should remove layer\'s overlays from the map', function () {
        var layerModel = new Layer({ id: 'paris-1550', url: 'fake-url' }),
            layer = LeafletMapService.createLayer(layerModel);

        spyOn(layerModel, 'getOverlays').and.callFake(function() {
            return {
                then: function(callback) {
                    callback(getJSONFixture('overlays_api.json'));

                    LeafletMapService.removeOverlays(layer);

                    _.forIn(layer.options.overlays, function(overlay) {
                        expect(map.hasLayer(overlay)).toBeFalsy();
                    });
                }
            };
        });

        LeafletMapService.createOverlaysControl();
        LeafletMapService.addOverlays(layer);
    });

});
