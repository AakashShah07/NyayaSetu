const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { success, error } = require('../utils/apiResponse');

const generateTokens = (user) => {
  const payload = { userId: user._id, role: user.role, department: user.department };
  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  const refreshToken = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtRefreshExpiresIn });
  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, department, role, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already registered', 409);

    const user = await User.create({ name, email, password, department, role, phone });
    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    return success(res, { user: userData, ...tokens }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return error(res, 'Invalid credentials', 401);

    if (!user.isActive) return error(res, 'Account is deactivated', 403);

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    return success(res, { user: userData, ...tokens }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return error(res, 'Invalid refresh token', 401);
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return success(res, tokens, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, getMe };
