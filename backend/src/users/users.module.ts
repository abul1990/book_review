import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        ReviewsModule
      ],    
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
  })
export class UsersModule {}
