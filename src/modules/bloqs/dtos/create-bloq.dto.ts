import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBloqDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    address: string;
}
