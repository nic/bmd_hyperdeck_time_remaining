#!/usr/bin/env node

import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import {exec} from 'child_process';
import open from 'open';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log(`import.meta.url: ${import.meta.url}`);

const hyperdeck_ip = process.argv[2];
const port = process.argv[3] || 9088

if (!process.argv[2]) {
	console.warn(`Missing hyperdeck IP. Please provide the IP address of the Hyperdeck as an argument.\nExample: \n $ npx github:nic/bmd_hyperdeck_time_remaining 10.0.0.42`);
	process.exit(1);
}
if (!process.argv[3]) {
	console.info(`Info: Using default port for the web interface (${port}). If you want to use a different port, please provide the port as the last command line argument.`);
}

console.info(`Connecting into Hyperdeck at: ${hyperdeck_ip}`);
io.sockets.on('connection', function(socket)	{
	const date = new Date();
	console.info(`[${date.toLocaleTimeString("en-GB")}] A new browser has connected from ${socket.handshake.address}`);
	io.emit('ip', hyperdeck_ip);
});
setInterval(function () {
	exec(`./bmdhd.sh ${hyperdeck_ip}`, (error, stdout, stderr) => {
		// Logging of errors
		const date = new Date();
 		if (error) {
	 		console.error(`[${date.toLocaleTimeString("en-GB")}] error: ${error.message}`);
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

server.listen(port, () => {
  	console.log(`Browser page ready: http://localhost:${port}`);
	open(`http://localhost:${port}`);
});

