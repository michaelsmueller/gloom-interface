import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import GlobalStyle from 'styles/globalStyles';
import Web3ContextProvider from 'contexts/web3Context';
import { getLibrary } from 'utils/web3Library';
import { Head, Home, Network, Contracts, SellerDashboard, BidderDashboard, NotFound } from 'components';
import LoadingContextProvider from 'contexts/loadingContext';

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
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/seller' component={SellerDashboard} />
              <Route exact path='/bidder' component={BidderDashboard} />
              <Route path='*' component={NotFound} />
            </Switch>
          </LoadingContextProvider>
        </Router>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}
