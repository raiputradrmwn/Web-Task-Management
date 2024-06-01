import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const tasks = await prisma.task.findMany();
      res.status(200).json(tasks);
    } else if (req.method === 'POST') {
      const { title, description } = req.body;

      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }
      const newTask = await prisma.task.create({
        data: { title, description: description || "", completed: false },
      });
      res.status(201).json(newTask);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
}
