import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Outlet } from 'src/outlet/entities/outlet.entity';

@ObjectType()
export class Article {
  @Field(() => ID)
  id: string;

  @Field()
  title?: string;

  @Field()
  category?: string;

  @Field(() => Outlet)
  outlet: Outlet;

  @Field()
  outletId: string;

  @Field()
  summary?: string;

  @Field()
  content?: string;

  @Field()
  condensedBody?: string;

  @Field()
  link: string;

  @Field()
  saved: boolean;

  @Field(() => [String])
  keywords: string[];

  @Field(() => Date)
  date?: Date;
}
