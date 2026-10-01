import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Guarantee dist/.assetsignore exists with exact content '_worker.js'
const assetsIgnorePath = path.join(distDir, '.assetsignore');
fs.writeFileSync(assetsIgnorePath, '_worker.js\n', 'utf-8');

console.log('✓ Guaranteed dist/.assetsignore created with content: _worker.js');
