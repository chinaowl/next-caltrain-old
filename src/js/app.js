(function() {
  'use strict';

  var ko = require('knockout');
  var $ = require('jquery');
  var moment = require('moment');

  var API_NEXT = '/next';
  var API_STOPS = '/stops';
  var TIME_FORMAT = 'hh:mm';

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
      data.forEach(function(item) {
        var departureTime = moment({
          hour: item.departure_time.hours === 24 ? 12 : item.departure_time.hours,
          minute: item.departure_time.minutes
        });

        var arrivalTime = moment({
          hour: item.arrival_time.hours === 24 ? 12 : item.arrival_time.hours,
          minute: item.arrival_time.minutes
        });

        item.departure_time = departureTime.format(TIME_FORMAT);
        item.arrival_time = arrivalTime.format(TIME_FORMAT);
      });

      vm.result(data);
    });
  };

  (function getStops() {
    if (window.localStorage.stops) {
      vm.stops(JSON.parse(window.localStorage.stops));
    } else {
      $.get(API_STOPS).done(function(data) {
        window.localStorage.setItem('stops', JSON.stringify(data));
        vm.stops(data);
      });
    }
  })();

  ko.applyBindings(vm);
})();