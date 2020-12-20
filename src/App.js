import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import GlobalStyle from 'styles/globalStyles';
import Web3ContextProvider from 'contexts/web3Context';
import { getLibrary } from 'utils/web3Library';
import { Head, Home, Network, Contracts, Nav, SellerDashboard, BidderDashboard, NotFound } from 'components';
import LoadingContextProvider from 'contexts/loadingContext';
import { ToastContainer } from 'react-toastify';
import ContentWrapper from 'styles/appStyles';

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ContextProvider>
        <Router>
          <GlobalStyle />
          <LoadingContextProvider>
            {/* <Network />
            <Contracts />
            <hr style={{ margin: '15px 0' }} /> */}
            <Head />
            <ContentWrapper>
              <Switch>
                <Route exact path='/' component={Home} />
                <NavRoute exact path='/seller' component={SellerDashboard} />
                <NavRoute exact path='/bidder' component={BidderDashboard} />
                <NavRoute path='*' component={NotFound} />
              </Switch>
              <ToastContainer />
            </ContentWrapper>
          </LoadingContextProvider>
        </Router>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}

const NavRoute = ({ exact, path, component: Component }) => (
  <Route
    exact={exact}
    path={path}
    component={() => (
      <>
        <Nav />
        <Component />
      </>
    )}
  />
);
