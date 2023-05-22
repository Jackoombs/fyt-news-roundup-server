import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOutletInput {
  @Field()
  name: string;

  @Field()
  baseUrl: string;
}
