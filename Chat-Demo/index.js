// Express initializes app to be a function handler that you can supply to an HTTP server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// We define a route handler / that gets called when we hit our website home
/*
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
*/

/*
So far in index.js we’re calling res.send and passing it a string of HTML. Our code would 
look very confusing if we just placed our entire application’s HTML there, so instead we're 
going to create a index.html file and serve that instead.

Let’s refactor our route handler to use sendFile instead
*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// We make the http server listen on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});
