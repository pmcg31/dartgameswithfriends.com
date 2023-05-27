import {
  acceptFriendRequest,
  createFriendRequest,
  createPlayer,
  deleteFriend,
  deleteFriendRequest,
  deleteNotification,
  deletePlayer,
  findFriends,
  friendRequestExists,
  getFriendsList,
  getIncomingFriendRequests,
  getNewNotificationCount,
  getNotificationCount,
  getNotifications,
  getOutgoingFriendRequests,
  getPlayer,
  notificationUpdateNew,
  rejectFriendRequest,
  updatePlayer
} from './src/lib/db-helper';
import prisma from './src/lib/prisma';
import { Player } from '@prisma/client';

export {
  acceptFriendRequest,
  createFriendRequest,
  createPlayer,
  deleteFriend,
  deleteFriendRequest,
  deleteNotification,
  deletePlayer,
  findFriends,
  friendRequestExists,
  getFriendsList,
  getIncomingFriendRequests,
  getNewNotificationCount,
  getNotificationCount,
  getNotifications,
  getOutgoingFriendRequests,
  getPlayer,
  notificationUpdateNew,
  rejectFriendRequest,
  updatePlayer,
  prisma,
  type Player
};
