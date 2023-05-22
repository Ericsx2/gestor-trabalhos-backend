import { Project } from '@prisma/client';
import { prismaClient } from '../prismaClient';
import { faker } from '@faker-js/faker';

async function createProjects(length: number): Promise<Project[]> {
  const subjects = await prismaClient.subject.findMany({
    select: { id: true },
  });
  const subjectIds = subjects.map((subject) => subject.id);
  let projects: Project[] = [];
  for (let i = 0; i < length; i++) {
    const project: Project = {
      id: faker.string.uuid(),
      title: faker.word.sample(),
      description: faker.lorem.paragraph(),
      accepted: true,
      created_at: new Date(),
      subjectId: faker.helpers.arrayElement(subjectIds),
    };
  }
  return projects;
}

export default async function projectSeeder() {
  const studentsIds = await prismaClient.user.findMany({
    where: { role: 'Student' },
  });

  const teacherIds = await prismaClient.user.findMany({
    where: { role: 'Teacher' },
  });

  await prismaClient.project.createMany({ data: await createProjects(10) });
}
