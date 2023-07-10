import projectSeeder from './Project';
import userSeeder from './User';

async function seed() {
  await userSeeder();
  await projectSeeder();
}

seed();
