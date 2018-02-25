const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const memory = require('feathers-memory');

// Feathers services automatically send created, udpated, patched, and
// removed events when a create, update, patch, or remove service method
// returns.
// These messages are also published to connected clients so they can
// react accordingly.

// REST does not support real-time, so we need a transport that does.
// SocketIO and Primus have official transports in FeathersJS.
// Real-time communicaiton requires bi-directional communiation.

// The feathers team actually recommends using socket transpsorts since
// they allow service method calling, and generally perform better than REST
// calls.

// create a feathers app
const app = express(feathers());

// parse json requests
app.use(express.json());
// parse url queries with nested data
app.use(express.urlencoded({extended: true}));
// configure express to use REST as the protocol
app.configure(express.rest());

// configure socketio
app.configure(socketio());

// Channels determine which real-time events should be sent to which client.
// e.g. sending messages to only authenticated clients, or sending messages
// only to people in the same room.

// add any client that connects to the 'everybody' channel
app.on('connection', connection => app.channel('everybody').join(connection));

// publish all events to the 'everybody' channel
app.publish(() => app.channel('everybody'));

app.use(
  'messages',
  memory({
    paginate: {
      default: 10,
      max: 25,
    },
  })
);

// add error handling
app.use(express.errorHandler());

// start the server
// Making a request to this opens a connection which needs to manually closed
const server = app.listen(3030);

server.on('listening', () =>
  console.log('Feathers API started at localhost:3030')
);
