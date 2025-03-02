import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Country } from '../../general/enums/country.enum';

export class UpdateBloqDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsEnum(Country, { message: `Country must be a valid enum value: ${Object.values(Country)}` })
    @IsOptional()
    country: Country;
}
