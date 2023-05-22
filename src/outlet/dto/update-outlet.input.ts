import { CreateOutletInput } from './create-outlet.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOutletInput extends PartialType(CreateOutletInput) {
  @Field()
  id: string;
}
