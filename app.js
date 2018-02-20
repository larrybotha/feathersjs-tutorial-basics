const feathers = require('@feathersjs/feathers');

// services provide a way to interact with any type of data.
// They are protocol independent; it doesn't matter if they
// are being called via REST, websockets, or any other method.

// A service can be an object or a method:
// const myservice = {
//  async find(),
//  async get(),
//  ...
// }
//
// app.use('/my-service', myService);
//
// class myService {
//  async find()
//  async get()
//  ...
// }
//
// app.use('/my-service', new myService());

// Every service has methods. Not all need to be implemented,
// but at least one does. Every method is a CRUD method.
// Methods:
// find(params)
// get(id, params)
// create(data, params)
// update(id, data, params)
// patch(id, data, params)
// remove(id, params)

// create an in-memory messages service
class Messages {
  constructor() {
    this.messages = [];
    this.currentId = 0;
  }

  // get all messages
  async find(params) {
    return this.messages;
  }

  async get(id, params) {
    // find a message by id
    const message = this.messages.find(({id}) => id === parseInt(id, 10));

    // if no message can be found, throw an error
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }

    return message;
  }

  async create(data, params) {
    // create a new message from the original data and an incremented id
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
    // get the message by id. Will throw an error if a message of this id doesn't
    // exist
    const message = await this.get(id);

    // merge the data into the object
    return Object.assign(message, data);
  }

  async remove(id, params) {
    // asynchronously get the message by id
    const message = await this.get(id);
    // get the index of the message if it didn't throw
    const index = this.messages.indexOf(message);

    // remove the message from all messages
    this.messages.splice(index, 1);

    // return the removed message
    return message;
  }
}

const app = feathers();

// this is how the messages service is registered
// We provide a path, which in the case of a REST api would be a URL, and then
// instantiate the service
app.use('messages', new Messages());

// The service is now available to be used. To do so, we need to get the service
// from the app:
async function processMessages() {
  const messagesSvc = app.service('messages');

  // When a service is registered it automatically becomes a Node EventEmitter
  // Events are sent whenever a method that modifies data is returned, i.e.
  // create()
  // update()
  // patch()
  // remove()

  // Events can be listened to as follows:
  // myService.on('created', data => {})
  // This is the key to how Feathers implements real-time functionality
  messagesSvc.on('created', msg => console.log('created', msg));
  messagesSvc.on('removed', msg => console.log('removed', msg));

  await messagesSvc.create({text: 'First message'});
  const lastMessage = await messagesSvc.create({text: 'Second message'});

  // delete the most recent message we created
  await messagesSvc.remove(lastMessage.id);

  const messageList = await messagesSvc.find();

  console.log('available messages', messageList);
}

processMessages();
