import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Role, User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(private dataSource: DataSource) {}

  async seedAdmin() {
    const userRepo = this.dataSource.getRepository(User);

    const adminExists = await userRepo.findOneBy({ email: 'admin@gmail.com' });
    if (adminExists) return;

    const admin = userRepo.create({
      name: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('StrongPassword123', 10),
      role: Role.ADMIN,
    });

    await userRepo.save(admin);
    console.log('Admin user seeded');
  }
}

