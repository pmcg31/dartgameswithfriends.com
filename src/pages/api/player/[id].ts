import type { NextApiRequest, NextApiResponse } from 'next';
import { Player } from '@prisma/client';
import {
  createPlayer,
  deletePlayer,
  getPlayer,
  updatePlayer
} from '@/src/lib/db-helper';

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player | Error | null>
) {
  // Get user id from url
  const { id } = req.query;

  // Take appropriate action based on the http method
  if (req.method === 'GET' || req.method === 'HEAD') {
    // Process a GET/HEAD request
    try {
      const player = await getPlayer(id as string);
      if (player != null) {
        if (req.method === 'HEAD') {
          res.status(200).send(null);
        } else {
          res.status(200).json(player);
        }
      } else {
        res.status(404).json({ error: `${id} not found` });
      }
    } catch (err) {
      res.status(400).json({ error: err as string });
    }
  } else if (req.method === 'POST') {
    // Process a POST request
    if (
      req.headers['content-type'] === 'application/json' &&
      'handle' in req.body
    ) {
      try {
        const player = await createPlayer(id as string, req.body.handle);
        res.status(200).json(player);
      } catch (err) {
        res.status(400).json({ error: err as string });
      }
    } else {
      res
        .status(400)
        .json({ error: 'missing "handle" field (string) in request JSON' });
    }
  } else if (req.method === 'PATCH') {
    // Process a PATCH request
    if (
      req.headers['content-type'] === 'application/json' &&
      'handle' in req.body
    ) {
      try {
        const player = await updatePlayer(id as string, req.body.handle);
        res.status(200).json(player);
      } catch (err) {
        res.status(400).json({ error: err as string });
      }
    } else {
      res
        .status(400)
        .json({ error: 'missing "handle" field (string) in request JSON' });
    }
  } else if (req.method === 'DELETE') {
    // Process a DELETE request
    try {
      const player = await deletePlayer(id as string);
      res.status(200).json(player);
    } catch (err) {
      res.status(404).json({ error: err as string });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', 'GET, HEAD, POST, PATCH, DELETE');
    res.status(405).json({ error: `${req.method} not allowed` });
  }
}
