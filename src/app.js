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
    let date = new Date();
    let currentDate = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    log.push({userId: data.user, message: data.message, date: currentDate});
    io.emit('history', log)
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('newProduct', async (data) => {
        await manager.save(data);
        let products = await manager.getAll().then(r => (r.payload))
        io.emit('products', products)
      }
  )
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