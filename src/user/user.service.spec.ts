import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';

import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn().mockResolvedValue('token') };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({
      dataValues: { id: '1', username: 'test', password: 'hashed' },
    });
    const result = await service.create({
      username: 'test',
      password: '123456',
      email: 'test@test.com',
    });
    expect(result.username).toBe('test');
  });

  it('should find all users', async () => {
    userModel.findAll.mockResolvedValue([
      { dataValues: { id: '1', username: 'test', password: 'hashed' } },
      { dataValues: { id: '2', username: 'test2', password: 'hashed2' } },
    ]);
    const result = await service.findAll();
    expect(result.length).toBe(2);
    expect(result[0].username).toBe('test');
  });

  it('should return a user on findOne', async () => {
    userModel.findOne.mockResolvedValue({
      dataValues: { id: '1', username: 'test', password: 'hashed' },
    });
    const result = await service.findOne('1');
    expect(result).toEqual({
      id: '1',
      username: 'test',
      email: undefined,
      role: undefined,
      createdAt: undefined,
    });
  });

  it('should throw NotFoundException if user not found on findOne', async () => {
    userModel.findOne.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow();
  });

  it('should update a user', async () => {
    userModel.findByPk.mockResolvedValue({
      update: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
      username: 'test',
      dataValues: {
        id: '1',
        username: 'test',
        email: undefined,
        role: undefined,
        createdAt: undefined,
      },
    });
    userModel.update = jest.fn().mockResolvedValue([1]);
    const result = await service.update('1', { username: 'test' });
    expect(result).toEqual({
      id: '1',
      username: 'test',
      email: undefined,
      role: undefined,
      createdAt: undefined,
    });
  });

  it('should remove a user', async () => {
    userModel.findByPk.mockResolvedValue({
      destroy: jest.fn().mockResolvedValue(true),
      username: 'test',
    });
    const result = await service.remove('1');
    expect(result).toEqual({ message: 'User 1 deleted (soft delete)' });
  });

  it('should login a user', async () => {
    userModel.findOne.mockResolvedValue({
      username: 'test',
      password: 'hashed',
      id: '1',
      dataValues: {
        id: '1',
        username: 'test',
        email: undefined,
        role: undefined,
        createdAt: undefined,
      },
    });
    service.hashPassword = jest.fn().mockResolvedValue('hashed');
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const result = await service.login({
      username: 'test',
      password: '123456',
    });
    expect(result).toEqual({
      message: 'Login successful',
      access_token: 'token',
      user: {
        id: '1',
        username: 'test',
        email: undefined,
        role: undefined,
        createdAt: undefined,
      },
    });
  });

  it('should register a user', async () => {
    service.create = jest.fn().mockResolvedValue({ username: 'test' });
    const result = await service.register({
      username: 'test',
      password: '123456',
      email: 'test@test.com',
    });
    expect(result.username).toBe('test');
  });

  it('should logout a user', async () => {
    const result = await service.logout();
    expect(result.message).toContain('Logout successful');
  });

  it('should request password reset', async () => {
    userModel.findOne.mockResolvedValue({
      update: jest.fn(),
      username: 'test',
    });
    const result = await service.requestPasswordReset('test@test.com');
    expect(result.message).toContain('Password reset token generated');
  });

  it('should reset password', async () => {
    userModel.findOne.mockResolvedValue({
      resetTokenExpires: new Date(Date.now() + 10000),
      update: jest.fn(),
      username: 'test',
    });
    service.hashPassword = jest.fn().mockResolvedValue('hashed');
    const result = await service.resetPassword('token', 'newpass');
    expect(result.message).toContain('Password has been reset');
  });

  // Agrega más tests según sea necesario
});
