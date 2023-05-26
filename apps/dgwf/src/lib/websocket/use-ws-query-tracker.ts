import { useContext, useEffect, useRef, useCallback } from 'react';
import {
  TrackQueryData,
  TrackMutationData,
  WsQueryTrackerContext
} from './ws-query-tracker-context';
import { useRouter } from 'next/router';
import { isEqual } from 'lodash';

export function useWsQueryTracker(): {
  usingQuery: (data: TrackQueryData) => void;
  announceMutation: (data: TrackMutationData) => void;
} {
  // For hooking routeChangeStart event
  const router = useRouter();

  // Use the websocket query tracker context
  const { usingQuery, releaseQuery, announceMutation } = useContext(
    WsQueryTrackerContext
  );

  // Stores the list of queries tracked
  const queriesTracked = useRef<TrackQueryData[]>([]);

  // Releases tracked queries when route
  // is changed
  const onChangeRoute = useCallback(() => {
    queriesTracked.current.forEach((element) => {
      releaseQuery(element);
    });
  }, [releaseQuery]);

  // Manages hooking/unhooking route change event
  useEffect(() => {
    // Hook routeChangeStart event
    router.events.on('routeChangeStart', onChangeRoute);

    return () => {
      // Unhook routeChangeStart event
      router.events.off('routeChangeStart', onChangeRoute);
    };
  }, [onChangeRoute, router.events]);

  // Local function that hooks into trackQuery messages:
  // this allows for automatic releasing of queries
  // when the route changes; message duplicates will
  // also be filtered out here
  function localUsingQuery(data: TrackQueryData) {
    let isDup = false;
    queriesTracked.current.every((element) => {
      if (isEqual(data, element)) {
        isDup = true;
      }

      return true;
    });
    if (!isDup) {
      queriesTracked.current.push(data);
      usingQuery(data);
    }
  }

  return { usingQuery: localUsingQuery, announceMutation };
}
