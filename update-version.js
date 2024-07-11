const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取变更集文件夹路径
const changesetDir = path.resolve(__dirname, '.changeset');

// 检查变更集文件夹是否存在
if (!fs.existsSync(changesetDir)) {
  fs.mkdirSync(changesetDir);
}

// 格式化当前时间为 'yyyy-mm-dd-hh-mm-ss' 格式
function getFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day}-${hours}:${minutes}:${seconds}`;
}

// 创建一个新的变更集文件
function createChangeset(type) {
  const timestamp = getFormattedTimestamp();
  const changesetFile = path.resolve(changesetDir, `${timestamp}-update.md`);

  const changesetContent = `---
"your-package-name": ${type}
---

Update description here.
`;

  fs.writeFileSync(changesetFile, changesetContent);
  console.log(`Created changeset file: ${changesetFile}`);
}

const type = process.argv[2]; // 'major', 'minor', or 'patch'
if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Please provide a valid version type: major, minor, or patch');
  process.exit(1);
}

createChangeset(type);

// 执行 changeset version 命令
try {
  execSync('pnpm changeset version', { stdio: 'inherit' });
} catch (error) {
  console.error('Error executing changeset version:', error);
  process.exit(1);
}
