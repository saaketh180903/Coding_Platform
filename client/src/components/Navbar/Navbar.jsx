import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the custom CSS file

function Navbarfunc() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/">Code Master</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to={'/'}>Problem Set</Nav.Link>
            <Nav.Link as={Link} to={'/Login'}>Login</Nav.Link>
            <Nav.Link as={Link} to={'/Signup'}>Signup</Nav.Link>
            <Nav.Link as={Link} to={'/UserProfile'}>User Profile</Nav.Link>
            <Nav.Link as={Link} to={'/Submissions'}>Submissions</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarfunc;