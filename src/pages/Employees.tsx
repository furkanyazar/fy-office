import { faInfoCircle, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import { useAppDispatch } from "../hooks/useAppDispatch";

import { hideNotification, showNotification } from "../store/slices/notificationSlice";

import CreatedEmployeeDto from "../models/employees/createdEmployeeDto";
import EmployeeListDto from "../models/employees/employeeListDto";
import UpdatedEmployeeDto from "../models/employees/updatedEmployeeDto";
import ErrorResponse from "../models/errorResponse";
import OrderValue from "../models/orderValue";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";
import PageSizeValue from "../models/pageSizeValue";

import EmployeeService from "../services/employeeService";

import CustomPageInfo from "../components/CustomPageInfo";
import CustomPagination from "../components/CustomPagination";
import CustomSearchInput from "../components/CustomSearchInput";
import CustomSpinner from "../components/CustomSpinner";
import CustomTHeadItem from "../components/CustomTHeadItem";
import EmployeeAddModal from "../components/Modals/EmployeeAddModal";
import EmployeeInfoModal from "../components/Modals/EmployeeInfoModal";
import EmployeeUpdateModal from "../components/Modals/EmployeeUpdateModal";

const Employees = () => {
  const pageSizeValues: PageSizeValue[] = require("../jsons/pageSizeValues.json");

  const dispatch = useAppDispatch();

  const [employees, setEmployees] = useState<PageResponse<EmployeeListDto>>(null);
  const [employeesLoaded, setEmployeesLoaded] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);
  const [showEmployeeInfoModal, setShowEmployeeInfoModal] = useState<boolean>(false);
  const [showEmployeeAddModal, setShowEmployeeAddModal] = useState<boolean>(false);
  const [showEmployeeUpdateModal, setShowEmployeeUpdateModal] = useState<boolean>(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, pageSize: pageSizeValues[0].value });
  const [orderValue, setOrderValue] = useState<OrderValue>({ orderBy: "id", order: "asc" });
  const [searchValue, setSearchValue] = useState<string>("");

  const employeeService = new EmployeeService();

  useEffect(() => {
    return () => {
      employeeService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    setEmployeesLoaded(false);

    employeeService
      .getList(pageRequest)
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
  }, [pageRequest]);

  useEffect(() => {
    if (employeesLoaded) {
      new Promise((resolve) => {
        const tempList = employees.items;

        if (orderValue.orderBy === "id") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.id - b.id);
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.id - a.id);
          }
        } else if (orderValue.orderBy === "fullName") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => (a.firstName + " " + a.lastName).localeCompare(b.firstName + " " + b.lastName));
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => (b.firstName + " " + b.lastName).localeCompare(a.firstName + " " + a.lastName));
          }
        } else if (orderValue.orderBy === "phoneNumber") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => {
              if (!a.phoneNumber) a.phoneNumber = "";
              if (!b.phoneNumber) b.phoneNumber = "";
              return a.phoneNumber.localeCompare(b.phoneNumber);
            });
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => {
              if (!a.phoneNumber) a.phoneNumber = "";
              if (!b.phoneNumber) b.phoneNumber = "";
              return b.phoneNumber.localeCompare(a.phoneNumber);
            });
          }
        } else if (orderValue.orderBy === "dateOfBirth") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => {
              let aDate = "";
              let bDate = "";

              if (a.dateOfBirth) {
                const dates = a.dateOfBirth.split(".");
                aDate = dates[1] + "-" + dates[0];
              }

              if (b.dateOfBirth) {
                const dates = b.dateOfBirth.split(".");
                bDate = dates[1] + "-" + dates[0];
              }

              return aDate.localeCompare(bDate);
            });
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => {
              let aDate = "";
              let bDate = "";

              if (a.dateOfBirth) {
                const dates = a.dateOfBirth.split(".");
                aDate = dates[1] + "-" + dates[0];
              }

              if (b.dateOfBirth) {
                const dates = b.dateOfBirth.split(".");
                bDate = dates[1] + "-" + dates[0];
              }

              return bDate.localeCompare(aDate);
            });
          }
        }

        resolve(tempList);
      }).then((items: any) => {
        setEmployees({ ...employees, items });
      });
    }
  }, [orderValue, employeesLoaded]);

  const handleClickAddButton = () => setShowEmployeeAddModal(true);

  const handleClickInfoButton = (id: number) => {
    setSelectedEmployeeId(id);
    setShowEmployeeInfoModal(true);
  };

  const handleClickUpdateButton = (id: number) => {
    setSelectedEmployeeId(id);
    setShowEmployeeUpdateModal(true);
  };

  const handleClickDeleteButton = (id: number) => {
    dispatch(
      showNotification({
        title: "Delete " + "#" + id,
        description: "Are you sure you want to delete this employee?",
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
    return employeeService
      .delete(id)
      .then((response) => {
        const resData = response.data;
        deleteEmployeeFromList(resData.id);
        toast.success("Employee deleted.");
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      });
  };

  const addEmployeeToList = (employee: CreatedEmployeeDto) =>
    setEmployees({ ...employees, items: [...employees.items, employee] });

  const updateEmployeeOnList = (employee: UpdatedEmployeeDto) => {
    const currentEmployee = employees.items.find((c) => c.id === employee.id);
    currentEmployee.firstName = employee.firstName;
    currentEmployee.lastName = employee.lastName;
    currentEmployee.phoneNumber = employee.phoneNumber;
    currentEmployee.dateOfBirth = employee.dateOfBirth;
    setEmployees(employees);
  };

  const deleteEmployeeFromList = (id: number) =>
    setEmployees({ ...employees, items: [...employees.items.filter((c) => c.id !== id)] });

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
        <title>Employees</title>
      </Helmet>
      {selectedEmployeeId !== 0 && (
        <>
          <EmployeeInfoModal
            show={showEmployeeInfoModal}
            setShow={setShowEmployeeInfoModal}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
          />
          <EmployeeUpdateModal
            show={showEmployeeUpdateModal}
            setShow={setShowEmployeeUpdateModal}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            updateEmployeeOnList={updateEmployeeOnList}
          />
        </>
      )}
      <EmployeeAddModal
        show={showEmployeeAddModal}
        setShow={setShowEmployeeAddModal}
        addEmployeeToList={addEmployeeToList}
      />
      <Container className="my-5">
        <Row>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <h3 className="text-inline">Employees</h3>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-end">
            <Button className="" variant="success" onClick={handleClickAddButton}>
              Add
            </Button>
          </Col>
        </Row>
        <hr />
        {employeesLoaded ? (
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
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Full Name"} value={"fullName"} />
                  <CustomTHeadItem
                    orderValue={orderValue}
                    setOrder={setOrder}
                    title={"Phone Number"}
                    value={"phoneNumber"}
                  />
                  <CustomTHeadItem
                    orderValue={orderValue}
                    setOrder={setOrder}
                    title={"Date Of Birth"}
                    value={"dateOfBirth"}
                  />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees?.items
                  .filter((c) =>
                    (c.firstName + c.lastName).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                  )
                  .map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.firstName + " " + employee.lastName}</td>
                      <td>{employee.phoneNumber ?? ""}</td>
                      <td>{employee.dateOfBirth ?? ""}</td>
                      <td className="text-end">
                        <Button className="btn-sm" variant="primary" onClick={() => handleClickInfoButton(employee.id)}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>{" "}
                        <Button
                          className="btn-sm text-white"
                          variant="warning"
                          onClick={() => handleClickUpdateButton(employee.id)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>{" "}
                        <Button
                          className="btn-sm"
                          variant="danger"
                          onClick={() => handleClickDeleteButton(employee.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {employees && <CustomPageInfo pageResponse={employees} />}
            {employees && <CustomPagination data={employees} setPage={setPage} />}
          </>
        ) : (
          <CustomSpinner />
        )}
      </Container>
    </>
  );
};

export default Employees;
