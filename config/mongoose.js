const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yazvits:zJ3YRyzVZH8z4gfL@atlascluster.zcabyj9.mongodb.net/pollingApi', {
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


