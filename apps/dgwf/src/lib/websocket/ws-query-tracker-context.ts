import { createContext } from 'react';

export type TrackQueryData = {
  getPlayer?: { id: string };
  getNewNotificationCount?: { playerId: string };
  getNotificationCount?: { playerId: string };
  getNotifications?: { playerId: string };
  getIncomingFriendRequests?: { playerId: string };
  getOutgoingFriendRequests?: { playerId: string };
  getFriendsList?: { playerId: string };
  friendRequestExists?: { requesterId: string; addresseeId: string };
  findFriends?: boolean;
};

export type TrackMutationData = {
  createPlayer?: { id: string };
  updatePlayer?: { id: string };
  deletePlayer?: { id: string };
  deleteNotification?: { notificationId: number };
  notificationUpdateNew?: { notificationId: number };
  acceptFriendRequest?: { requesterId: string; addresseeId: string };
  rejectFriendRequest?: { requesterId: string; addresseeId: string };
  createFriendRequest?: { requesterId: string; addresseeId: string };
  deleteFriendRequest?: { requesterId: string; addresseeId: string };
  deleteFriend?: { playerId1: string; playerId2: string };
  getVConf?: { id: string };
  createVConf?: { id: string; playerId1: string; playerId2: string };
  updateVConf?: { id: string };
};

export const WsQueryTrackerContext = createContext<{
  usingQuery: (data: TrackQueryData) => void;
  releaseQuery: (data: TrackQueryData) => void;
  announceMutation: (data: TrackMutationData) => void;
}>({
  usingQuery: () => {
    return;
  },
  releaseQuery: () => {
    return;
  },
  announceMutation: () => {
    return;
  }
});
