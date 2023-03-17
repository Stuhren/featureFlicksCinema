import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, Link } from "react-router-dom";


function NavbarComponent() {
    return (
        <>
            <Navbar className="navbar" bg="warning" variant="primary">
                <Container className="navbarContainer">
                    <Navbar.Brand className="brand">Feature Flicks</Navbar.Brand>
                    <Nav className="me-auto">
                        <Link className="nav-link" Link to="/home">Home</Link>
                        <Link className="nav-link" Link to="/screenings">Screenings</Link>
                    </Nav>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}

export default NavbarComponent;