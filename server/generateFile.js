// generateFile.js
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';






const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

// generateFile.js
const generateFile = async (format, content) => {
  const jobID = uuid();
  let filename;
  console.log(format);
  if (format === 'java') {
    filename = 'Main.java'; // For Java, set the filename to Main.java
  } else if (format === 'cpp') {
    filename = `${jobID}.cpp`; // For C++, set the filename to <jobID>.cpp
  } else if (format === 'c') {
    filename = `${jobID}.c`; // For C, set the filename to <jobID>.c
  } else if (format === 'py') {
    filename = `${jobID}.py`; // For Python, set the filename to a unique ID with the .py extension
  } else {
    throw new Error('Unsupported language');
  }

  const filePath = path.join(dirCodes, filename);

  await fs.promises.writeFile(filePath, content);
  return filePath;
};

export default generateFile;