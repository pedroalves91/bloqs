import { Route, Tags, Post, Body, SuccessResponse, Response, Security, Inject } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';
import logger from '../../../utils/logger.util';
import { CreateUserDto, LoginDto } from '../dtos';
import { NextFunction } from 'express';

@Route('users')
@Tags('Users')
@injectable()
export class UserController {
    constructor(
        @inject(UserService)
        private userService: UserService
    ) {}

    @Post('/register')
    @SuccessResponse(StatusCodes.CREATED, 'User Created')
    @Response(StatusCodes.CONFLICT, 'Email already in use')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async createUser(
        @Body() userData: CreateUserDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Creating user with email: ${userData.email}`);
            const token = await this.userService.createUser(userData);

            response.status(StatusCodes.CREATED).json(token);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Post('/login')
    @SuccessResponse(StatusCodes.OK, 'Login Successful')
    @Response(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async login(@Body() loginData: LoginDto, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`User logging in with email: ${loginData.email}`);
            const token = await this.userService.login(loginData.email, loginData.password);

            response.status(StatusCodes.OK).json(token);
        } catch (internalError) {
            next(internalError);
        }
    }
}
