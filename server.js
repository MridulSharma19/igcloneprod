const dotenv= require('dotenv')
dotenv.config()


const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const morgan = require('morgan');
const cors = require('cors');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const { dirname } = require('path');
const app =  module.exports = express();

app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: "*"
}));


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    limit: '50mb'
}));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);


// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


app.use(express.static(path.join(__dirname,'client/build')))

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'client/build','index.html'))
})


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

