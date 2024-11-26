import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import './LandingPage.css'

const LandingPage = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/');
        setProblems(response.data.x);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <Container>
      <h1 className="text-center my-4">Welcome to PPS Lab!!!</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Acceptance</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id}>
              <td>{problem.title}</td>
              <td>{problem.difficulty}</td>
              <td>{problem.acceptance}</td>
              <td>
                <Link to={`/ProblemPage/${problem._id}`} className="btn btn-primary">
                  View Problem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LandingPage;