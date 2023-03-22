import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import { setUser } from "./store/slices/userSlice";

import { persistor, store } from "./store/store";

import AuthService from "./services/authService";
import CookieService from "./services/cookieService";

import App from "./App";

const authService = new AuthService();
const cookieService = new CookieService();

axios.defaults.withCredentials = true;

// add token to all requests
axios.interceptors.request.use(
  (request) => {
    const token = cookieService.getCookie("token");
    if (token) request.headers["Authorization"] = "Bearer " + token;
    return request;
  },
  (error) => Promise.reject(error)
);

// refresh token if token has expired
let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const request = error?.config;

    if (error?.response?.status === 401 && !request?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            request.headers["Authorization"] = "Bearer " + token;
            return axios(request);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      request._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        authService
          .refreshToken()
          .then((res) => {
            const resData = res.data;
            if (resData) {
              request.headers["Authorization"] = "Bearer " + resData.token;
              cookieService.setCookie("token", resData.token, resData.expiration);
              processQueue(null, resData.token);
              resolve(axios(request));
            }
          })
          .catch((err: any) => {
            if (!axios.isCancel(err)) {
              store.dispatch(setUser());
              processQueue(err);
              reject(err);
            }
          })
          .finally(() => (isRefreshing = false));
      });
    }

    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
