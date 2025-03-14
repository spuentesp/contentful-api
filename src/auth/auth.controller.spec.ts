import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
    login: jest.fn().mockResolvedValue({ access_token: 'test_token' }),
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and return it', async () => {
      const result = await controller.register({ username: 'testuser', password: 'password123' });
      expect(usersService.createUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(result).toEqual({ id: 1, username: 'testuser' });
    });
  });

  describe('login', () => {
    it('should validate the user and return an access token', async () => {
      const result = await controller.login({ username: 'testuser', password: 'password123' });
      expect(authService.validateUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(authService.login).toHaveBeenCalledWith({ id: 1, username: 'testuser' });
      expect(result).toEqual({ access_token: 'test_token' });
    });
  });
});
