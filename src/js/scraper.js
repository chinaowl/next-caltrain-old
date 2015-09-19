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

            $('table .NB_TT thead tr').children().each(function (index, element) {
                var trainNumber = parseInt($(this).text().replace(/\*/g, ''), 10);
                if (trainNumber) {
                    nbTrains[trainNumber] = {};
                    nbTrainIndex.push(trainNumber + '');
                }
            });

            $('table .NB_TT tbody tr').each(function (index, element) {
                var stationName = $(this).children('th').next().children().text();
                var trainsThroughStation = [];

                var am = true;
                $(this).children('td').each(function (index, element) {
                    var timeText = $(this).text();
                    if (timeText.match(/12:../)) {
                        am = !am;
                    }
                    if (timeText.indexOf(':') > -1) {
                        var split = timeText.split(':');
                        if (!am) {
                            if (split[0] != 12) {
                                split[0] = parseInt(split[0]) + 12;
                            }
                            timeText = split[0] + ':' + split[1];
                        } else { // edge case: 12:00 midnight becomes 0:00
                            if (split[0] == 12) {
                                timeText = '0:' + split[1];
                            }
                        }
                        trainsThroughStation.push(nbTrainIndex[index]);
                        nbTrains[nbTrainIndex[index]][stationName] = timeText;
                    }
                });

                nbStations[stationName] = trainsThroughStation;
                nbStationIndex.push(stationName);
            });

            var json = {
                nbTrains: nbTrains,
                nbStations: nbStations,
                nbTrainIndex: nbTrainIndex,
                nbStationIndex: nbStationIndex
            };

            fs.writeFile('./src/js/data.json', JSON.stringify(json, null, 4), function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('File successfully written! Check folder for data.json');
                }
            });
        } else {
            console.log(error);
        }
    });
};
