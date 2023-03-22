import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { useAppDispatch } from "../hooks/useAppDispatch";

import { setUser } from "../store/slices/userSlice";

import { ValidationEmail, ValidationMinLength, ValidationRequired } from "../constants/validationMessages";

import ErrorResponse from "../models/errorResponse";

import AuthService from "../services/authService";
import CookieService from "../services/cookieService";
import UserService from "../services/userService";

import CustomSpinner from "../components/CustomSpinner";

const Login = () => {
  const dispatch = useAppDispatch();

  const defaultLoginModel = {
    email: "test@mail.com",
    password: "1234",
  };

  const [loginModel, setLoginModel] = useState(defaultLoginModel);
  const [loading, setLoading] = useState(false);

  const authService = new AuthService();
  const userService = new UserService();
  const cookieService = new CookieService();

  useEffect(() => {
    return () => {
      authService.cancelToken.cancel();
      userService.cancelToken.cancel();
    };
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    authService
      .login(loginModel)
      .then((response) => {
        const resData = response.data;
        cookieService.setCookie("token", resData.accessToken.token, resData.accessToken.expiration);
      })
      .then(() => {
        userService
          .getFromAuth()
          .then((response) => {
            const resData = response.data;
            dispatch(setUser(resData));
          })
          .catch((errorResponse) => {
            if (!axios.isCancel(errorResponse)) {
              const errorResData: ErrorResponse = errorResponse.response.data;
              toast.error(errorResData.Detail);
            }
          });
      })
      .catch((errorResponse) => {
        if (!axios.isCancel(errorResponse)) {
          const errorResData: ErrorResponse = errorResponse.response.data;
          toast.error(errorResData.Detail);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginModel({
      ...loginModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const validationSchema = Yup.object({
    email: Yup.string().required(ValidationRequired).email(ValidationEmail),
    password: Yup.string().required(ValidationRequired).min(4, ValidationMinLength),
  });

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Container className="my-5">
        <Row>
          <Col className="mx-auto" sm={12} md={6} lg={6}>
            {loading ? (
              <CustomSpinner />
            ) : (
              <Formik
                initialValues={loginModel}
                onSubmit={handleSubmit}
                enableReinitialize
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({ errors }) => (
                  <Form>
                    <FormGroup className="mb-3" controlId="formBasicEmail">
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        placeholder="Enter Email"
                        name="email"
                        value={loginModel?.email}
                        onChange={handleChangeInput}
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </FormGroup>
                    <FormGroup className="mb-3" controlId="formBasicPassword">
                      <FormLabel>Password</FormLabel>
                      <FormControl
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={loginModel?.password}
                        onChange={handleChangeInput}
                      />
                      {errors.password && <small className="text-danger">{errors.password}</small>}
                    </FormGroup>
                    <Button variant="success" type="submit">
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
