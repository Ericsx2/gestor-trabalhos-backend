import projectSeeder from './Project';
import subjectSeeder from './Subject';
import userSeeder from './User';

async function seed() {
  await userSeeder();
  await subjectSeeder();
  await projectSeeder();
}

seed();
