import moment from "moment";
import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link to={"/"}>
          <Navbar.Brand>Fy Office</Navbar.Brand>
        </Link>
        <Navbar.Text>All rights reserved. | Fy Office © {moment().get("years")}</Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;
