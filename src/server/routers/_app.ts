import {
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getNewNotificationCount,
  getNotifications,
  getNotificationCount,
  deleteNotification,
  notificationUpdateNew
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
    .mutation((opts) => deletePlayer(opts.input.id)),
  getNewNotificationCount: procedure
    .input(z.object({ playerId: z.string() }))
    .query((opts) => getNewNotificationCount(opts.input.playerId)),
  getNotificationCount: procedure
    .input(z.object({ playerId: z.string() }))
    .query((opts) => getNotificationCount(opts.input.playerId)),
  getNotifications: procedure
    .input(
      z.object({
        playerId: z.string(),
        limit: z.number().optional()
      })
    )
    .query((opts) => getNotifications(opts.input.playerId, opts.input.limit)),
  deleteNotification: procedure
    .input(z.object({ notificationId: z.number() }))
    .mutation((opts) => deleteNotification(opts.input.notificationId)),
  notificationUpdateNew: procedure
    .input(z.object({ notificationId: z.number(), isNew: z.boolean() }))
    .mutation((opts) =>
      notificationUpdateNew(opts.input.notificationId, opts.input.isNew)
    )
});

// export type definition of API
export type AppRouter = typeof appRouter;
