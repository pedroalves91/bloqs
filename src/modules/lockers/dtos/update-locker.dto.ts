import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LockerStatus } from '../enums';

export class UpdateLockerDto {
    @IsString()
    @IsOptional()
    bloqId?: string;

    @IsEnum(LockerStatus, { message: `Status must be a valid enum value: ${Object.values(LockerStatus)}` })
    @IsOptional()
    status?: LockerStatus;

    @IsBoolean()
    @IsOptional()
    isOccupied?: boolean;
}
