'use strict';

describe('Routing', function () {
    var $state,
        $stateParams,
        $templateCache,
        $location,
        $rootScope;

    function mockTemplate(templateRoute, tmpl) {
        $templateCache.put(templateRoute, tmpl || templateRoute);
    }

    function goTo(url) {
        $location.url(url);
        $rootScope.$digest();
    }

    // Mock module dependencies
    beforeEach(function () {
        module('sarFortress');
    });

    // Mock other dependencies
    beforeEach(inject(function (_$state_, _$stateParams_, _$templateCache_, _$location_, _$rootScope_) {
        $state = _$state_;
        $stateParams = _$stateParams_;
        $templateCache = _$templateCache_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    describe('html5Mode', function () {
        it('should be enabled', function () {
            goTo('/paris-1550');
            expect($location.$$html5).toEqual(true);
        });
    });

    describe('otherwise', function () {
        beforeEach(function () {
            mockTemplate('app/main.html');
        });

        it('should redirect to the default layer', function () {
            goTo('/someNonExistentUrl');
            expect($state.current.name).toEqual('main.map');
        });
    });

    describe('/:layerId', function () {
        beforeEach(function () {
            mockTemplate('app/map/map.html');
        });

        it('should go to the stateWithUrlParams state', function () {
            goTo('/paris-1550');
            expect($state.current.name).toEqual('main.map');
        });

        it('should have $stateParams.layerId', function () {
            goTo('/paris-1550');
            expect($stateParams.layerId).toEqual('paris-1550');
        });
    });
});
