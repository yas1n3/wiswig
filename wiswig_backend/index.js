const express = require('express');
const http = require('http');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const nwsRoutes = require('./routes/newsletter');
const clientRoutes = require('./routes/client');
const cGroupRoutes = require('./routes/clientGroup');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});


const User = require('./models/user'); // Import the User model

// Store online status of connected users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('WebSocket connection established', socket.id);

  socket.on('message', (message) => {
    console.log('Received message:', message);

    // Handle incoming messages from clients
    // You can implement logic for different types of messages

    const data = JSON.parse(message);

    // Check if it's a login message
    if (data.type === 'login') {
      const userId = data.userId;
      socket.userId = userId;

      // Update user's online status and broadcast the update to other clients
      onlineUsers.set(userId, socket);
      broadcastOnlineStatus(userId, true);
    }
  });

  socket.on('disconnect', () => {
    // Handle WebSocket connection close
    // Update user's online status and broadcast the update to other clients
    const userId = socket.userId;

    if (userId) {
      onlineUsers.delete(userId);
      broadcastOnlineStatus(userId, false);
    }
  });
});

async function broadcastOnlineStatus(userId, isOnline) {
  try {
    // Update user's online status in the database
    await User.setOnlineStatus(userId, isOnline);

    // Broadcast the online status update to other connected clients
    const message = JSON.stringify({ userId, isOnline });

    onlineUsers.forEach((client) => {
      if (client.connected && client.userId) {
        client.send(message);
      }
    });
  } catch (error) {
    console.error("Failed to update user's online status:", error);
  }
}



mongoose.connect('mongodb://127.0.0.1:27017/wiswig');


app.use(express.json());
app.use(cookieParser());

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/newsletter', nwsRoutes);
app.use('/client', clientRoutes);
app.use('/company', cGroupRoutes);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
