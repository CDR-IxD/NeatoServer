/*************************************************************
Filename: neato-server.js

Description: This file is to be run on the main computer. It
receives inputs from the dual shock controllers and sends them
to the corresponding raspberry pi.

Author: tlee
Notes:
    first release 5/17/17
*************************************************************/

var util = require("util"),
    io = require('socket.io').listen(3000),
    fs = require('fs'),
    os = require('os'),
    url = require('url');

// array to store neatos
var neatos = [];
var controllers;

io.sockets.on('connection', function (socket) {

    socket.on('storeClientInfo', function (data) {
        if (data.clientType == "Neato") {
        	console.log(data);
        	neatos.push(socket.id);
        	console.log(neatos);
    	} else if (data.clientType == "Controllers") {
        	console.log(data);
        	controllers = socket.id;
        	console.log(controllers);        		
    	}
    });

    // Push the drive command to the corresponding raspberry pi
    socket.on('drive2Server', function(data) {
    	if (neatos[data.NeatoNumber]) {
    		socket.to(neatos[data.NeatoNumber]).emit('drive2Neato',
    		{'LWheelDist': data.LWheelDist, 'RWheelDist': data.RWheelDist, 'Speed': data.Speed});
    	}
    });

    socket.on('disconnect', function (data) {
        for( var i=0, len=neatos.length; i<len; ++i ){
            if(neatos[i] == socket.id){
                neatos.splice(i,1);
                console.log(neatos);
                break;
            }
        }
    });
});