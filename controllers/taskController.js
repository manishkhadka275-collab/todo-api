const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Title is required.' });
    }

    const task = await Task.create({
      title,
      description,
      isCompleted,
      dueDate,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks (with optional status filtering)
// @route   GET /api/tasks?completed=true|false
exports.getTasks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.completed !== undefined) {
      filter.isCompleted = req.query.completed === 'true';
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }
    next(error);
  }
};

// @desc    Update a task (PUT/PATCH)
// @route   PUT /api/tasks/:id or PATCH /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    if (req.body.title !== undefined && req.body.title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title cannot be empty.' });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }
    next(error);
  }
};