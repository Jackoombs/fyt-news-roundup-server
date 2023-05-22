import { Test, TestingModule } from '@nestjs/testing';
import { OutletResolver } from './outlet.resolver';
import { OutletService } from './outlet.service';

describe('OutletResolver', () => {
  let resolver: OutletResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutletResolver, OutletService],
    }).compile();

    resolver = module.get<OutletResolver>(OutletResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
