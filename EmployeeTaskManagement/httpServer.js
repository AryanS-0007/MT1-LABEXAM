import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Shared in-memory data store for tasks
let tasks = [
    { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
    { id: 2, taskName: "Set up Server Environment", assignedTo: "Priya Patel", status: "Completed", priority: "Medium" },
    { id: 3, taskName: "Write Unit Tests", assignedTo: "John Doe", status: "Pending", priority: "Low" }
];

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // A2 & A3: Handle Routes and Methods
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to the Employee Task Management Application</h1>');
    } 
    else if (url === '/tasks' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } 
    else if (url === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Employee Task Management Application Info: This application helps track employee tasks using an in-memory database array.');
    } 
    // A4: Static File Serving Using FS Module
    else if (url === '/home' && method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error: Unable to read index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } 
    // A3: POST /add-task
    else if (url === '/add-task' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);
                // A5: Validation
                if (!newTask.id || !newTask.taskName || !newTask.assignedTo || !newTask.status) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Missing required fields: id, taskName, assignedTo, status" }));
                    return;
                }
                tasks.push(newTask);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Task added successfully via HTTP module", task: newTask }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        });
    } 
    // A5: Error Handling (404 Not Found)
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Page Not Found</h1>');
    }
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
