const jwt = require('jsonwebtoken');

// create a mock payload
const payload = {
    userId: '1234',
    email: 'example@example.com',
    role: 'admin'
};

// sign the token with a secret key
const token = jwt.sign(payload, 'secret-key', { expiresIn: '1h' });

console.log(token); // print the generated token to console