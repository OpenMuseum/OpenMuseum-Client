'use strict';

describe('Layers Service', function () {
    var $httpBackend,
        Layer,
        LayersDataService;

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

    afterEach(function () {
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('successfully', function () {

        it('should load layers', function () {
            $httpBackend.when('GET', './api/layers.json').respond(200, getJSONFixture('layers_api.json'));
            LayersDataService.getLayers().then(function(layers) {
                expect(layers.length).toEqual(2);
            });
            $httpBackend.flush();
        });

        it('should return memorized layers', function () {
            $httpBackend.when('GET', './api/layers.json').respond(200, getJSONFixture('layers_api.json'));
            LayersDataService.getLayers().then(function() {
                LayersDataService.getLayers().then(function(layers) {
                    expect(layers.length).toEqual(2);
                });
            });
            $httpBackend.flush();
        });

        it('should return default layer', function () {
            $httpBackend.when('GET', './api/layers.json').respond(200, getJSONFixture('layers_api.json'));
            LayersDataService.getLayers().then(function() {
                expect(LayersDataService.getDefaultLayer().id).toEqual('paris-1550');
            });
            $httpBackend.flush();
        });

        it('should return layer by "id"', function () {
            $httpBackend.when('GET', './api/layers.json').respond(200, getJSONFixture('layers_api.json'));
            LayersDataService.getLayers().then(function() {
                expect(LayersDataService.getLayerById('paris-1575').id).toEqual('paris-1575');
            });
            $httpBackend.flush();
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

    describe('unsuccessfully', function () {
        it('should throw error', function () {
            $httpBackend.when('GET', './api/layers.json').respond(500, 'Oh no!');

            try {
                LayersDataService.getLayers();
                $httpBackend.flush();
            } catch (error) {
                expect(error.toString()).toEqual('Error: XHR Failed for loadLayers: Oh no!');
            }
        });
    });
});
