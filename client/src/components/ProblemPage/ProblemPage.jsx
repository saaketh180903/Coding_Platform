import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProblemPage.css';

const ProblemPage = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [fileName, setFileName] = useState('');
  const [receivedOutput, setReceivedOutput] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [editorAnnotations, setEditorAnnotations] = useState([]); // To highlight error lines

  const defaultCode = `#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Problem/${pid}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };
    setCode(defaultCode);
    fetchProblem();
  }, [pid]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileInput(e.target.result);
      };
      reader.readAsText(file);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleRemoveFile = () => {
    setFileInput(null);
    setFileName('');
  };

  const handleRunCode = async () => {
    try {
      setIsLoading2(true);
      const inputToUse = fileInput || customInput;
  
      const response = await axios.post('http://localhost:3001/RunCode', {
        code,
        input: inputToUse,
      });
  
      setEditorAnnotations([]);
      setReceivedOutput(response.data.output);
      setExecutionTime(response.data.executionTime);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error compiling code';
      setReceivedOutput(formatErrorMessage(errorMessage));
      setExecutionTime(null);
  
      // Updated regex to capture line and column numbers if available
      const lineRegex = /:(\d+)(?::(\d+))?:\s+(.+)/g;
      let match;
      const newAnnotations = [];
  
      while ((match = lineRegex.exec(errorMessage)) !== null) {
        const lineNumber = parseInt(match[1], 10) - 1; // Zero-based index
        const columnNumber = match[2] ? parseInt(match[2], 10) - 1 : 0; // Default to 0 if not available
        const errorText = match[3];
  
        let finalColumnNumber = columnNumber;
        if (!match[2]) {
          const keywordMatch = errorText.match(/'([^']+)'/); // Extract problematic keyword
          if (keywordMatch) {
            const keyword = keywordMatch[1];
            const lineContent = code.split('\n')[lineNumber];
            const charIndex = lineContent.indexOf(keyword);
            if (charIndex !== -1) {
              finalColumnNumber = charIndex;
            }
          }
        }
  
        newAnnotations.push({
          row: lineNumber,
          column: finalColumnNumber,
          type: 'error',
          text: errorText,
        });
      }
  
      console.log("Annotations:", newAnnotations); // Debugging log
      setEditorAnnotations(newAnnotations);
    }
    setIsLoading2(false);
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading1(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:3001/ProblemSubmission',
        {
          title: problem.title,
          code,
          language: 'c',
          difficulty: problem.difficulty,
        },
        { headers: { Authorization: `${token}` } }
      );

      toast.success('Code submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit code.');
    } finally {
      setIsLoading1(false);
    }
  };

  const formatErrorMessage = (message) => {
    return message
      .split('\n')
      .map((line) => {
        // Updated regex to capture both line and column numbers
        const match = line.match(/:(\d+):(\d+):\s+(.+)/);
        return match
          ? `Line: ${match[1]}, char: ${match[2]}: ${match[3]}`
          : '';
      })
      .filter(Boolean)
      .join('\n');
  };
  

  const handleMySubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/mys',
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const userEmail = response.data;
      if (userEmail == null) {
        toast.error('Please log in to view your submissions.');
      } else {
        navigate(
          `/submissions?problemTitle=${encodeURIComponent(
            problem.title
          )}&userEmail=${encodeURIComponent(userEmail)}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Please log in to view your submissions.');
      } else {
        console.error('Error retrieving user email:', error);
      }
    }
  };


  return (
    <div className="problem-page">
      <div className="header">
        <Button variant="secondary"  onClick={handleMySubmissions}>My Submissions</Button>
        
        <Button
          variant="secondary"
          onClick={() =>
            navigate(`/submissions?problemTitle=${encodeURIComponent(problem?.title)}`)
          }
        >
          All Submissions
        </Button>
      </div>

      <div className="content-container">
        <div className="left-section">
          <Card className="problem-card">
            <Card.Body>
              <h1>{problem?.title}</h1>
              <p>{problem?.description}</p>
              <p>Input: {problem?.testCases[0].input[0]}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{problem?.testCases[0].input.substring(2)}</p>
              <p>Expected Output: {problem?.testCases[0].expectedOutput}</p>
            </Card.Body>
          </Card>

          <div className="custom-input-container">
            <h4>Custom Input</h4>
            <textarea
              className="form-control"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows="4"
              placeholder="Enter custom input"
              disabled={!!fileInput}
            />
          </div>

          <div className="file-upload">
            <label>Upload Input File:</label>
            <input type="file" onChange={handleFileUpload} />
            {fileName && (
              <div className="file-info">
                <Button variant="danger" onClick={handleRemoveFile}>
                  Remove File
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          <div className="editor-container">
            <AceEditor
              mode="c_cpp"
              theme="monokai"
              value={code}
              onChange={(value) => setCode(value)}
              fontSize={16}
              width="100%"
              height="400px"
              annotations={editorAnnotations} // Highlight error lines
            />
          </div>

          <div className="output-container">
            <h4>Output</h4>
            <pre>{receivedOutput}</pre>
            <div className="execution-time">
              <strong>Execution Time:</strong> {executionTime}
            </div>
          </div>

          <div className="action-buttons">
            <Button variant="primary" onClick={handleRunCode} disabled={isLoading2}>
              {isLoading2 ? 'Running...' : 'Run Code'}
            </Button>
            <Button variant="success" onClick={handleSubmit} disabled={isLoading1}>
              {isLoading1 ? 'Submitting...' : 'Submit Code'}
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProblemPage;
