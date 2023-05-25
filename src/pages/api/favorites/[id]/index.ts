import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { favoritesValidationSchema } from 'validationSchema/favorites';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getFavoritesById();
    case 'PUT':
      return updateFavoritesById();
    case 'DELETE':
      return deleteFavoritesById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFavoritesById() {
    const data = await prisma.favorites.findFirst({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }

  async function updateFavoritesById() {
    await favoritesValidationSchema.validate(req.body);
    const data = await prisma.favorites.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteFavoritesById() {
    const data = await prisma.favorites.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
