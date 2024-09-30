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
    const newList = {
      id: this.list.length,
      ...createListDto,
    };
    this.list.push(newList);
    return newList;
  }

  findAll() {
    return this.list;
  }

  findOne(id: number) {
    const foundList = this.list.find((item) => item.id === id);
    if (foundList) {
      return foundList;
    }
    return `List with id #${id} not found`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    const index = this.list.findIndex((item) => item.id === id);
    if (index === -1) {
      return `List with id #${id} not found`;
    }
    this.list[index] = { ...this.list[index], ...updateListDto };
    return this.list[index];
  }

  remove(id: number) {
    const index = this.list.findIndex((item) => item.id === id);
    if (index === -1) {
      return `List with id #${id} not found`;
    }
    const removedList = this.list.splice(index, 1);
    return removedList[0];
  }
}
