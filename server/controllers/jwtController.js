const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config.js').JWT_SECRET;

function generateUserJwtToken(user) {
    const username = user.username;
    const currentDate = new Date();
    const expiresIn = '30m'; // Token ističe nakon 30 minuta

    // Generisanje JWT tokena
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn });
    return token;
}

module.exports = generateUserJwtToken;
