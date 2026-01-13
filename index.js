// Start of Gateway Logic
require('dotenv').config(); 
const express = require('express');
const path = require('path');
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

// Serving Static Files for Game (CSS, JS)
app.use('/cyber-drifter', express.static(path.join(__dirname, 'logic/cyber-drifter')));

// Main Route to serve the game HTML
app.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, 'logic/cyber-drifter/game.html'));
});

// Root Route
app.get('/', (req, res) => {
    res.send('<h1>StatVerse API is running!</h1>');
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;