import { faInfoCircle, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import { useAppDispatch } from "../hooks/useAppDispatch";

import { hideNotification, showNotification } from "../store/slices/notificationSlice";

import ComputerListDto from "../models/computers/computerListDto";
import CreatedComputerDto from "../models/computers/createdComputerDto";
import UpdatedComputerDto from "../models/computers/updatedComputerDto";
import ErrorResponse from "../models/errorResponse";
import OrderValue from "../models/orderValue";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";
import PageSizeValue from "../models/pageSizeValue";

import ComputerService from "../services/computerService";

import CustomPageInfo from "../components/CustomPageInfo";
import CustomPagination from "../components/CustomPagination";
import CustomSearchInput from "../components/CustomSearchInput";
import CustomSpinner from "../components/CustomSpinner";
import CustomTHeadItem from "../components/CustomTHeadItem";
import ComputerAddModal from "../components/Modals/ComputerAddModal";
import ComputerInfoModal from "../components/Modals/ComputerInfoModal";
import ComputerUpdateModal from "../components/Modals/ComputerUpdateModal";

const Computers = () => {
  const pageSizeValues: PageSizeValue[] = require("../jsons/pageSizeValues.json");

  const dispatch = useAppDispatch();

  const [computers, setComputers] = useState<PageResponse<ComputerListDto>>(null);
  const [computersLoaded, setComputersLoaded] = useState<boolean>(false);
  const [selectedComputerId, setSelectedComputerId] = useState<number>(0);
  const [showComputerInfoModal, setShowComputerInfoModal] = useState<boolean>(false);
  const [showComputerAddModal, setShowComputerAddModal] = useState<boolean>(false);
  const [showComputerUpdateModal, setShowComputerUpdateModal] = useState<boolean>(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, pageSize: pageSizeValues[0].value });
  const [orderValue, setOrderValue] = useState<OrderValue>({ orderBy: "id", order: "asc" });
  const [searchValue, setSearchValue] = useState<string>("");

  const computerService = new ComputerService();

  useEffect(() => {
    return () => {
      computerService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    setComputersLoaded(false);

    computerService
      .getList(pageRequest)
      .then((response) => {
        const resData = response.data;
        setComputers(resData);
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      })
      .finally(() => setComputersLoaded(true));
  }, [pageRequest]);

  useEffect(() => {
    if (computersLoaded) {
      new Promise((resolve) => {
        const tempList = computers.items;

        if (orderValue.orderBy === "id") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.id - b.id);
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.id - a.id);
          }
        } else if (orderValue.orderBy === "computer") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.brand.localeCompare(b.brand));
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.brand.localeCompare(a.brand));
          }
        } else if (orderValue.orderBy === "employee") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) =>
              (a.employeeFirstName + " " + a.employeeLastName).localeCompare(
                b.employeeFirstName + " " + b.employeeLastName
              )
            );
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) =>
              (b.employeeFirstName + " " + b.employeeLastName).localeCompare(
                a.employeeFirstName + " " + a.employeeLastName
              )
            );
          }
        } else if (orderValue.orderBy === "licence") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => {
              const aRes = a.hasLicence ? 1 : 0;
              const bRes = b.hasLicence ? 1 : 0;
              return aRes - bRes;
            });
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => {
              const aRes = a.hasLicence ? 1 : 0;
              const bRes = b.hasLicence ? 1 : 0;
              return bRes - aRes;
            });
          }
        }

        resolve(tempList);
      }).then((items: any) => {
        setComputers({ ...computers, items });
      });
    }
  }, [orderValue, computersLoaded]);

  const handleClickAddButton = () => setShowComputerAddModal(true);

  const handleClickInfoButton = (id: number) => {
    setSelectedComputerId(id);
    setShowComputerInfoModal(true);
  };

  const handleClickUpdateButton = (id: number) => {
    setSelectedComputerId(id);
    setShowComputerUpdateModal(true);
  };

  const handleClickDeleteButton = (id: number) => {
    dispatch(
      showNotification({
        title: "Delete " + "#" + id,
        description: "Are you sure you want to delete this computer?",
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
    return computerService
      .delete(id)
      .then((response) => {
        const resData = response.data;
        deleteComputerFromList(resData.id);
        toast.success("Computer deleted.");
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      });
  };

  const addComputerToList = (computer: CreatedComputerDto) =>
    setComputers({ ...computers, items: [...computers.items, computer] });

  const updateComputerOnList = (computer: UpdatedComputerDto) => {
    const currentComputer = computers.items.find((c) => c.id === computer.id);
    currentComputer.brand = computer.brand;
    currentComputer.employeeFirstName = computer.employeeFirstName;
    currentComputer.employeeLastName = computer.employeeLastName;
    currentComputer.hasLicence = computer.hasLicence;
    setComputers(computers);
  };

  const deleteComputerFromList = (id: number) =>
    setComputers({ ...computers, items: [...computers.items.filter((c) => c.id !== id)] });

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
        <title>Computers</title>
      </Helmet>
      {selectedComputerId !== 0 && (
        <>
          <ComputerInfoModal
            show={showComputerInfoModal}
            setShow={setShowComputerInfoModal}
            selectedComputerId={selectedComputerId}
            setSelectedComputerId={setSelectedComputerId}
          />
          <ComputerUpdateModal
            show={showComputerUpdateModal}
            setShow={setShowComputerUpdateModal}
            selectedComputerId={selectedComputerId}
            setSelectedComputerId={setSelectedComputerId}
            updateComputerOnList={updateComputerOnList}
          />
        </>
      )}
      <ComputerAddModal
        show={showComputerAddModal}
        setShow={setShowComputerAddModal}
        addComputerToList={addComputerToList}
      />
      <Container className="my-5">
        <Row>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <h3 className="text-inline">Computers</h3>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-end">
            <Button variant="success" onClick={handleClickAddButton}>
              Add
            </Button>
          </Col>
        </Row>
        <hr />
        {computersLoaded ? (
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
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Computer"} value={"computer"} />
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Employee"} value={"employee"} />
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Licence"} value={"licence"} />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {computers?.items
                  .filter((c) => c.brand.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                  .map((computer) => (
                    <tr key={computer.id}>
                      <td>{computer.id}</td>
                      <td>{computer.brand}</td>
                      <td>
                        {computer.employeeFirstName && computer.employeeLastName
                          ? computer.employeeFirstName + " " + computer.employeeLastName
                          : ""}
                      </td>
                      <td>{computer.hasLicence ? "Available" : "Unavailable"}</td>
                      <td className="text-end">
                        <Button className="btn-sm" variant="primary" onClick={() => handleClickInfoButton(computer.id)}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>{" "}
                        <Button
                          className="btn-sm text-white"
                          variant="warning"
                          onClick={() => handleClickUpdateButton(computer.id)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>{" "}
                        <Button
                          className="btn-sm"
                          variant="danger"
                          onClick={() => handleClickDeleteButton(computer.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {computers && <CustomPageInfo pageResponse={computers} />}
            {computers && <CustomPagination data={computers} setPage={setPage} />}
          </>
        ) : (
          <CustomSpinner />
        )}
      </Container>
    </>
  );
};

export default Computers;
