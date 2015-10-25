'use strict';

angular
    .module('sfMap')
    .controller('MapController', MapController);

MapController.$inject = ['$scope', 'LayersDataService'];

function MapController($scope, LayersDataService) {
    var vm = this;
}