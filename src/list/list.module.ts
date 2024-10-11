import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, ListItem])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
