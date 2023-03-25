import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.gameType.upsert({
    where: { name: '301' },
    update: {},
    create: {
      name: '301',
      description:
        'A game where players start with 301 points and must reduce their score to zero exactly.',
      rules: '## Objective\nReduce score to zero',
      gameOptions: {
        create: [
          {
            name: 'double in',
            description:
              'Whether players have to hit a double scoring area before they may start deducting points from their scores.',
            validValuesJSON: '{ "type": "boolean" }',
            dataDefaultJSON: '{ "value": false }'
          },
          {
            name: 'double out',
            description:
              'Whether players have to hit a double scoring area to go out.',
            validValuesJSON: '{ "type": "boolean" }',
            dataDefaultJSON: '{ "value": true }'
          },
          {
            name: 'starting points',
            description:
              'The number of points players begin the game with, usually 301 or 501.',
            validValuesJSON: '{ "type": "int", "minValue": 2 }',
            dataDefaultJSON: '{ "value": 301 }'
          }
        ]
      }
    }
  });

  await prisma.gameType.upsert({
    where: { name: 'cricket' },
    update: {},
    create: {
      name: 'cricket',
      description:
        'A game where players must get 3 marks each on numbers 20-15 and bull. First player to do so wins.',
      rules: '## Objective\nBeat everyone else',
      gameOptions: {
        create: [
          {
            name: 'points',
            description:
              'Whether players can earn points on numbers other players do not have closed. A number is closed when a player has hit 3 marks on it.',
            validValuesJSON: '{ "type": "boolean" }',
            dataDefaultJSON: '{ "value": true }'
          },
          {
            name: 'bonus',
            description:
              'Whether players can earn a bonus turn by hitting their highest unclosed number with the last dart of their turn.',
            validValuesJSON: '{ "type": "boolean" }',
            dataDefaultJSON: '{ "value": false }'
          }
        ]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
