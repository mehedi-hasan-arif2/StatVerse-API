require('dotenv').config(); 
const express = require('express');
const app = express();

// Logic files Import
const orbitLogic = require('./logic/orbit');
const languageLogic = require('./logic/languages');
const performanceLogic = require('./logic/performance');
const coreStats = require('./logic/coreStats');

// API Routes 
app.get('/api/orbit', orbitLogic);
app.get('/api/languages', languageLogic);
app.get('/api/performance', performanceLogic);
app.get('/api/coreStats', coreStats);

app.get('/', (req, res) => {
    res.send('<h1>StatVerse API is running!</h1>');
});

// Server Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app; 