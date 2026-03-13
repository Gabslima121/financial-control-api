import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePersonUseCase } from 'src/application/person/create-person.use-case';
import { CreatePersonDTO } from 'src/infrastructure/nestjs/person/dto/create-person.dto';

@ApiTags('Financial Control - Person')
@Controller('person')
export class PersonController {
  constructor(private readonly createPersonUseCase: CreatePersonUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new person' })
  @ApiResponse({ status: 201, description: 'Person created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createPerson(@Body() body: CreatePersonDTO) {
    await this.createPersonUseCase.execute(body);
  }
}
