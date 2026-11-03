import express from 'express';

const app = express();
const PORT = 4000;

// B1: Configure middleware
app.use(express.json());

// B3: Initialize sample array data
let tasks = [
    { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
    { id: 2, taskName: "Set up Server Environment", assignedTo: "Priya Patel", status: "Completed", priority: "Medium" },
    { id: 3, taskName: "Write Unit Tests", assignedTo: "John Doe", status: "Pending", priority: "Low" }
];

// B2: CRUD Operations

// 1. GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 2. GET /tasks/:id - Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }
    res.status(200).json(task);
});

// 3. POST /tasks - Add a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;
    
    if (!id || !taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({ error: "Missing required fields in task data" });
    }
    
    const taskExists = tasks.some(t => t.id === id);
    if (taskExists) {
        return res.status(400).json({ error: `Task with ID ${id} already exists` });
    }

    const newTask = { id, taskName, assignedTo, status, priority };
    tasks.push(newTask);
    
    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// 4. PUT /tasks/:id - Update task details
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    // Update fields dynamically if they are passed in body
    if (taskName) tasks[taskIndex].taskName = taskName;
    if (assignedTo) tasks[taskIndex].assignedTo = assignedTo;
    if (status) tasks[taskIndex].status = status;
    if (priority) tasks[taskIndex].priority = priority;

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[taskIndex]
    });
});

// 5. DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: `Task with ID ${taskId} deleted successfully` });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
