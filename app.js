const express = require('@feathers/express');
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

// instead of initialising only a feathers app, we pass feathers into express
const app = express(feathers());

app.use('messages', new Messages());

app.service('messages').hooks(messageHooks);




