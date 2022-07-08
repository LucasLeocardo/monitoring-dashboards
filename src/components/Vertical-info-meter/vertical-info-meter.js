import React from "react";
import { Container, Dot } from "./vertical-info-meter.styles";
import { BsCircleFill } from "react-icons/bs";

const VerticalInfoMeter = ({ value, correctionFactor }) => {
  return (
    <Container>
      <Dot
        style={{
          bottom: value / correctionFactor
        }}
      >
        <BsCircleFill color="#4349da" size={30} />
      </Dot>
    </Container>
  );
};

export default VerticalInfoMeter;
