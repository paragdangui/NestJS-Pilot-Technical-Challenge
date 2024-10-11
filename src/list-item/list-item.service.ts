import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { List } from 'src/list/entities/list.entity';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { UpdateListItemDto } from './dto/update-list-item.dto';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private listItemRepository: Repository<ListItem>,
    @InjectRepository(List) private listRepository: Repository<List>,
  ) {}

  // Find all items in a list
  async findAll(listId: number) {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['items'],
    });
    if (!list) throw new NotFoundException('List not found');
    return list.items;
  }

  // Find one item in a list
  async findOne(listId: number, itemId: number) {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['items'],
    });
    if (!list) throw new NotFoundException('List not found');
    const item = list.items.find((item) => item.id === itemId);
    if (!item) throw new NotFoundException('Item not found in the list');
    return item;
  }

  // Create a new item in a list
  async create(listId: number, createListItemDto: CreateListItemDto) {
    const list = await this.listRepository.findOne({ where: { id: listId } });
    if (!list) throw new NotFoundException('List not found');
    const newItem = this.listItemRepository.create({
      ...createListItemDto,
      list,
    });
    return this.listItemRepository.save(newItem);
  }

  // Update an item in a list
  async update(
    listId: number,
    itemId: number,
    updateListItemDto: UpdateListItemDto,
  ) {
    const item = await this.findOne(listId, itemId); // Reuse findOne method
    return this.listItemRepository.save({ ...item, ...updateListItemDto });
  }

  // Remove an item from a list
  async remove(listId: number, itemId: number) {
    const item = await this.findOne(listId, itemId); // Reuse findOne method
    return this.listItemRepository.remove(item);
  }
}
