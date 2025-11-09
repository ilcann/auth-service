import { PrismaClient } from '@prisma/client';
import { getAllRoles } from '@tssx-bilisim/praiven-contracts/auth';

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
      id: 'default-general-department',
      key: 'general',
      name: 'General',
      description: 'Default general-purpose department',
    },
  });

  console.log(`Default department created/verified: ${defaultDepartment.name}`);

  // --- Create the Default Roles ---
  const roles = getAllRoles();

  for (const role of roles) {
    const result = await prisma.userRole.upsert({
      where: { id: role.id },
      update: {
        key: role.key,
        name: role.name,
        description: role.description,
      },
      create: {
        id: role.id,
        key: role.key,
        name: role.name,
        description: role.description,
      },
    });

    console.log(`✅ ${result.name} (${result.key}) - ID: ${result.id}`);
  }
  console.log('✅ Roles seeded successfully');

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
