'use strict';

describe('Directive "sf-leaflet-map"', function () {
    var $compile,
        $rootScope,
        LayersDataService,
        LeafletMapService;

    // Mock module dependencies
    beforeEach(function() {
        module('sarFortress');
        module('sfMap');

        module(function ($provide) {
            $provide.value('LayersDataService', {
                getLayers: function () {
                    return {
                        then: function (callback) { return callback(getJSONFixture('layers_api.json')); }
                    }
                },
                getCurrentLayer: function () { return { id: 'paris-1550' }; }
            });
        });
    });

    // Mock other dependencies
    beforeEach(inject(function (_$compile_, _$rootScope_, _LayersDataService_, _LeafletMapService_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        LayersDataService = _LayersDataService_;
        LeafletMapService = _LeafletMapService_;
    }));

    it('should be replaced with the map container', function () {
        spyOn(LayersDataService, 'getLayers').and.callThrough();
        spyOn(LeafletMapService, 'addOverlays').and.callFake(function() { return null; });

        var element = $compile("<sf-leaflet-map></sf-leaflet-map>")($rootScope);

        $rootScope.$digest();

        expect(LayersDataService.getLayers).toHaveBeenCalled();
        expect(LeafletMapService.addOverlays).toHaveBeenCalled();
        expect(element.length).toBe(1);
    });
});
