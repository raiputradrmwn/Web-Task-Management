import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // Convert id to a number and check for validity
  const taskId = Number(id);
  if (isNaN(taskId)) {
    res.status(400).json({ error: 'Invalid task ID' });
    return;
  }

  try {
    if (req.method === 'PUT') {
      const { title, description, completed } = req.body;
      
      // Validate input data
      if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
        res.status(400).json({ error: 'Invalid input data' });
        return;
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { title, description, completed },
      });
      res.json(updatedTask);
    } else if (req.method === 'DELETE') {
      const deletedTask = await prisma.task.delete({
        where: { id: taskId },
      });
      res.json({ message: 'Task deleted', task: deletedTask });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    // This will catch any errors related to Prisma operations, like not finding the task (PrismaClientKnownRequestError)
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Task not found' });
    } else {
      console.error('Request error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
};
