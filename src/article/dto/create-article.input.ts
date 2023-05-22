import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
  @Field()
  title?: string;

  @Field()
  category?: string;

  @Field()
  outletId: string;

  @Field()
  summary?: string;

  @Field()
  content?: string;

  @Field()
  link: string;

  @Field(() => [String])
  keywords: string[];

  @Field(() => Date)
  date?: Date;
}
