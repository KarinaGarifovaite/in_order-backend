const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

const corsOptions = { exposedHeaders: ['in_order-token'] };

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', routes);

const DB_URI = process.env.DB_CLUSTER;

//Database
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log(`Server is running on port: ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
