import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.py`); // Use .py file extension
  const inputPath = path.join(outputPath, `${jobId}.txt`); // New input file path

  return new Promise((resolve, reject) => {
    fs.writeFile(inputPath, input, (error) => {
      if (error) {
        reject(error);
      } else {
        exec(
          `python3 ${filepath} < ${inputPath}`, // Use python3 instead of python
          (error, stdout, stderr) => {
            fs.unlink(outPath, () => {}); // Remove the .py file (not required for Python, but keeping it consistent)
            fs.unlink(inputPath, () => {});
            if (error) {
              reject({ error, stderr });
            }
            if (stderr) {
              reject(stderr);
            }
            resolve(stdout);
          }
        );
      }
    });
  });
};

export default executePython;
