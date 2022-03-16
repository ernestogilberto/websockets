import express from 'express'
import productsRouter from './routes/products.js'
import {Server} from 'socket.io'

import options from './options/mysqlite3config.js';
import knex from 'knex';

const database = knex(options);

import Contenedor from './js/contenedor.js';
const manager = new Contenedor()
import MessagesManager from './js/messagesManager.js'
const messagesManager = new MessagesManager()

const createTable = async () => {

  if(await database.schema.hasTable('messages')) {
    console.log('la tabla ya existe')
    return {
      status: 'success',
      message: 'table already exists'
    }
  }

  try {
    await database.schema.createTable('messages', (table) => {
      table.increments('id').primary();
      table.string('userId').notNullable();
      table.string('message').notNullable();
      table.string('date').notNullable();
    });
    return {status: 'success', payload: 'table created'}
  }
  catch (error) {
    return {status: 'error', message: error}
  }
}

createTable()

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
const io = new Server(server);

let log = [];

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('newUser', async (data) => {
    let messages = []
    await messagesManager.getAll().then(res => {
      messages = res.payload
    })
    socket.emit('history', messages);
    socket.broadcast.emit('alert', data);
  })
  socket.on('chat message', async data => {
    let date = new Date();
    let currentDate = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    await messagesManager.save({userId: data.user, message: data.message, date: currentDate})
    let messages = []
    await messagesManager.getAll().then(res => {
      messages = res.payload
    })
    io.emit('history', messages);
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