import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  findAll() {
    return this.listRepository.find();
  }

  async findOne(id: number) {
    const list = await this.listRepository.findOne({
      where: { id: +id },
    });
    if (!list) {
      throw new NotFoundException(`List with id #${id} NOT FOUND`);
    }
    return list;
  }

  // TODO: respond with what is created
  async create(createListDto: CreateListDto) {
    const newList = this.listRepository.create(createListDto);
    return await this.listRepository.save(newList);
  }

  // TODO: respond with what is deleted
  async update(id: number, updateListDto: UpdateListDto) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }

    Object.assign(existingList, updateListDto);
    return await this.listRepository.save(existingList);
  }

  // TODO: add proper responses when deleting a item
  async remove(id: number) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }

    return await this.listRepository.remove(existingList);
  }
}
