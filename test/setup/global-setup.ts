import { execSync } from 'node:child_process';
import path from 'node:path';
import { config } from 'dotenv';

export default function globalSetup(): void {
  config({ path: path.resolve(__dirname, '../../.env.test') });

  execSync('npx prisma migrate deploy', {
    env: process.env,
    stdio: 'inherit',
  });
}
