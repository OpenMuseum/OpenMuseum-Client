'use strict';

describe('Layers Service', function () {
    var $httpBackend,
        Layer,
        LayersDataService,
        layersCollection;

    // Mock module dependencies
    beforeEach(function () {
        module('sfModels');
        module('sfServices');
    });

    // Mock other dependencies
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        Layer = $injector.get('Layer');
        LayersDataService = $injector.get('LayersDataService');
        jasmine.getJSONFixtures().fixturesPath = 'base/src/tests/fixtures/layers';
    }));

    // Load layers collection
    beforeEach(function () {
        $httpBackend.when('GET', './api/layers.json').respond(200, getJSONFixture('layers_api.json'));
        LayersDataService.loadLayers();
        $httpBackend.flush();

        layersCollection = LayersDataService.getLayers();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should load layers', function () {
        expect(LayersDataService.getLayers().length).toEqual(2);
    });

    it('should get default layer', function () {
        expect(LayersDataService.getDefaultLayer().id).toEqual('paris-1550');
    });

    it('should get layer by "id"', function () {
        expect(LayersDataService.getLayerById('paris-1575').id).toEqual('paris-1575');
    });

    it('should set current layer', function () {
        var layer = new Layer({
            id: 'paris-1550',
            name: 'Paris 1550',
            height: 4444,
            width: 6108,
            url: 'http://domain.com/map/{z}/{x}/{y}.png'
        });

        LayersDataService.setCurrentLayer(layer);

        expect(LayersDataService.getCurrentLayer().id).toEqual(layer.id);
    });
});