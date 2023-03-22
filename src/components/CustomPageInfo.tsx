import React from "react";

import PageResponse from "../models/pageResponse";

const CustomPageInfo = (props: Props) => {
  return (
    <div className="text-end">
      <small>
        Showing{" "}
        {props.pageResponse.count <= props.pageResponse.size
          ? `1-${props.pageResponse.count}`
          : props.pageResponse.index + 1 === props.pageResponse.pages
          ? `${props.pageResponse.size * props.pageResponse.index + 1}-${props.pageResponse.count}`
          : `${(props.pageResponse.index + 1) * props.pageResponse.size - props.pageResponse.size + 1}-${
              (props.pageResponse.index + 1) * props.pageResponse.size
            }`}{" "}
        of {props.pageResponse.count} total items.
      </small>
    </div>
  );
};

export default CustomPageInfo;

interface Props {
  pageResponse: PageResponse<any>;
}
