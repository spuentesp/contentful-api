import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation succeeds', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpass' };
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
  
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
  
      const result = await service.validateUser('testuser', 'password');
  
      expect(result).toEqual({ id: 1, username: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpass');
    });
  
    it('should throw UnauthorizedException if validation fails', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpass' };
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
  
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
  
      await expect(service.validateUser('testuser', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const result = await service.login(mockUser);

      expect(result).toEqual({ access_token: 'mockToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'testuser', sub: 1 });
    });
  });
});
