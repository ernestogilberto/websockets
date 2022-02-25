const fs = require('fs');

const path = './files/products.txt'

getProducts = async () => {

  if (!fs.existsSync(path)){
    return {status: 404, error: 'Not Found'};
  }

  try {
    let data = await fs.promises.readFile(path, 'utf8');
    let products = await JSON.parse(data);
    return {status: 'success', products: products}
  } catch (e) {
    return {status: 'error', error: e}
  }
}

setId = async () => {
  try {
    let result = await getProducts().then(result => result)
    if (result.status === 404) {
      return {status: 'success', id: 1};
    } else {
      let products = result.products
      let id = products[products.length - 1].id
      return {status: 'success', id: id + 1};
    }
  } catch (e) {
    return {status: 'error', error: e}
  }
}

class Contenedor {

  save = async (product) => {
    if (!product) return {status: 'error', error: 'missing product'}

    product.id = await setId().then(result => result.id)

    try {
      if (product.id === 1) {
        await fs.promises.writeFile(path, JSON.stringify([product], null, 2))
      } else {
        let products = await getProducts().then(result => result.products)
        products.push(product)
        await fs.promises.writeFile(path, JSON.stringify(products, null, 2))
      }

      return {status: 'success', payload: product}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getById = async (id) => {
    try {
      let data = await getProducts().then(result => result)
      if(data.status === 'success'){
        let product = await data.products.find(product => product.id === id)
        if(product){
          return {status: 'success', payload: product}
        }
        return {status: 'error', payload:'product not found'}
      }
      return{status: 'error', error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }
  }

  getAll = async () => {
    try {
      let data = await getProducts().then(result => result)
      if(data.status === 'success'){
        return {status: 'success', payload: data.products}
      }

      return{status: 'error', error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }

  }


  deleteById = async (id) => {
    try {
      let data = await getProducts().then(result => result)
      if(data.status === 'success'){
        let products = data.products.filter(product => product.id !== id)
        if(data.products.length !== products.length){
          await fs.promises.writeFile(path, JSON.stringify(products, null, 2))
          return {status: 'success', message: `successfully deleted product with id: ${id}`}
        }

        return {status: 'error', message: 'product not found'}
      }
      return{status: 'error', error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }
  }

  deleteAll = async () => {
    try {
      await fs.promises.unlink(path)
      return {status: 'success', message: 'File deleted successfully'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  updateById = async (id, body) => {
    if(!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getProducts().then(result => result)
      if(data.status === 'success'){
        let products = await data.products.map(product => product.id === id ? body  : product)
        await fs.promises.writeFile(path, JSON.stringify(products, null, 2))
        return {status: 'success', payload:'product updated successfully'}
      }
      return{status: 'error', error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }
  }
}

module.exports = Contenedor