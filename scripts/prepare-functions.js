import fs from 'fs/promises';
import path from 'path';

async function removeIfExists(target) {
  try {
    await fs.rm(target, { recursive: true, force: true });
  } catch {}
}

async function copyDir(from, to) {
  await fs.cp(from, to, { recursive: true });
}

await removeIfExists('functions/.next');
await removeIfExists('functions/public');

await copyDir('.next', 'functions/.next');
await copyDir('public', 'functions/public');

console.log('Build do Next copiado para functions.');