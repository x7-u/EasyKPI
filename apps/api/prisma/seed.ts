import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Use fixed IDs so the auth middleware's default "local" workspace/user
  // match the seeded rows (FK constraints rely on this in the .exe launcher).
  const ws = await prisma.workspace.upsert({
    where: { id: "local" },
    update: {},
    create: { id: "local", name: "Local workspace", slug: "local" },
  });
  const user = await prisma.user.upsert({
    where: { id: "local-user" },
    update: {},
    create: { id: "local-user", email: "local@easykpi.dev", name: "Local user" },
  });
  await prisma.membership.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: ws.id } },
    update: {},
    create: { userId: user.id, workspaceId: ws.id, role: "admin" },
  });
  console.log(`Seeded workspace=${ws.id} user=${user.id}`);
}

main()
  .catch((e) => {
    console.error("SEED FAILED:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
