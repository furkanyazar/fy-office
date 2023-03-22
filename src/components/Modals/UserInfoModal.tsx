import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import ErrorResponse from "../../models/errorResponse";
import UserDto from "../../models/users/userDto";

import UserService from "../../services/userService";

import CustomSpinner from "../CustomSpinner";

const UserInfoModal = (props: Props) => {
  const [user, setUser] = useState<UserDto>(null);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);

  const userService = new UserService();

  useEffect(() => {
    return () => {
      userService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (props.show && !userLoaded) {
      userService
        .getById(props.selectedUserId)
        .then((response) => {
          const resData = response.data;
          setUser(resData);
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        })
        .finally(() => setUserLoaded(true));
    }
  }, [props.show]);

  const handleClose = () => {
    props.setShow(false);
    setTimeout(() => {
      props.setSelectedUserId(0);
    }, 200);
  };

  return (
    <Modal show={props.show} onHide={handleClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>User Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {userLoaded ? (
            <>
              <FormGroup className="mb-3" controlId="formBasicFullName">
                <FormLabel>Full Name</FormLabel>
                <FormControl value={user?.firstName + " " + user?.lastName} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicEmail">
                <FormLabel>Email</FormLabel>
                <FormControl value={user?.email} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicStatus">
                <FormLabel>Status</FormLabel>
                <FormControl value={user?.status ? "Active" : "Passive"} readOnly />
              </FormGroup>
            </>
          ) : (
            <CustomSpinner />
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfoModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedUserId: number;
  setSelectedUserId: Function;
}
