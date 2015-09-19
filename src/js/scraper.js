var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

exports.scrapeCaltrainWebsite = function () {
    var weekday = 'http://www.caltrain.com/schedules/weekdaytimetable.html';

    request(weekday, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var nbTrains = {};
            var nbStations = {};
            var nbTrainIndex = [];
            var nbStationIndex = [];

            var json = {
                nbTrains: nbTrains,
                nbStations: nbStations,
                nbTrainIndex: nbTrainIndex,
                nbStationIndex: nbStationIndex
            };

            fs.writeFile('./public/data.json', JSON.stringify(json), function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('File successfully written! Check public/data.json');
                }
            });
        } else {
            console.log(error);
        }
    });
};