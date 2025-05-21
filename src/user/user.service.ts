import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}
  private async validateUniqueUsername(username: string) {
    const exists = await this.userModel.findOne({ where: { username } });
    if (exists) throw new BadRequestException('Username already exists');
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private toSafeUser(user: User) {
    const { password, ...rest } = user['dataValues'];
    return rest;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.validateUniqueUsername(createUserDto.username);
      await this.hashPassword(createUserDto.password).then((hashedPassword) => {
        createUserDto.password = hashedPassword;
      });
      const newUser = await this.userModel.create({
        ...createUserDto,
      } as any);
      this.logger.log(`User created successfully: ${newUser.username}`);
      return this.toSafeUser(newUser);
    } catch (error) {
      this.logger.error('Error creating user:', error.message);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, filter: any = {}) {
    try {
      const offset = (page - 1) * limit;
      const users = await this.userModel.findAll({
        where: { ...filter, deletedAt: null },
        offset,
        limit,
      });
      this.logger.log('Fetched all users successfully');
      return users.map(this.toSafeUser);
    } catch (error) {
      this.logger.error('Error fetching users:', error.message);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userModel.findOne({
        where: { id, deletedAt: null },
      });
      if (!user) throw new NotFoundException('User not found');
      this.logger.log(`Fetched user successfully: ${user.username}`);
      return this.toSafeUser(user);
    } catch (error) {
      this.logger.error('Error fetching user:', error.message);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({
        where: { username, deletedAt: null },
      });
      if (user) this.logger.log(`User found by username: ${username}`);
      return user;
    } catch (error) {
      this.logger.error('Error finding user by username:', error.message);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) throw new NotFoundException('User not found');
      if (updateUserDto.username) {
        await this.validateUniqueUsername(updateUserDto.username);
      }
      if (updateUserDto.password) {
        await this.hashPassword(updateUserDto.password).then(
          (hashedPassword) => {
            updateUserDto.password = hashedPassword;
          },
        );
      }
      const responseUpdate = await this.userModel.update(updateUserDto, {
        where: { id },
      });
      if (responseUpdate[0] === 0) {
        this.logger.error('User not updated');
        throw new BadRequestException('User not updated');
      }
      this.logger.log(`User updated successfully: ${user.username}`);
      return this.toSafeUser(user);
    } catch (error) {
      this.logger.error('Error updating user:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('User not updated');
      }
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) throw new NotFoundException('User not found');
      await user.destroy(); // Esto hará soft delete
      this.logger.log(`User ${id} deleted (soft delete)`);
      return { message: `User ${id} deleted (soft delete)` };
    } catch (error) {
      this.logger.error('Error deleting user:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('User not deleted');
      }
    }
  }

  async login({ username, password }: { username: string; password: string }) {
    try {
      const user = await this.userModel.findOne({
        where: { username, deletedAt: null },
      });
      if (!user) throw new NotFoundException('User not found');
      const isMatch = await this.hashPassword(password).then((hash) =>
        bcrypt.compare(password, user.password),
      );
      if (!isMatch) throw new BadRequestException('Invalid credentials');
      // Generar y devolver JWT
      const payload = { username: user.username, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      this.logger.log(`User ${username} logged in successfully`);
      return {
        message: 'Login successful',
        access_token,
        user: this.toSafeUser(user),
      };
    } catch (error) {
      this.logger.error('Error logging in:', error.message);
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.create(createUserDto);
      this.logger.log(`User registered successfully: ${user.username}`);
      return user;
    } catch (error) {
      this.logger.error('Error registering user:', error.message);
      throw error;
    }
  }

  async logout() {
    try {
      // Aquí podrías invalidar el token en el frontend o mantener una blacklist
      this.logger.log('User logged out successfully');
      return { message: 'Logout successful' };
    } catch (error) {
      this.logger.error('Error logging out:', error.message);
      throw error;
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.userModel.findOne({
        where: { email, deletedAt: null },
      });
      if (!user) throw new NotFoundException('User not found');
      const resetToken = uuidv4();
      const resetTokenExpires = addMinutes(new Date(), 30); // Token válido por 30 minutos
      await user.update({ resetToken, resetTokenExpires });
      this.logger.log(`Password reset requested for user: ${user.username}`);
      // Aquí deberías enviar el token por email
      return { message: 'Password reset token generated', resetToken };
    } catch (error) {
      this.logger.error('Error requesting password reset:', error.message);
      throw error;
    }
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const user = await this.userModel.findOne({
        where: { resetToken, deletedAt: null },
      });
      if (
        !user ||
        !user.resetTokenExpires ||
        user.resetTokenExpires < new Date()
      ) {
        throw new BadRequestException('Invalid or expired reset token');
      }
      const hashedPassword = await this.hashPassword(newPassword);
      await user.update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      });
      this.logger.log(`Password reset for user: ${user.username}`);
      return { message: 'Password has been reset' };
    } catch (error) {
      this.logger.error('Error resetting password:', error.message);
      throw error;
    }
  }
}
