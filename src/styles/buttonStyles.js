import styled from 'styled-components/macro';

export const Button = styled.button`
  margin: 15px 5px;
  padding: 15px;
  border-radius: 20px;
  box-shadow: -3px -3px 5px var(--nearWhite), 3px 3px 3px var(--shadow);
  font-weight: 600;
  font-size: ${props => (props.large ? '1.1em' : '0.8em')};

  &:hover {
    cursor: pointer;
    color: var(--primary);
  }

  &:active {
    color: var(--primary);
    box-shadow: inset -3px -3px 5px var(--nearWhite), inset 3px 3px 3px var(--shadow);
  }
`;

export const ConnectButton = styled.button`
  padding: 7px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.2em;

  &:hover {
    cursor: pointer;
    color: var(--primary);
  }

  &:active {
    color: var(--primary);
  }
`;
