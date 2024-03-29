var express = require('express');
var pg = require('pg');
var _ = require('lodash');

var app = express();
var LOCAL_DATABASE = 'postgres://localhost:5432/next-caltrain';

pg.defaults.ssl = true;

function connectToDatabase(query, params, callback) {
  pg.connect(process.env.DATABASE_URL || LOCAL_DATABASE, function(err, client) {
    if (err) throw err;
    console.log('Connected to Postgres');

    client.query(query, params, function(err, result) {
      if (err) throw err;
      callback(result.rows);
      pg.end();
    });
  });
}

app.get('/stops', function(req, res) {
  var query = 'select stops.stop_name from stops where stops.platform_code is not null';
  connectToDatabase(query, null, function(result) {
    var finalResult = _.uniq(_.flatMap(result, function(item) {
      return item.stop_name;
    }));

    res.send(finalResult);
  });
});

app.get('/next/:origin/:destination/:direction', function(req, res) {
  var query = 'select t.trip_id, stop_times.departure_time ' +
    'from (select trips.trip_id from stop_times ' +
    'join stops on stops.stop_id = stop_times.stop_id ' +
    'join trips on trips.trip_id = stop_times.trip_id ' +
    'where (stops.stop_name=$1 ' +
    'or stops.stop_name=$2) ' +
    'and stops.platform_code=$3 ' +
    'and trips.service_id=$4 ' +
    'and stop_times.departure_time > $5 ' +
    'group by trips.trip_id having count(trips.trip_id) > 1) t ' +
    'join stop_times on t.trip_id = stop_times.trip_id ' +
    'join stops on stops.stop_id = stop_times.stop_id ' +
    'where stops.stop_name=$1 ' +
    'or stops.stop_name=$2';

  var date = new Date();
  var currentTime = date.getHours() + ':' + date.getMinutes();

  var serviceIdMap = {
    weekday: 'CT-16APR-Caltrain-Weekday-01',
    saturday: 'CT-16APR-Caltrain-Saturday-02',
    sunday: 'CT-16APR-Caltrain-Sunday-02'
  };

  var serviceId;

  if (date.getDay() === 0) {
    serviceId = serviceIdMap.sunday;
  } else if (date.getDay() === 6) {
    serviceId = serviceIdMap.saturday;
  } else {
    serviceId = serviceIdMap.weekday;
  }

  connectToDatabase(query, [req.params.origin, req.params.destination, req.params.direction, serviceId, currentTime], function(result) {
    var finalResult = [];

    for (var i = 0; i < result.length; i += 2) {
      finalResult.push({
        trip_id: result[i].trip_id,
        departure_time: result[i].departure_time,
        arrival_time: result[i + 1].departure_time
      });
    }

    res.send(finalResult);
  });
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Next Caltrain is running on port', app.get('port'));
});
