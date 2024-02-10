const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {exec} = require("child_process");

//Change to your Hyperdeck IP address
const hyperdeck_ip = "192.168.1.42";

setInterval(function () {
	exec(`./bmdhd.sh ${hyperdeck_ip}`, (error, stdout, stderr) => {
		// Logging of errors
		const date = new Date();
 		if (error) {
	 		console.error(`${new Date().toString()} error: ${error.message}`);
			io.emit('erro', stderr.replace(/\n/gm, ""))
    		        return;
  		}

  		if (stderr) {
    			console.error('['+date.toLocaleTimeString("en-GB")+'] stderror: ' + stderr);
  			io.emit('erro', stderr.replace(/\n/gm, ""))
    			return;
  		} 
                // If no error, send the data
  		io.emit('time', stdout.replace(/\n/gm, ""))
		});
	}, 1000);

app.get('/', (req, res) => {
  	res.sendFile(__dirname + '/index.html');
});

server.listen(9088, () => {
  	console.log('Ready: http://localhost:9088');
});

