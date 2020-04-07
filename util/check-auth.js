const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');

module.exports = (context) => {

  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    //NOTE Bearer extraction
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid token');
      }
    }

    throw new Error('Invalid token');
  }

  throw new Error('Authorization header not present, login again');
};
