import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LockerStatus } from '../enums';

export class CreateLockerDto {
    @IsString()
    @IsNotEmpty({ message: 'Bloqid is required' })
    bloqId: string;

    @IsEnum(LockerStatus, { message: `Status must be a valid enum value: ${Object.values(LockerStatus)}` })
    @IsOptional()
    status?: LockerStatus;
}
