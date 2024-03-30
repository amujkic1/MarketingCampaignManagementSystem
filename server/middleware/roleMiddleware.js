const jwt = require('jsonwebtoken');
const roleService = require("../services/roleService");

async function checkRole(req, res, next) {
    try {
        // Extract the JWT token from the request headers
        const authToken = req.headers.authorization;

        if (!authToken || !authToken.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
        }

        // Extract the token without the 'Bearer ' prefix
        const token = authToken.split(' ')[1];

        // Verify and decode the JWT token to get user ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Now you have the user ID, you can use it to fetch the user's role
        const userRole = await roleService.getUserRole(userId);
        
        if (!userRole) {
            return res.status(403).json({ message: 'Unauthorized: User role not found' });
        }

        req.userRole = userRole;
        req.userId = userId; // Attach user ID to the request object for further use
        next();
    } catch (error) {
        console.error('Error extracting user role:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    checkRole
}