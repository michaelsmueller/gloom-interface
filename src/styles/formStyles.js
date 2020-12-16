import styled from 'styled-components/macro';

export const Fieldset = styled.fieldset`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 20px;
  box-shadow: -3px -3px 5px var(--nearWhite), 3px 3px 3px var(--shadow);
`;

export const FieldsetTitle = styled.h3`
  margin: 5px 0;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 5px 0;
  & > div {
    width: 150px;
  }
`;

export const Input = styled.input`
  width: 50%;
  border-radius: 20px;
  padding: 8px 15px;
  box-shadow: ${props =>
    props.readOnly ? 'none' : 'inset -3px -3px 5px var(--nearWhite), inset 3px 3px 3px var(--shadow)'};
`;

export const Select = styled.select`
  width: 50%;
  border-radius: 20px;
  padding: 8px 15px;
  box-shadow: inset -3px -3px 5px var(--nearWhite), inset 3px 3px 3px var(--shadow);
`;
