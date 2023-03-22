import axios, { CancelTokenSource } from "axios";

import EmployeeEquipmentListDto from "../models/employeeEquipments/employeeEquipmentListDto";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";

class EmployeeEquipmentService {
  private readonly apiUrl: string;
  public cancelToken: CancelTokenSource;

  constructor() {
    this.apiUrl = process.env.API_URL + "EmployeeEquipments/";
    this.cancelToken = axios.CancelToken.source();
  }

  public getListByEmployeeId = (employeeId: number, params?: PageRequest) => {
    return axios.get<PageResponse<EmployeeEquipmentListDto>>(this.apiUrl + employeeId, {
      cancelToken: this.cancelToken.token,
      params,
    });
  };

  public getListByEquipmentId = (equipmentId: number, params?: PageRequest) => {
    return axios.get<PageResponse<EmployeeEquipmentListDto>>(this.apiUrl + "GetListByEquipmentId/" + equipmentId, {
      cancelToken: this.cancelToken.token,
      params,
    });
  };
}

export default EmployeeEquipmentService;
