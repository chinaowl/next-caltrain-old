(function () {
    'use strict';

    var ko = require('knockout');
    var moment = require('moment');
    var data = require('./data.json');
    var _forEach = require('lodash/collection/forEach');
    var _intersection = require('lodash/array/intersection');

    var vm = {
        stations: data.nbStationIndex,
        origin: ko.observable(),
        destination: ko.observable(),
        result: {
            trainNumber: ko.observable(),
            departureTime: ko.observable(),
            arrivalTime: ko.observable()
        }
    };

    vm.getNextTrain = function () {
        var now = moment();
        var commonTrains = _intersection(data.nbStations[vm.origin()], data.nbStations[vm.destination()]);

        _forEach(commonTrains, function (train) {
            var trainTimeString = data.nbTrains[train][vm.origin()];
            var split = trainTimeString.split(':');
            var trainTime = moment({
                hour: split[0],
                minute: split[1]
            });

            if (now.isBefore(trainTime)) {
                vm.result.trainNumber(train);
                vm.result.departureTime(trainTimeString);
                vm.result.arrivalTime(data.nbTrains[train][vm.destination()]);
                return false;
            }
        });
    };

    ko.applyBindings(vm);
})();