import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const taskId = Number(id);

  if (isNaN(taskId)) {
    res.status(400).json({ error: 'Invalid task ID' });
    return;
  }
  
  try {
    switch (req.method) {
      case 'PUT':
        const { title, description, completed } = req.body;
        const dataToUpdate = {};

        if (title !== undefined) {
          if (typeof title !== 'string') {
            res.status(400).json({ error: 'Title must be a string' });
            return;
          }
          dataToUpdate.title = title;
        }

        if (description !== undefined) {
          if (typeof description !== 'string') {
            res.status(400).json({ error: 'Description must be a string' });
            return;
          }
          dataToUpdate.description = description;
        }

        if (completed !== undefined) {
          if (typeof completed !== 'boolean') {
            res.status(400).json({ error: 'Completed must be a boolean' });
            return;
          }
          dataToUpdate.completed = completed;
        }

        if (Object.keys(dataToUpdate).length > 0) {
          const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: dataToUpdate,
          });
          res.json({ message: 'Task updated successfully', task: updatedTask });
        } else {
          res.status(400).json({ error: 'No valid fields provided for update' });
        }
        break;

      case 'DELETE':
        const deletedTask = await prisma.task.delete({
          where: { id: taskId },
        });
        res.json({ message: 'Task deleted successfully', task: deletedTask });
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        break;
    }
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Task not found' });
    } else {
      console.error('Error during request:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
};
