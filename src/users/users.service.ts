import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { OmitType, PartialType } from '@nestjs/mapped-types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserInput: CreateUserInput) {
    return this.prisma.user.create({ data: createUserInput });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      throw new NotFoundException(id);
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      const deletePosts = this.prisma.post.deleteMany({ where: { authorId: id } });
      const deleteUser =  this.prisma.user.delete({ where: { id } });
      await this.prisma.$transaction([ deletePosts, deleteUser]);

      return `L'utilisateur ${user.lastname} ${user.firstname} a été supprimer`;
    } else {
      throw new NotFoundException();
    }
  }
}
