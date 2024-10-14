import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const currentUser = await this.userRepository.findOne({
      where: { id: user_id }, // Correct syntax for querying user
    });
    if (!currentUser) {
      throw new Error('User not found');
    }
    const newList = this.listRepository.create({
      ...createListDto,
      user_id: currentUser,
    });
    const savedList = await this.listRepository.save(newList);
    return savedList.name;
  }

  async update(id: number, updateListDto: UpdateListDto) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }
    Object.assign(existingList, updateListDto);
    return await this.listRepository.save(existingList);
  }

  //TODO: ERROR: this function throws a 500 error
  async remove(id: number) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }
    const deletedList = await this.listRepository.remove(existingList);
    return deletedList.name;
  }
}
