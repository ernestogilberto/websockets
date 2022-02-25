const express = require('express')
const productsRouter = require('./routes/products')
const {Server} = require('socket.io');

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
const io = new Server(server);

let log = [];

io.on('connection', (socket) => {
  console.log('Client connected');
  // socket.broadcast.emit('alert');
  socket.on('newUser', (data) => {
    socket.emit('history', log);
    socket.broadcast.emit('alert', data);
  })
  socket.on('chat message', data => {
    log.push({userId: data.user, message: data.message});
    io.emit('history', log)
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('views', './views')
app.set('view engine', 'ejs')


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use('/api/products', productsRouter)

app.get('/', (req, res) => {
  res.render('home')
})