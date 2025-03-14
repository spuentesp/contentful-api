import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and create user', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, username, password: hashedPassword };

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.createUser(username, password);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username,
        password: expect.any(String),
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findByUsername', () => {
    it('should return user if found', async () => {
      const username = 'testuser';
      const user = { id: 1, username, password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByUsername(username);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('nonexistentuser');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'nonexistentuser' } });
      expect(result).toBeNull();
    });
  });
});
