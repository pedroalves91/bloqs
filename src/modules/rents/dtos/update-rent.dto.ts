import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RentSize, RentStatus } from '../enums';

export class UpdateRentDto {
    @IsString()
    @IsOptional()
    lockerId?: string;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsEnum(RentSize, { message: `Size must be a valid enum value: ${Object.values(RentSize)}` })
    @IsOptional()
    size?: RentSize;

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
