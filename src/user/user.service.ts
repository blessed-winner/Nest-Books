import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { Borrow } from 'src/borrow/entities/borrow.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Borrow)
    private readonly borrowRepo: Repository<Borrow>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async create(email: string, createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new ConflictException('The user is already in use');

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    const token = await this.jwtService.signAsync(
      { email: user.email },
      {
        expiresIn: '10m',
      },
    );
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Email Verification',
      text: 'Verify your email in the verification link below:',
      html: `<p>Click to verify: <a href="http://localhost:3000/auth/verify-email?token=${token}">Verify</a></p>`,
    });
    return {
      message:
        'Signup successfull. Please check your email to verify your account',
    };
  }

  async verifyUser(token: string) {
    const payload = await this.jwtService.verifyAsync(token);

    const user = await this.userRepository.findOneBy({ email: payload.email });
    if (!user) throw new UnauthorizedException('User not found');

    user.isVerified = true;
    await this.userRepository.save(user);
    return { message: 'User successfully verified!!' };
  }

  async adminCreate(email: string, dto: AdminCreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    dto.password = await bcrypt.hash(dto.password, salt);
    const user = await this.userRepository.create({ ...dto, isVerified: true });
    await this.userRepository.save(user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async enter(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const payload = { id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async getBorrowHistory(userId: number) {
    return await this.borrowRepo.find({
      where: { user: { id: userId } },
      relations: ['book'],
      order: { borrowedAt: 'DESC' },
    });
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User Not Found');

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await this.userRepository.save(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset',
      text: 'Follow this link to reset your password',
      html: `<p>Click<a href="http://localhost:3000/auth/reset-password?token=${token}">here</a>to reset your password. Token valid for 10 minutes</p>`,
    });
    return { message: 'Reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOneBy({ resetToken: token });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token is invalid or expired');
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }
}
