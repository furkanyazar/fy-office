import axios, { CancelTokenSource } from "axios";

import CreatedEquipmentDto from "../models/equipments/createdEquipmentDto";
import CreateEquipmentDto from "../models/equipments/createEquipmentDto";
import DeletedEquipmentDto from "../models/equipments/deletedEquipmentDto";
import EquipmentDto from "../models/equipments/equipmentDto";
import EquipmentListDto from "../models/equipments/equipmentListDto";
import UpdatedEquipmentDto from "../models/equipments/updatedEquipmentDto";
import UpdateEquipmentDto from "../models/equipments/updateEquipmentDto";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";

class EquipmentService {
  private readonly apiUrl: string;
  public cancelToken: CancelTokenSource;

  constructor() {
    this.apiUrl = process.env.API_URL + "Equipments/";
    this.cancelToken = axios.CancelToken.source();
  }

  public getList = (params?: PageRequest) => {
    return axios.get<PageResponse<EquipmentListDto>>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      params,
    });
  };

  public getById = (id: number) => {
    return axios.get<EquipmentDto>(this.apiUrl + id, {
      cancelToken: this.cancelToken.token,
    });
  };

  public delete = (id: number) => {
    return axios.delete<DeletedEquipmentDto>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      data: { id },
    });
  };

  public add = (values: CreateEquipmentDto) => {
    return axios.post<CreatedEquipmentDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };

  public update = (values: UpdateEquipmentDto) => {
    return axios.put<UpdatedEquipmentDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };
}

export default EquipmentService;
