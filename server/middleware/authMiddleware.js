const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config.js').JWT_SECRET;

const verify = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const decoded = jwt.verify(authHeader, JWT_SECRET);
        
        // Produžavanje vremena trajanja tokena za 30 minuta
        const extendedToken = jwt.sign({ ...decoded, exp: decoded.exp + (30 * 60) }, JWT_SECRET);
        req.headers["Authorization"] = extendedToken;

        // Postavljanje dekodiranih podataka u req.userData
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authorization failed'
        });
    }
}

module.exports = verify;
