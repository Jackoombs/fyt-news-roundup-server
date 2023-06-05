import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterArticleInput {
  @Field(() => [String], { nullable: true })
  outletName?: string[];

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  saved?: boolean;
}
