import { faInfoCircle, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import { useAppDispatch } from "../hooks/useAppDispatch";

import { hideNotification, showNotification } from "../store/slices/notificationSlice";

import CreatedEquipmentDto from "../models/equipments/createdEquipmentDto";
import EquipmentListDto from "../models/equipments/equipmentListDto";
import UpdatedEquipmentDto from "../models/equipments/updatedEquipmentDto";
import ErrorResponse from "../models/errorResponse";
import OrderValue from "../models/orderValue";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";
import PageSizeValue from "../models/pageSizeValue";

import EquipmentService from "../services/equipmentService";

import CustomPageInfo from "../components/CustomPageInfo";
import CustomPagination from "../components/CustomPagination";
import CustomSearchInput from "../components/CustomSearchInput";
import CustomSpinner from "../components/CustomSpinner";
import CustomTHeadItem from "../components/CustomTHeadItem";
import EquipmentAddModal from "../components/Modals/EquipmentAddModal";
import EquipmentInfoModal from "../components/Modals/EquipmentInfoModal";
import EquipmentUpdateModal from "../components/Modals/EquipmentUpdateModal";

const Equipments = () => {
  const pageSizeValues: PageSizeValue[] = require("../jsons/pageSizeValues.json");

  const dispatch = useAppDispatch();

  const [equipments, setEquipments] = useState<PageResponse<EquipmentListDto>>(null);
  const [equipmentsLoaded, setEquipmentsLoaded] = useState<boolean>(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number>(0);
  const [showEquipmentInfoModal, setShowEquipmentInfoModal] = useState<boolean>(false);
  const [showEquipmentAddModal, setShowEquipmentAddModal] = useState<boolean>(false);
  const [showEquipmentUpdateModal, setShowEquipmentUpdateModal] = useState<boolean>(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, pageSize: pageSizeValues[0].value });
  const [orderValue, setOrderValue] = useState<OrderValue>({ orderBy: "id", order: "asc" });
  const [searchValue, setSearchValue] = useState<string>("");

  const equipmentService = new EquipmentService();

  useEffect(() => {
    return () => {
      equipmentService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    setEquipmentsLoaded(false);

    equipmentService
      .getList(pageRequest)
      .then((response) => {
        const resData = response.data;
        setEquipments(resData);
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      })
      .finally(() => setEquipmentsLoaded(true));
  }, [pageRequest]);

  useEffect(() => {
    if (equipmentsLoaded) {
      new Promise((resolve) => {
        const tempList = equipments.items;

        if (orderValue.orderBy === "id") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.id - b.id);
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.id - a.id);
          }
        } else if (orderValue.orderBy === "equipment") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.name.localeCompare(b.name));
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.name.localeCompare(a.name));
          }
        } else if (orderValue.orderBy === "unitsInStock") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.unitsInStock - b.unitsInStock);
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.unitsInStock - a.unitsInStock);
          }
        } else if (orderValue.orderBy === "unitsInRemaining") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.unitsInRemaining - b.unitsInRemaining);
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.unitsInRemaining - a.unitsInRemaining);
          }
        }

        resolve(tempList);
      }).then((items: any) => {
        setEquipments({ ...equipments, items });
      });
    }
  }, [orderValue, equipmentsLoaded]);

  const handleClickAddButton = () => setShowEquipmentAddModal(true);

  const handleClickInfoButton = (id: number) => {
    setSelectedEquipmentId(id);
    setShowEquipmentInfoModal(true);
  };

  const handleClickUpdateButton = (id: number) => {
    setSelectedEquipmentId(id);
    setShowEquipmentUpdateModal(true);
  };

  const handleClickDeleteButton = (id: number) => {
    dispatch(
      showNotification({
        title: "Delete " + "#" + id,
        description: "Are you sure you want to delete this equipment?",
        buttons: [
          {
            text: "Cancel",
            variant: "secondary",
            handleClick: () => dispatch(hideNotification()),
          },
          {
            text: "Delete",
            variant: "danger",
            handleClick: () => handleDelete(id).then(() => dispatch(hideNotification())),
          },
        ],
      })
    );
  };

  const handleDelete = (id: number) => {
    return equipmentService
      .delete(id)
      .then((response) => {
        const resData = response.data;
        deleteEquipmentFromList(resData.id);
        toast.success("Equipment deleted.");
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      });
  };

  const addEquipmentToList = (equipment: CreatedEquipmentDto) =>
    setEquipments({ ...equipments, items: [...equipments.items, equipment] });

  const updateEquipmentOnList = (equipment: UpdatedEquipmentDto) => {
    const currentEquipment = equipments.items.find((c) => c.id === equipment.id);
    currentEquipment.name = equipment.name;
    currentEquipment.unitsInStock = equipment.unitsInStock;
    currentEquipment.unitsInRemaining = equipment.unitsInRemaining;
    setEquipments(equipments);
  };

  const deleteEquipmentFromList = (id: number) =>
    setEquipments({ ...equipments, items: [...equipments.items.filter((c) => c.id !== id)] });

  const setPage = (page: number) => setPageRequest({ ...pageRequest, page: page });

  const setPageSize = (size: number) => setPageRequest({ page: 0, pageSize: size });

  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const setOrder = (value: string) => {
    if (orderValue.orderBy === value) {
      if (orderValue.order === "asc") {
        setOrderValue({ ...orderValue, order: "desc" });
      } else {
        setOrderValue({ ...orderValue, order: "asc" });
      }
    } else {
      setOrderValue({ orderBy: value, order: "asc" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Equipments</title>
      </Helmet>
      {selectedEquipmentId !== 0 && (
        <>
          <EquipmentInfoModal
            show={showEquipmentInfoModal}
            setShow={setShowEquipmentInfoModal}
            selectedEquipmentId={selectedEquipmentId}
            setSelectedEquipmentId={setSelectedEquipmentId}
          />
          <EquipmentUpdateModal
            show={showEquipmentUpdateModal}
            setShow={setShowEquipmentUpdateModal}
            selectedEquipmentId={selectedEquipmentId}
            setSelectedEquipmentId={setSelectedEquipmentId}
            updateEquipmentOnList={updateEquipmentOnList}
          />
        </>
      )}
      <EquipmentAddModal
        show={showEquipmentAddModal}
        setShow={setShowEquipmentAddModal}
        addEquipmentToList={addEquipmentToList}
      />
      <Container className="my-5">
        <Row>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <h3 className="text-inline">Equipments</h3>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-end">
            <Button variant="success" onClick={handleClickAddButton}>
              Add
            </Button>
          </Col>
        </Row>
        <hr />
        {equipmentsLoaded ? (
          <>
            <CustomSearchInput
              setPageSize={setPageSize}
              searchValue={searchValue}
              pageSize={pageRequest.pageSize}
              handleChangeSearchInput={handleChangeSearchInput}
            />
            <Table striped>
              <thead>
                <tr>
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"#"} value={"id"} />
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Name"} value={"equipment"} />
                  <CustomTHeadItem
                    orderValue={orderValue}
                    setOrder={setOrder}
                    title={"Units In Stock"}
                    value={"unitsInStock"}
                  />
                  <CustomTHeadItem
                    orderValue={orderValue}
                    setOrder={setOrder}
                    title={"Units In Remaining"}
                    value={"unitsInRemaining"}
                  />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {equipments?.items
                  .filter((c) => c.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                  .map((equipment) => (
                    <tr key={equipment.id}>
                      <td>{equipment.id}</td>
                      <td>{equipment.name}</td>
                      <td>{equipment.unitsInStock}</td>
                      <td>{equipment.unitsInRemaining}</td>
                      <td className="text-end">
                        <Button
                          className="btn-sm"
                          variant="primary"
                          onClick={() => handleClickInfoButton(equipment.id)}
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>{" "}
                        <Button
                          className="btn-sm text-white"
                          variant="warning"
                          onClick={() => handleClickUpdateButton(equipment.id)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>{" "}
                        <Button
                          className="btn-sm"
                          variant="danger"
                          onClick={() => handleClickDeleteButton(equipment.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {equipments && <CustomPageInfo pageResponse={equipments} />}
            {equipments && <CustomPagination data={equipments} setPage={setPage} />}
          </>
        ) : (
          <CustomSpinner />
        )}
      </Container>
    </>
  );
};

export default Equipments;
