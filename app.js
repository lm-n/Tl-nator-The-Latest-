var express = require('express');
var Request = require('request');
var PythonShell = require('python-shell');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var WebSocketServer = require('ws').Server;
var ardsdat;
var app = express();
var dataS;
var dataSpy;
var data;
var pyshell = ''


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* ----
ROUTES
-----*/
app.post("/save", function(req,res){
	console.log("A POST!!!!");
	//Get the data from the body
	dataS = req.body;
	//dataS = "hi";
	console.log(dataS);
	sendToSerial(dataS.body);

});

app.post("/savepy", function(req,res){
	pyshell = new PythonShell('TloDemo2.py', { scriptPath: '/home/pi/gratis/PlatformWithOS/demo' })
	console.log("A POST!!!!");
	//Get the data from the body
	dataSpy = req.body;
	//dataSpy = "hi";
	console.log(dataSpy);
	pyshell.send(dataSpy.body)
	pyshell.end(function (err) {
  		if (err) throw err;
  		console.log('finished');
	});
	setTimeout(function () {
		console.log('screen to change')
		pyshell = new PythonShell('TloDemo2.py', { scriptPath: '/home/pi/gratis/PlatformWithOS/demo' })
		pyshell.send('to tlonate type anything and press enter!')
		pyshell.end(function (err) {
  			if (err) throw err;
  			console.log('finished');
		});
	}, 20000);
});

app.get("/", function (request, response) {
	console.log("In main route");
	response.render('index', {title: "Tlon"});
});

app.get("/dict/:term" , function (request, response) {
	var theTerm = request.params.term;
	//console.log('Making a dict request for term ' + theTerm);
	var theURL = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + theTerm + "?key=21960e29-e95e-456c-af22-7ff4c8b2fedb";
	Request.get(theURL,function(err, res, body){
		if (!err && res.statusCode == 200){
			response.json({theXML: body});
		}
		else{
			//console.log("Problems...");
			response.json({theXML: "nope"});
		}
	});
});

app.get("/:key", function (request, response) {
	console.log("In key...");
	response.render('notes',{title: "Tlon", key: request.params.key});
});

app.get("*", function(request,response){
	response.send("Sorry, nothing to see here.");
});

app.listen(port);
console.log('Express started on port' + port);

/*-----------
//ARDS TALKS TO CONSOLE
------------*/

var serialport = require('serialport');// include the library
SerialPort = serialport.SerialPort; // make a local instance of it
// get port name from the command line:
portName = process.argv[2];

var myPort = new SerialPort(portName, {
	baudRate: 9600,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\n")
	});

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
	console.log('hello there');
	console.log(myPort);
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
   console.log(data);
	//SaveLatestData(data);
   //ardsdat = data;
}

/*function saveLatestData(data) {
   console.log(data);
   // if there are webSocket connections, send the serial data
   // to all of them:
   // if (connections.length > 0) {
   //   broadcast(data);
   // }
}*/
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

function sendToSerial(dataS) {
 console.log("sending to serial: " + dataS);
 myPort.write(dataS);
 myPort.write('\n');
 console.log("sent");
 //myPort.write(data);
}


// sends a message to the Python script via stdin
//pyshell.send('hello');


//$ node app.js /dev/cu.usbmodem1411
