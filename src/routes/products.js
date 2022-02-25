const express = require('express');
const router = express.Router();

const productsManager = require('../js/contenedor')
manager = new productsManager

let products = [];

const initialProducts = async () => {
  products = await manager.getAll().then(r=> (r.payload))
}

initialProducts();

router.get('/', async (req, res) => {
  res.render('products', {products: await manager.getAll().then(r => (r.payload))})
})

router.get('/:id', async (req, res) => {
  let index = parseInt(req.params.id); res.send(await manager.getById(index).then(r=> (r.payload)))
})

router.post('/', async (req, res) => {
  let product = req.body;
  product.price = parseFloat(product.price);
  products.push(product)
  res.send(await manager.save(product).then(r=> (r.payload)))
})

router.delete('/:id', async (req, res) => {
  let index = parseInt(req.params.id);
  products = products.filter(product => product.id !== index);
  res.send(await manager.deleteById(index).then(r=> (r.message)))
})

router.put('/:id', async(req, res) => {
  let index = parseInt(req.params.id);
  let product = req.body;
  product.id = index;
  products = products.map(currentProduct => currentProduct.id === index ? product : currentProduct)
  res.send(await manager.updateById(index, product).then(r=> (r.payload)))
})

module.exports = router;