const mongoose = require('mongoose');
require('dotenv').config();


mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Mongo Connected Successfully');
  });
