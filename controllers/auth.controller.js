const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// REGISTER
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 2. Username length
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }

        // 3. Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // 4. Password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // 5. Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 6. Hash password & create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Register failed' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
};