import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Article } from 'src/article/entities/article.entity';
import { Category } from 'src/category/entities/category.entity';

@ObjectType()
export class Outlet {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Article])
  articles: Article[];

  @Field(() => [Category])
  categorys: Category[];

  @Field()
  baseUrl: string;
}
