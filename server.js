const feathers        = require('feathers');

const config = require('./config').config;

var app = feathers();

var server = app.listen(config.server.port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('Feathers server listening on ',host, port);
});
