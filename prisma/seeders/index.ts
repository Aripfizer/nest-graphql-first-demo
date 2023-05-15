import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

dotenv.config();

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'create') {
    params.args.data.password = await hashPassword(params.args.data.password);
  }
  return next(params);
});

const hashPassword = async (password: any) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export class DefaultSeeder {
  static async run(prisma: PrismaClient) {
    const users = Array.from({ length: 10 }, (_, k) => this.createRandomUser());
    await this.createUsers(prisma, users);

    const posts = Array.from({ length: 10 }, (_, k) => this.createRandomPost());
    await this.createPosts(prisma, posts);
  }

  static createRandomUser(): UserDto {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  static async createUsers(prisma: PrismaClient, users: UserDto[]) {
    try {
      await Promise.all(
        users.map((user) => {
          return prisma.user.create({
            data: {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              password: user.password,
            },
          });
        }),
      );

      console.log('Les Users ont été creer avec succes');
    } catch (error) {
      console.log(error);
      throw new Error("Erreur lors de l'insertion des users");
    }
  }

  static createRandomPost(): PostDto {
    return {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      published: true,
      authorId: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    };
  }

  static async createPosts(prisma: PrismaClient, posts: PostDto[]) {
    try {
      await Promise.all(
        posts.map((post) => {
          return prisma.post.create({
            data: {
              title: post.title,
              body: post.body,
              published: post.published,
              authorId: post.authorId,
            },
          });
        }),
      );

      console.log('Les posts ont été creer avec succes');
    } catch (error) {
      console.log(error);
      throw new Error("Erreur lors de l'insertion des posts");
    }
  }
}



export interface UserDto {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthorDto {
  firstname: string;
  lastname: string;
  email: string;
}

export interface PostDto {
  id?: number;
  title: string;
  body: string;
  published?: boolean;
  author?: AuthorDto;
  authorId?: number;
}

DefaultSeeder.run(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
