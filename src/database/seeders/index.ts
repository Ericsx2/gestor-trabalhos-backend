import projectSeeder from './Project';
import subjectSeeder from './Subject';
import userSeeder from './User';

function seed() {
  userSeeder();
  subjectSeeder();
  projectSeeder();
}

seed();
