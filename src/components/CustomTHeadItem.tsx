import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import OrderValue from "../models/orderValue";

const CustomTHeadItem = (props: Props) => {
  return (
    <th className="orderable" onClick={() => props.setOrder(props.value)}>
      {props.title + " "}
      {props.orderValue.orderBy === props.value ? (
        props.orderValue.order === "asc" ? (
          <FontAwesomeIcon icon={faCaretUp} />
        ) : (
          <FontAwesomeIcon icon={faCaretDown} />
        )
      ) : null}
    </th>
  );
};

export default CustomTHeadItem;

interface Props {
  setOrder: Function;
  orderValue: OrderValue;
  title: string;
  value: string;
}
