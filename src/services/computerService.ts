import axios, { CancelTokenSource } from "axios";

import ComputerDto from "../models/computers/computerDto";
import ComputerListDto from "../models/computers/computerListDto";
import CreateComputerDto from "../models/computers/createComputerDto";
import CreatedComputerDto from "../models/computers/createdComputerDto";
import DeletedComputerDto from "../models/computers/deletedComputerDto";
import UpdateComputerDto from "../models/computers/updateComputerDto";
import UpdatedComputerDto from "../models/computers/updatedComputerDto";
import PageRequest from "../models/pageRequest";
import PageResponse from "../models/pageResponse";

class ComputerService {
  private readonly apiUrl: string;
  public cancelToken: CancelTokenSource;

  constructor() {
    this.apiUrl = process.env.API_URL + "Computers/";
    this.cancelToken = axios.CancelToken.source();
  }

  public getList = (params?: PageRequest) => {
    return axios.get<PageResponse<ComputerListDto>>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      params,
    });
  };

  public getById = (id: number) => {
    return axios.get<ComputerDto>(this.apiUrl + id, {
      cancelToken: this.cancelToken.token,
    });
  };

  public delete = (id: number) => {
    return axios.delete<DeletedComputerDto>(this.apiUrl, {
      cancelToken: this.cancelToken.token,
      data: { id },
    });
  };

  public add = (values: CreateComputerDto) => {
    return axios.post<CreatedComputerDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };

  public update = (values: UpdateComputerDto) => {
    return axios.put<UpdatedComputerDto>(this.apiUrl, values, {
      cancelToken: this.cancelToken.token,
    });
  };
}

export default ComputerService;
