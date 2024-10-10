import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@ApiTags('Lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list' })
  @ApiResponse({
    status: 201,
    description: 'New list created with the name [name of the list]',
  })
  async create(@Body() createListDto: CreateListDto) {
    return `New list created with the name '${await this.listService.create(createListDto)}'`;
  }

  @ApiOperation({ summary: 'Get all the lists of this user' })
  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @ApiOperation({ summary: 'Get The list of the specified ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update the list of the specified ID' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.update(+id, updateListDto);
  }

  @ApiOperation({ summary: 'Delete the list of the specified ID' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.listService.remove(+id);
  }
}
