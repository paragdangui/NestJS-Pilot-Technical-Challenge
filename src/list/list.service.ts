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
    return this.listRepository.find({
      relations: ['user_id'],
    });
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

  async create(createListDto: CreateListDto, user_id: number) {
    const currentUser = await this.listRepository.findOne({
      where: { user_id },
    });
    const newList = this.listRepository.create({..createListDto});
    const { name } = await this.listRepository.save(newList);
    return name;

    // const newList = this.listRepository.create(createListDto);
    const newlyCreatedList = await this.listRepository.save(newList);
    return newlyCreatedList;
  }

  async update(id: number, updateListDto: UpdateListDto) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }
    Object.assign(existingList, updateListDto);
    return await this.listRepository.save(existingList);
  }

  async remove(id: number) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }
    const deletedList = await this.listRepository.remove(existingList);
    return deletedList.name;
  }
}
