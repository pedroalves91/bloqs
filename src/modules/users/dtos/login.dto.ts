import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsStrongPassword()
    @MinLength(6)
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
