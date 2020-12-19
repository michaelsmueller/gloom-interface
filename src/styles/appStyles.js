import styled from 'styled-components/macro';

const ContentWrapper = styled.div`
  ${'' /* height: 85vh; */}
  width: 640px;

  @media (max-width: 768px) {
    max-width: 90vw;
  }
`;

export default ContentWrapper;
