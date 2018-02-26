const app = feathers();
const socket = window.io('http://localhost:3030');

app.configure(feathers.socketio(socket));

// instead of using web sockets, we could also use REST:
const rest = feathers.rest('http://localhost:3030');
// configure our rest transport to use window.fetch. We could use jQuery, Axios, or
// some other type of request lib
// This is commented because we can only configure 1 default transport on the client
// app.configure(rest.fetch(window.fetch));

// this is how to create a listener using socketIO alone
// Because we now have a feathers app wrapping socketIO we no
// longer need to use socketio directly - we can rely on
// feathers' service methods and events to listen to and call
// service methods.
// socket.on('messages created', message => {
//   console.log('someone created a message');
// });

// on the messages service, listen for the created event
app.service('messages').on('created', msg => {
  // and log the messages
  console.log('Someone created a message', msg);
});

// this is how a message is created using socketIO
// We emit a create event on the messages'service'? What does SocketIO refer to
// it as? It appears to be a socket name. So our feathers app has a service, which
// is also a socket, of the name messages.
// Because we're now using feathers, we don't need the manual implementation of
// creating and finding messages on our service - we can let feathers do the
// heavy lifting with the same API we've been using all the time.
// socket.emit('create', 'messages', {text: 'Hello from socket'}, (err, res) => {
//   if (err) throw err;

//   socket.emit('find', 'messages', (error, messageList) => {
//     if (error) throw error;

//     console.log('Current messages', messageList);
//   });
// });

// create an async function for creating and listing messages
async function createAndList() {
  // create a blocking function by creating a message using our feathers messages
  // service
  await app.service('messages').create({
    text: 'Hello from feathers browser client',
  });

  // once the above ceases blocking, create another blocking function that makes
  // a request for all messages
  const messages = await app.service('messages').find();

  // once messages is populated with a result, we can log it
  console.log('Messages', messages);
}

createAndList();
