/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
import { Web3Context } from 'contexts/web3Context';
import { CommitBid, RevealBid } from 'components';
import NavBar from 'styles/navStyles';

export default function BidderPhases({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  // const [winner, setWinner] = useState('');
  const [showing, setShowing] = useState('COMMIT_BID');

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  return (
    <div>
      <h2>Bid</h2>
      {/* <div>auction invited address: {auctionAddress}</div> */}
      <TopNav showing={showing} setShowing={setShowing} />
      {/* {showing === 'TOKEN_AND_DATES' && <TokenAndDates />} */}
      {showing === 'COMMIT_BID' && <CommitBid auctionAddress={auctionAddress} />}
      {showing === 'REVEAL_BID' && <RevealBid auctionAddress={auctionAddress} />}
    </div>
  );
}

const TopNav = ({ showing, setShowing, user }) => {
  const handleClick = e => setShowing(e.target.value);
  // const { partner } = user || '';
  const highlighted = { fontWeight: 600, borderBottom: '2px solid #ee2B7a' };
  // const setupButtonStyle = showing === 'offers' ? highlighted : null;
  const commitButtonStyle = showing === 'COMMIT_BID' ? highlighted : null;
  const revealButtonStyle = showing === 'REVEAL_BID' ? highlighted : null;
  // const redeemedButtonStyle = showing === 'redeemed' ? highlighted : null;
  return (
    <NavBar>
      <button type='button' style={commitButtonStyle} onClick={handleClick} value='COMMIT_BID'>
        Commit bid
      </button>
      <button type='button' style={revealButtonStyle} onClick={handleClick} value='REVEAL_BID'>
        Reveal bid
      </button>
      {/* {partner && <button style={redeemedButtonStyle} onClick={handleClick} value='redeemed'>Redeemed</button>} */}
    </NavBar>
  );
};
