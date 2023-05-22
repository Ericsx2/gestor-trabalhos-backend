import { prismaClient } from '../prismaClient';

const subjects = [
  {
    name: 'Linguagem de Programação I',
    code: 'CET 635',
  },
  {
    name: 'Linguagem de Programação II',
    code: 'CET 641',
  },
  {
    name: 'Linguagem de Programação III',
    code: 'CET 078',
  },
  {
    name: 'Estrutura de Dados',
    code: 'CET 077',
  },
];

export default async function subjectSeeder() {
  await prismaClient.subject.createMany({ data: subjects });
}
