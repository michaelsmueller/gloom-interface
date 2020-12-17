import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  margin-top: 50px;
  height: 450px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  & > * {
    align-items: center;
    text-align: center;
  }
`;

export default Container;
