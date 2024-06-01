import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const taskId = Number(id);

  // Validate task ID
  if (isNaN(taskId)) {
    res.status(400).json({ error: 'Invalid task ID' });
    return;
  }

  try {
    if (req.method === 'PUT') {
      const { title, description, completed } = req.body as TaskUpdateInput;
      const dataToUpdate: TaskUpdateInput = {};

      if (title !== undefined) {
        dataToUpdate.title = title;
      }

      if (description !== undefined) {
        dataToUpdate.description = description;
      }

      if (completed !== undefined) {
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
    } else if (req.method === 'DELETE') {
      const deletedTask = await prisma.task.delete({
        where: { id: taskId },
      });
      res.json({ message: 'Task deleted successfully', task: deletedTask });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string; message: string };
      if (prismaError.code === 'P2025') {
        res.status(404).json({ error: 'Task not found' });
      } else {
        console.error('Error during request:', prismaError.message);
        res.status(500).json({ error: 'Internal server error', details: prismaError.message });
      }
    } else {
      console.error('Unexpected error type:', error);
      res.status(500).json({ error: 'Internal server error', details: 'An unexpected error occurred' });
    }
  }
};
