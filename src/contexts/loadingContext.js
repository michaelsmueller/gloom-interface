import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import LoadingOverlay from 'react-loading-overlay';

export const LoadingContext = createContext();

const StyledLoader = styled(LoadingOverlay)`
  padding: 30px;
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
`;

export default function LoadingContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => setIsLoading(false), [setIsLoading]);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <StyledLoader active={isLoading} spinner>
        {children}
      </StyledLoader>
    </LoadingContext.Provider>
  );
}
