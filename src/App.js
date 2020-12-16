import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import GlobalStyle from 'styles/globalStyles';
import Web3ContextProvider from 'contexts/web3Context';
import { getLibrary } from 'utils/web3Library';
import {
  Head,
  Home,
  Network,
  Contracts,
  SellerDashboard,
  BidderDashboard,
  AuctionSetup,
  AuctionDetails,
  SellerDeposit,
  BidderInvites,
  CommitBid,
  RevealBid,
  NotFound,
} from 'components';

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ContextProvider>
        <Router>
          <GlobalStyle />
          <Network />
          <Contracts />
          <hr style={{ margin: '15px 0' }} />
          <Head />
          <Switch>
            <Route exact path='/' component={Home} />

            <Route exact path='/seller' component={SellerDashboard} />
            <Route exact path='/auctions/new' component={AuctionSetup} />
            <Route exact path='/auctions/:id' component={AuctionDetails} />
            <Route exact path='/auctions/:id/seller-deposit' component={SellerDeposit} />

            <Route exact path='/bidder' component={BidderDashboard} />
            <Route exact path='/auctions/:id/bidder-invites' component={BidderInvites} />
            <Route exact path='/auctions/:id/commit-bid' component={CommitBid} />
            <Route exact path='/auctions/:id/reveal-bid' component={RevealBid} />

            <Route path='*' component={NotFound} />
          </Switch>
        </Router>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}
