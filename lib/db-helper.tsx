import { Player, PrismaClient } from '@prisma/client';

export async function getPlayer(id: string): Promise<Player> {
  const prisma = new PrismaClient();

  return prisma.player.findUnique({ where: { id: id } });
}

export async function createPlayer(
  id: string,
  handle: string
): Promise<Player> {
  const prisma = new PrismaClient();

  return prisma.player.create({ data: { id, handle } });
}

export async function updatePlayer(
  id: string,
  handle: string
): Promise<Player> {
  const prisma = new PrismaClient();

  return prisma.player.update({
    where: { id },
    data: { handle, updatedAt: new Date() }
  });
}

export async function deletePlayer(id: string): Promise<Player> {
  const prisma = new PrismaClient();

  return prisma.player.delete({ where: { id } });
}
