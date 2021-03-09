import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

import logout from '../../api/auth/logout';


const CustomNavbar = (props) => {

  const isAuth = props.isAuth;
  const setAuth = props.setAuth;

  const onLogout = async (event) => {
    event.preventDefault();
    await logout(setAuth);
  }

  return (
    isAuth ?
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Matcha</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/user/self">Voir mon profile</Nav.Link>
            <Nav.Link href="/">Modifier mon profile</Nav.Link>
            <Nav.Link href="/match">Match !</Nav.Link>
            <Nav.Link href="/chat">Chat</Nav.Link>
          </Nav>
          <Button variant='danger' onClick={(event) => onLogout(event)}>Deconnexion</Button>
        </Navbar.Collapse>
      </Navbar>
    :
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Matcha</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/register">Inscription</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  );
}

export default CustomNavbar;
