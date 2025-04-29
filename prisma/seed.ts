const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur administrateur
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrateur',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Créer quelques services
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'IT' },
      update: {},
      create: {
        name: 'IT',
        description: 'Service informatique',
      },
    }),
    prisma.department.upsert({
      where: { name: 'RH' },
      update: {},
      create: {
        name: 'RH',
        description: 'Ressources humaines',
      },
    }),
    prisma.department.upsert({
      where: { name: 'Finance' },
      update: {},
      create: {
        name: 'Finance',
        description: 'Service financier',
      },
    }),
  ]);

  console.log('Base de données initialisée avec succès !');
  console.log('Utilisateur administrateur créé :');
  console.log('Email : admin@example.com');
  console.log('Mot de passe : admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 