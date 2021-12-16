const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) {
      filter = { userId: req.params.userId };
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .sort()
      .limitFields();

    const doc = await features.query.populate({
      path: 'user',
      model: 'User',
      select: ['name', '_id'],
    });

    res.status(200).json({
      status: 'success',
      data: doc,
      message: null,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Resource not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
      message: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(201).json({
      status: 'success',
      data: doc,
      message: 'Created successfully',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError('Resource not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Updated successfully',
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Resource not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Deleted successfully',
    });
  });
