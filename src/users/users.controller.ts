import { Controller, Get, Post, Param, Delete, Inject } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailerService,
    @Inject('CREATE_USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('users')
  createUser(): string {
    try {
      const user: User = {
        id: 0,
        email: 'dayd4@outlook.com',
        firstName: 'David',
        lastName: 'Gutiérrez',
        avatar: 'avatar',
      };
      this.usersService.create(user);
      this.client.emit<any>('message_printed', 'user created');
      this.mailService.sendMail({
        to: 'random@outlook.com',
        from: 'dayd4@outlook.com',
        subject: 'User created',
        text: 'User created',
      });
      return 'created';
    } catch (error) {
      return error;
    }
  }

  @Get('user/:userId')
  getUser(@Param('userId') userId: number): Promise<string> {
    return this.usersService.getUser(userId);
  }

  @Get('user/:userId/avatar')
  getUserAvatar(@Param('userId') userId: number): Promise<string> {
    return this.usersService.getUserAvatar(userId);
  }

  @Delete('user/:userId/avatar')
  deleteUserAvatar(@Param('userId') userId: number): Promise<User | null> {
    return this.usersService.deleteUserAvatar(userId);
  }
}
