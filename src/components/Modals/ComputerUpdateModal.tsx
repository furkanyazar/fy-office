import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, FormSelect, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import UpdateComputerDto from "../../models/computers/updateComputerDto";
import EmployeeListDto from "../../models/employees/employeeListDto";
import ErrorResponse from "../../models/errorResponse";
import PageResponse from "../../models/pageResponse";

import ComputerService from "../../services/computerService";
import EmployeeService from "../../services/employeeService";

import CustomSpinner from "../CustomSpinner";

const ComputerUpdateModal = (props: Props) => {
  const [computer, setComputer] = useState<UpdateComputerDto>(null);
  const [computerLoaded, setComputerLoaded] = useState<boolean>(false);
  const [employees, setEmployees] = useState<PageResponse<EmployeeListDto>>(null);
  const [employeesLoaded, setEmployeesLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

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

    if (props.show && !computerLoaded) {
      computerService
        .getById(props.selectedComputerId)
        .then((response) => {
          const resData = response.data;
          setComputer(resData);
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        })
        .finally(() => setComputerLoaded(true));
    }
  }, [props.show]);

  useEffect(() => {
    if (computerLoaded && employeesLoaded) {
      setDataLoaded(true);
    } else {
      setDataLoaded(false);
    }
  }, [computerLoaded, employeesLoaded]);

  const handleSubmit = () => {
    setLoading(true);

    computerService
      .update(computer)
      .then((response) => {
        const resData = response.data;
        const employee = employees?.items.find((c) => c.id == computer.employeeId);
        resData.employeeFirstName = employee?.firstName;
        resData.employeeLastName = employee?.lastName;
        props.updateComputerOnList(resData);
        toast.success("Computer updated.");
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
    setTimeout(() => {
      props.setSelectedComputerId(0);
    }, 200);
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
        <Modal.Title>Update Computer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {dataLoaded ? (
            <Formik
              initialValues={computer}
              onSubmit={handleSubmit}
              enableReinitialize
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors }) => (
                <Form id="computerUpdateForm">
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
        <Button variant="secondary" onClick={handleClose} disabled={loading || !dataLoaded}>
          Cancel
        </Button>
        <Button
          variant="warning"
          type="submit"
          form="computerUpdateForm"
          className="text-white"
          disabled={loading || !dataLoaded}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComputerUpdateModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedComputerId: number;
  setSelectedComputerId: Function;
  updateComputerOnList: Function;
}
