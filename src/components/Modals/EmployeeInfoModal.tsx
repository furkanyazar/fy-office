import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, FormCheck, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import EmployeeDto from "../../models/employees/employeeDto";
import EquipmentListDto from "../../models/equipments/equipmentListDto";
import ErrorResponse from "../../models/errorResponse";
import PageResponse from "../../models/pageResponse";

import EmployeeEquipmentService from "../../services/employeeEquipmentService";
import EmployeeService from "../../services/employeeService";
import EquipmentService from "../../services/equipmentService";

import CustomSpinner from "../CustomSpinner";

const EmployeeInfoModal = (props: Props) => {
  const [employee, setEmployee] = useState<EmployeeDto>(null);
  const [employeeLoaded, setEmployeeLoaded] = useState<boolean>(false);
  const [equipments, setEquipments] = useState<PageResponse<EquipmentListDto>>(null);
  const [equipmentsLoaded, setEquipmentsLoaded] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [employeeEquipments, setEmployeeEquipments] = useState<number[]>([]);

  const employeeService = new EmployeeService();
  const equipmentService = new EquipmentService();
  const employeeEquipmentService = new EmployeeEquipmentService();

  useEffect(() => {
    equipmentService
      .getList()
      .then((response) => {
        const resData = response.data;
        setEquipments(resData);
      })
      .then(() => {
        employeeEquipmentService
          .getListByEmployeeId(props.selectedEmployeeId)
          .then((response) => {
            const resData = response.data;
            setEmployeeEquipments(resData.items.map((c) => c.equipmentId));
          })
          .catch((errorResponse) => {
            if (!axios.isCancel(errorResponse)) {
              const errorResData: ErrorResponse = errorResponse.response.data;
              toast.error(errorResData.Detail);
            }
          })
          .finally(() => setEquipmentsLoaded(true));
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      });

    return () => {
      employeeService.cancelToken.cancel();
      equipmentService.cancelToken.cancel();
      employeeEquipmentService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (props.show && !employee) {
      employeeService
        .getById(props.selectedEmployeeId)
        .then((response) => {
          const resData = response.data;
          setEmployee(resData);
        })
        .catch((errorResponse) => {
          if (!axios.isCancel(errorResponse)) {
            const errorResData: ErrorResponse = errorResponse.response.data;
            toast.error(errorResData.Detail);
          }
        })
        .finally(() => setEmployeeLoaded(true));
    }
  }, [props.show]);

  useEffect(() => {
    if (employeeLoaded && equipmentsLoaded) {
      setDataLoaded(true);
    } else {
      setDataLoaded(false);
    }
  }, [employeeLoaded, equipmentsLoaded]);

  const handleClose = () => {
    props.setShow(false);
    setTimeout(() => {
      props.setSelectedEmployeeId(0);
    }, 200);
  };

  return (
    <Modal show={props.show} onHide={handleClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Employee Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {dataLoaded ? (
            <>
              <FormGroup className="mb-3" controlId="formBasicFullName">
                <FormLabel>Full Name</FormLabel>
                <FormControl value={employee?.firstName + " " + employee?.lastName} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicPhoneNumber">
                <FormLabel>Phone Number</FormLabel>
                <FormControl value={employee?.phoneNumber ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicDateOfBirth">
                <FormLabel>Date Of Birth</FormLabel>
                <FormControl value={employee?.dateOfBirth ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicComputerBrand">
                <FormLabel>Computer</FormLabel>
                <FormControl value={employee?.computerBrand ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicComputerHasLicence">
                <FormLabel>Licence</FormLabel>
                <FormControl value={employee?.computerHasLicence ? "Var" : "Yok"} readOnly />
              </FormGroup>
              <label className="mb-1">Equipments</label>
              <div className="row mb-3">
                {equipments?.items.map((equipment) => (
                  <div key={equipment.id} className="col m-1">
                    <FormCheck
                      label={equipment.name}
                      id={"formCheckEmployee-" + equipment.id}
                      checked={employeeEquipments?.includes(equipment.id)}
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

export default EmployeeInfoModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedEmployeeId: number;
  setSelectedEmployeeId: Function;
}
