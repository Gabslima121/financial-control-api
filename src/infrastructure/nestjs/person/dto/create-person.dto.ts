import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePersonDTO {
    @ApiProperty({ description: 'Name of the person' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Email of the person' })
    @IsString()
    @IsNotEmpty()
    email: string;
}