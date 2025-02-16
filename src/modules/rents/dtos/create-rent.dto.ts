import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RentSize } from '../enums';

export class CreateRentDto {
    @IsString()
    @IsOptional()
    lockerId?: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Weight is required' })
    weight: number;

    @IsEnum(RentSize, { message: `Size must be a valid enum value: ${Object.values(RentSize)}` })
    @IsNotEmpty({ message: 'Size is required' })
    size: RentSize;

    @IsEmail()
    @IsNotEmpty({ message: 'Sender email is required' })
    senderEmail: string;

    @IsEmail()
    @IsNotEmpty({ message: 'Receiver email is required' })
    receiverEmail: string;

    @IsString()
    @IsOptional()
    code?: string;
}
