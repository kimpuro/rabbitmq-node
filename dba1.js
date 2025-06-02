#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const http = require('http');

let count = 0;

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            count++;
            console.log('count', count);
            channel.ack(msg);
        }, {
            noAck: false
        });
    });
});

const PORT = 3001;
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/count') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count: count }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});