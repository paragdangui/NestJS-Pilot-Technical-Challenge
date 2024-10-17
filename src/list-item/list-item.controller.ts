import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { UpdateListItemDto } from './dto/update-list-item.dto';

@ApiTags('List Items')
@Controller('list-items/:listId')
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @ApiOperation({ summary: 'Get all items in a list' })
  @ApiResponse({ status: 200, description: 'Returns all list items.' })
  @Get()
  findAll(@Param('listId') listId: string) {
    return this.listItemService.findAll(+listId);
  }

  @ApiOperation({ summary: 'Get a specific item by ID in the list' })
  @ApiResponse({ status: 200, description: 'Returns a single list item.' })
  @Get(':itemId')
  findOne(@Param('listId') listId: string, @Param('itemId') itemId: string) {
    return this.listItemService.findOne(+listId, +itemId);
  }

  @ApiOperation({
    summary: 'Add a single new item or list of items to your list',
  })
  @ApiResponse({
    status: 201,
    description: 'Creates and returns the new list item.',
  })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            example: 'string',
          },
        },
      },
    },
  })
  @Post()
  create(
    @Param('listId') listId: string,
    @Body() createListItemDtos: CreateListItemDto[],
  ) {
    return this.listItemService.createMultiple(+listId, createListItemDtos);
  }

  @ApiOperation({ summary: 'Update a list item' })
  @ApiResponse({
    status: 200,
    description: 'Updates and returns the updated list item.',
  })
  @Patch(':itemId')
  update(
    @Param('listId') listId: string,
    @Param('itemId') itemId: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ) {
    return this.listItemService.update(+listId, +itemId, updateListItemDto);
  }

  @ApiOperation({ summary: 'Delete a list item' })
  @ApiResponse({ status: 200, description: 'Deletes the specified list item.' })
  @Delete(':itemId')
  remove(@Param('listId') listId: string, @Param('itemId') itemId: string) {
    return this.listItemService.remove(+listId, +itemId);
  }
}
