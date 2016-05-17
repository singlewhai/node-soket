const feathers          = require('feathers');
const rest              = require('feathers-rest');
const socket            = require('feathers-socketio');
const path              = require('path');
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override');
const mongoose          = require('mongoose');

const config    = require('./config').config,
      settings  = require('./settings');

var app = feathers();

// Connect to database
mongoose.connect(config.database.uri, config.database.optiong);

var socketCon = socket(function(io){ 
    io.use(function(socket, next){
        //console.log("Query: ", socket.handshake);
        // return the result of next() to accept the connection.
        if (socket.handshake.query.appid == "123456789") {
            return next();
        }
        // call next() with an Error if you need to reject the connection.
        next(new Error('Authentication error'));
    });
    io.set('authorization', function (handshakeData, callback) {
        console.log('Auth: ', handshakeData._query);
        callback(null, true);
    });
    var clients = [];
    io.on('connection', function(socket){
        console.log('a user connected');
        clients.push(socket);
        
        function sendClientList(clients, currentId){
            var clientList = [];
            clients.forEach(function(e){
                if(e.id === currentId)
                    clientList.push('/#public');
                else
                    clientList.push(e.id); 
            });
            console.log(currentId, clientList);
            io.to(currentId).emit('list', clientList);
        }
        socket.on('ready', function(id){
            console.log(socket.id, id, 'id');
            sendClientList(clients, socket.id);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
            clients.splice(clients.indexOf(socket), 1);
            clients.forEach(function(client, index) {
                var client_id = index; // Just use the index in the clients array for now
                sendClientList(clients, socket.id);
            });
        });
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
        socket.on('private message', function(id, msg){
            io.to(id).emit('private message', msg);
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
    res.sendFile(__dirname + '/index.html');
});

app.use(feathers.static(path.join(__dirname, 'bower_components')));

var server = app.listen(config.server.port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('Feathers server listening on ',host, port);
});
