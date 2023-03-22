import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import CreateEmployeeDto from "../../models/employees/createEmployeeDto";
import ErrorResponse from "../../models/errorResponse";

import EmployeeService from "../../services/employeeService";

const EmployeeAddModal = (props: Props) => {
  const defaultEmployee: CreateEmployeeDto = {
    firstName: "",
    lastName: "",
    phoneNumber: null,
    dateOfBirth: null,
  };

  const [employee, setEmployee] = useState<CreateEmployeeDto>(defaultEmployee);
  const [loading, setLoading] = useState<boolean>(false);

  const employeeService = new EmployeeService();

  useEffect(() => {
    return () => {
      employeeService.cancelToken.cancel();
    };
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    employeeService
      .add(employee)
      .then((response) => {
        const resData = response.data;
        props.addEmployeeToList(resData);
        toast.success("Employee added.");
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
    setEmployee({ ...defaultEmployee });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmployee({ ...employee, [e.currentTarget.name]: e.currentTarget.value });

  const validationSchema = Yup.object({
    firstName: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    lastName: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
  });

  return (
    <Modal show={props.show} onHide={!loading && handleClose} backdrop="static" keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Formik
            initialValues={employee}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ errors }) => (
              <Form id="employeeAddForm">
                <FormGroup className="mb-3" controlId="formBasicFirstName">
                  <FormLabel>First Name</FormLabel>
                  <FormControl
                    placeholder="Enter First Name"
                    name="firstName"
                    value={employee?.firstName}
                    onChange={handleChangeInput}
                  />
                  {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicLastName">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl
                    placeholder="Enter Last Name"
                    name="lastName"
                    value={employee?.lastName}
                    onChange={handleChangeInput}
                  />
                  {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicMemory">
                  <FormLabel>Phone Number</FormLabel>
                  <ReactInputMask
                    className="form-control"
                    mask={"(999) 999-9999"}
                    placeholder="(___) ___-____"
                    name="phoneNumber"
                    value={employee?.phoneNumber ?? ""}
                    onChange={handleChangeInput}
                  />
                </FormGroup>
                <FormGroup className="mb-3" controlId="formBasicLicenceKey">
                  <FormLabel>Date Of Birth</FormLabel>
                  <ReactInputMask
                    className="form-control"
                    mask={"99.99.9999"}
                    placeholder="dd.mm.yyyy"
                    name="dateOfBirth"
                    value={employee?.dateOfBirth ?? ""}
                    onChange={handleChangeInput}
                  />
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
        <Button variant="success" type="submit" form="employeeAddForm" disabled={loading}>
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeAddModal;

interface Props {
  show: boolean;
  setShow: Function;
  addEmployeeToList: Function;
}
