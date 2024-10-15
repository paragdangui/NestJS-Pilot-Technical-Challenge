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

  //TODO: ERROR: this function throws a 500 error (checkout the chatgpt solution)
  //terminal:
  //   [Nest] 32325  - 14/10/2024, 5:38:55 pm     LOG [RouterExplorer] Mapped {/list-items/:listId/:itemId, DELETE} route +0ms
  // [Nest] 32325  - 14/10/2024, 5:38:55 pm     LOG [NestApplication] Nest application successfully started +3ms
  // [Nest] 32325  - 14/10/2024, 5:57:59 pm   ERROR [ExceptionsHandler] Cannot delete or update a parent row: a foreign key constraint fails (`list_management`.`list_item`, CONSTRAINT `FK_89a46892e58c831d817b2dca8f7` FOREIGN KEY (`listId`) REFERENCES `list` (`id`))
  // QueryFailedError: Cannot delete or update a parent row: a foreign key constraint fails (`list_management`.`list_item`, CONSTRAINT `FK_89a46892e58c831d817b2dca8f7` FOREIGN KEY (`listId`) REFERENCES `list` (`id`))
  //     at Query.onResult (/home/parag/Documents/websites/test-websites/NestJS-Pilot-Technical-Challenge/node_modules/typeorm/driver/src/driver/mysql/MysqlQueryRunner.ts:246:33)
  //     at Query.execute (/home/parag/Documents/websites/test-websites/NestJS-Pilot-Technical-Challenge/node_modules/mysql2/lib/commands/command.js:36:14)
  //     at PoolConnection.handlePacket (/home/parag/Documents/websites/test-websites/NestJS-Pilot-Technical-Challenge/node_modules/mysql2/lib/connection.js:481:34)
  //     at PacketParser.onPacket (/home/parag/Documents/websites/test-websites/NestJS-Pilot-Technical-Challenge/node_modules/mysql2/lib/connection.js:97:12)
  //     at PacketParser.executeStart (/home/parag/Documents/websites/test-websites/NestJS-Pilot-Technical-Challenge/node_modules/mysql2/lib/packet_parser.js:75:16)
  //     at Socket.<anonymous> (/home/parag/Documents/websites/test-websites/NestJS-Pilot-Technical-Challenge/node_modules/mysql2/lib/connection.js:104:25)
  //     at Socket.emit (node:events:514:28)
  //     at addChunk (node:internal/streams/readable:545:12)
  //     at readableAddChunkPushByteMode (node:internal/streams/readable:495:3)
  //     at Readable.push (node:internal/streams/readable:375:5)

  async remove(id: number) {
    const existingList = await this.findOne(id);
    if (!existingList) {
      throw new NotFoundException(`List with id #${id} not found`);
    }
    const deletedList = await this.listRepository.remove(existingList);
    return deletedList.name;
  }
}
