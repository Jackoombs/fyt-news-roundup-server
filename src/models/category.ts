import { Outlet, PrismaClient } from "@prisma/client";
import { Category } from "src/type";
import { getOutlet } from "./outlet";

const prisma = new PrismaClient();

export const postCategorys = async (categorys: Category[]) => {
  for (const category of categorys) {
    const isCategory = await getCategory(category.url);

    if (!isCategory) {
      await createCategory(category.url, category.outlet);
    }
  }
};

const getCategory = async (url: string) => {
  const category = await prisma.category.findUnique({
    where: {
      url,
    },
  });

  return category;
};

const createCategory = async (url: string, outletName: string) => {
  return await prisma.category.create({
    data: {
      url,
      outlet: {
        connect: {
          name: outletName,
        },
      },
    },
  });
};
