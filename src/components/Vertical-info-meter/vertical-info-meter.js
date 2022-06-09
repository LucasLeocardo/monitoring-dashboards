import React from "react";
import { Container, Dot } from "./vertical-info-meter.styles";
import { BsCircleFill } from "react-icons/bs";

const VerticalInfoMeter = ({ value }) => {
  return (
    <Container>
      <Dot
        style={{
          bottom: value
        }}
      >
        <BsCircleFill color="#4349da" size={30} />
      </Dot>
    </Container>
  );
};

export default VerticalInfoMeter;
