import { CreateArticleInput } from './create-article.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
  @Field()
  id: string;

  @Field()
  saved: boolean;
}
