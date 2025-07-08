import { Test, TestingModule } from '@nestjs/testing';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';

describe('BorrowController', () => {
  let controller: BorrowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
      providers: [BorrowService],
    }).compile();

    controller = module.get<BorrowController>(BorrowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
