import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormCheck, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import UpdateEmployeeDto from "../../models/employees/updateEmployeeDto";
import EquipmentListDto from "../../models/equipments/equipmentListDto";
import ErrorResponse from "../../models/errorResponse";
import PageResponse from "../../models/pageResponse";

import EmployeeEquipmentService from "../../services/employeeEquipmentService";
import EmployeeService from "../../services/employeeService";
import EquipmentService from "../../services/equipmentService";

import CustomSpinner from "../CustomSpinner";

const EmployeeUpdateModal = (props: Props) => {
  const [employee, setEmployee] = useState<UpdateEmployeeDto>(null);
  const [employeeLoaded, setEmployeeLoaded] = useState<boolean>(false);
  const [equipments, setEquipments] = useState<PageResponse<EquipmentListDto>>(null);
  const [equipmentsLoaded, setEquipmentsLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const employeeService = new EmployeeService();
  const employeeEquipmentService = new EmployeeEquipmentService();
  const equipmentService = new EquipmentService();

  useEffect(() => {
    return () => {
      employeeService.cancelToken.cancel();
      employeeEquipmentService.cancelToken.cancel();
      equipmentService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (props.show && !employeeLoaded) {
      equipmentService
        .getList()
        .then((response) => {
          const resData = response.data;
          setEquipments(resData);
        })
        .then(() => {
          employeeService
            .getById(props.selectedEmployeeId)
            .then((response) => {
              const resData = response.data;
              return resData;
            })
            .then((employeeDto) => {
              employeeEquipmentService
                .getListByEmployeeId(props.selectedEmployeeId)
                .then((response) => {
                  const resData = response.data;
                  const model: UpdateEmployeeDto = {
                    ...employeeDto,
                    equipments: resData.items.map((c) => c.equipmentId),
                  };
                  setEmployee(model);
                })
                .catch((errorResponse) => {
                  if (!axios.isCancel(errorResponse)) {
                    const errorResData: ErrorResponse = errorResponse.response.data;
                    toast.error(errorResData.Detail);
                  }
                })
                .finally(() => setEmployeeLoaded(true));
            })
            .catch((errorResponse) => {
              if (!axios.isCancel(errorResponse)) {
                const errorResData: ErrorResponse = errorResponse.response.data;
                toast.error(errorResData.Detail);
              }
            });
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        })
        .finally(() => setEquipmentsLoaded(true));
    }
  }, [props.show]);

  useEffect(() => {
    if (employeeLoaded && equipmentsLoaded) {
      setDataLoaded(true);
    } else {
      setDataLoaded(false);
    }
  }, [employeeLoaded, equipmentsLoaded]);

  const handleSubmit = () => {
    setLoading(true);

    employeeService
      .update(employee)
      .then((response) => {
        const resData = response.data;
        props.updateEmployeeOnList(resData);
        toast.success("Employee updated.");
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
      props.setSelectedEmployeeId(0);
    }, 200);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmployee({ ...employee, [e.currentTarget.name]: e.currentTarget.value });

  const handleChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const model = { ...employee };
      model.equipments.push(parseInt(e.target.value));
      setEmployee(model);
    } else {
      const model = { ...employee };
      model.equipments = employee.equipments.filter((c) => c !== parseInt(e.target.value));
      setEmployee(model);
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    lastName: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
  });

  return (
    <Modal show={props.show} onHide={!loading && handleClose} backdrop="static" keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Update Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {dataLoaded ? (
            <Formik
              initialValues={employee}
              onSubmit={handleSubmit}
              enableReinitialize
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors }) => (
                <Form id="employeeUpdateForm">
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
                  <label className="mb-1">Equipments</label>
                  <div className="row mb-3">
                    {equipments?.items.map((equipment) => (
                      <div key={equipment.id} className="col m-1">
                        <FormCheck
                          label={equipment.name}
                          id={"formCheckEmployee-" + equipment.id}
                          value={equipment.id}
                          checked={employee?.equipments.includes(equipment.id)}
                          onChange={handleChangeCheck}
                          disabled={!employee?.equipments.includes(equipment.id) && equipment.unitsInRemaining === 0}
                        />
                      </div>
                    ))}
                  </div>
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
          form="employeeUpdateForm"
          className="text-white"
          disabled={loading || !dataLoaded}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeUpdateModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedEmployeeId: number;
  setSelectedEmployeeId: Function;
  updateEmployeeOnList: Function;
}
