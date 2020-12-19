import styled from 'styled-components/macro';

export const Container = styled.div`
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  & > * {
    align-items: center;
    text-align: center;
  }
`;

export const Logo = styled.img`
  max-width: 60vw;
`;

export const Headline = styled.h1`
  margin-top: 40px;
  max-width: 700px;
  font-size: calc(1.4em + 0.5vw);
`;

export const SellingProposition = styled.p`
  font-size: 1.1em;
  line-height: 1.5em;
  max-width: 700px;
`;

export const Buttons = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  width: 40vw;

  @media (max-width: 768px) {
    flex-direction: column;
    min-width: 60vw;
    max-width: 70vw;
  }

  justify-content: space-between;
  align-items: center;

  & > button {
    margin: 10px;
    width: 200px;
    height: 75px;
  }
`;
