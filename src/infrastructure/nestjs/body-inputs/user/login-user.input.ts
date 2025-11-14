import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserInput {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'User password' })
  password: string;
}