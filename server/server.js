import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import connectDB from './DB/db.js';
import User from './DB/models/user_schema.js';
import Submission_Schema from './DB/models/submissions_schema.js';
import Problem_Schema from './DB/models/Problems_schema.js';
import generateFile from './generateFile.js';
// import executeCpp from './executeCPP.js';
// import executeJava from './executeJava.js';
import executeConly from './executeC.js';
// import executePython from './executePython.js';
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process';
import { exec } from 'child_process';


connectDB();
User.createCollection()
  .then(() => console.log('User collection created'))
  .catch(error => console.error('Error creating User collection:', error));

Submission_Schema.createCollection()
.then(() => console.log('Submission_Schema collection created'))
.catch(error => console.error('Error creating Submission_Schema collection:', error));

Problem_Schema.createCollection()
.then(() => console.log('Problem_Schema collection created'))
.catch(error => console.error('Error creating Problem_Schema collection:', error));

const JWT_SECRET = "secret";
const app = express();
const port = 3001;
let USER_ID_COUNTER = 1;
app.use(express.json());
app.use(cors());
import auth from "./middleware.js";

app.get("/", async (req, res) => {
  try {
    const problems = await Problem_Schema.find({}, "title difficulty acceptance description");
    res.json({x: problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});


app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ msg: 'Email already exists' });
    }

    const newUser = new User({ email, password });

    // Save the user to the database
    await newUser.save();

    return res.json({ msg: 'Success' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (!existingUser) {
      return res.status(403).json({ msg: "User not found " });
    }
    if (existingUser.password !== password) {
      return res.status(403).json({ msg: "Incorrect password" });
    }
    const token = jwt.sign(
      {
        existingUser,
      },
      JWT_SECRET
    );
    return res.json({ token });
  }
  catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Failed to login user' });
  }
});

