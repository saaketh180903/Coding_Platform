import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const inputPath = path.join(outputPath, `${jobId}.txt`);

  return new Promise((resolve, reject) => {
    fs.writeFile(inputPath, input, (error) => {
      if (error) {
        reject(error);
      } else {
        const command = process.platform === "win32"
          ? `gcc "${filepath}" -o "${outPath}" && cd "${outputPath}" && ${jobId}.out < "${inputPath}"`
          : `gcc "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./${jobId}.out < "${inputPath}"`;

        exec(command, (error, stdout, stderr) => {
          fs.unlink(outPath, () => {}); // Clean up the output file
          fs.unlink(inputPath, () => {}); // Clean up the input file
          
          if (error) {
            reject({ error, stderr });
          } else if (stderr) {
            reject(stderr);
          } else {
            resolve(stdout);
          }
        });
      }
    });
  });
};

export default executeC;
