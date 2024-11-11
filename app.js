const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static(__dirname + '/public'));

// Function definitions
function respondNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

  /**
   * Responds with JSON
   * 
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3], 

  });
}

function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

function respondEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// Route mappings
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/not-found', respondNotFound); // Example route for 404
app.get('/', chatApp); // For the chat application

// Chat functionality
const chatEmitter = new EventEmitter();

function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

app.get('/chat', respondChat);

function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

app.get('/sse', respondSSE);

function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage   
 = (message) => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);   


  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});