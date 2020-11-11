const express = require('express');
const cors = require('cors');
const port = 5000;
const port2 = 3000;
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const uri = "mongodb+srv://everafter:Jusang20@cluster0-srjln.mongodb.net/test?retryWrites=true&w=majority";

const app = express();

app.use(cors({origin : `http://localhost:${port2}`, credentials:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

const Issue = require('./issues');
const router = require('./issueapi')(app, Issue);

app.listen(port, function(){
  console.log(`listening on port ${port}`);
});
