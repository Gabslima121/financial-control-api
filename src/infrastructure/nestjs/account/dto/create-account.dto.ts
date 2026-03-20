import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDTO {
  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty({ message: 'Account name is required' })
  name: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @IsNotEmpty({ message: 'Bank name is required' })
  bankName: string;

  @ApiProperty({ description: 'Initial balance' })
  @IsNumber({}, { message: 'Initial balance must be a number' })
  @IsNotEmpty({ message: 'Initial balance is required' })
  initialBalance: number;
}
