'use strict';

var ko = require('knockout');
var data = require('./data.json');

(function () {
    var vm = {
        stations: data.nbStationIndex
    };

    ko.applyBindings(vm);
})();