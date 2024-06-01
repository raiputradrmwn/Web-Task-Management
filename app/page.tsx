'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post('/api/tasks', { title, description });
      setTasks(prev => [...prev, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleCompletion = async (task: Task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`/api/tasks/${task.id}`, updatedTask);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Tasks</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        className="space-y-2"
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 border rounded">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.completed ? 'Completed' : 'Not Completed'}</p>
            <button onClick={() => toggleCompletion(task)} className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600">
              Toggle Status
            </button>
            <button onClick={() => deleteTask(task.id)} className="px-2 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
