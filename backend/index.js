var express = require('express');
var app = express();
var server = app.listen(9000)

//const http = require('http');

const io = require('socket.io').listen(server);


const mongoose = require('mongoose');


const bodyParser = require('body-parser');
const routes = require("./routes/index.js");

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //The ionic server
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*

var cors = require('cors')
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));

*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

//const server = http.createServer(app);
//const io = socketio(server);


mongoose.connect('mongodb://localhost/imroz2?replicaSet=rs0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {

  /*
  app.listen(9000, () => {
    console.log('Node server running on port 9000');
  });
  */



  const roomsCollection = db.collection('rooms');
  const changeStream = roomsCollection.watch({ fullDocument: 'updateLookup' });

  io.on("connection", socket => {
    console.log("New client connected");


    changeStream.on('change', (change) => {


        
      if(change.operationType === 'insert') 
      {
        const task = change.fullDocument;
        console.log("here start watch")
        console.log(task)
        console.log("here end watch")

        id = task.id
        socket.emit("chat added", {id:id})


      }
      
      if(change.operationType === 'update') 
      {
        const task = change.fullDocument;
        console.log("here start watch")
        console.log(task)
        console.log("here end watch")

        id = task.id
        socket.emit("update collection", {id:id})



      }
      
      else if(change.operationType === 'delete') 
      {
        
        
      }
    });






    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
  });




});

