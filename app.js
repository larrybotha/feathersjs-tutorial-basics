const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

const messageHooks = require('./messages.hooks');
const messagesOptions = require('./messages.service');

const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.configure(express.rest());

app.use('messages', messagesOptions);
app.service('messages').hooks(messageHooks);

// All database adapters support a common wat of querying data in a `find` method
// call using params.query.
// With pagination enabled the `find` method will return an object with the
// following properties:
// data - the list of data
// limit - the page size, or number of items returned in the response
// skip - the number of entries that were skipped
// total - the total number of entries for thi query

// This gives us a full CRUD service without having to define any of the methods
// manually.
// We use feathers' memory db adapter in order to do so
app.use(
  'mem-messages',
  memory({
    paginate: {
      // by default return 10 - this can be overridden by the client using $limit
      default: 10,
      // set the maximum number of items that a client can get in a response
      max: 25,
    },
  })
);

async function createAndFind() {
  const messages = app.service('mem-messages');

  // create 100 messages
  for (let counter = 0; counter < 100; counter++) {
    // we await each one's creation before creating the next
    await messages.create({
      counter,
      message: `Message number ${counter}`,
    });
  }

  // skip the first 10
  // Because we set the default in pagination to 10, this is essentially page 2
  const page2 = await messages.find({
    query: {$skip: 10},
  });

  console.log('page 2', page2);

  // change the limit from 10 to 20
  const largePage = await messages.find({
    query: {$limit: 20},
  });

  console.log('20 items', largePage);

  // get the first 10 (based on default pagination limit) that have a counter
  // value between 50 and 70
  const counterList = await messages.find({
    query: {
      counter: {$gt: 50, $lt: 70},
    },
  });

  console.log('Counter greater than 50 and lt 70', counterList);

  // get all messages that match the message field exactly
  const message20 = await messages.find({
    query: {
      message: 'Message number 20',
    },
  });

  console.log("Entries with text 'Message number 20'", message20);
}

app.use(express.errorHandler());

const server = app.listen(3030);

app.service('messages').create({
  text: 'Hello from the server',
});

server.on('listening', () => {
  console.log('Feathers REST API start at http://localhost:3030');
});

createAndFind();
