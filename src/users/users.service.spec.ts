import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

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

    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and create a new user', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, username, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.createUser(username, password);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username,
        password: expect.any(String),
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw ConflictException if user already exists', async () => {
      const username = 'existinguser';
      const password = 'password123';
      const existingUser = { id: 1, username, password: 'hashedpassword' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.createUser(username, password)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByUsername', () => {
    it('should return a user if found', async () => {
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

  describe('validateUser', () => {
    it('should return user if credentials are correct', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, username, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(username, password);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser('nonexistentuser', 'password123')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'nonexistentuser' } });
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const user = { id: 1, username, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser(username, password)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username } });
    });
  });
});
