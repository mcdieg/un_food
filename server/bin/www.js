const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'})

const server = require('../server')

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true
  }

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(process.env.DATABASE, options).then(()=>{
      console.log('MongoDB is connected')
    }).catch(err=>{
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
      setTimeout(connectWithRetry, 5000)
    })
}

// const port = normalizePort(process.env.PORT || '8000');
// server.set('port', port);

connectWithRetry()