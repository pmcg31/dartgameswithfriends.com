import { useState, useRef, useEffect } from 'react';

export type ConnState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';

export type UseWebsocketData = {
  connState: ConnState;
  sendData: (data: object) => boolean;
};

// socketUrl: the websocket URL to connect to
// onData: called when data is received; arg is
//         parsed JSON message payload
//
// returns:
//   connState: the current state of the connection,
//              one of 'DISCONNECTED', 'CONNECTING',
//              or 'CONNECTED'
//   sendData: sends stringified version of arg to
//             websocket; returns false if not
//             connected
export function useWebsocket({
  socketUrl,
  onData
}: {
  socketUrl: string;
  onData: (data: object) => void;
}): UseWebsocketData {
  const [connState, setConnState] = useState<ConnState>('DISCONNECTED');
  const ws = useRef<WebSocket | null>(null);

  // Stringify and send data to websocket
  function sendData(data: object): boolean {
    if (ws.current && ws.current.readyState === ws.current.OPEN) {
      ws.current.send(JSON.stringify(data));
      return true;
    }

    return false;
  }

  useEffect(() => {
    // Connect if disconnected
    if (connState === 'DISCONNECTED' && ws.current == null) {
      // Start the connection process
      ws.current = new WebSocket(socketUrl);

      // Socket is connecting
      setConnState('CONNECTING');

      // Called when socket connects
      ws.current.onopen = () => {
        // Socket is connected
        setConnState('CONNECTED');
      };

      // Called on incoming data
      ws.current.onmessage = (data) => {
        onData(JSON.parse(data.data));
      };

      // Called when socket disconnects
      ws.current.onclose = () => {
        // Socket is disconnected; setting the socket to
        // null and the state to disconnected will cause
        // a reconnect to be attempted immediately, so
        // use a one second delay to keep this from
        // spinning
        setTimeout(() => {
          ws.current = null;
          setConnState('DISCONNECTED');
        }, 1000);
      };

      // Called if error
      ws.current.onerror = (e) => {
        // Just log the error for now
        console.log(`WS error: ${JSON.stringify(e)}`);
      };
    }

    // Disconnect on unmount if connected
    if (connState === 'CONNECTED') {
      return () => {
        ws.current?.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connState, ws]);

  return { connState, sendData };
}