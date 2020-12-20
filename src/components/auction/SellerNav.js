import React from 'react';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function SellerNav({ showing, setShowing, auctionAddress, isWinner }) {
  const handleClick = e => {
    if (auctionAddress) setShowing(e.target.value);
    else toast.warning('Auction has not been set up and mined yet.');
  };
  const highlighted = { fontWeight: 600, borderBottom: '2px solid var(--primary)' };
  const setupButtonStyle = showing === 'TOKEN_AND_DATES' ? highlighted : null;
  const depositButtonStyle = showing === 'SELLER_DEPOSIT' ? highlighted : null;
  const biddersButtonStyle = showing === 'BIDDER_INVITES' ? highlighted : null;
  const transferButtonStyle = showing === 'TRANSFER' ? highlighted : null;
  const withdrawButtonStyle = showing === 'WITHDRAW' ? highlighted : null;
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
      {isWinner && (
        <>
          <button type='button' style={transferButtonStyle} onClick={handleClick} value='TRANSFER'>
            Transfer
          </button>
          <button type='button' style={withdrawButtonStyle} onClick={handleClick} value='WITHDRAW'>
            Withdraw
          </button>
        </>
      )}
    </NavBar>
  );
}
