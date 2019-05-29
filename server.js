/* eslint-disable */

// var led = new five.Led(8); // Set pin 13 for LED
// led.on();
// led.off();

// var servo = new five.Servo(10);  // Servo Motor
// var motion = new five.motion(7); // PIR sensor

// motion.on("calibrated", function() {
//   console.log("Read to go :D");
// })
// motion.on("motionstart", function() {
//   servo.on(180); // unlock door
// })
// motion.on("motionstart", function() {
//   servo.on(0); // lock door
// })

// NOSQL & SOCKETIO & MONGOOSE SETUP
const {mongoose} = require('./server/mongoose');
const {Enter} = require('./server/enter');
const {Exit} = require('./server/exit');
const {Fan} = require('./server/fan');
const {Player} = require('./server/player');
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const SerialPort = require('serialport')
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

// SERVER LIBRARY & SETUP
const publicPath = path.join(__dirname, 'public');
var app = express();
var server = http.createServer(app)
var io = socketIO(server);
app.use(express.static(publicPath));
app.use(bodyParser.json());

// JOHNNY-FIVE CODE
var five = require("johnny-five");

var board = five.Board();

board.on('ready', function() {

  //http://johnny-five.io/api/button/
  //http://johnny-five.io/examples/led/
  //http://johnny-five.io/examples/led-rgb/
  //http://johnny-five.io/examples/photoresistor/


  // THIS IS THE SETUP SECTION
  var led = new five.Led(8); // Set pin 13 for LED
  var lock = new five.Led(9); // Set pin 13 for LED
  var button2 = new five.Button(2); // button
  var button1 = new five.Button(3); // button
  var servo = new five.Servo(10);  // servo code
  let count = 0; // number of people in the house
  let door = false; // door is default closed

  // Reading Sockets
  io.on('connection', function (socket) {


    button1.on("press", function() {
      console.log("PIR sensor from outside is activated");
      // console.log("State of the door: ", door);
      if (door) {
        lock.on(); // unlock door if door is locked
        console.log("lock door");
        servo.to(180);  // servo lock

      }
      else {
        console.log("unlock door");
        lock.off();  // lock door if door is unlocked
        servo.to(180); // servo unlock
        count++;
        led.on(); // Turn on Led
        var enter = new Enter({
          date: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
          count: count,
          status: 'Entering'
        });

        enter.save().then((doc) => {
          console.log(doc);
        });

        socket.emit('count', {count: count});
        socket.emit('exit', {exit: false});
        socket.emit('enter', {enter: true});
        socket.emit('led', {led: true});

      }
      door = !door;  // inverse boolean
      console.log('count', count);
    })

    // WRITE YOU LOGIC HERE RGB

    button2.on("press", function() {
      console.log("PIR sensor from inside is activated");
      // console.log("State of the door: ", door);

      if (door) {
        lock.on(); // unlock door if door is locked
        console.log("lock door");
      }
      else {
        console.log("unlock door");
        count--;
        lock.off();  // lock door if door is unlocked

        led.off(); // turn off light
        var exit = new Exit({
          date: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
          count: count,
          status: 'Exiting'
        });

        exit.save().then((doc) => {
          console.log(doc);
        });

        socket.emit('count', {count: count});
        socket.emit('exit', {exit: true});
        socket.emit('enter', {enter: false});
        socket.emit('led', {led: false});
      }
      door = !door;  // inverse boolean


    });

});

});

/////////  ----- DATABASE CODE
app.post('/enter', (req, res) => {
  // console.log(moment(Date.now()));
  var enter = new Enter({
      time: moment(),
      count: req.body.count,
      status: req.body.status
  });

  enter.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});
app.get('/exit', (req, res) => {
  console.log('api working');
  Exit.find().then((temp) => {
    res.send(temp);
  })
})

app.get('/enter', (req, res) => {
  console.log('api working');
  Enter.find().then((temp) => {
    res.send(temp);
  })
})

app.post('/exit', (req, res) => {
  // console.log(moment(Date.now()));
  var enter = new Enter({
      time: moment(),
      count: req.body.count,
      status: req.body.status
  });

  enter.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

app.post('/fan', (req, res) => {
  console.log(req.body.text);
  var fan = new Fan({
      status: req.body.status,
      temp: req.body.temp
  });

  fan.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

app.get('/fan', (req, res) => {
  console.log('api working');
  Fan.find().then((temp) => {
    res.send(temp);
  })
})

app.get('/player', (req, res) => {
  console.log('api working');
  Player.find().then((players) => {
    res.send(players);
  })
})

app.post('/player', (req, res) => {
  console.log(req.body);
  var player = new Player({
      name: req.body.name,
      level: req.body.level
  });

  player.save().then((doc) => {
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});


app.get('*', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'))
});

server.listen(8080, () => {
  console.log("Local host live on 8080");
});
