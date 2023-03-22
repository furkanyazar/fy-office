import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router";

import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";

import { hideNotification } from "./store/slices/notificationSlice";

import CustomToastr from "./components/CustomToastr";
import NotificationModal from "./components/Modals/NotificationModal";

import Footer from "./layouts/Footer";
import Header from "./layouts/Header";

import Computers from "./pages/Computers";
import Employees from "./pages/Employees";
import Equipments from "./pages/Equipments";
import Login from "./pages/Login";
import Users from "./pages/Users";

const App = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.userItems);

  useEffect(() => {
    dispatch(hideNotification());
  }, []);

  return (
    <>
      <Helmet titleTemplate="%s | Fy Office" defaultTitle="Fy Office" />
      <NotificationModal />
      <Header />
      <Routes>
        <Route path="/" element={user ? <Employees /> : <Navigate to={"/login"} />} />
        <Route path="/employees" element={user ? <Employees /> : <Navigate to={"/login"} />} />
        <Route path="/computers" element={user ? <Computers /> : <Navigate to={"/login"} />} />
        <Route path="/equipments" element={user ? <Equipments /> : <Navigate to={"/login"} />} />
        <Route path="/users" element={user ? <Users /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
      </Routes>
      <Footer />
      <CustomToastr />
    </>
  );
};

export default App;
