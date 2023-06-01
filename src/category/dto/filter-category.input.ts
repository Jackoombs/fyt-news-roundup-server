import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterCategoryInput {
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  outletName?: string;
}
