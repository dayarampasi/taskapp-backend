const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; 
        next();
    });
}

module.exports = authenticateToken;
