const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const dataroomId = "cmno7nu0a0001jr04ctzp0679";
  const links = await prisma.link.findMany({
    where: { dataroomId },
    select: {
      id: true,
      name: true,
      emailProtected: true,
      emailAuthenticated: true,
      password: true,
      audienceType: true,
      groupId: true,
      permissionGroupId: true,
      allowList: true,
      denyList: true,
    }
  });

  console.log("Datarooms Links for dataroom:", dataroomId);
  console.log(JSON.stringify(links, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
