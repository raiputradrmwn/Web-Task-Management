'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';

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
  const [editId, setEditId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState('');

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

  const handleEdit = (id: number, description: string) => {
    setEditId(id);
    setEditDescription(description);
  };

  const saveDescription = async (id: number) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, { description: editDescription });
      if (response.status === 200) {
        setTasks(prev => prev.map(task => task.id === id ? { ...task, description: editDescription } : task));
        setEditId(null);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const cancelEdit = () => {
    setEditId(null);  
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
        <Button type="submit" variant="default">
          Add Task
        </Button>
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {tasks.map((task) => (
          <Card key={task.id} style={{ minWidth: '300px', flexGrow: 1, padding: '10px' }}>
            <CardContent>
              <CardTitle className='pb-2'>{task.title}</CardTitle>
              {editId === task.id ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="px-4 py-2 border rounded w-full"
                />
              ) : (
                <CardDescription>{task.description}</CardDescription>
              )}
              <p>Status: {task.completed ? 'Completed' : 'Not Completed'}</p>
            </CardContent>
            <CardFooter>
              {editId === task.id ? (
                <>
                  <Button onClick={() => saveDescription(task.id)} variant="secondary">
                    Save
                  </Button>
                  <Button onClick={cancelEdit} variant="destructive" className="ml-2">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleEdit(task.id, task.description)} variant="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => toggleCompletion(task)} variant="default" className="ml-2">
                    Toggle Status
                  </Button>
                  <Button onClick={() => deleteTask(task.id)} variant="destructive" className="ml-2">
                    Delete
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
