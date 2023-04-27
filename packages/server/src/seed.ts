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

  const employees = await prisma.employee.findMany();
  const projects = await prisma.project.findMany({
    where: {
      OR: [{ name: 'Indirect' }, { name: 'Absence' }]
    }
  });

  employees.map((employee) => {
    projects.map(async (project) => {
      await prisma.favoriteProject.upsert({
        where: {
          employeeId_projectId: {
            employeeId: employee.id,
            projectId: project.id
          }
        },
        create: {
          employeeId: employee.id,
          projectId: project.id
        },
        update: {
          employeeId: employee.id,
          projectId: project.id
        }
      });
    });
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
