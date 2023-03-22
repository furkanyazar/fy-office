import React from "react";
import { Dropdown, FormControl, InputGroup, SplitButton } from "react-bootstrap";

import PageSizeValue from "../models/pageSizeValue";

const CustomSearchInput = (props: Props) => {
  const pageSizeValues: PageSizeValue[] = require("../jsons/pageSizeValues.json");

  return (
    <InputGroup className="mb-3">
      <FormControl placeholder="Search..." value={props.searchValue} onChange={props.handleChangeSearchInput} />
      <SplitButton
        variant="outline-secondary"
        title={pageSizeValues.find((c) => c.value === props.pageSize)?.name}
        id="segmented-button-dropdown"
        align="end"
      >
        {pageSizeValues.map((pageSizeValue) => (
          <Dropdown.Item key={pageSizeValue.id} onClick={() => props.setPageSize(pageSizeValue.value)}>
            {pageSizeValue.name}
          </Dropdown.Item>
        ))}
      </SplitButton>
    </InputGroup>
  );
};

export default CustomSearchInput;

interface Props {
  pageSize: number;
  searchValue: string;
  handleChangeSearchInput: React.ChangeEventHandler;
  setPageSize: Function;
}
