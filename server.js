const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(function(req, res, next) {
  if ((req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url);
  } else
    next();
});


require('dotenv').config();
const port = process.env.PORT || 3338;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());


const uri = process.env.ATLAS_URI
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
const db = mongoose.connection;
db.once('open', function() {
    console.log('MONGODB is connected!');
});
db.on('error', console.error.bind(console, 'connection error:'));


const namesRouter = require('./routes/names');
app.use('/names', namesRouter)

const usersRouter = require('./routes/users');
app.use('/users', usersRouter)

const changesRouter = require('./routes/changes');
app.use('/changes', changesRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  
  }

app.listen(port, () => {
    console.log(`server is runnig on: ${port}`)
  })