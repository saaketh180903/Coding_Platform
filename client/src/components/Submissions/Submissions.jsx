import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Submissions.css'

const Submissions = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchUser, setSearchUser] = useState(searchParams.get('userEmail') || '');
  const [searchProblemTitles, setSearchProblemTitles] = useState(searchParams.get('problemTitle') || '');
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchFilteredSubmissions = async () => {
    try {
      const response = await axios.post('http://localhost:3001/Submissions', {
        searchUser,
        searchProblemTitles,
      });
      setFilteredSubmissions(response.data.filteredSubmissions);
    } catch (error) {
      console.error('Error fetching filtered submissions:', error);
    }
  };

  useEffect(() => {
    fetchFilteredSubmissions(); // Fetch filtered submissions on component mount and whenever search parameters change
  }, [searchUser, searchProblemTitles]);

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="submissions-container">
      <h2 className="submissions-heading">Submissions</h2>
      <div className="submissions-search">
        <Form>
          <Form.Control
            type="text"
            placeholder="Search by User"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Search by Problem Title"
            value={searchProblemTitles}
            onChange={(e) => setSearchProblemTitles(e.target.value)}
          />
          <Button variant="primary" onClick={fetchFilteredSubmissions}>
            Search
          </Button>
        </Form>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Title</th>
            <th>Code Link</th>
            <th>Verdict</th>
            <th>DateTime</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubmissions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.username}</td>
              <td>{sub.title}</td>
              <td>
                <Button variant="link" onClick={() => openModal(sub)}>
                  View Code
                </Button>
              </td>
              <td>{sub.verdict}</td>
              <td>{sub.dateTime}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedSubmission && (
        <Modal show={showModal} onHide={closeModal} style={{ maxWidth: '2400px', margin: 'auto' }}>
          <Modal.Header closeButton>
            <Modal.Title>Code Link and Test Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>User: {selectedSubmission.username}</p>
            <p>Title: {selectedSubmission.title}</p>
            <p>
              Code Link: <pre>{selectedSubmission.codelink}</pre>
            </p>

            <h3>Test Results:</h3>
            <ul>
              {selectedSubmission.tests.map((test, index) => (
                <li key={index}>
                  <strong>Test {index + 1}:</strong>
                  <ul>
                    <li>
                      Input: <pre>{test.input}</pre>
                    </li>
                    <li>
                      Generated Output: <pre>{test.generatedOutput}</pre>
                    </li>
                    <li>
                      Expected Output: <pre>{test.expectedOutput}</pre>
                    </li>
                    <li>
                      Result: <pre>{test.resultoftestcase}</pre>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Submissions;