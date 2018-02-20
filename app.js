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

// register a todos service that specifies only a get method
app.use('todos', {
  async get(name) {
    // GET /todos returns only an object
    return {
      name,
      text: `You have to do ${name}`,
    };
  },
});

// a function that gets a todo asynchronously
async function getTodo(name) {
  // first get the service we need to make the request against
  const service = app.service('todos');

  // make the actual request using the method we defined
  const todo = await service.get(name);

  console.log(todo);
}

getTodo('dishes');
