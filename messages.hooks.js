const {BadRequest} = require('@feathersjs/errors');

const setTimeStamp = name => {
  return async context => {
    context.data[name] = new Date();

    return context;
  };
};

const validate = async context => {
  const {data} = context;

  if (!data.text) {
    throw new BadRequest('Message text must exist');
  }

  if (typeof data.text !== 'string' || data.text.trim() === '') {
    throw new BadRequest('Message text is invalid');
  }

  context.data = {
    text: data.text.toString(),
  };

  return context;
};

module.exports = {
  before: {
    create: [validate, setTimeStamp('createdAt')],
    update: [validate, setTimeStamp('updatedAt')],
    patch: validate,
  },
};
