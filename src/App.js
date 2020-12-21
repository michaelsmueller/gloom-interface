import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import GlobalStyle from 'styles/globalStyles';
import Web3ContextProvider from 'contexts/web3Context';
import { getLibrary } from 'utils/web3Library';
import { Head, Home, Banner, SellerDashboard, BidderDashboard, NotFound } from 'components';
import LoadingContextProvider from 'contexts/loadingContext';
import { ToastContainer } from 'react-toastify';
import ContentWrapper from 'styles/appStyles';

export default function App() {
  return (
    <Router>
      <Head />
      <ContentWrapper>
        <GlobalStyle />
        <Switch>
          <Route exact path='/' component={Home} />
          <AppRoute exact path='/seller' component={SellerDashboard} />
          <AppRoute exact path='/bidder' component={BidderDashboard} />
          <AppRoute path='*' component={NotFound} />
        </Switch>
        <ToastContainer />
      </ContentWrapper>
    </Router>
  );
}

const AppRoute = ({ exact, path, component: Component }) => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ContextProvider>
      <LoadingContextProvider>
        <Route
          exact={exact}
          path={path}
          component={() => (
            <>
              <Banner />
              <Component />
            </>
          )}
        />
      </LoadingContextProvider>
    </Web3ContextProvider>
  </Web3ReactProvider>
);
