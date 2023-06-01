import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { FilterArticleInput } from './dto/filter-article.input';
import { OrderArticleInput } from './dto/order-article.input';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => Article)
  createArticle(
    @Args('createArticleInput') createArticleInput: CreateArticleInput,
  ) {
    return this.articleService.create(createArticleInput);
  }

  @Query(() => [Article], { name: 'articles' })
  findAll(
    @Args('filterBy', { nullable: true }) filterBy: FilterArticleInput,
    @Args('orderBy', { type: () => [OrderArticleInput], nullable: true })
    orderBy?: OrderArticleInput[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ) {
    const orderByOptions: { [key: string]: 'asc' | 'desc' }[] | null =
      orderBy && orderBy.length > 0
        ? orderBy.map((item) => {
            const option = {};
            option[item.field] = item.direction;
            return option;
          })
        : undefined;

    return this.articleService.findAll(filterBy, orderByOptions, take, skip);
  }

  @Query(() => Article, { name: 'article' })
  findOne(@Args('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Query(() => [Article], { name: 'relatedArticles' })
  async findRelated(
    @Args('id') id: string,
    @Args('keywords', { type: () => [String] }) keywords: string[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    const relatedArticles = await this.articleService.findRelatedArticles(
      id,
      keywords,
      take,
    );
    console.log(relatedArticles);
    return relatedArticles;
  }

  @Mutation(() => Article)
  updateArticle(
    @Args('updateArticleInput') updateArticleInput: UpdateArticleInput,
  ) {
    return this.articleService.update(updateArticleInput);
  }

  @Mutation(() => Article)
  removeArticle(@Args('id', { type: () => Int }) id: string) {
    return this.articleService.remove(id);
  }
}
