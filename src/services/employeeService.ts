import axios, { CancelTokenSource } from "axios";

import CreatedEmployeeDto from "../models/employees/createdEmployeeDto";
import CreateEmployeeDto from "../models/employees/createEmployeeDto";
import DeletedEmployeeDto from "../models/employees/deletedEmployeeDto";
import EmployeeDto from "../models/employees/employeeDto";
import EmployeeListDto from "../models/employees/employeeListDto";
import UpdatedEmployeeDto from "../models/employees/updatedEmployeeDto";
import UpdateEmployeeDto from "../models/employees/updateEmployeeDto";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";

class EmployeeService {
  private readonly apiUrl: string;
  public cancelToken: CancelTokenSource;

  constructor() {
    this.apiUrl = process.env.API_URL + "Employees/";
    this.cancelToken = axios.CancelToken.source();
  }

  public getList = (params?: PageRequest) => {
    return axios.get<PageResponse<EmployeeListDto>>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      params,
    });
  };

  public getById = (id: number) => {
    return axios.get<EmployeeDto>(this.apiUrl + id, {
      cancelToken: this.cancelToken.token,
    });
  };

  public delete = (id: number) => {
    return axios.delete<DeletedEmployeeDto>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      data: { id },
    });
  };

  public add = (values: CreateEmployeeDto) => {
    return axios.post<CreatedEmployeeDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };

  public update = (values: UpdateEmployeeDto) => {
    return axios.put<UpdatedEmployeeDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };
}

export default EmployeeService;
