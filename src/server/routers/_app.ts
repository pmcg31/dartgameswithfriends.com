import {
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer
} from '@/src/lib/db-helper';
import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  getPlayer: procedure
    .input(z.object({ id: z.string() }))
    .query((opts) => getPlayer(opts.input.id)),
  createPlayer: procedure
    .input(z.object({ id: z.string(), handle: z.string() }))
    .mutation((opts) => createPlayer(opts.input.id, opts.input.handle)),
  updatePlayer: procedure
    .input(z.object({ id: z.string(), handle: z.string() }))
    .mutation((opts) => updatePlayer(opts.input.id, opts.input.handle)),
  deletePlayer: procedure
    .input(z.object({ id: z.string() }))
    .mutation((opts) => deletePlayer(opts.input.id))
});

// export type definition of API
export type AppRouter = typeof appRouter;
