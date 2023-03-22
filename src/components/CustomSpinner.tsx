import React from "react";
import { Spinner } from "react-bootstrap";

const CustomSpinner = () => {
  return (
    <div className="p-3 text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default CustomSpinner;
