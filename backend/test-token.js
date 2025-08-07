const crypto = require('crypto');

// Test token generation
const token = crypto.randomBytes(32).toString('hex');
console.log('Generated token:', token);
console.log('Token length:', token.length);
console.log('Token contains URL-unsafe chars:', /[^a-zA-Z0-9]/.test(token));

// Test encoding/decoding
const encoded = encodeURIComponent(token);
const decoded = decodeURIComponent(encoded);
console.log('Encoded:', encoded);
console.log('Decoded:', decoded);
console.log('Tokens match:', token === decoded);
