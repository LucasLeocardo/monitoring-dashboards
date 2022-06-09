import React, { Children } from "react";

const { Container, Index, Number } = require("./number-index.styles");

export const INDEX_POSITION = {
  RIGHT_TOP: "RIGHT_TOP",
  RIGHT_BOTTOM: "RIGHT_BOTTOM",
  RIGHT_CENTER: "RIGHT_CENTER"
};

const POSITION_FLEX = {
  [INDEX_POSITION.RIGHT_TOP]: "flex-start",
  [INDEX_POSITION.RIGHT_CENTER]: "center",
  [INDEX_POSITION.RIGHT_BOTTOM]: "flex-end"
};

const NumberIndex = ({
  children,
  index,
  indexPosition = INDEX_POSITION.RIGHT_TOP,
  size = 24,
  indexSize = size / 2
}) => {
  return (
    <Container>
      <Number style={{ fontSize: `${size}px`, lineHeight: `${size}px` }}>
        {children}
      </Number>
      <Index
        style={{
          fontSize: indexSize,
          justifyContent: POSITION_FLEX[indexPosition]
        }}
      >
        {index}
      </Index>
    </Container>
  );
};

export default NumberIndex;
