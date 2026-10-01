const jwt = require('jsonwebtoken');

const generateToken = (userId, role, email) => {
  const secret = process.env.JWT_SECRET || 'skillorbit_jwt_fallback_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: userId,
      role,
      email,
    },
    secret,
    {
      expiresIn,
    }
  );
};

module.exports = generateToken;
