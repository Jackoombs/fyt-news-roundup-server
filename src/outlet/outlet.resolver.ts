import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OutletService } from './outlet.service';
import { Outlet } from './entities/outlet.entity';
import { CreateOutletInput } from './dto/create-outlet.input';
import { UpdateOutletInput } from './dto/update-outlet.input';

@Resolver(() => Outlet)
export class OutletResolver {
  constructor(private readonly outletService: OutletService) {}

  @Mutation(() => Outlet)
  createOutlet(
    @Args('createOutletInput') createOutletInput: CreateOutletInput,
  ) {
    return this.outletService.create(createOutletInput);
  }

  @Query(() => [Outlet], { name: 'outlets' })
  findAll() {
    return this.outletService.findAll();
  }

  @Query(() => Outlet, { name: 'outlet' })
  findOne(@Args('id') id: string) {
    return this.outletService.findOne(id);
  }

  @Query(() => Outlet, { name: 'outletByName' })
  findByName(@Args('name') name: string) {
    return this.outletService.findByName(name);
  }

  @Mutation(() => Outlet)
  updateOutlet(
    @Args('updateOutletInput') updateOutletInput: UpdateOutletInput,
  ) {
    return this.outletService.update(updateOutletInput.id, updateOutletInput);
  }

  @Mutation(() => Outlet)
  removeOutlet(@Args('id') id: string) {
    return this.outletService.remove(id);
  }
}
