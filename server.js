const http = require('http').createServer();

const io = require('socket.io')(http, {
  cors: { origin: "*" }
});



const users = [];

io.on('connection', (socket) => {


  socket.on("private_message", (privatemessage) => {
    socket.to(privatemessage.anotherSocketId).emit("private_message", socket.id, privatemessage.msg);
  });

  console.log('connected ' + socket.id);
  users[users.length] = socket.id;
  //users.push(socket.id);

  socket.on("load_contact", (data) => {
    console.clear();
    io.emit("load_contact", users);
    console.log("load_contact " + users);
    console.log(users.length);
  });

  console.log(users);


  // to send and receive text message
  socket.on('msg', (msg) => {
    console.log(msg);
    //io.emit('msg', msg);
    console.log(socket.id);
    let message = {
      id: socket.id,
      msg
    }

    socket.broadcast.emit("msg", message);
  })


  socket.on('disconnecting', () => {
    console.log("user left " + socket.id);
    users.splice(socket.id, 1);
    io.emit("load_contact", users);

  });

  // to send and receive audio message
  socket.on('mic_rec', (msg) => {
    //console.log(msg);
    socket.broadcast.emit("mic_rec", msg);
  })

  // to send and receive images
  socket.on('image_sent', (img) => {
    socket.broadcast.emit("image_sent", img);
  })

})

var port = 8000;


http.listen(port, () => console.log(`listening on port ${port}`));



//const imageToBase64 = require('image-to-base64');

// imageToBase64("./rec.png")
    //   .then(
    //     (response) => {

    //       //data:image/jpeg;base64,
    //       console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
    //     }
    //   )
    //   .catch(
    //     (error) => {
    //       console.log(error); // Logs an error if there was one
    //     }
    //   )
