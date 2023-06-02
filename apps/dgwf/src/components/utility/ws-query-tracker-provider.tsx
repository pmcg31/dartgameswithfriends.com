import { useWebsocket } from '@/src/lib/websocket/use-websocket';
import {
  TrackMutationData,
  TrackQueryData,
  WsQueryTrackerContext
} from '@/src/lib/websocket/ws-query-tracker-context';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { trpc } from '@/src/utils/trpc';

export default function WsQueryTrackerProvider({
  children
}: PropsWithChildren): JSX.Element {
  const { isLoaded, isSignedIn, user } = useUser();

  // Get trpc utils
  const utils = trpc.useContext();

  const handleMutationMsg = useCallback(
    (mutation: string) => {
      // Invalidate the queries affected by the
      // specific mutation
      if (mutation === 'createPlayer') {
        utils.getPlayer.invalidate();
      } else if (mutation === 'updatePlayer') {
        utils.getPlayer.invalidate();
      } else if (mutation === 'createFriendRequest') {
        utils.findFriends.invalidate();
        utils.friendRequestExists.invalidate();
        utils.getIncomingFriendRequests.invalidate();
        utils.getOutgoingFriendRequests.invalidate();
        utils.getNewNotificationCount.invalidate();
        utils.getNotificationCount.invalidate();
        utils.getNotifications.invalidate();
      } else if (mutation === 'deleteFriendRequest') {
        utils.friendRequestExists.invalidate();
        utils.getIncomingFriendRequests.invalidate();
        utils.getOutgoingFriendRequests.invalidate();
        utils.findFriends.invalidate();
      } else if (mutation === 'acceptFriendRequest') {
        utils.getNotifications.invalidate();
        utils.getNewNotificationCount.invalidate();
        utils.getNotificationCount.invalidate();
        utils.getFriendsList.invalidate();
        utils.getIncomingFriendRequests.invalidate();
        utils.getOutgoingFriendRequests.invalidate();
      } else if (mutation === 'rejectFriendRequest') {
        utils.getNotifications.invalidate();
        utils.getNewNotificationCount.invalidate();
        utils.getNotificationCount.invalidate();
        utils.getIncomingFriendRequests.invalidate();
        utils.getOutgoingFriendRequests.invalidate();
      } else if (mutation === 'notificationUpdateNew') {
        utils.getNotifications.invalidate();
        utils.getNewNotificationCount.invalidate();
      } else if (mutation === 'deleteNotification') {
        utils.getNotifications.invalidate();
        utils.getNewNotificationCount.invalidate();
        utils.getNotificationCount.invalidate();
      } else if (mutation === 'deleteFriend') {
        utils.findFriends.invalidate();
        utils.getFriendsList.invalidate();
      } else if (mutation === 'createVConf') {
        utils.getNotifications.invalidate();
        utils.getNewNotificationCount.invalidate();
        utils.getNotificationCount.invalidate();
      } else if (mutation === 'updateVConf') {
        utils.getVConf.invalidate();
      }
    },
    [utils]
  );

  const handleAnnouncedMutation = useCallback(
    (data: TrackMutationData) => {
      for (const prop in data) {
        if (Object.prototype.hasOwnProperty.call(data, prop)) {
          handleMutationMsg(prop);
        }
      }
    },
    [handleMutationMsg]
  );

  // Use the websocket
  const { connState, sendData } = useWebsocket({
    socketUrl:
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3000/ws',
    onOpen: () => {
      return;
    },
    onData: (data) => {
      if (Object.prototype.hasOwnProperty.call(data, 'mutation')) {
        handleMutationMsg((data as { mutation: string }).mutation);
      }
      return;
    }
  });

  // Storage for query or mutation data that comes
  // in before the websocket is connected
  const usedQueries = useRef<TrackQueryData[]>([]);
  const releasedQueries = useRef<TrackQueryData[]>([]);
  const announcedMutations = useRef<TrackMutationData[]>([]);

  // Function provided by websocket query
  // tracker context; sends data on queries
  // currently in use to the ws server
  const usingQuery = useCallback(
    (data: TrackQueryData) => {
      if (connState === 'CONNECTED') {
        sendData({ usingQuery: data });
      } else {
        usedQueries.current.push(data);
      }
    },
    [connState, sendData]
  );

  // Function provided by websocket query
  // tracker context; sends data on queries
  // no longer being used to the ws server
  const releaseQuery = useCallback(
    (data: TrackQueryData) => {
      if (connState === 'CONNECTED') {
        sendData({ releaseQuery: data });
      } else {
        releasedQueries.current.push(data);
      }
    },
    [connState, sendData]
  );

  // Function provided by websocket query
  // tracker context; sends data on mutations used
  // to the ws server
  const announceMutation = useCallback(
    (data: TrackMutationData) => {
      handleAnnouncedMutation(data);
      if (connState === 'CONNECTED') {
        sendData({ mutation: data });
      } else {
        announcedMutations.current.push(data);
      }
    },
    [connState, sendData, handleAnnouncedMutation]
  );

  useEffect(() => {
    if (connState === 'CONNECTED') {
      if (isLoaded && isSignedIn) {
        sendData({ playerId: user.id });
      } else {
        sendData({ playerId: null });
      }
    }
  }, [connState, sendData, isLoaded, isSignedIn, user]);

  // Handle sending any data to the websocket that
  // has accumulated while it was connecting
  useEffect(() => {
    if (connState === 'CONNECTED') {
      // Send accumulated tracked query data
      while (usedQueries.current.length > 0) {
        sendData({ usingQuery: usedQueries.current.pop() });
      }

      // Send accumulated released query data
      while (releasedQueries.current.length > 0) {
        sendData({ releaseQuery: releasedQueries.current.pop() });
      }

      // Send accumulated mutation data
      while (announcedMutations.current.length > 0) {
        sendData({ announceMutation: announcedMutations.current.pop() });
      }
    }
  }, [connState, sendData, usedQueries, announcedMutations]);

  return (
    <WsQueryTrackerContext.Provider
      value={{ usingQuery, releaseQuery, announceMutation }}
    >
      {children}
    </WsQueryTrackerContext.Provider>
  );
}
