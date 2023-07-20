import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsString()
  surname: string;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @ApiProperty({
    minimum: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
