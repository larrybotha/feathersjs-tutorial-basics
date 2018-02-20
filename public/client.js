const app = feathers();

// register a service in the same way as on the backend
app.use('todos', {
  async get(name) {
    return {
      name,
      text: `You have to do ${name}`,
    };
  },
});

async function logTodo(name) {
  const service = app.service('todos');
  const todo = await service.get(name);

  console.log(todo);
}

logTodo('dishes');
