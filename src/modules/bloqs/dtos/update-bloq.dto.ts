import { IsOptional, IsString } from 'class-validator';

export class UpdateBloqDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    address?: string;
}
