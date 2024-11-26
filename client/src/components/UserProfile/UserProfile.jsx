import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    acceptanceRate: '',
    testCases: [{ input: '', expectedOutput: '' }],
    difficulty: 'easy',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `${token}` } };
        const response = await axios.get('http://localhost:3001/UserProfile', config);

        setUser(response.data.userobj);
        setUserStats(response.data.userStats);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleAddProblem = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `${token}` } };

      await axios.post('http://localhost:3001/AddProblem', problemData, config);

      setShowAddProblem(false);
      resetProblemForm();
    } catch (err) {
      console.error('Error adding problem:', err);
      setError('Failed to add problem');
    }
  };

  const resetProblemForm = () => {
    setProblemData({
      title: '',
      description: '',
      acceptanceRate: '',
      testCases: [{ input: '', expectedOutput: '' }],
      difficulty: 'easy',
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...problemData.testCases];
    updatedTestCases[index][field] = value;
    setProblemData((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  const handleAddTestCase = () => {
    setProblemData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }],
    }));
  };

  const handleRemoveTestCase = (index) => {
    setProblemData((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card id="user-profile-card">
            <Card.Body>
              <h1>User Profile</h1>
              <Card.Title>Email</Card.Title>
              <Card.Text>{user.email}</Card.Text>
              {(user.isAdmin || user.isProblemSetter) && (
                <Button variant="primary" onClick={() => setShowAddProblem(true)}>
                  Add Problem
                </Button>
              )}
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>

          {userStats && (
            <div className="user-stats mt-4">
              <h3>Your Progress</h3>
              <p>
                Easy: {userStats.numSolvedEasyQuestions} / {userStats.totalEasyQuestions}
              </p>
              <p>
                Medium: {userStats.numSolvedMediumQuestions} / {userStats.totalMediumQuestions}
              </p>
              <p>
                Hard: {userStats.numSolvedHardQuestions} / {userStats.totalHardQuestions}
              </p>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showAddProblem} onHide={() => setShowAddProblem(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Problem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={problemData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={problemData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <h5>Test Cases</h5>
            {problemData.testCases.map((testCase, index) => (
              <div key={index}>
                <Form.Group controlId={`input-${index}`}>
                  <Form.Label>Input</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId={`output-${index}`}>
                  <Form.Label>Expected Output</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={testCase.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                  />
                </Form.Group>
                {index > 0 && (
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveTestCase(index)}
                    className="mb-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="primary" onClick={handleAddTestCase}>
              Add Test Case
            </Button>
            <Form.Group controlId="difficulty">
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                as="select"
                name="difficulty"
                value={problemData.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Control>
            </Form.Group>
            {error && <p className="text-danger mt-2">{error}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddProblem(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProblem}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
