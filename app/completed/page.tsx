"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Button  } from '@/components/ui/button';
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const CompletedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/tasks?completed=true')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch completed tasks');
        }
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load completed tasks');
      });
  }, []);

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task');
    }
  };

  return (
    <div className='space-y-4'>
      <h1>Completed Tasks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length > 0 ? (
        tasks.map(task => (
          <Card key={task.id}>
          <CardContent>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
            <p>Status: {task.completed ? 'Completed' : 'Not Completed'}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => deleteTask(task.id)} variant="destructive" className="ml-2">
              Delete
            </Button>
          </CardFooter>
        </Card>
        ))
      ) : (
        !error && <p>No completed tasks found.</p>
      )}
    </div>
  );
}

export default CompletedTasks;
