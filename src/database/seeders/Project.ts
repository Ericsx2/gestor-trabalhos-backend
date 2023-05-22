import { prismaClient } from '../prismaClient';
import { faker } from '@faker-js/faker';

async function createProjects(length: number) {
  const [subjects, students, teachers] = await Promise.all([
    prismaClient.subject.findMany({
      select: { id: true },
    }),
    prismaClient.user.findMany({
      where: { role: 'Student' },
      select: { id: true },
    }),
    prismaClient.user.findMany({
      where: { role: 'Teacher' },
      select: { id: true },
    }),
  ]);
  const subjectIds = subjects.map((subject) => subject.id);
  const studentIds = students.map((student) => student.id);
  const teacherIds = teachers.map((teacher) => teacher.id);

  for (let i = 0; i < length; i++) {
    const project = await prismaClient.project.create({
      data: {
        title: faker.word.sample(),
        description: faker.lorem.paragraph(),
        accepted: true,
        created_at: new Date(),
        subjectId: faker.helpers.arrayElement(subjectIds),
        Users: {
          create: [
            {
              user: {
                connect: {
                  id: faker.helpers.arrayElement(studentIds),
                },
              },
            },
            {
              user: {
                connect: {
                  id: faker.helpers.arrayElement(teacherIds),
                },
              },
            },
          ],
        },
      },
    });
  }
}

export default async function projectSeeder() {
  await createProjects(10);
}
