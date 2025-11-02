import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding process is starting...');

  // --- Create the Default Department ---
  // We now control this using the 'key' field
  const defaultDepartment = await prisma.department.upsert({
    // Find the department with the key 'GENERAL'
    where: { key: 'general' },
    // If found, ensure the name is correct (optional update)
    update: { name: 'General' },
    // If not found, create it with this data
    create: {
      key: 'general',
      name: 'General',
      description: 'Default general-purpose department',
    },
  });

  console.log(`Default department created/verified: ${defaultDepartment.name}`);

  // --- Create the Default Roles ---
  const [userRole, adminRole] = await Promise.all([
    // 1. USER Role
    prisma.userRole.upsert({
      // Find the role with the key 'USER'
      where: { key: 'user' },
      update: { name: 'User' },
      create: {
        key: 'user',
        name: 'User',
        description: 'Standard user role',
      },
    }),
    // 2. ADMIN Role
    prisma.userRole.upsert({
      // Find the role with the key 'ADMIN'
      where: { key: 'admin' },
      update: { name: 'Admin' },
      create: {
        key: 'admin',
        name: 'Admin',
        description: 'Administrator role',
      },
    }),
  ]);

  console.log(
    `Default roles created/verified: ${userRole.name}, ${adminRole.name}`,
  );
  console.log('Seeding process completed successfully.');
}

// Run the main function and catch any errors
main()
  .catch((e) => {
    console.error('An error occurred during the seeding process:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client when done
    await prisma.$disconnect();
  });
