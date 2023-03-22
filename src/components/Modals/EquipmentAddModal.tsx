import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { ValidationMinCount, ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";

import CreateEquipmentDto from "../../models/equipments/createEquipmentDto";
import ErrorResponse from "../../models/errorResponse";

import EquipmentService from "../../services/equipmentService";

const EquipmentAddModal = (props: Props) => {
  const defaultEquipment: CreateEquipmentDto = {
    name: "",
    unitsInStock: 0,
  };

  const [equipment, setEquipment] = useState<CreateEquipmentDto>(defaultEquipment);
  const [loading, setLoading] = useState<boolean>(false);

  const equipmentService = new EquipmentService();

  useEffect(() => {
    return () => {
      equipmentService.cancelToken.cancel();
    };
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    equipmentService
      .add(equipment)
      .then((response) => {
        const resData = response.data;
        props.addEquipmentToList(resData);
        toast.success("Equipment added.");
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
    setEquipment({ ...defaultEquipment });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEquipment({ ...equipment, [e.currentTarget.name]: e.currentTarget.value });

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationRequired).min(2, ValidationMinLength),
    unitsInStock: Yup.number().required(ValidationRequired).min(0, ValidationMinCount),
  });

  return (
    <Modal show={props.show} onHide={!loading && handleClose} backdrop="static" keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add Equipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Formik
            initialValues={equipment}
            onSubmit={handleSubmit}
            enableReinitialize
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ errors }) => (
              <Form id="equipmentAddForm">
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
              </Form>
            )}
          </Formik>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="success" type="submit" form="equipmentAddForm" disabled={loading}>
          {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EquipmentAddModal;

interface Props {
  show: boolean;
  setShow: Function;
  addEquipmentToList: Function;
}
