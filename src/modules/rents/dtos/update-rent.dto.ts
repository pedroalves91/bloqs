import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RentStatus } from '../enums';
import { Size } from '../../general/enums/size.enum';

export class UpdateRentDto {
    @IsString()
    @IsOptional()
    lockerId?: string;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsEnum(Size, { message: `Size must be a valid enum value: ${Object.values(Size)}` })
    @IsOptional()
    size?: Size;

    @IsEnum(RentStatus, { message: `Status must be a valid enum value: ${Object.values(RentStatus)}` })
    @IsOptional()
    status?: RentStatus;

    @IsEmail()
    @IsOptional()
    senderEmail?: string;

    @IsEmail()
    @IsOptional()
    receiverEmail?: string;

    @IsString()
    @IsOptional()
    code?: string;
}
