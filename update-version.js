const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const changesetFile = path.resolve(__dirname, '.changeset', 'changes.json');

function updateChangesetVersion(type) {
  const changeset = JSON.parse(fs.readFileSync(changesetFile, 'utf8'));
  changeset.releases.forEach(release => {
    release.type = type; // 'major', 'minor', or 'patch'
  });
  fs.writeFileSync(changesetFile, JSON.stringify(changeset, null, 2));
}

const type = process.argv[2]; // 'major', 'minor', or 'patch'
if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Please provide a valid version type: major, minor, or patch');
  process.exit(1);
}

updateChangesetVersion(type);
execSync('pnpm changeset version', { stdio: 'inherit' });
