import { hashSync } from 'bcrypt';
import { prismaClient } from '../prismaClient';
import { faker } from '@faker-js/faker';

async function createUsers(length: number) {
  for (let i = 0; i < length; i++) {
    const password = faker.internet.password();
    const hashedPassword = hashSync(password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        registration: faker.number
          .int({ min: 201800000, max: 202499999 })
          .toString(),
        password: hashedPassword,
        role: faker.helpers.arrayElement(['Student', 'Teacher', 'Admin']),
        deleted: false,
      },
    });
    console.log(
      `email: ${user.email}, password: ${password}, role: ${user.role}`
    );
  }
}

export default async function userSeeder() {
  await createUsers(30);
}
