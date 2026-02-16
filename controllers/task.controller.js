const Task = require('../models/Task');

// GET all tasks for logged-in user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD a new task
exports.addTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) return res.status(400).json({ message: 'Task needs a title' });
        if (title.length > 100) return res.status(400).json({ message: 'Title too long' });
        if (description && description.length > 500) return res.status(400).json({ message: 'Description too long' });

        const newTask = new Task({
            title,
            description: description || '',
            user: req.user.id,
            completed: false
        });

        await newTask.save();
        res.status(201).json({ message: 'Task added', task: newTask });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE an existing task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.body.title !== undefined && req.body.title.length > 100) {
    return res.status(400).json({ message: 'Title too long' });
}
if (req.body.description !== undefined && req.body.description.length > 500) {
    return res.status(400).json({ message: 'Description too long' });
}
if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
    return res.status(400).json({ message: 'Completed must be boolean' });
}


        await task.save();

        res.json({ message: 'Task updated', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
