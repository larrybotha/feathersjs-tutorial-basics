const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const messageHooks = require('./messages.hooks');

// Without a 'transport' we don't actually have an API that can
// be consumed. A transport is a plugin that turns feathers
// into a server. Currently we can't make requests against our
// messages service using curl or any other method.

// Feathers has three transports:
// HTTP REST via Express
// Socket.io for websockets
// Primus also for websockets

// For a REST API servers has the following service methods:
// find -> GET -> /messages
// get -> GET -> /messages/1
// create -> POST -> /messages
// update -> PUT -> /messages/1
// patch -> PATCH -> /messages/1
// remove -> DELETE -> /messages/1

// Feathers' REST transport maps the service methods to their
// REST verb equivalents

class Messages {
  constructor() {
    this.messages = [];
    this.currentId = 0;
  }

  async find(params) {
    return this.messages;
  }

  async get(id, params) {
    const message = this.messages.find(({id}) => id === parseInt(id, 10));

    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }

    return message;
  }

  async create(data, params) {
    const message = Object.assign(
      {
        id: ++this.currentId,
      },
      data
    );

    this.messages = this.messages.concat(message);

    return message;
  }

  async patch(id, data, params) {
    const message = await this.get(id);

    return Object.assign(message, data);
  }

  async remove(id, params) {
    const message = await this.get(id);
    const index = this.messages.indexOf(message);

    this.messages.splice(index, 1);

    return message;
  }
}

// instead of initialising only a feathers app, we wrap feathers in express
const app = express(feathers());

// turn on JSON body parsing for REST services
app.use(express.json());
// turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({extended: true}));
// configure REST transport using Express
app.configure(express.rest());

// set up the messages service
app.use('messages', new Messages());
app.service('messages').hooks(messageHooks);

// set up nicer error handling
// This must always be the last line before starting the server. Because it's
// a middleware... does it swallow errors and not propogate them? Or if there's
// an error we want it last so that errors can't be thrown after it.
app.use(express.errorHandler());

const server = app.listen(3030);

app.service('messages').create({
  text: 'Hello from the server',
});

server.on('listening', () => {
  console.log('Feathers REST API start at http://localhost:3030');
});
