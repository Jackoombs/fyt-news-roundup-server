import { Outlet, Category } from '@prisma/client';

export interface OutletWithCategory extends Outlet {
  categorys: Category[];
}
