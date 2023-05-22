export function sendWebSocketData({
  socketUrl,
  data,
  onSuccess,
  onError
}: {
  socketUrl: string;
  data: object;
  onSuccess?: () => void;
  onError?: (reason: string) => void;
}): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify(data));
      if (onSuccess) {
        onSuccess();
      }
      resolve(true);
    };

    ws.onerror = (e) => {
      if (onError) {
        onError(JSON.stringify(e));
      }
      reject(false);
    };
  });
}
