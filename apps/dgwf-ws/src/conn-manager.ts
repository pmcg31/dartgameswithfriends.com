import { CloseEvent, MessageEvent, WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ConnMapValue = {
  remoteAddress: string;
  remotePort: number;
  playerId?: string;
};

// type QueryMapValue = {
//   ws: WebSocket;
//   key: object;
// };

const connectionMap = new Map<WebSocket, ConnMapValue>();
const onlineCountMap = new Map<string, number>();

async function updatePlayerOnlineStatus(
  playerId: string,
  isOnline: boolean
): Promise<void> {
  try {
    // Update the database
    await prisma.player.update({
      where: { id: playerId },
      data: { isOnline, updatedAt: new Date() }
    });

    // Notify connected sockets
    const msg = JSON.stringify({ mutation: 'updatePlayer' });
    for (const ws of connectionMap.keys()) {
      const tmp = connectionMap.get(ws);
      if (tmp) {
        console.log(`${tmp.remoteAddress}[${tmp.remotePort}] ===> ${msg}`);
      }
      ws.send(msg);
    }
  } catch (error) {
    console.log('onPlayerOnlineStatusChanged: error:');
    console.log(error);
  }
}

async function onPlayerOnlineStatusChanged(
  playerId: string,
  isOnline: boolean
): Promise<void> {
  const currentCount = onlineCountMap.get(playerId);
  if (currentCount) {
    if (isOnline) {
      onlineCountMap.set(playerId, currentCount + 1);
    } else {
      if (currentCount === 1) {
        // Count hit zero; player is offline
        onlineCountMap.delete(playerId);

        // Update db
        updatePlayerOnlineStatus(playerId, isOnline);
      } else {
        onlineCountMap.set(playerId, currentCount - 1);
      }
    }
  } else {
    // First time seeing player
    onlineCountMap.set(playerId, 1);

    // Update db
    updatePlayerOnlineStatus(playerId, isOnline);
  }
}

function handleMessage(e: MessageEvent) {
  const conn = connectionMap.get(e.target);
  if (conn) {
    const data = JSON.parse(e.data as string);
    if (Object.prototype.hasOwnProperty.call(data, 'playerId')) {
      if (conn.playerId) {
        console.log(
          `${conn.remoteAddress}[${conn.remotePort}] Player offline: ${conn.playerId}`
        );
        onPlayerOnlineStatusChanged(conn.playerId, false);
      }
      conn.playerId = data.playerId;
      if (conn.playerId) {
        console.log(
          `${conn.remoteAddress}[${conn.remotePort}] Player online: ${data.playerId}`
        );
        onPlayerOnlineStatusChanged(conn.playerId, true);
      }
    } else if (Object.prototype.hasOwnProperty.call(data, 'usingQuery')) {
      console.log(
        `${conn.remoteAddress}[${conn.remotePort}] usingQuery: ${JSON.stringify(
          data.usingQuery
        )}`
      );
    } else if (Object.prototype.hasOwnProperty.call(data, 'releaseQuery')) {
      console.log(
        `${conn.remoteAddress}[${
          conn.remotePort
        }] releaseQuery: ${JSON.stringify(data.releaseQuery)}`
      );
    } else if (Object.prototype.hasOwnProperty.call(data, 'mutation')) {
      console.log(
        `${conn.remoteAddress}[${conn.remotePort}] mutation: ${
          Object.keys(data.mutation)[0]
        }`
      );
      // Forward to all connections
      const msg = JSON.stringify({ mutation: Object.keys(data.mutation)[0] });
      for (const ws of connectionMap.keys()) {
        // Don't send back to originator
        if (ws !== e.target) {
          const tmp = connectionMap.get(ws);
          if (tmp) {
            console.log(`${tmp.remoteAddress}[${tmp.remotePort}] ===> ${msg}`);
          }
          ws.send(msg);
        }
      }
    }
  }
}

function handleClose(e: CloseEvent) {
  const conn = connectionMap.get(e.target);
  if (conn) {
    if (conn.playerId) {
      console.log(
        `${conn.remoteAddress}[${conn.remotePort}] Player offline: ${conn.playerId}`
      );
      onPlayerOnlineStatusChanged(conn.playerId, false);
    }

    // Remove all query map values using this
    // conection

    // Remove from connection map
    connectionMap.delete(e.target);

    console.log(
      `${conn.remoteAddress}[${conn.remotePort}] is outta here! total connections: ${connectionMap.size}`
    );
  }
}

export function acceptConnection(
  remoteAddress: string,
  remotePort: number,
  ws: WebSocket
) {
  // Save the connection
  connectionMap.set(ws, {
    remoteAddress,
    remotePort
  });

  // Handle messages from this connection
  ws.addEventListener('message', handleMessage);

  // Handle the closing of this connection
  ws.addEventListener('close', handleClose);

  console.log(
    `Accepted connection from ${remoteAddress}[${remotePort}]; total connections: ${connectionMap.size}`
  );
}
