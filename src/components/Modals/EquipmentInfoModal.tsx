import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, FormCheck, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import EmployeeListDto from "../../models/employees/employeeListDto";
import EquipmentDto from "../../models/equipments/equipmentDto";
import ErrorResponse from "../../models/errorResponse";
import PageResponse from "../../models/pageResponse";

import EmployeeEquipmentService from "../../services/employeeEquipmentService";
import EmployeeService from "../../services/employeeService";
import EquipmentService from "../../services/equipmentService";

import CustomSpinner from "../CustomSpinner";

const EquipmentInfoModal = (props: Props) => {
  const [equipment, setEquipment] = useState<EquipmentDto>(null);
  const [equipmentLoaded, setEquipmentLoaded] = useState<boolean>(false);
  const [employees, setEmployees] = useState<PageResponse<EmployeeListDto>>(null);
  const [employeesLoaded, setEmployeesLoaded] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [employeeEquipments, setEmployeeEquipments] = useState<number[]>([]);

  const equipmentService = new EquipmentService();
  const employeeService = new EmployeeService();
  const employeeEquipmentService = new EmployeeEquipmentService();

  useEffect(() => {
    employeeService
      .getList()
      .then((response) => {
        const resData = response.data;
        setEmployees(resData);
      })
      .then(() => {
        employeeEquipmentService
          .getListByEquipmentId(props.selectedEquipmentId)
          .then((response) => {
            const resData = response.data;
            setEmployeeEquipments(resData.items.map((c) => c.employeeId));
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
      });

    return () => {
      equipmentService.cancelToken.cancel();
      employeeService.cancelToken.cancel();
      employeeEquipmentService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (props.show && !equipmentLoaded) {
      equipmentService
        .getById(props.selectedEquipmentId)
        .then((response) => {
          const resData = response.data;
          setEquipment(resData);
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        })
        .finally(() => setEquipmentLoaded(true));
    }
  }, [props.show]);

  useEffect(() => {
    if (equipmentLoaded && employeesLoaded) {
      setDataLoaded(true);
    } else {
      setDataLoaded(false);
    }
  }, [equipmentLoaded, employeesLoaded]);

  const handleClose = () => {
    props.setShow(false);
    setTimeout(() => {
      props.setSelectedEquipmentId(0);
    }, 200);
  };

  return (
    <Modal show={props.show} onHide={handleClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Equipment Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {dataLoaded ? (
            <>
              <FormGroup className="mb-3" controlId="formBasicEquipment">
                <FormLabel>Name</FormLabel>
                <FormControl value={equipment?.name} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicUnitsInStock">
                <FormLabel>Units In Stock</FormLabel>
                <FormControl value={equipment?.unitsInStock} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicUnitsInRemaining">
                <FormLabel>Units In Remaining</FormLabel>
                <FormControl value={equipment?.unitsInRemaining} readOnly />
              </FormGroup>
              <label className="mb-1">Employees</label>
              <div className="row mb-3">
                {employees?.items.map((employee) => (
                  <div key={employee.id} className="col m-1">
                    <FormCheck
                      label={employee.firstName + " " + employee.lastName}
                      id={"formCheckEquipment-" + employee.id}
                      checked={employeeEquipments?.includes(employee.id)}
                      readOnly
                    />
                  </div>
                ))}
              </div>
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

export default EquipmentInfoModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedEquipmentId: number;
  setSelectedEquipmentId: Function;
}
