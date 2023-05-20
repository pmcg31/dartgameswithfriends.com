import {
  Player,
  Notification,
  FriendshipRequest,
  Friendship
} from '@prisma/client';
import prisma from '@/src/lib/prisma';

export async function getPlayer(id: string): Promise<Player | null> {
  return prisma.player.findUnique({ where: { id: id } });
}

export async function createPlayer(
  id: string,
  handle: string,
  email: string,
  profileImageUrl: string
): Promise<Player> {
  return prisma.player.create({ data: { id, handle, email, profileImageUrl } });
}

export async function updatePlayer(
  id: string,
  handle?: string,
  email?: string,
  profileImageUrl?: string
): Promise<Player> {
  return prisma.player.update({
    where: { id },
    data: { handle, email, profileImageUrl, updatedAt: new Date() }
  });
}

export async function deletePlayer(id: string): Promise<Player> {
  return prisma.player.delete({ where: { id } });
}

export async function getNewNotificationCount(
  playerId: string
): Promise<number> {
  return prisma.notification.count({ where: { playerId, isNew: true } });
}

export async function getNotificationCount(playerId: string): Promise<number> {
  return prisma.notification.count({ where: { playerId } });
}

export async function getNotifications(
  playerId: string,
  limit?: number
): Promise<Notification[]> {
  if (limit) {
    return prisma.notification.findMany({
      where: { playerId },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  } else {
    return prisma.notification.findMany({ where: { playerId } });
  }
}

export async function deleteNotification(
  notificationId: number
): Promise<Notification> {
  return prisma.notification.delete({ where: { id: notificationId } });
}

export async function notificationUpdateNew(
  notificationId: number,
  isNew: boolean
): Promise<Notification> {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isNew }
  });
}

export async function getIncomingFriendRequests(
  playerId: string
): Promise<FriendshipRequest[]> {
  return prisma.friendshipRequest.findMany({
    where: { addresseeId: playerId }
  });
}

export async function getOutgoingFriendRequests(
  playerId: string
): Promise<FriendshipRequest[]> {
  return prisma.friendshipRequest.findMany({
    where: { requesterId: playerId }
  });
}

export async function getFriendsList(playerId: string) {
  return prisma.player.findUnique({
    where: { id: playerId },
    select: {
      aSideFriends: {
        select: {
          playerB: { select: { id: true, handle: true } },
          createdAt: true
        },
        orderBy: {
          playerB: {
            handle: 'asc'
          }
        }
      },
      bSideFriends: {
        select: {
          playerA: { select: { id: true, handle: true } },
          createdAt: true
        },
        orderBy: {
          playerA: {
            handle: 'asc'
          }
        }
      }
    }
  });
}

export async function friendRequestExists(
  requesterId: string,
  addresseeId: string
): Promise<boolean> {
  // Check whether there is a friend request for these ids
  const count = await prisma.friendshipRequest.count({
    where: { requesterId, addresseeId }
  });

  return count === 1;
}

export async function acceptFriendRequest(
  requesterId: string,
  addresseeId: string
): Promise<boolean> {
  // Check whether there is a friend request for these ids
  const count = await prisma.friendshipRequest.count({
    where: { requesterId, addresseeId }
  });
  if (count === 1) {
    // There is a pending request; create a new
    // Friendship record using the lower id as
    // side A
    await prisma.friendship.create({
      data: {
        playerAId: requesterId < addresseeId ? requesterId : addresseeId,
        playerBId: requesterId < addresseeId ? addresseeId : requesterId
      }
    });

    // Delete the request
    await prisma.friendshipRequest.delete({
      where: { requesterId_addresseeId: { requesterId, addresseeId } }
    });

    // Get addressee handle
    const addresseePlayer = await prisma.player.findUnique({
      where: { id: addresseeId },
      select: { handle: true }
    });

    // Create a notification for the requester
    await prisma.notification.create({
      data: {
        playerId: requesterId,
        isNew: true,
        text: JSON.stringify({
          kind: 'sysNotify',
          data: {
            subject: `@${
              addresseePlayer?.handle || 'unknown'
            } has accepted your friend request!`,
            body: 'Congratulations! 🎉'
          }
        })
      }
    });

    return true;
  } else {
    // No pending friend request for those ids
    return false;
  }
}

export async function rejectFriendRequest(
  requesterId: string,
  addresseeId: string
): Promise<boolean> {
  // Check whether there is a friend request for these ids
  const count = await prisma.friendshipRequest.count({
    where: { requesterId, addresseeId }
  });
  if (count === 1) {
    // There is a pending request; delete it
    await prisma.friendshipRequest.delete({
      where: { requesterId_addresseeId: { requesterId, addresseeId } }
    });

    // Get addressee handle
    const addresseePlayer = await prisma.player.findUnique({
      where: { id: addresseeId },
      select: { handle: true }
    });

    // Create a notification for the requester
    await prisma.notification.create({
      data: {
        playerId: requesterId,
        isNew: true,
        text: JSON.stringify({
          kind: 'sysNotify',
          data: {
            subject: `@${
              addresseePlayer?.handle || 'unknown'
            } has rejected your friend request`,
            body: 'Better luck next time!'
          }
        })
      }
    });

    return true;
  } else {
    // No pending friend request for those ids
    return false;
  }
}

export async function findFriends(
  requesterId: string,
  searchText: string,
  limit?: number
) {
  // a and b side friends: check that candidate player is not
  //                       already a friend
  // ob and ib requests: check that candidate player is not
  //                     already a pending friend
  // id: check that candidate player is not the requester's
  //     self
  // If all that is ok, then take candidates where search
  // text is in either the handle or email field
  //
  // return only player ids

  // Optionally include take if a limit was given
  let take = {};
  if (limit) {
    take = { take: limit };
  }

  return prisma.player.findMany({
    ...take,
    orderBy: {
      handle: 'asc'
    },
    where: {
      aSideFriends: { none: { playerBId: requesterId } },
      bSideFriends: { none: { playerAId: requesterId } },
      obFriendRequests: { none: { addresseeId: requesterId } },
      ibFriendRequests: { none: { requesterId } },
      id: { not: requesterId },
      OR: [
        {
          handle: {
            contains: searchText
          }
        },
        {
          email: {
            contains: searchText
          }
        }
      ]
    },
    select: {
      id: true
    }
  });
}

export async function createFriendRequest(
  requesterId: string,
  addresseeId: string
): Promise<FriendshipRequest> {
  // Create friend request
  const fr = await prisma.friendshipRequest.create({
    data: { requesterId, addresseeId }
  });

  // Create a notification for the addressee
  await prisma.notification.create({
    data: {
      playerId: addresseeId,
      isNew: true,
      text: JSON.stringify({
        kind: 'frNotify',
        data: {
          from: requesterId,
          createdAt: fr.createdAt
        }
      })
    }
  });

  // Return the friend request
  return fr;
}

export async function deleteFriendRequest(
  requesterId: string,
  addresseeId: string
): Promise<FriendshipRequest> {
  return prisma.friendshipRequest.delete({
    where: { requesterId_addresseeId: { requesterId, addresseeId } }
  });
}

export async function deleteFriend(
  playerId1: string,
  playerId2: string
): Promise<Friendship> {
  return prisma.friendship.delete({
    where: {
      playerAId_playerBId: {
        playerAId: playerId1 < playerId2 ? playerId1 : playerId2,
        playerBId: playerId1 < playerId2 ? playerId2 : playerId1
      }
    }
  });
}
