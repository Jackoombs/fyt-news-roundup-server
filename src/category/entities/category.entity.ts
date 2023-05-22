import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Outlet } from 'src/outlet/entities/outlet.entity';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field()
  active: boolean;

  @Field(() => Outlet)
  outlet: Outlet;

  @Field()
  outletId: string;
}
