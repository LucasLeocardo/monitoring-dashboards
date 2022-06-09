import styled from "styled-components";

export const Container = styled.div`
  text-align: left;
  display: flex;
`;

const Font = styled.div`
  font-weight: 300;
`;

export const Number = styled(Font)`
  display: flex;
  flex-direction: column;
`;

export const Index = styled(Font)`
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
