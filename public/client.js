// create a socket connection to our server
const socket = window.io('http://localhost:3030');

// subscribe to the messages service when the create service method returns
socket.on('messages created', message => {
  console.log('someone created a message');
});

// create a message using the messages service
socket.emit(
  'create',
  'messages',
  // with the following body
  {
    text: 'Hello from socket',
  },
  // and handle the request
  (err, res) => {
    // if there's an error, throw it
    if (err) throw err;

    // otherwise execute the 'find' service method on messages, providing a
    // handler
    socket.emit('find', 'messages', (error, messageList) => {
      // where again we handle the case of an error
      if (error) throw error;

      // otherwise we log the result
      console.log('Current messages', messageList);
    });
  }
);
