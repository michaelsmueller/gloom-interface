import styled from 'styled-components/macro';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  & > * {
    align-items: center;
    text-align: center;
  }
`;

export default Container;
