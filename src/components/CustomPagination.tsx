import React from "react";
import { Pagination } from "react-bootstrap";

import PageResponse from "../models/pageResponse";

const CustomPagination = (props: Props) => {
  return (
    props.data.pages > 1 && (
      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.First disabled={!props.data.hasPrevious} onClick={() => props.setPage(0)} />
          <Pagination.Prev disabled={!props.data.hasPrevious} onClick={() => props.setPage(props.data.index - 1)} />
          {props.data.pages > 10 && props.data.index > 3 && (
            <Pagination.Ellipsis onClick={() => props.setPage(props.data.index - 4)} />
          )}
          {Array.from(Array(props.data.pages).keys())
            .filter((c) => {
              if (props.data.pages > 10) return c >= props.data.index - 3 && c <= props.data.index + 3;
              return true;
            })
            .map((page) => (
              <Pagination.Item key={page} active={props.data.index === page} onClick={() => props.setPage(page)}>
                {page + 1}
              </Pagination.Item>
            ))}
          {props.data.pages > 10 && props.data.index < props.data.pages - 4 && (
            <Pagination.Ellipsis onClick={() => props.setPage(props.data.index + 4)} />
          )}
          <Pagination.Next disabled={!props.data.hasNext} onClick={() => props.setPage(props.data.index + 1)} />
          <Pagination.Last disabled={!props.data.hasNext} onClick={() => props.setPage(props.data.pages - 1)} />
        </Pagination>
      </div>
    )
  );
};

export default CustomPagination;

interface Props {
  data: PageResponse<any>;
  setPage: Function;
}
