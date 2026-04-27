require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.set('io', io);

const MONGO_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI defined:', !!MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/stores',   require('./routes/stores'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/users',    require('./routes/users'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('driver_location', (data) => {
    io.emit('driver_location_update', data);
  });
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
