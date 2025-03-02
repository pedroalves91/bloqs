import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LockerStatus } from '../enums';
import { Size } from '../../general/enums/size.enum';

export class UpdateLockerDto {
    @IsString()
    @IsOptional()
    bloqId?: string;

    @IsEnum(LockerStatus, { message: `Status must be a valid enum value: ${Object.values(LockerStatus)}` })
    @IsOptional()
    status?: LockerStatus;

    @IsEnum(Size, { message: `Size must be a valid enum value: ${Object.values(Size)}` })
    @IsOptional()
    size?: Size;

    @IsBoolean()
    @IsOptional()
    isOccupied?: boolean;
}
