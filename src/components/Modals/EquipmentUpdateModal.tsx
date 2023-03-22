import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormCheck, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationMinCount, ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import EmployeeListDto from "../../models/employees/employeeListDto";
import UpdateEquipmentDto from "../../models/equipments/updateEquipmentDto";
import ErrorResponse from "../../models/errorResponse";
import PageResponse from "../../models/pageResponse";

import EmployeeEquipmentService from "../../services/employeeEquipmentService";
import EmployeeService from "../../services/employeeService";
import EquipmentService from "../../services/equipmentService";

import CustomSpinner from "../CustomSpinner";

const EquipmentUpdateModal = (props: Props) => {
  const [equipment, setEquipment] = useState<UpdateEquipmentDto>(null);
  const [equipmentLoaded, setEquipmentLoaded] = useState<boolean>(false);
  const [employees, setEmployees] = useState<PageResponse<EmployeeListDto>>(null);
  const [employeesLoaded, setEmployeesLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const equipmentService = new EquipmentService();
  const employeeEquipmentService = new EmployeeEquipmentService();
  const employeeService = new EmployeeService();

  useEffect(() => {
    return () => {
      equipmentService.cancelToken.cancel();
      employeeEquipmentService.cancelToken.cancel();
      employeeService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (props.show && !equipmentLoaded) {
      employeeService
        .getList()
        .then((response) => {
          const resData = response.data;
          return setEmployees(resData);
        })
        .then(() => {
          equipmentService
            .getById(props.selectedEquipmentId)
            .then((response) => {
              const resData = response.data;
              return resData;
            })
            .then((equipmentDto) => {
              employeeEquipmentService
                .getListByEquipmentId(props.selectedEquipmentId)
                .then((response) => {
                  const resData = response.data;
                  const model: UpdateEquipmentDto = {
                    ...equipmentDto,
                    employees: resData.items.map((c) => c.employeeId),
                  };
                  setEquipment(model);
                })
                .catch((errorResponse) => {
                  if (!axios.isCancel(errorResponse)) {
                    const errorResData: ErrorResponse = errorResponse.response.data;
                    toast.error(errorResData.Detail);
                  }
                })
                .finally(() => setEmployeesLoaded(true));
            })
            .catch((errorResponse) => {
              if (!axios.isCancel(errorResponse)) {
                const errorResData: ErrorResponse = errorResponse.response.data;
                toast.error(errorResData.Detail);
              }
            })
            .finally(() => setEquipmentLoaded(true));
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        });
    }
  }, [props.show]);

  useEffect(() => {
    if (equipmentLoaded && employeesLoaded) {
      setDataLoaded(true);
    } else {
      setDataLoaded(false);
    }
  }, [equipmentLoaded, employeesLoaded]);

  useEffect(() => {
    if (dataLoaded && equipment?.employees.length > 0) {
      if (equipment?.unitsInStock < equipment?.employees.length) {
        setEquipment({ ...equipment, unitsInStock: ++equipment.unitsInStock });
      }
    }
  }, [equipment]);

  const handleSubmit = () => {
    setLoading(true);

    equipmentService
      .update(equipment)
      .then((response) => {
        const resData = response.data;
        props.updateEquipmentOnList(resData);
        toast.success("Equipment updated.");
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
      props.setSelectedEquipmentId(0);
    }, 200);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEquipment({ ...equipment, [e.currentTarget.name]: e.currentTarget.value });

  const handleChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const model = { ...equipment };
      model.employees.push(parseInt(e.target.value));
      setEquipment(model);
    } else {
      const model = { ...equipment };
      model.employees = equipment.employees.filter((c) => c !== parseInt(e.target.value));
      setEquipment(model);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    unitsInStock: Yup.number().required(ValidationRequired).min(0, ValidationMinCount),
  });

  return (
    <Modal show={props.show} onHide={!loading && handleClose} backdrop="static" keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Update Equipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {dataLoaded ? (
            <Formik
              initialValues={equipment}
              onSubmit={handleSubmit}
              enableReinitialize
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors }) => (
                <Form id="equipmentUpdateForm">
                  <FormGroup className="mb-3" controlId="formBasicEquipmentName">
                    <FormLabel>Name</FormLabel>
                    <FormControl
                      placeholder="Enter Name"
                      name="name"
                      value={equipment?.name}
                      onChange={handleChangeInput}
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="formBasicUnitsInStock">
                    <FormLabel>Units In Stock</FormLabel>
                    <FormControl
                      type="number"
                      placeholder="Enter Units In Stock"
                      name="unitsInStock"
                      value={equipment?.unitsInStock}
                      onChange={handleChangeInput}
                    />
                    {errors.unitsInStock && <small className="text-danger">{errors.unitsInStock}</small>}
                  </FormGroup>
                  <label className="mb-1">Employees</label>
                  <div className="row mb-3">
                    {employees.items.map((employee) => (
                      <div key={employee.id} className="col m-1">
                        <FormCheck
                          label={employee.firstName + " " + employee.lastName}
                          id={"formCheckEquipment-" + employee.id}
                          value={employee.id}
                          checked={equipment?.employees.includes(employee.id)}
                          onChange={handleChangeCheck}
                          disabled={
                            !equipment?.employees.includes(employee.id) &&
                            equipment?.employees.length >= equipment?.unitsInStock
                          }
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
          form="equipmentUpdateForm"
          className="text-white"
          disabled={loading || !dataLoaded}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EquipmentUpdateModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedEquipmentId: number;
  setSelectedEquipmentId: Function;
  updateEquipmentOnList: Function;
}
