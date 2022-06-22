import styled from "styled-components";

export const Card = styled.div``;

export const InfoCard = styled(Card)`
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  align-items: stretch;
  box-sizing: border-box;
`;
export const InfoCardTitle = styled.div`
  color: #c6c6c6;
  position: absolute;
  top: 16px;
  display: flex;
  position: absolute;
  width: 100%;
  left: 0;
  padding: 0 16px;
  box-sizing: border-box;
  font-size: large;
`;

export const InfoCardContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 50%;
  margin-top: ${(props) => props.marginTop ? props.marginTop : "0px"};
`;

export const NewInfoCardContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 90%;
  width: 100%;
  margin-top: ${(props) => props.marginTop ? props.marginTop : "0px"};
`;

export const InfoCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 16px;
  width: 100%;
  left: 0;
  padding: 0 16px;
  box-sizing: border-box;
`;
