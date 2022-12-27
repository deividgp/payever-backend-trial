import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as fs from 'node:fs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUser: User): Promise<User> {
    const createdUser = new this.userModel(createUser);
    return createdUser.save();
  }

  async getUser(userId: number): Promise<string> {
    const response = await fetch('https://reqres.in/api/users/' + userId);
    const data = await response.json();
    return data.data;
  }

  async getUserAvatar(userId: number): Promise<string> {
    const user = await this.userModel.findOne({ id: userId });
    if (user == null) {
      const response = await fetch('https://reqres.in/api/users/' + userId);
      const data = await response.json();
      const imageUrlData = await fetch(data.data.avatar);
      const buffer = await imageUrlData.arrayBuffer();
      const stringifiedBuffer = Buffer.from(buffer).toString('base64');

      if (!fs.existsSync('./avatars')) {
        fs.mkdirSync('./avatars');
      }

      fs.writeFileSync(
        './avatars/' + userId + '.jpg',
        stringifiedBuffer,
        'base64',
      );
      const createdUser = new this.userModel({
        id: userId,
        avatar: stringifiedBuffer,
      });
      await createdUser.save();
      return stringifiedBuffer;
    }

    return user.avatar;
  }

  async deleteUserAvatar(userId: number): Promise<User | null> {
    try {
      fs.unlinkSync('./avatars/' + userId + '.jpg');
    } catch (err) {
      console.error(err);
    }
    const deletedUser = await this.userModel.findOneAndDelete({ id: userId });
    return deletedUser;
  }
}
