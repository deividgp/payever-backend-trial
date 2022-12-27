import { Test, TestingModule } from '@nestjs/testing';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

// SOURCE: https://dev.to/tkssharma/unit-testing-and-integration-testing-nestjs-application-4d7a

class ApiServiceMock {
  create(createdUser: User) {
    return [];
  }
  getUser(userId: number) {
    return [];
  }
  getUserAvatar(userId: string) {
    return [];
  }
  deleteUserAvatar(userid: number) {
    return [];
  }
}

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: UsersService,
      useClass: ApiServiceMock,
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ApiServiceProvider],
    }).compile();

    usersService = app.get<UsersService>(UsersService);
  });

  it('createUser', async () => {
    const createUserSpy = jest.spyOn(usersService, 'create');
    const user: User = {
      id: 0,
      email: 'dayd4@outlook.com',
      firstName: 'David',
      lastName: 'Gutiérrez',
      avatar: 'avatar',
    };
    usersService.create(user);
    expect(createUserSpy).toHaveBeenCalledWith(user);
  });

  it('getUser', async () => {
    const getUserSpy = jest.spyOn(usersService, 'getUser');
    const userId = 1;
    usersService.getUser(userId);
    expect(getUserSpy).toHaveBeenCalledWith(userId);
  });

  it('getUserAvatar', async () => {
    const getUserAvatarSpy = jest.spyOn(usersService, 'getUserAvatar');
    const userId = 1;
    usersService.getUserAvatar(userId);
    expect(getUserAvatarSpy).toHaveBeenCalledWith(userId);
  });

  it('deleteUserAvatar', async () => {
    const deleteUserAvatarSpy = jest.spyOn(usersService, 'deleteUserAvatar');
    const userId = 1;
    usersService.deleteUserAvatar(userId);
    expect(deleteUserAvatarSpy).toHaveBeenCalledWith(userId);
  });
});
