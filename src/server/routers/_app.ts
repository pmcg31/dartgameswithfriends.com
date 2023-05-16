import {
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getNewNotificationCount,
  getNotifications,
  getNotificationCount,
  deleteNotification,
  notificationUpdateNew,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getFriendsList,
  acceptFriendRequest,
  rejectFriendRequest,
  friendRequestExists
} from '@/src/lib/db-helper';
import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  getPlayer: procedure
    .input(z.object({ id: z.string() }))
    .query((opts) => getPlayer(opts.input.id)),
  createPlayer: procedure
    .input(
      z.object({
        id: z.string(),
        handle: z.string(),
        email: z.string(),
        profileImageUrl: z.string()
      })
    )
    .mutation((opts) =>
      createPlayer(
        opts.input.id,
        opts.input.handle,
        opts.input.email,
        opts.input.profileImageUrl
      )
    ),
  updatePlayer: procedure
    .input(
      z
        .object({
          id: z.string(),
          handle: z.string().optional(),
          email: z.string().optional(),
          profileImageUrl: z.string().optional()
        })
        .refine(
          (data) => !!data.handle || !!data.email || !!data.profileImageUrl,
          'At least one of (handle, email, profileImageUrl) must be defined'
        )
    )
    .mutation((opts) =>
      updatePlayer(
        opts.input.id,
        opts.input.handle,
        opts.input.email,
        opts.input.profileImageUrl
      )
    ),
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
    ),
  getIncomingFriendRequests: procedure
    .input(z.object({ playerId: z.string() }))
    .query((opts) => getIncomingFriendRequests(opts.input.playerId)),
  getOutgoingFriendRequests: procedure
    .input(z.object({ playerId: z.string() }))
    .query((opts) => getOutgoingFriendRequests(opts.input.playerId)),
  getFriendsList: procedure
    .input(z.object({ playerId: z.string() }))
    .query((opts) => getFriendsList(opts.input.playerId)),
  friendRequestExists: procedure
    .input(z.object({ requesterId: z.string(), addresseeId: z.string() }))
    .query((opts) =>
      friendRequestExists(opts.input.requesterId, opts.input.addresseeId)
    ),
  acceptFriendRequest: procedure
    .input(z.object({ requesterId: z.string(), addresseeId: z.string() }))
    .mutation((opts) =>
      acceptFriendRequest(opts.input.requesterId, opts.input.addresseeId)
    ),
  rejectFriendRequest: procedure
    .input(z.object({ requesterId: z.string(), addresseeId: z.string() }))
    .mutation((opts) =>
      rejectFriendRequest(opts.input.requesterId, opts.input.addresseeId)
    )
});

// export type definition of API
export type AppRouter = typeof appRouter;
