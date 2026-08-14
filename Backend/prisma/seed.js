import "dotenv/config";

import prisma from "../src/config/prisma.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

if (!ADMIN_EMAIL) {
  throw new Error("ADMIN_EMAIL is required in the environment variables");
}

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: ADMIN_EMAIL,
    },

    update: {
      role: "ADMIN",
      status: "ACTIVE",
    },

    create: {
      email: ADMIN_EMAIL,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Admin user seeded successfully:");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    status: admin.status,
  });
}

main()
  .catch((error) => {
    console.error("Admin seeding failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
