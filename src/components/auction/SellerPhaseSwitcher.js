import React, { useContext, useEffect, useState } from 'react';
import useContractAt from 'hooks/useContractAt';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { TokenAndDates, SellerDeposit, BidderInvites, Transfer } from 'components';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function SellerPhaseSwitcher({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const auctionContract = useContractAt(Auction, auctionAddress);
  const [winningBid, setWinningBid] = useState(0);
  const [winningBidder, setWinningBidder] = useState('');
  const [escrowAddress, setEscrowAddress] = useState(null);
  const [showing, setShowing] = useState('TOKEN_AND_DATES');

  useEffect(() => {
    if (!active || !auctionContract) return;
    const getWinner = async () => {
      const [bidder, bid] = await auctionContract.getWinner();
      if (bidder !== '0x0000000000000000000000000000000000000000') {
        setWinningBidder(bidder);
        setWinningBid(bid);
      }
    };
    getWinner();
  }, [active, auctionContract]);

  useEffect(() => {
    if (!active || !auctionContract) return null;
    auctionContract.once('LogSetWinner', bidder => toast.success(`${bidder} won the auction`));
    return () => auctionContract.removeAllListeners('LogSetWinner');
  });

  useEffect(() => {
    if (!active || !auctionContract || !winningBidder) return;
    const getEscrow = async () => {
      const escrow = await auctionContract.getEscrow();
      setEscrowAddress(escrow);
    };
    getEscrow();
  }, [account, active, auctionContract, winningBidder]);

  console.log('render');
  return (
    <div>
      <h2>Auction</h2>
      <SellerNav showing={showing} setShowing={setShowing} auctionAddress={auctionAddress} isWinner={winningBidder} />
      {showing === 'TOKEN_AND_DATES' && <TokenAndDates />}
      {showing === 'SELLER_DEPOSIT' && <SellerDeposit auctionAddress={auctionAddress} />}
      {showing === 'BIDDER_INVITES' && <BidderInvites auctionAddress={auctionAddress} />}
      {showing === 'TRANSFER' && <Transfer escrowAddress={escrowAddress} />}
    </div>
  );
}

const SellerNav = ({ showing, setShowing, auctionAddress, isWinner }) => {
  const handleClick = e => {
    if (auctionAddress) setShowing(e.target.value);
    else toast.warning('Auction has not been set up and mined yet.');
  };
  const highlighted = { fontWeight: 600, borderBottom: '2px solid var(--primary)' };
  const setupButtonStyle = showing === 'TOKEN_AND_DATES' ? highlighted : null;
  const depositButtonStyle = showing === 'SELLER_DEPOSIT' ? highlighted : null;
  const biddersButtonStyle = showing === 'BIDDER_INVITES' ? highlighted : null;
  const transferButtonStyle = showing === 'TRANSFER' ? highlighted : null;
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
        <button type='button' style={transferButtonStyle} onClick={handleClick} value='TRANSFER'>
          Transfer
        </button>
      )}
    </NavBar>
  );
};
