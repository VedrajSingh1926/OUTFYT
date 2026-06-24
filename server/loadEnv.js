import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.VITE_CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;
}

// Ensure the server has a placeholder CLERK_SECRET_KEY if none is set to avoid Clerk SDK throwing
if (!process.env.CLERK_SECRET_KEY) {
  process.env.CLERK_SECRET_KEY = 'sk_test_placeholder_key_for_local_testing_bypass';
}
