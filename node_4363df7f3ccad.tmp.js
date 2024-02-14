const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://ahmedmohamed:01021981901@cluster0.qbbq5oo.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to the database');
});

app.use(express.json());

// Routes
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});