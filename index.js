#!/usr/bin/env node

import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import {exec} from 'child_process';
import open from 'open';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.resolve(path.dirname(''));

//Change to your Hyperdeck IP address
const hyperdeck_ip = process.argv[2];

// Check and warn if IP is not provided
if (!process.argv[2]) {
	console.warn(`Missing hyperdeck IP. Please provide the IP address of the Hyperdeck as an argument.\nExample: \n $ npx github:nic/bmd_hyperdeck_time_remaining 192.168.1.42`);
	process.exit(1);
}

console.info(`Connecting into Hyperdeck at: ${hyperdeck_ip}`);
io.sockets.on('connection', function(socket)	{
	const date = new Date();
	console.info(`${new Date().toString()} A new browser has connected`);
	io.emit('ip', hyperdeck_ip);
});
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
  	console.log('Browser page ready: http://localhost:9088');
	open('http://localhost:9088');
});

