var scraper = require('./src/js/scraper');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    scraper.scrapeCaltrainWebsite();
    response.render('public/index');
});

app.listen(app.get('port'), function () {
    console.log('Next Caltrain is running on port', app.get('port'));
});
