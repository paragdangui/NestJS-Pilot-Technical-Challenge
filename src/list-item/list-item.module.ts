import { Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemController } from './list-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { List } from 'src/list/entities/list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListItem, List]), // Register repositories for ListItem and List
  ],
  controllers: [ListItemController],
  providers: [ListItemService],
})
export class ListItemModule {}
