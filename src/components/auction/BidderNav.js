import React from 'react';
import NavBar from 'styles/navStyles';

export default function BidderNav({ showing, setShowing, isWinner }) {
  const handleClick = e => setShowing(e.target.value);
  const highlighted = { fontWeight: 600, borderBottom: '2px solid var(--primary)' };
  const commitButtonStyle = showing === 'COMMIT_BID' ? highlighted : null;
  const revealButtonStyle = showing === 'REVEAL_BID' ? highlighted : null;
  const payButtonStyle = showing === 'PAY' ? highlighted : null;
  return (
    <NavBar>
      <button type='button' style={commitButtonStyle} onClick={handleClick} value='COMMIT_BID'>
        Commit bid
      </button>
      <button type='button' style={revealButtonStyle} onClick={handleClick} value='REVEAL_BID'>
        Reveal bid
      </button>
      {isWinner && (
        <button type='button' style={payButtonStyle} onClick={handleClick} value='PAY'>
          Pay
        </button>
      )}
    </NavBar>
  );
}
