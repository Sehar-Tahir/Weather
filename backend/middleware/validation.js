// ============================================================
// WEATHERVERSE — Request Validation Middleware
// ============================================================

const { body, param, query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join('. '), 400));
  }
  next();
};

// Admin validation rules
const adminLoginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const adminCreateValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'superadmin']).withMessage('Invalid role'),
];

// Story validation
const storyValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('type').optional().isIn(['text', 'video']).withMessage('Invalid type'),
];

// Blog validation
const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional(),
  body('category').optional(),
];

// Weather validation
const weatherCityValidation = [
  query('city').notEmpty().withMessage('City name is required'),
];

const weatherZipValidation = [
  query('code').notEmpty().withMessage('ZIP code is required'),
];

const weatherLocationValidation = [
  query('lat').isFloat().withMessage('Valid latitude is required'),
  query('lon').isFloat().withMessage('Valid longitude is required'),
];

module.exports = {
  validate,
  adminLoginValidation,
  adminCreateValidation,
  storyValidation,
  blogValidation,
  weatherCityValidation,
  weatherZipValidation,
  weatherLocationValidation,
};