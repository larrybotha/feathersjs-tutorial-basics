const feathers = require('@feathersjs/feathers');

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
