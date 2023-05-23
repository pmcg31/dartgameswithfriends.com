import { useWebsocket } from '@/src/lib/websocket/use-websocket';
import {
  TrackMutationData,
  TrackQueryData,
  WsQueryTrackerContext
} from '@/src/lib/websocket/ws-query-tracker-context';
import { PropsWithChildren, useEffect, useRef } from 'react';

export default function WsQueryTrackerProvider({
  children
}: PropsWithChildren): JSX.Element {
  // Use the websocket
  const { connState, sendData } = useWebsocket({
    socketUrl:
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3000/ws',
    onData: (/*data*/) => {
      // console.log(`ws data: ${JSON.stringify(data, null, 2)}`);
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
  function usingQuery(data: TrackQueryData) {
    if (connState === 'CONNECTED') {
      sendData({ usingQuery: data });
    } else {
      usedQueries.current.push(data);
    }
  }

  // Function provided by websocket query
  // tracker context; sends data on queries
  // no longer being used to the ws server
  function releaseQuery(data: TrackQueryData) {
    if (connState === 'CONNECTED') {
      sendData({ releaseQuery: data });
    } else {
      releasedQueries.current.push(data);
    }
  }

  // Function provided by websocket query
  // tracker context; sends data on mutations used
  // to the ws server
  function announceMutation(data: TrackMutationData) {
    if (connState === 'CONNECTED') {
      sendData({ mutation: data });
    } else {
      announcedMutations.current.push(data);
    }
  }

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
