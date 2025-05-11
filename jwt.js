const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    // If no Authorization header is present
    if (!authorization) {
        return res.status(401).json({ error: "Token not found" });
    }

    // Extract the token from "Bearer <token>"
    const token = authorization.split(" ")[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user to request
        next(); // Proceed to next middleware or route handler
    } catch (err) {
        console.log("JWT Error:", err.message);
        res.status(401).json({ error: "Invalid token" });
    }
};

// Function to generate JWT token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { jwtAuthMiddleware, generateToken };
