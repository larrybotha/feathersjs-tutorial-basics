const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const messageHooks = require('./messages.hooks');
const Messages = require('./messages.service');

const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.configure(express.rest());

app.use('messages', new Messages());
app.service('messages').hooks(messageHooks);

app.use(express.errorHandler());

const server = app.listen(3030);

app.service('messages').create({
  text: 'Hello from the server',
});

server.on('listening', () => {
  console.log('Feathers REST API start at http://localhost:3030');
});
