import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsNotEmpty({ message: 'User name is required' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'User document', example: '12345678900' })
    @IsNotEmpty({ message: 'User document is required' })
    @IsString()
    document: string;
    
    @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
    @IsNotEmpty({ message: 'User email is required' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ description: 'User password', example: '123456' })
    @IsNotEmpty({ message: 'User password is required' })
    @IsString()
    password: string;
}