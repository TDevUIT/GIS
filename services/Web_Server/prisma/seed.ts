import { PrismaClient, Role } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function derivePhone(email: string) {
  const digits = email.replace(/\D/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  return digits.padStart(10, '0');
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not found in environment, skipping seed.');
    return;
  }

  if (!adminPassword) {
    console.warn(
      'ADMIN_PASSWORD not found in environment, skipping seed to avoid creating an admin with an empty password.',
    );
    return;
  }

  const adminName = process.env.ADMIN_NAME ?? 'Default Admin';
  const adminPhone = process.env.ADMIN_PHONE ?? derivePhone(adminEmail);

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      phone: adminPhone,
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
      mustChangePassword: false,
    },
    create: {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
      mustChangePassword: false,
    },
  });

  console.log(`Seed completed. Admin ensured for ${adminEmail}.`);
}

main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
