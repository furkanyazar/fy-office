import axios, { CancelTokenSource } from "axios";

import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";
import CreatedUserDto from "../models/users/createdUserDto";
import CreateUserDto from "../models/users/createUserDto";
import DeletedUserDto from "../models/users/deletedUserDto";
import UpdatedUserDto from "../models/users/updatedUserDto";
import UpdateUserDto from "../models/users/updateUserDto";
import UserDto from "../models/users/userDto";
import UserListDto from "../models/users/userListDto";

class UserService {
  private readonly apiUrl: string;
  public cancelToken: CancelTokenSource;

  constructor() {
    this.apiUrl = process.env.API_URL + "Users/";
    this.cancelToken = axios.CancelToken.source();
  }

  public getFromAuth = () => {
    return axios.get<UserDto>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
    });
  };

  public getList = (params?: PageRequest) => {
    return axios.get<PageResponse<UserListDto>>(this.apiUrl + "GetList/", {
      cancelToken: this.cancelToken.token,
      params,
    });
  };

  public getById = (id: number) => {
    return axios.get<UserDto>(this.apiUrl + id, {
      cancelToken: this.cancelToken.token,
    });
  };

  public delete = (id: number) => {
    return axios.delete<DeletedUserDto>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      data: { id },
    });
  };

  public add = (values: CreateUserDto) => {
    return axios.post<CreatedUserDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };

  public update = (values: UpdateUserDto) => {
    return axios.put<UpdatedUserDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };
}

export default UserService;
