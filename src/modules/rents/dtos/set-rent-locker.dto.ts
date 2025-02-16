import { IsNotEmpty, IsString } from 'class-validator';

export class SetRentLockerDto {
    @IsString()
    @IsNotEmpty({ message: 'Locker ID is required' })
    lockerId: string;
}
