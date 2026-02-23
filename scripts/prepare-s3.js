const fs = require('fs');
const path = require('path');

// Diplodoc generates HTML with hashed bundle references (e.g. vendor-14432c0205e2d1bb.css)
// but outputs unhashed files (vendor.css). Their infra uses a proxy to strip hashes.
// For plain S3 hosting, we create hashed copies from the client manifest.

const buildDir = path.resolve(__dirname, '..', '_build', '_bundle');
const manifestPath = path.resolve(__dirname, '..', 'node_modules', '@diplodoc', 'client', 'build', 'client', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const HASH_RE = /^(.+)-[0-9a-f]{16}(\..+)$/;
let copied = 0;

const seen = new Set();
for (const entry of Object.values(manifest)) {
    for (const files of Object.values(entry)) {
        for (const file of files) {
            if (seen.has(file)) continue;
            seen.add(file);

            const match = file.match(HASH_RE);
            if (!match) continue;

            const original = match[1] + match[2];
            const src = path.join(buildDir, original);
            const dest = path.join(buildDir, file);

            if (fs.existsSync(src) && !fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
                copied++;
                console.log(`${original} -> ${file}`);
            }
        }
    }
}

console.log(`Done: ${copied} files copied.`);