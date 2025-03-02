import { mock, MockProxy } from 'jest-mock-extended';
import { UserService } from './user.service';
import { UserRepository } from '../repository';
import { UserRole } from '../enums';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../interfaces';
import { ConflictError, InternalServerError, UnauthorizedError } from '../../../utils/http-error.util';
import { CreateUserDto } from '../dtos';
import { Country } from '../../general/enums/country.enum';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: MockProxy<UserRepository>;

    beforeEach(() => {
        userRepositoryMock = mock<UserRepository>();

        userService = new UserService(userRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('createUser', () => {
        it('should create a user and return a token', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: UserRole.REGULAR_USER,
                country: Country.FRANCE,
            };

            userRepositoryMock.findByEmail.mockResolvedValue(null);
            userRepositoryMock.createUser.mockResolvedValue({
                _id: '123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: UserRole.REGULAR_USER,
                country: Country.FRANCE,
            } as unknown as User);

            (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

            const result = await userService.createUser(createUserDto);

            expect(result.token).toBe('jwtToken');
            expect(userRepositoryMock.createUser).toHaveBeenCalledWith(createUserDto);
        });

        it('should throw conflict error when user exists', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password',
                role: UserRole.REGULAR_USER,
                country: Country.FRANCE,
            };

            userRepositoryMock.findByEmail.mockResolvedValue({
                _id: '123',
                email: 'test@example.com',
                password: 'hashedPassword',
                country: Country.FRANCE,
            } as unknown as User);

            await expect(userService.createUser(createUserDto)).rejects.toThrow(
                new ConflictError('Email already in use')
            );

            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(userRepositoryMock.createUser).not.toHaveBeenCalled();
        });

        it('should throw internal server error if an error occurs', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password',
                role: UserRole.REGULAR_USER,
                country: Country.FRANCE,
            };

            userRepositoryMock.findByEmail.mockRejectedValue(new Error('Error creating user'));

            await expect(userService.createUser(createUserDto)).rejects.toThrow(
                new InternalServerError('Error creating user')
            );
        });
    });

    describe('login', () => {
        it('should throw an unauthorized error if password is incorrect', async () => {
            const user = { email: 'test@example.com', password: 'hashedPassword' };
            userRepositoryMock.findByEmail.mockResolvedValue(user as unknown as User);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.login('test@example.com', 'wrongPassword')).rejects.toThrow(
                new UnauthorizedError('Invalid credentials')
            );
        });

        it('should throw internal server error if an error occurs', async () => {
            userRepositoryMock.findByEmail.mockRejectedValue(new Error('Login failed'));

            await expect(userService.login('test@example.com', 'pass')).rejects.toThrow(
                new InternalServerError('Login failed')
            );
        });

        it('should return a token if credentials are valid', async () => {
            const user = { _id: '123', email: 'test@example.com', password: 'hashedPassword' };
            userRepositoryMock.findByEmail.mockResolvedValue(user as unknown as User);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

            const result = await userService.login('test@example.com', 'password');

            expect(result.token).toBe('jwtToken');
        });
    });

    describe('findUserByEmail', () => {
        it('should return user when email is found', async () => {
            const user = {
                _id: '123',
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password',
                role: UserRole.REGULAR_USER,
                country: Country.FRANCE,
            };
            userRepositoryMock.findByEmail.mockResolvedValue(user as unknown as User);

            const result = await userService.findUserByEmail('test@example.com');

            expect(result).toEqual(user);
            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should throw an internal server error if an error occurs in the repository', async () => {
            userRepositoryMock.findByEmail.mockRejectedValue(new Error('Database error'));

            await expect(userService.findUserByEmail('test@example.com')).rejects.toThrow(
                new InternalServerError('Database error')
            );

            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
        });
    });
});
