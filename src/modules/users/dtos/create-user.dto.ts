import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { UserRole } from '../enums';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsStrongPassword()
    @MinLength(6)
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsEnum(UserRole, { message: `Role must be a valid enum value: ${Object.values(UserRole)}` })
    @IsOptional()
    role?: UserRole;
}
