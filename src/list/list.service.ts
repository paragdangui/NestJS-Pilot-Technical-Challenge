import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  private list = [
    {
      id: 0,
      name: 'tomato',
    },
    {
      id: 1,
      name: 'potato',
    },
  ];
  create(createListDto: CreateListDto) {
    return createListDto;
  }

  findAll() {
    return this.list;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
