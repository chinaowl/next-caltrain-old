(function() {
  'use strict';

  var ko = require('knockout');
  var $ = require('jquery');

  var API_NEXT = '/next';
  var API_STOPS = '/stops';

  var vm = {
    stops: ko.observableArray(),
    origin: ko.observable(),
    destination: ko.observable(),
    direction: ko.observable(),
    result: ko.observableArray()
  };

  vm.getNextTrain = function() {
    vm.direction(vm.stops.indexOf(vm.origin()) < vm.stops.indexOf(vm.destination()) ? 'SB' : 'NB');
    var url = [API_NEXT, vm.origin(), vm.destination(), vm.direction()].join('/');

    $.get(url).done(function(data) {
      console.log(data);
      vm.result(data);
    });
  };

  (function getStops() {
    $.get(API_STOPS).done(function(data) {
      console.log(data);
      vm.stops(data);
    });
  })();

  ko.applyBindings(vm);
})();