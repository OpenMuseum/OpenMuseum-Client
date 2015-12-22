'use strict';

describe('Layer Model', function () {
    var $httpBackend,
        Layer,
        defaultLayer = {
            default: false,
            height: null,
            id: null,
            name: '',
            overlays: [],
            url: '',
            width: null
        };

    // Mock module dependencies
    beforeEach(function () {
        module('sfModels');
    });

    // Mock other dependencies
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        Layer = $injector.get('Layer');
        jasmine.getJSONFixtures().fixturesPath = 'base/src/tests/fixtures/overlays';
    }));

    it('should create default model', function () {
        expect(angular.equals(new Layer(), defaultLayer)).toBe(true);
    });

    it('should create model with parameters', function () {
        var params = {
                default: true,
                height: 400,
                id: 'layer-id',
                width: 600
            },
            expectedLayer = _.assign(defaultLayer, params);

        expect(angular.equals(new Layer(params), expectedLayer)).toBe(true);
    });

    it('should return memorized overlays', function () {
        var layer = new Layer({
            id: 'paris-1550',
            overlays: [1, 2, 3, 4]
        });

        layer.getOverlays().then(function (overlays) {
            expect(overlays.length).toBe(4);
        });
    });

    it('should successfully load overlays for model', function () {
        var layer = new Layer({ id: 'paris-1550' });

        $httpBackend.when('GET', './api/overlays/paris-1550.json').respond(200, getJSONFixture('overlays_api.json'));
        layer.getOverlays().then(function (overlays) {
            expect(overlays.length).toBe(3);
        });
        $httpBackend.flush();
    });

    it('should unsuccessfully load overlays for model', function () {
        var layer = new Layer({ id: 'paris-1550' });

        $httpBackend.when('GET', './api/overlays/paris-1550.json').respond(500, 'Oh no!');

        try {
            layer.getOverlays();
            $httpBackend.flush();
        } catch (error) {
            expect(error.toString()).toEqual('Error: XHR Failed for _loadOverlays: Oh no!');
        }
    });
});
