require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
var mongoose = require('mongoose');

const mainRouter = require('./routes/main');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const config = require('./config');

// middleware
//app.use(express.static('./public'));
app.use(express.json());


app.use('/api/v1', mainRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

//concect to mondb
mongoose.connect(config.getDBConStr());

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
}; 

start();