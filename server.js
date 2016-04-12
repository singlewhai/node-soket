const feathers          = require('feathers');
const rest              = require('feathers-rest');
const socket            = require('feathers-socketio');
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override');
const mongoose          = require('mongoose');

const config    = require('./config').config,
      settings  = require('./settings');

var app = feathers();

// Connect to database
mongoose.connect(config.database.uri, config.database.optiong);

var socketCon = socket(function(io){
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.broadcast.emit('hi');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
            console.log('message: ' + msg);
        });
    });
});

// config
app.configure(rest())
    .configure(socketCon)
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(methodOverride())
    .use(settings.cross());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('Feathers server listening on ',host, port);
});
