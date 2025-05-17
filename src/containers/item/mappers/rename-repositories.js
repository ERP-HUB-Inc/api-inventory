// rename-repositories.js
const fs = require('fs');
const path = require('path');

const dir = __dirname; // adjust if not in same folder

function toKebabRepositoryName(file) {
  return file
    .replace(/Mapper\.ts$/, '')                  // remove 'Repository.ts'
    .replace(/([a-z])([A-Z])/g, '$1-$2')             // camelCase to kebab-case
    .toLowerCase() + '.mapper.ts';               // add '.repository.ts'
}

fs.readdir(dir, (err, files) => {
  if (err) return console.error('Error reading directory:', err);

  files
    .filter(f => f.endsWith('Mapper.ts'))
    .forEach(file => {
      const newFileName = toKebabRepositoryName(file);
      const oldPath = path.join(dir, file);
      const newPath = path.join(dir, newFileName);

      if (file !== newFileName) {
        fs.rename(oldPath, newPath, err => {
          if (err) console.error(`❌ Failed to rename ${file}:`, err);
          else console.log(`✅ Renamed: ${file} → ${newFileName}`);
        });
      }
    });
});
