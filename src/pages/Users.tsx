import { faInfoCircle, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

import { hideNotification, showNotification } from "../store/slices/notificationSlice";

import ErrorResponse from "../models/errorResponse";
import OrderValue from "../models/orderValue";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";
import PageSizeValue from "../models/pageSizeValue";
import CreatedUserDto from "../models/users/createdUserDto";
import UpdatedUserDto from "../models/users/updatedUserDto";
import UserListDto from "../models/users/userListDto";

import UserService from "../services/userService";

import CustomPageInfo from "../components/CustomPageInfo";
import CustomPagination from "../components/CustomPagination";
import CustomSearchInput from "../components/CustomSearchInput";
import CustomSpinner from "../components/CustomSpinner";
import CustomTHeadItem from "../components/CustomTHeadItem";
import UserAddModal from "../components/Modals/UserAddModal";
import UserInfoModal from "../components/Modals/UserInfoModal";
import UserUpdateModal from "../components/Modals/UserUpdateModal";

const Users = () => {
  const pageSizeValues: PageSizeValue[] = require("../jsons/pageSizeValues.json");

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.userItems);

  const [users, setUsers] = useState<PageResponse<UserListDto>>(null);
  const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [showUserInfoModal, setShowUserInfoModal] = useState<boolean>(false);
  const [showUserAddModal, setShowUserAddModal] = useState<boolean>(false);
  const [showUserUpdateModal, setShowUserUpdateModal] = useState<boolean>(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, pageSize: pageSizeValues[0].value });
  const [orderValue, setOrderValue] = useState<OrderValue>({ orderBy: "id", order: "asc" });
  const [searchValue, setSearchValue] = useState<string>("");

  const userService = new UserService();

  useEffect(() => {
    return () => {
      userService.cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    setUsersLoaded(false);

    userService
      .getList(pageRequest)
      .then((response) => {
        const resData = response.data;
        setUsers(resData);
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      })
      .finally(() => setUsersLoaded(true));
  }, [pageRequest]);

  useEffect(() => {
    if (usersLoaded) {
      new Promise((resolve) => {
        const tempList = users.items;

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
        } else if (orderValue.orderBy === "email") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => a.email.localeCompare(b.email));
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => b.email.localeCompare(a.email));
          }
        } else if (orderValue.orderBy === "status") {
          if (orderValue.order === "asc") {
            tempList.sort((a, b) => {
              const aRes = a.status ? 1 : 0;
              const bRes = b.status ? 1 : 0;
              return aRes - bRes;
            });
          } else if (orderValue.order === "desc") {
            tempList.sort((a, b) => {
              const aRes = a.status ? 1 : 0;
              const bRes = b.status ? 1 : 0;
              return bRes - aRes;
            });
          }
        }

        resolve(tempList);
      }).then((items: any) => {
        setUsers({ ...users, items });
      });
    }
  }, [orderValue, usersLoaded]);

  const handleClickAddButton = () => setShowUserAddModal(true);

  const handleClickInfoButton = (id: number) => {
    setSelectedUserId(id);
    setShowUserInfoModal(true);
  };

  const handleClickUpdateButton = (id: number) => {
    setSelectedUserId(id);
    setShowUserUpdateModal(true);
  };

  const handleClickDeleteButton = (id: number) => {
    dispatch(
      showNotification({
        title: "Delete " + "#" + id,
        description: "Are you sure you want to delete this user?",
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
    return userService
      .delete(id)
      .then((response) => {
        const resData = response.data;
        deleteUserFromList(resData.id);
        toast.success("User deleted.");
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      });
  };

  const addUserToList = (user: CreatedUserDto) => setUsers({ ...users, items: [...users.items, user] });

  const updateUserOnList = (user: UpdatedUserDto) => {
    const currentUser = users.items.find((c) => c.id === user.id);
    currentUser.firstName = user.firstName;
    currentUser.lastName = user.lastName;
    currentUser.email = user.email;
    currentUser.status = user.status;
    setUsers(users);
  };

  const deleteUserFromList = (id: number) => setUsers({ ...users, items: [...users.items.filter((c) => c.id !== id)] });

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
        <title>Users</title>
      </Helmet>
      {selectedUserId !== 0 && (
        <>
          <UserInfoModal
            show={showUserInfoModal}
            setShow={setShowUserInfoModal}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
          <UserUpdateModal
            show={showUserUpdateModal}
            setShow={setShowUserUpdateModal}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            updateUserOnList={updateUserOnList}
          />
        </>
      )}
      <UserAddModal show={showUserAddModal} setShow={setShowUserAddModal} addUserToList={addUserToList} />
      <Container className="my-5">
        <Row>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <h3 className="text-inline">Users</h3>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-end">
            <Button variant="success" onClick={handleClickAddButton}>
              Add
            </Button>
          </Col>
        </Row>
        <hr />
        {usersLoaded ? (
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
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Email"} value={"email"} />
                  <CustomTHeadItem orderValue={orderValue} setOrder={setOrder} title={"Status"} value={"status"} />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users?.items
                  .filter((c) =>
                    (c.firstName + " " + c.lastName).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                  )
                  .map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.firstName + " " + u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.status ? "Active" : "Passive"}</td>
                      <td className="text-end">
                        <Button className="btn-sm" variant="primary" onClick={() => handleClickInfoButton(u.id)}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>{" "}
                        <Button
                          className="btn-sm text-white"
                          variant="warning"
                          onClick={() => handleClickUpdateButton(u.id)}
                          disabled={u.email === user.email}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>{" "}
                        <Button
                          className="btn-sm"
                          variant="danger"
                          onClick={() => handleClickDeleteButton(u.id)}
                          disabled={u.email === user.email}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {users && <CustomPageInfo pageResponse={users} />}
            {users && <CustomPagination data={users} setPage={setPage} />}
          </>
        ) : (
          <CustomSpinner />
        )}
      </Container>
    </>
  );
};

export default Users;
