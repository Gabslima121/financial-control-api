import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';

export class CreatePersonIncomeDTO {
  @ApiProperty({ description: 'Person ID' })
  @IsString()
  @IsNotEmpty({ message: 'Person ID is required' })
  personId: string;

  @ApiProperty({ description: 'Income amount' })
  @IsNumber({}, { message: 'Income amount must be a number' })
  @IsNotEmpty({ message: 'Income amount is required' })
  amount: number;

  @ApiProperty({ description: 'Income frequency' })
  @IsString()
  @IsNotEmpty({ message: 'Income frequency is required' })
  frequency: RecurrenceFrequency;
}
