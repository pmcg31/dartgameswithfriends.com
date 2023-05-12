import { Player } from '@prisma/client';
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
