import { createContext } from 'react';
import { ConnState } from './use-websocket';

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

export const WsQueryTrackerContext = createContext<{
  connState: ConnState;
  trackQuery: (data: TrackQueryData) => void;
}>({
  connState: 'DISCONNECTED',
  trackQuery: () => {
    return;
  }
});
