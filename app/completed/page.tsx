"use client";
import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
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

  return (
    <div>
      <h1>Completed Tasks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {task.title}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No completed tasks found.</p>
      )}
    </div>
  );
}

export default CompletedTasks;
