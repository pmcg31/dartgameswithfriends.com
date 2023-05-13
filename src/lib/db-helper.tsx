import { Player, Notification } from '@prisma/client';
import prisma from '@/src/lib/prisma';

export async function getPlayer(id: string): Promise<Player | null> {
  return prisma.player.findUnique({ where: { id: id } });
}

export async function createPlayer(
  id: string,
  handle: string
): Promise<Player> {
  return prisma.player.create({ data: { id, handle } });
}

export async function updatePlayer(
  id: string,
  handle: string
): Promise<Player> {
  return prisma.player.update({
    where: { id },
    data: { handle, updatedAt: new Date() }
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
