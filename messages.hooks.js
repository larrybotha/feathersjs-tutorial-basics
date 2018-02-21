const {BadRequest} = require('@feathersjs/errors');

// hooks are pluggable middleware functions that can be registered
// before, after, or on errors of any service methods
// Hooks can be chained to create complex workflows
// Hooks are transport independent, and are also service agnostic -
// they can be reused on different services.
// Hooks are usually used for validation, authorisation, logging, and
// populating related entities

// This hooks adds a createdAt field to the data before the create method
// is called:
// app.service('messages').hooks({
//  before: {
//    create: async context => {
//      context.data.createdAt = new Date();
//
//      return context;
//    }
//  }
// })

// A hook function takes the hook context as a parameter, and returns either that or
// nothing.

// To make hooks more reusable, one can write wrapper functions. So intead of the
// function above, we can abstract it and reuse it for multiple methods:
const setTimeStamp = name => {
  return async context => {
    context.data[name] = new Date();

    return context;
  };
};

// The hook context is an object containining info on the service method call.
// It has read-only and writable properties.
// Read-only properties:
// context.app - the feathers app
// context.service - the current service the hook has been called from
// context.path - the path of the service
// context.methods - service method called
// context.type - whether this hook is called before, after, or on error
//
// Writable properties:
// context.params - the parameters of the service method call. When a service
// is called externally it usually has:
//    context.query - e.g. the string query in REST
//    context.provide - whether this is rest, socketio, primus
// context.id - the id for get, remove, udpate, and patch service method calls
// context.data - data sent by the user in create, update, and patch service
//    method calls
// context.error - the error thrown in error hooks
// context.result - the result of the service method call - after hooks only

// Hooks are great for validation because they can be run before creating or
// returning data
const validate = async context => {
  const {data} = context;

  // check that text field is passed through on request
  if (!data.text) {
    throw new BadRequest('Message text must exist');
  }

  // check that the text is in fact a string and is not empty
  if (typeof data.text !== 'string' || data.text.trim() === '') {
    throw new BadRequest('Message text is invalid');
  }

  // Change the data to be only the text
  // This prevents people from adding other properties to our database
  context.data = {
    text: data.text.toString(),
  };

  return context;
};

module.exports = {
  before: {
    // and add hook functions to run before create and update
    create: [validate, setTimeStamp('createdAt')],
    update: [validate, setTimeStamp('updatedAt')],
    patch: validate,
  },
};
