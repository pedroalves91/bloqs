import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository';
import logger from '../../../utils/logger.util';
import config from 'config';
import jwt from 'jsonwebtoken';
import { User } from '../interfaces';
import { ConflictError, GeneralError, InternalServerError, UnauthorizedError } from '../../../utils/http-error.util';
import { CreateUserDto } from '../dtos';

@injectable()
export class UserService {
    private saltRounds = 10;
    private jwtSecret: string = config.get<string>('jwt.secret');

    constructor(@inject(UserRepository) private userRepository: UserRepository) {}

    async createUser(userData: CreateUserDto): Promise<{ token: string }> {
        try {
            const existingUser = await this.findUserByEmail(userData.email);
            if (existingUser) {
                throw new ConflictError('Email already in use');
            }

            const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
            const newUser = await this.userRepository.createUser({
                ...userData,
                password: hashedPassword,
            });

            const token = this.getToken(newUser);

            return { token };
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error creating user: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findUserByEmail(email: string) {
        try {
            return await this.userRepository.findByEmail(email);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding user: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async login(email: string, password: string): Promise<{ token: string }> {
        try {
            const user = await this.findUserByEmail(email);
            if (!user) {
                throw new UnauthorizedError('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedError('Invalid credentials');
            }

            const token = this.getToken(user);

            return { token };
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error in login: ${error.message}`);
            throw new InternalServerError('Login failed');
        }
    }

    private getToken(user: User) {
        return jwt.sign({ id: user._id, email: user.email, role: user.role, country: user.country }, this.jwtSecret, {
            expiresIn: '1h',
        });
    }
}
