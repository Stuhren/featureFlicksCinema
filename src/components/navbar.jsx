import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
    return (
        <>
            <Navbar className="navbar" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home" className="brand">Feature Flicks</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#movies">Movies</Nav.Link>
                        <Nav.Link href="#screenings">Screenings</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default ColorSchemesExample;