const Class = require('../models/Class');

exports.createClass = async (req, res, next) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    next(err);
  }
};

exports.getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().populate('teacherInCharge', 'username');
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

// Add other CRUD operations