app.get('/Problem/:id', async (req, res) => {
  try {
    const problem = await Problem_Schema.findOne({ _id: req.params.id });
    if (!problem) {
      return res.status(404).json({});
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});


app.get("/UserProfile", auth, async (req, res) => {
  try {
    const userobj = req.USER_DETAILS;

    console.log('hi');
    console.log(userobj);

    // Normalize user data to handle missing fields and MongoDB flexibility
    const normalizedUser = {
      _id: userobj._id?.toString() || '',
      email: userobj.email || '',
      password: userobj.password || '',
      isAdmin: userobj.isAdmin || false,
      isProblemSetter: userobj.isProblemSetter || false,
    };

    // Fetch total number of questions by difficulty
    const totalEasyQuestions = await Problem_Schema.countDocuments({ difficulty: 'easy' });
    const totalMediumQuestions = await Problem_Schema.countDocuments({ difficulty: 'medium' });
    const totalHardQuestions = await Problem_Schema.countDocuments({ difficulty: 'hard' });

    // Fetch the number of questions solved by the user in each category
    console.log(normalizedUser.email);

    const solvedEasyQuestions = await Submission_Schema.distinct('title', {
      username: normalizedUser.email.toString(),
      verdict: 'Accepted',
      difficulty: 'easy',
    });

    const solvedMediumQuestions = await Submission_Schema.distinct('title', {
      username: normalizedUser.email.toString(),
      verdict: 'Accepted',
      difficulty: 'medium',
    });

    const solvedHardQuestions = await Submission_Schema.distinct('title', {
      username: normalizedUser.email.toString(),
      verdict: 'Accepted',
      difficulty: 'hard',
    });

    // Count the number of unique problems solved by the user in each category
    const numSolvedEasyQuestions = solvedEasyQuestions.length;
    const numSolvedMediumQuestions = solvedMediumQuestions.length;
    const numSolvedHardQuestions = solvedHardQuestions.length;

    const userStats = {
      totalEasyQuestions,
      totalMediumQuestions,
      totalHardQuestions,
      numSolvedEasyQuestions,
      numSolvedMediumQuestions,
      numSolvedHardQuestions,
    };

    res.json({ userobj: normalizedUser, userStats });
  } catch (error) {
    console.error('Error in /UserProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/AddProblem', async (req, res) => {
  try {
    // Extract the problem data from the request body
    const { title, description, acceptanceRate, testCases, difficulty } = req.body;

    // Create a new problem instance
    const newProblem = new Problem_Schema({
      title,
      description,
      "acceptance": acceptanceRate,
      testCases,
      difficulty,
    });

    // Save the problem to the database
    const savedProblem = await newProblem.save();

    res.status(200).json(savedProblem);
  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ error: 'Failed to add problem' });
  }
});

app.post("/mys", auth , async (req, res) => {
  try {
    console.log('t12');
    console.log(req.USER_DETAILS.email);
    console.log('t12');
    res.json(req.USER_DETAILS.email);
  } catch (error) {
    console.error('Error retrieving user email:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/RunCode', async (req, res) => {
  let programProcess = null;
  let responseSent = false; // Flag to prevent multiple responses

  const { code, input } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  if (typeof input === 'undefined') {
    return res.status(400).json({ error: 'No input provided' });
  }

  try {
    const filePath = await generateFile('c', code);
    const jobId = path.basename(filePath).split('.')[0];
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outPath = path.join(__dirname, 'outputs', `${jobId}`);

    exec(`gcc "${filePath}" -o "${outPath}"`, (error, stdout, stderr) => {
      if (responseSent) return;

      if (error || stderr) {
        responseSent = true;
        const errorMessage = stderr
          .split('\n')
          .filter(line => line.includes(':'))
          .map(line => line.trim())
          .join('\n');
        return res.status(500).json({ error: errorMessage || 'Compilation failed with an unknown error.' });
      }

      const runCmd = process.platform === 'win32' ? `${outPath}.exe` : `./${outPath}`;
      const startTime = Date.now();

      programProcess = spawn(runCmd, { cwd: path.join(__dirname, 'outputs') });

      const timeout = setTimeout(() => {
        if (programProcess && !responseSent) {
          programProcess.kill(); // Terminate process
          programProcess = null;
          responseSent = true;
          return res.status(408).json({ error: 'Execution timed out' });
        }
      }, 5000); // Timeout duration

      if (input) {
        programProcess.stdin.write(`${input}\n`);
      }

      let output = '';

      programProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      programProcess.stderr.on('data', (data) => {
        output += `Error: ${data.toString()}`;
      });

      programProcess.on('close', () => {
        if (responseSent) return; // Avoid duplicate response
        clearTimeout(timeout); // Clear timeout
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        programProcess = null;
        responseSent = true;
        return res.json({ output, executionTime });
      });

      programProcess.on('error', (err) => {
        if (responseSent) return; // Avoid duplicate response
        clearTimeout(timeout); // Clear timeout
        responseSent = true;
        return res.status(500).json({ error: 'Failed to execute the program', details: err.message });
      });
    });
  } catch (error) {
    if (!responseSent) {
      responseSent = true;
      console.error("Error running code:", error);
      return res.status(500).json({ error: "Failed to run code" });
    }
  }
});




app.post("/ProblemSubmission", auth, async (req, res) => {
  let responseSent = false; // Flag to prevent multiple responses
  const { title, code, language, difficulty } = req.body;

  try {
    // Fetch problem data from the database
    const problem = await Problem_Schema.findOne({ title });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Generate file based on language and code
    const filePath = await generateFile(language, code);
    if (!filePath) {
      throw new Error("Unsupported language or file generation failed");
    }

    const tests = [];
    let isAllCorrect = true;

    for (const testCase of problem.testCases) {
      const { input, expectedOutput } = testCase;
      let outputBuffer = "";

      const jobId = path.basename(filePath).split(".")[0];
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const outPath = path.join(__dirname, "outputs", `${jobId}`);

      // Compile the code
      const compileError = await new Promise((resolve) => {
        exec(`gcc "${filePath}" -o "${outPath}"`, (error, stdout, stderr) => {
          if (error || stderr) {
            const errorMessage = stderr
              .split("\n")
              .filter((line) => line.includes(":"))
              .map((line) => line.trim())
              .join("\n");
            resolve({ error: errorMessage || "Compilation failed with an unknown error." });
          } else {
            resolve(null);
          }
        });
      });

      if (compileError) {
        if (!responseSent) {
          responseSent = true;
          return res.status(500).json({ error: compileError.error });
        }
        return;
      }

      const runCmd = process.platform === "win32" ? `${outPath}.exe` : `./${outPath}`;
      let programProcess = spawn(runCmd, { cwd: path.join(__dirname, "outputs") });

      // Timeout logic
      const timeout = setTimeout(() => {
        if (programProcess) {
          programProcess.kill(); // Terminate the process on timeout
          tests.push({
            input,
            generatedOutput: "Execution Timed Out",
            expectedOutput,
            resultoftestcase: "Timeout",
          });
          isAllCorrect = false;
          programProcess = null; // Ensure programProcess is nullified
        }
      }, 5000);

      if (input) {
        programProcess.stdin.write(`${input}\n`);
        programProcess.stdin.end(); // Close stdin
      }

      // Capture stdout and stderr
      programProcess.stdout.on("data", (data) => {
        outputBuffer += data.toString();
      });

      programProcess.stderr.on("data", (data) => {
        outputBuffer += `Error: ${data.toString()}`;
      });

      // Wait for process to finish or timeout
      await new Promise((resolve) => {
        programProcess.on("close", () => {
          clearTimeout(timeout); // Clear the timeout if execution finishes
          const isCorrect = outputBuffer.trim() === expectedOutput.trim();

          tests.push({
            input,
            generatedOutput: outputBuffer || "No Output",
            expectedOutput,
            resultoftestcase: isCorrect ? "Accepted" : "Rejected",
          });

          if (!isCorrect) {
            isAllCorrect = false;
          }

          resolve();
        });

        programProcess.on("error", () => {
          clearTimeout(timeout);
          isAllCorrect = false;
          tests.push({
            input,
            generatedOutput: "Error occurred during execution",
            expectedOutput,
            resultoftestcase: "Error",
          });
          resolve();
        });
      });
    }

    // Determine overall verdict
    const verdict = isAllCorrect ? "Accepted" : "Rejected";

    // Delete generated file
    fs.unlink(filePath, () => {});

    // Create a new submission document
    const newPS = new Submission_Schema({
      username: req.USER_DETAILS.email,
      title,
      codelink: code,
      tests,
      verdict,
      dateTime: new Date(),
      difficulty,
    });

    // Save the submission to the database
    const savedSubmission = await newPS.save();
    if (!responseSent) {
      responseSent = true;
      return res.json({ submission: savedSubmission });
    }
  } catch (error) {
    if (!responseSent) {
      responseSent = true;
      console.error("Error saving submission:", error);
      res.status(500).json({ error: "Failed to save submission" });
    }
  }
});





app.post("/Submissions", async (req, res) => {
  const searchUser = req.body.searchUser;
  const searchProblemTitles = req.body.searchProblemTitles;

  try {
    let filteredSubmissions = [];

    if (searchUser && !searchProblemTitles) {
      // Case 1: searchUser provided, searchProblemTitles not provided
      filteredSubmissions = await Submission_Schema.find({
        username: { $regex: new RegExp(searchUser, "i") },
      });
    } else if (!searchUser && searchProblemTitles) {
      // Case 2: searchUser not provided, searchProblemTitles provided
      filteredSubmissions = await Submission_Schema.find({
        title: { $regex: new RegExp(searchProblemTitles, "i") },
      });
    } else if (!searchUser && !searchProblemTitles) {
      // Case 3: Both searchUser and searchProblemTitles not provided
      filteredSubmissions = await Submission_Schema.find();
    } else if (searchUser && searchProblemTitles) {
      // Case 4: Both searchUser and searchProblemTitles provided
      filteredSubmissions = await Submission_Schema.find({
        username: { $regex: new RegExp(searchUser, "i") },
        title: { $regex: new RegExp(searchProblemTitles, "i") },
      });
    }

    res.json({ filteredSubmissions });
  } catch (error) {
    console.error('Error fetching filtered submissions:', error);
    res.status(500).json({ error: "Failed to fetch filtered submissions" });
  }
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});