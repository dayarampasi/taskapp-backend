const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const taskController = require('../controllers/task.controller');

const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/task.controller');

router.get('/', authenticateToken, taskController.getTasks);
router.post('/', authenticateToken, taskController.addTask);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);


module.exports = router;
