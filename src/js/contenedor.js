import options from '../options/mysqlconfig.js';
import knex from 'knex';

const database = knex(options);

class Contenedor {

  save = async (products) => {
    if (!products) return {status: 'error', error: 'missing products'}

    try {
      await database('products').insert(products).then(() => {
        return {status: 'success', payload: products}
      })
      return {status: 'success', payload: products}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getById = async (id) => {
    let product
    try {
      await database.from('products').select('*').where('id', id).then((data) => {
        product = JSON.parse(JSON.stringify(data));
      })
      return {status: 'success', payload: product}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getAll = async () => {

    let products = [];
    try {
      await database.from('products').select('*').then(async (data) => {
        products = await JSON.parse(JSON.stringify(data))
      })
      return {status: 'success', payload: products}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  deleteById = async (id) => {
    if (!id) return {status: 'error', error: 'id Needed'}

    try {
      await database.from('products').where('id', id).del().then(() => {
        return {status: 'success', payload: id}
      })
      return {status: 'success', payload: `successfully deleted product with id: ${id}`}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  deleteAll = async () => {
    try {
      await database.from('products').del().then(() => {
        console.log('deleted all products')
      })
      return {status: 'success', payload: 'successfully deleted all products'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  updateById = async (id, body) => {
    if (!id) return {status: 'error', error: 'id Needed'}
    try {
      await database.from('products').where('id', id).update(body).then(() => {
        console.log('updated')
      })
      return {status: 'success', payload: 'product updated'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }
}

export default Contenedor