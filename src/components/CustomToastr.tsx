import React from "react";
import { ToastContainer } from "react-toastify";

const CustomToastr = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      theme="colored"
    />
  );
};

export default CustomToastr;
