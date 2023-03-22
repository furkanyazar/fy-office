import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import ComputerDto from "../../models/computers/computerDto";
import ErrorResponse from "../../models/errorResponse";

import ComputerService from "../../services/computerService";

import CustomSpinner from "../CustomSpinner";

const ComputerInfoModal = (props: Props) => {
  const [computer, setComputer] = useState<ComputerDto>(null);
  const [computerLoaded, setComputerLoaded] = useState<boolean>(false);

  const computerService = new ComputerService();

  useEffect(() => {
    return () => {
      computerService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
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

  const handleClose = () => {
    props.setShow(false);
    setTimeout(() => {
      props.setSelectedComputerId(0);
    }, 200);
  };

  return (
    <Modal show={props.show} onHide={handleClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Computer Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {computerLoaded ? (
            <>
              <FormGroup className="mb-3" controlId="formBasicBrand">
                <FormLabel>Brand</FormLabel>
                <FormControl value={computer?.brand ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicProcessor">
                <FormLabel>Processor</FormLabel>
                <FormControl value={computer?.processor ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicMemory">
                <FormLabel>RAM</FormLabel>
                <FormControl value={computer?.memory ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicLicenceKey">
                <FormLabel>Licence</FormLabel>
                <FormControl value={computer?.licenceKey ?? ""} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicComputerNote">
                <FormLabel>Note</FormLabel>
                <FormControl value={computer?.note ?? ""} as={"textarea"} rows={3} readOnly />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formBasicEmployeeFullName">
                <FormLabel>Employee</FormLabel>
                <FormControl
                  value={
                    computer?.employeeFirstName && computer?.employeeLastName
                      ? computer?.employeeFirstName + " " + computer?.employeeLastName
                      : ""
                  }
                  readOnly
                />
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

export default ComputerInfoModal;

interface Props {
  show: boolean;
  setShow: Function;
  selectedComputerId: number;
  setSelectedComputerId: Function;
}
