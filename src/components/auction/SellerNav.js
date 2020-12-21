import React from 'react';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function SellerNav({ showing, setShowing, auctionAddress, isWinner }) {
  const handleClick = e => {
    if (auctionAddress) setShowing(e.target.value);
    else toast.warning('Auction has not been set up and mined yet.');
  };
  const highlighted = { fontWeight: 600, borderBottom: '2px solid var(--primary)' };
  const buttonStyle = value => (showing === value ? highlighted : null);
  const setupButtonStyle = buttonStyle('TOKEN_AND_DATES');
  const depositButtonStyle = buttonStyle('SELLER_DEPOSIT');
  const biddersButtonStyle = buttonStyle('BIDDER_INVITES');
  const transferButtonStyle = buttonStyle('TRANSFER');
  const withdrawButtonStyle = buttonStyle('WITHDRAW');
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
