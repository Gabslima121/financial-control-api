import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', example: '123456' })
    @IsNotEmpty()
    @IsString()
    password: string;
}