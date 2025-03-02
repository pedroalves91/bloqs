import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Country } from '../../general/enums/country.enum';

export class CreateBloqDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    address: string;

    @IsEnum(Country, { message: `Country must be a valid enum value: ${Object.values(Country)}` })
    @IsNotEmpty({ message: 'Country is required' })
    country: Country;
}
