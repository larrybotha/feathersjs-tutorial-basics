const memory = require('feathers-memory');

// using a database adapter we can reduce the manual work of implementing
// the service methods to a few lines
// class Messages {
//   constructor() {
//     this.messages = [];
//     this.currentId = 0;
//   }

//   async find(params) {
//     return this.messages;
//   }

//   async get(id, params) {
//     const message = this.messages.find(({id}) => id === parseInt(id, 10));

//     if (!message) {
//       throw new Error(`Message with id ${id} not found`);
//     }

//     return message;
//   }

//   async create(data, params) {
//     const message = Object.assign(
//       {
//         id: ++this.currentId,
//       },
//       data
//     );

//     this.messages = this.messages.concat(message);

//     return message;
//   }

//   async patch(id, data, params) {
//     const message = await this.get(id);

//     return Object.assign(message, data);
//   }

//   async remove(id, params) {
//     const message = await this.get(id);
//     const index = this.messages.indexOf(message);

//     this.messages.splice(index, 1);

//     return message;
//   }
// }

// This can now be queried:
// curl localhost:3030/messages?$limit=2
const messagesOptions = memory({
  paginate: {
    default: 10,
    max: 25,
  },
});

// Using hooks we can still modify how the service methods work

module.exports = messagesOptions;
