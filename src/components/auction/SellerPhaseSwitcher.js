import React, { useState } from 'react';
import { TokenAndDates, SellerDeposit, BidderInvites } from 'components';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function SellerPhaseSwitcher({ auctionAddress }) {
  const [showing, setShowing] = useState('TOKEN_AND_DATES');

  return (
    <div>
      <h2>Auction</h2>
      <SellerNav showing={showing} setShowing={setShowing} auctionAddress={auctionAddress} />
      {showing === 'TOKEN_AND_DATES' && <TokenAndDates />}
      {showing === 'SELLER_DEPOSIT' && <SellerDeposit auctionAddress={auctionAddress} />}
      {showing === 'BIDDER_INVITES' && <BidderInvites auctionAddress={auctionAddress} />}
    </div>
  );
}

const SellerNav = ({ showing, setShowing, auctionAddress }) => {
  const handleClick = e => {
    if (auctionAddress) setShowing(e.target.value);
    else toast.warning('Auction has not been set up and mined yet.');
  };
  const highlighted = { fontWeight: 600, borderBottom: '2px solid #ee2B7a' };
  const setupButtonStyle = showing === 'TOKEN_AND_DATES' ? highlighted : null;
  const depositButtonStyle = showing === 'SELLER_DEPOSIT' ? highlighted : null;
  const biddersButtonStyle = showing === 'BIDDER_INVITES' ? highlighted : null;
  return (
    <NavBar>
      <button type='button' style={setupButtonStyle} onClick={handleClick} value='TOKEN_AND_DATES'>
        Token & Dates
      </button>
      <button type='button' style={depositButtonStyle} onClick={handleClick} value='SELLER_DEPOSIT'>
        Deposit
      </button>
      <button type='button' style={biddersButtonStyle} onClick={handleClick} value='BIDDER_INVITES'>
        Bidders
      </button>
    </NavBar>
  );
};
