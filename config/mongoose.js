const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/polling-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;


