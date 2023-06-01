import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderArticleInput {
  @Field(() => String)
  field: string;

  @Field(() => String)
  direction: 'asc' | 'desc';
}
