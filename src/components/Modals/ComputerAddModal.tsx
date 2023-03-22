import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, FormSelect, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import CreateComputerDto from "../../models/computers/createComputerDto";
import EmployeeListDto from "../../models/employees/employeeListDto";
import ErrorResponse from "../../models/errorResponse";
import PageResponse from "../../models/pageResponse";

import ComputerService from "../../services/computerService";
import EmployeeService from "../../services/employeeService";

import CustomSpinner from "../CustomSpinner";

const ComputerAddModal = (props: Props) => {
  const defaultComputer: CreateComputerDto = {
    employeeId: null,
    brand: "",
    processor: null,
    memory: null,
    licenceKey: null,
    note: null,
  };

  const [computer, setComputer] = useState<CreateComputerDto>(defaultComputer);
  const [employees, setEmployees] = useState<PageResponse<EmployeeListDto>>(null);
  const [employeesLoaded, setEmployeesLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const computerService = new ComputerService();
  const employeeService = new EmployeeService();

  useEffect(() => {
    return () => {
      computerService.cancelToken.cancel();
      employeeService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (props.show && !employeesLoaded) {
      employeeService
        .getList()
        .then((response) => {
          const resData = response.data;
          setEmployees(resData);
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        })
        .finally(() => setEmployeesLoaded(true));
    }
  }, [props.show]);

  const handleSubmit = () => {
    setLoading(true);

    computerService
      .add(computer)
      .then((response) => {
        const resData = response.data;
        const employee = employees?.items.find((c) => c.id == computer.employeeId);
        resData.employeeFirstName = employee?.firstName;
        resData.employeeLastName = employee?.lastName;
        props.addComputerToList(resData);
        toast.success("Computer added.");
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
    setComputer({ ...defaultComputer });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setComputer({ ...computer, [e.currentTarget.name]: e.currentTarget.value });

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setComputer({ ...computer, [e.currentTarget.name]: e.currentTarget.value });

  const validationSchema = Yup.object({
    brand: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
  });

  return (
    <Modal show={props.show} onHide={!loading && handleClose} backdrop="static" keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add Computer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {employeesLoaded ? (
            <Formik
              initialValues={computer}
              onSubmit={handleSubmit}
              enableReinitialize
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors }) => (
                <Form id="computerAddForm">
                  <FormGroup className="mb-3" controlId="formBasicEmployeeId">
                    <FormLabel>Employee</FormLabel>
                    <FormSelect name="employeeId" value={computer?.employeeId ?? 0} onChange={handleChangeSelect}>
                      <option value={0}>No</option>
                      {employees?.items.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.firstName + " " + employee.lastName}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="formBasicBrand">
                    <FormLabel>Brand</FormLabel>
                    <FormControl
                      placeholder="Enter Brand"
                      name="brand"
                      value={computer?.brand}
                      onChange={handleChangeInput}
                    />
                    {errors.brand && <small className="text-danger">{errors.brand}</small>}
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="formBasicProcessor">
                    <FormLabel>Processor</FormLabel>
                    <FormControl
                      placeholder="Enter Processor"
                      name="processor"
                      value={computer?.processor ?? ""}
                      onChange={handleChangeInput}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="formBasicMemory">
                    <FormLabel>RAM</FormLabel>
                    <FormControl
                      placeholder="Enter RAM"
                      name="memory"
                      value={computer?.memory ?? ""}
                      onChange={handleChangeInput}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="formBasicLicenceKey">
                    <FormLabel>Licence</FormLabel>
                    <FormControl
                      placeholder="Enter Licence"
                      name="licenceKey"
                      value={computer?.licenceKey ?? ""}
                      onChange={handleChangeInput}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="formBasicComputerNote">
                    <FormLabel>Note</FormLabel>
                    <FormControl
                      as={"textarea"}
                      rows={3}
                      placeholder="Enter Note"
                      name="note"
                      value={computer?.note ?? ""}
                      onChange={handleChangeInput}
                    />
                  </FormGroup>
                </Form>
              )}
            </Formik>
          ) : (
            <CustomSpinner />
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading || !employeesLoaded}>
          Cancel
        </Button>
        <Button variant="success" type="submit" form="computerAddForm" disabled={loading || !employeesLoaded}>
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComputerAddModal;

interface Props {
  show: boolean;
  setShow: Function;
  addComputerToList: Function;
}
