const feathers = require('@feathersjs/feathers');

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

const app = feathers();

app.use('messages', new Messages());

async function processMessages() {
  const messagesSvc = app.service('messages');

  messagesSvc.on('created', msg => console.log('created', msg));
  messagesSvc.on('removed', msg => console.log('removed', msg));

  await messagesSvc.create({text: 'First message'});
  const lastMessage = await messagesSvc.create({text: 'Second message'});

  await messagesSvc.remove(lastMessage.id);

  const messageList = await messagesSvc.find();

  console.log('available messages', messageList);
}

processMessages();
