const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Fallback route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// Connecting the socket from the server
io.on("connection", socket => {
  console.log(`${socket.id} is connected`);

  // receiving message from the server
  socket.on("chat", message => {

    //snding message back to the client
    socket.broadcast.emit("receive-message", message);
  });

  //listening to typing
  socket.on("typing", message => {
    socket.broadcast.emit("typing", message);
  })
});