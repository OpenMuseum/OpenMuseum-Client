'use strict';

describe('Main Controller', function () {
    var $state, $stateParams, $templateCache, $location, $rootScope, $injector, $controller, LayersDataService;

    function goTo(url) {
        $location.url(url);
        $rootScope.$digest();
    }

    function createController(params) {
        $state.params = params || {};

        return $controller('MainController', {
            $state: $state
        });
    }

    // Mock module dependencies
    beforeEach(function() {
        jasmine.getJSONFixtures().fixturesPath = 'base/src/tests/fixtures/layers';

        module('sarFortress');

        module(function ($provide) {
            $provide.value('LayersDataService',{
                getLayers: function () {
                    return {
                        then: function (callback) { return callback(getJSONFixture('layers_api.json')); }
                    }
                },
                getLayerById: function (id) { return {}; },
                getDefaultLayer: function () { return { id: 'paris-1550' }; },
                setCurrentLayer: function () { return null; }
            });
        });
    });

    // Mock other dependencies
    beforeEach(inject(function (_$state_, _$stateParams_, _$templateCache_, _$location_, _$rootScope_, _$injector_, _$controller_, _LayersDataService_) {
        $state = _$state_;
        $stateParams = _$stateParams_;
        $templateCache = _$templateCache_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $controller = _$controller_;
        LayersDataService = _LayersDataService_;
    }));

    it('should call LayersDataService to load layers', function () {
        spyOn(LayersDataService, 'getLayers').and.callThrough();
        createController();

        expect(LayersDataService.getLayers).toHaveBeenCalled();
    });

    it('should redirect to the default layer if url isn\'t specified', function () {
        createController();
        goTo('/');

        expect($location.url()).toEqual('/paris-1550');
    });

    it('should redirect to the default layer from not existent url', function () {
        spyOn(LayersDataService, 'getLayerById').and.callFake(function() { return undefined; });
        createController({ layerId: 'bad-url' });
        goTo('/bad-url');

        expect($location.url()).toEqual('/paris-1550');
    });

    it('should show layer from given url', function () {
        spyOn(LayersDataService, 'getLayerById').and.callFake(function() { return { id: 'paris-1575' }; });
        createController({ layerId: 'paris-1575' });
        goTo('/paris-1575');

        expect($location.url()).toEqual('/paris-1575');
    });
});
