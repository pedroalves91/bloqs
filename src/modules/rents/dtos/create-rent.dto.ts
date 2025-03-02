import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Size } from '../../general/enums/size.enum';

export class CreateRentDto {
    @IsString()
    @IsOptional()
    lockerId?: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Weight is required' })
    weight: number;

    @IsEnum(Size, { message: `Size must be a valid enum value: ${Object.values(Size)}` })
    @IsNotEmpty({ message: 'Size is required' })
    size: Size;

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
