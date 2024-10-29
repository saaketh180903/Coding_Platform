import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      const token = response.data.token;
      // Store the token in local storage or any other desired storage method
      localStorage.setItem('token', token);
      // Set the isLoggedIn state to true
      setIsLoggedIn(true);
      setErrorMessage('');
    } catch (error) {
      // Handle error response
      console.error(error);
      setErrorMessage('Wrong username or password');
      setIsLoggedIn(false);
    }
  };

  return (
    <div id="login" className="flex-col">
      <h1>Login</h1>
      <Form onSubmit={handleLogin} className="signup-form">
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
          Login
        </Button>
      </Form>

      {errorMessage && !isLoggedIn && (
        <Alert variant="danger" className="mt-4">
          {errorMessage}
        </Alert>
      )}
      {isLoggedIn && (
        <Alert variant="success" className="mt-4">
          Login successful!
        </Alert>
      )}
    </div>
  );
};

export default Login;