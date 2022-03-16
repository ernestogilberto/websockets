import express from 'express';
const router = express.Router();
import options from '../options/mysqlconfig.js';
import knex from 'knex';

const database = knex(options);


import Contenedor from '../js/contenedor.js'
const manager = new Contenedor

const createTable = async () => {

  if(await database.schema.hasTable('products')) {
    console.log('la tabla ya existe')
    return {
      status: 'success',
      message: 'table already exists'
    }
  }

  try {
    await database.schema.createTable('products', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.float('price').notNullable();
      table.string('thumbnail').notNullable();
    });
    return {status: 'success', payload: 'table created'}
  }
  catch (error) {
    return {status: 'error', message: error}
  }
}

createTable()

router.get('/', async (req, res) => {
  res.render('products', {products: await manager.getAll().then(r => (r.payload))})
})

router.get('/:id', async (req, res) => {
  let index = parseInt(req.params.id); res.send(await manager.getById(index).then(r=> (r.payload)))
})

router.post('/', async (req, res) => {
  let product = req.body;
  product.price = parseFloat(product.price);

  res.send(await manager.save(product).then(r=> (r.payload)))
})

router.delete('/:id', async (req, res) => {
  let index = parseInt(req.params.id);
  res.send(await manager.deleteById(index).then(r=> (r.payload)))
})

router.put('/:id', async(req, res) => {
  let index = parseInt(req.params.id);
  let product = req.body;
  product.id = index;

  res.send(await manager.updateById(index, product).then(r=> (r.payload)))
})

export default router;