import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findOutletByName = async (name: string) => {
  const outlet = await prisma.outlet.findUniqueOrThrow({
    where: {
      name,
    },
  });
  return outlet;
};

export const getAllOutlets = async () => {
  return await prisma.outlet.findMany({
    include: {
      categorys: {
        where: {
          active: true,
        },
      },
    },
  });
};

export const getOutlet = async (name: string) => {
  return await prisma.outlet.findUniqueOrThrow({
    where: {
      name,
    },
  });
};
