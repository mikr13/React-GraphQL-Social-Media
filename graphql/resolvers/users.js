const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput
} = require('../../util/validators');

const User = require('../../models/User');

const generateToken = (user) => jwt.sign({
  id: user.id,
  email: user.email,
  username: user.username
},
  process.env.SECRET_KEY,
  {
    expiresIn: '1h'
  }
);

module.exports = {
  Mutation: {
    async login(_, { username, password }) {

      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },

    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      //NOTE user already exists check
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is already registered', {
          errors: {
            username: 'Username is already registered'
          }
        });
      }

      password = await bcrypt.hash(password, process.env.SECRET_KEY);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const result = await newUser.save();

      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token
      };
    }
  }
};
