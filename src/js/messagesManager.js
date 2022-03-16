import options from '../options/mysqlite3config.js';
import knex from 'knex';

const database = knex(options);

class MessagesManager {

  save = async (message) => {
    console.log('entro el save')
    console.log(message)
    if (!message) return {status: 'error', error: 'missing products'}

    try {
      await database('messages').insert(message).then(() => {
        console.log('se añadio el mensaje')
        return {status: 'success', payload: message}
      })
      return {status: 'success', payload: message}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getAll = async () => {
    console.log('entro el getAll')
    let messages = [];
    try {
      await database.from('messages').select('*').then(async (data) => {
        messages = await JSON.parse(JSON.stringify(data))
      })
      console.log('messages', messages)
      return {status: 'success', payload: messages}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }
}

export default MessagesManager;