import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

import { hideNotification, showNotification } from "../store/slices/notificationSlice";
import { setUser } from "../store/slices/userSlice";

import AuthService from "../services/authService";

const Header = () => {
  const pathName = useLocation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.userItems);

  const [loading, setLoading] = useState(false);

  const authService = new AuthService();

  useEffect(() => {
    return () => {
      authService.cancelToken.cancel();
    };
  }, []);

  const handleClickLogoutButton = () => {
    dispatch(
      showNotification({
        title: "Logging Out",
        description: "Are you sure you want to logout?",
        buttons: [
          {
            text: "Cancel",
            variant: "secondary",
            handleClick: () => dispatch(hideNotification()),
          },
          {
            text: "Logout",
            variant: "danger",
            handleClick: () => handleLogout(),
          },
        ],
      })
    );
  };

  const handleLogout = () => {
    setLoading(true);

    return authService.revokeToken().finally(() => {
      dispatch(setUser());
      dispatch(hideNotification());
      setLoading(false);
    });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Link to={"/"}>
          <Navbar.Brand>Fy Office</Navbar.Brand>
        </Link>
        {user ? (
          <>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
                <Link to={"/employees"}>
                  <Nav.Link
                    className={(pathName.pathname.startsWith("/employees") || pathName.pathname === "/") && "active"}
                    as={"div"}
                  >
                    Employees
                  </Nav.Link>
                </Link>
                <Link to={"/computers"}>
                  <Nav.Link className={pathName.pathname.startsWith("/computers") && "active"} as={"div"}>
                    Computers
                  </Nav.Link>
                </Link>
                <Link to={"/equipments"}>
                  <Nav.Link className={pathName.pathname.startsWith("/equipments") && "active"} as={"div"}>
                    Equipments
                  </Nav.Link>
                </Link>
                <Link to={"/users"}>
                  <Nav.Link className={pathName.pathname.startsWith("/users") && "active"} as={"div"}>
                    Users
                  </Nav.Link>
                </Link>
              </Nav>
              <Button variant="danger" disabled={loading} onClick={handleClickLogoutButton}>
                {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Logout"}
              </Button>
            </Navbar.Collapse>
          </>
        ) : (
          <Navbar.Text>Welcome</Navbar.Text>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
