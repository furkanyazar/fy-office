import axios, { CancelTokenSource } from "axios";

import AccessTokenDto from "../models/auths/accessTokenDto";
import LoggedDto from "../models/auths/loggedDto";

class AuthService {
  private readonly apiUrl: string;
  public cancelToken: CancelTokenSource;

  constructor() {
    this.apiUrl = process.env.API_URL + "Auth/";
    this.cancelToken = axios.CancelToken.source();
  }

  public login = (values: any) => {
    return axios.post<LoggedDto>(this.apiUrl + "Login/", values, {
      cancelToken: this.cancelToken.token,
    });
  };

  public refreshToken = () => {
    return axios.get<AccessTokenDto>(this.apiUrl + "RefreshToken/", {
      cancelToken: this.cancelToken.token,
    });
  };

  public revokeToken = () => {
    return axios.put(this.apiUrl + "RevokeToken/", null, {
      cancelToken: this.cancelToken.token,
      headers: { "Content-Type": "application/json" },
    });
  };
}

export default AuthService;
