import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationEmail, ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import ErrorResponse from "../../models/errorResponse";
import CreateUserDto from "../../models/users/createUserDto";

import UserService from "../../services/userService";

const UserAddModal = (props: Props) => {
  const defaultUser: CreateUserDto = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const [user, setUser] = useState<CreateUserDto>(defaultUser);
  const [loading, setLoading] = useState<boolean>(false);

  const userService = new UserService();

  useEffect(() => {
    return () => {
      userService.cancelToken.cancel();
    };
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    userService
      .add(user)
      .then((response) => {
        const resData = response.data;
        props.addUserToList(resData);
        toast.success("User added.");
        handleClose();
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    props.setShow(false);
    setUser({ ...defaultUser });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.currentTarget.name]: e.currentTarget.value });

  const validationSchema = Yup.object({
    firstName: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    lastName: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    email: Yup.string().required(ValidationRequired).email(ValidationEmail),
    password: Yup.string().required(ValidationRequired).min(4, ValidationMinLength),
  });

  return (
    <Modal show={props.show} onHide={!loading && handleClose} backdrop="static" keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Formik
            initialValues={user}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ errors }) => (
              <Form id="userAddForm">
                <FormGroup className="mb-3" controlId="formBasicFirstName">
                  <FormLabel>First Name</FormLabel>
                  <FormControl
                    placeholder="Enter First Name"
                    name="firstName"
                    value={user?.firstName}
                    onChange={handleChangeInput}
                  />
                  {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicLastName">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl
                    placeholder="Enter Last Name"
                    name="lastName"
                    value={user?.lastName}
                    onChange={handleChangeInput}
                  />
                  {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicEmail">
                  <FormLabel>Email</FormLabel>
                  <FormControl
                    placeholder="Enter Email"
                    name="email"
                    value={user?.email}
                    onChange={handleChangeInput}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicPassword">
                  <FormLabel>Password</FormLabel>
                  <FormControl
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    value={user?.password}
                    onChange={handleChangeInput}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </FormGroup>
              </Form>
            )}
          </Formik>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="success" type="submit" form="userAddForm" disabled={loading}>
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserAddModal;

interface Props {
  show: boolean;
  setShow: Function;
  addUserToList: Function;
}
