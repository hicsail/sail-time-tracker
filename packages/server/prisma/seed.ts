import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const indirect = await prisma.project.upsert({
    create: {
      name: 'Indirect',
      description: 'Update Meetings, Standup, Classes, etc.',
      status: 'Active',
      isBillable: true
    },
    where: {
      name: 'Indirect'
    },
    update: {
      name: 'Indirect',
      description: 'Update Meetings, Standup, Classes, etc.',
      status: 'Active',
      isBillable: true
    }
  });

  const absence = await prisma.project.upsert({
    create: {
      name: 'Absence',
      description: 'Vacation, Sick leave, Holidays etc.',
      status: 'Active',
      isBillable: false
    },
    where: {
      name: 'Absence'
    },
    update: {
      name: 'Absence',
      description: 'Vacation, Sick leave, Holidays etc.',
      status: 'Active',
      isBillable: false
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
