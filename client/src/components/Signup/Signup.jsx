import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Signup.css'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/signup', {
        email,
        password,
      });

      console.log(response.data);
      setIsSignupSuccess(true);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setIsSignupSuccess(false);
      setErrorMessage('Failed to signup');
    }
  };

  return (
    <div id="signup" className="flex-col">
      <h1>Signup</h1>
      <Form onSubmit={handleSignup} className="signup-form">
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Signup
        </Button>
      </Form>

      {errorMessage && (
        <Alert variant="danger" className="mt-4">
          {errorMessage}
        </Alert>
      )}
      {isSignupSuccess && (
        <Alert variant="success" className="mt-4">
          Signup successful!
        </Alert>
      )}
    </div>
  );
};

export default Signup;