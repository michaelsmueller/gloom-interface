import React, { useContext, useEffect, useState } from 'react';
import useContractAt from 'hooks/useContractAt';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { TokenAndDates, SellerDeposit, BidderInvites } from 'components';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function SellerPhaseSwitcher({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const auctionContract = useContractAt(Auction, auctionAddress);
  const [winner, setWinner] = useState('');
  const [escrowAddress, setEscrowAddress] = useState(null);
  const [showing, setShowing] = useState('TOKEN_AND_DATES');

  console.log('before auctionContract', auctionContract);
  console.log('before auctionAddress', auctionAddress);

  useEffect(() => {
    console.log('active', active);
    if (!active || !auctionContract) return;
    console.log('auctionContract', auctionContract);
    console.log('useEffect 1');
    const getWinner = async () => {
      const winningBidder = await auctionContract.getWinner();
      if (winningBidder !== '0x0000000000000000000000000000000000000000') setWinner(winningBidder);
    };
    getWinner();
  }, [active, auctionContract]);

  useEffect(() => {
    if (!active || !auctionContract || winner !== account) return;
    console.log('useEffect 2');
    const getEscrow = async () => {
      const escrow = await auctionContract.getEscrow();
      setEscrowAddress(escrow);
    };
    getEscrow();
  }, [account, active, auctionContract, winner]);

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
