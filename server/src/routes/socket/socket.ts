import {Server} from "socket.io";

type Users = {[key: string]: message[]};

type message = {
  id: string;
  sender: string;
  subject: string;
  body: string;
  date: string;
};

const offlineUsers: Users = {};
let io: Server;

const socketOperation = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const user = socket.handshake.query.key;
    if (typeof user === "string") {
      socket.join(user);
      console.log(`user ${socket.id} connected room ${user}`);
      // if (!offlineUsers[user]) {
      //   offlineUsers[user] = [];
      // }

      if (offlineUsers[user]) {
        offlineUsers[user].forEach((msg: message) => {
          socket.to(user).emit("ofline_message", msg);

          console.log(
            `user ${user} with ${socket.id} will get the message ${msg}`
          );
          console.log(msg);
        });
        delete offlineUsers[user];
      }
    }
    next();
  });

  io.on("connection", socket => {
    const userKey = socket.handshake.query.key;

    // if (typeof userKey === "string") {
    //   console.log(socket.rooms.has(userKey));
    //   if (offlineUsers[userKey]) {
    //     offlineUsers[userKey].forEach((msg: message) => {
    //       io.to(userKey).emit("ofline_message", msg);

    //       console.log(
    //         `user ${userKey} with ${socket.id} will get the message ${msg}`
    //       );
    //       console.log(msg);
    //     });
    //     delete offlineUsers[userKey];
    //   }
    // }
    socket.on("send_message", msg => {
      const {id, sender, subject, body, date} = msg;
      const message = {id, sender, subject, body, date};
      const receivers = msg.receivers;

      receivers.forEach((user: string) => {
        io.to(user).emit("receive_message", message);

        if (!offlineUsers[user]) {
          offlineUsers[user] = [];
        }
        const isConnected = socket.rooms.has(user);
        if (!isConnected) {
          offlineUsers[user].push(message);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("user Disconnected");
    });
  });
};

export default socketOperation;
