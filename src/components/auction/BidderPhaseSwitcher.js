/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { CommitBid, RevealBid, Pay } from 'components';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function BidderPhaseSwitcher({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const [bidderDeposit, setBidderDeposit] = useState(null);
  const [winner, setWinner] = useState('');
  const [escrowAddress, setEscrowAddress] = useState(null);
  const [showing, setShowing] = useState('COMMIT_BID');

  useEffect(() => {
    if (!active || !auctionContract) return;
    const getBidderDeposit = async () => {
      const deposit = await auctionContract.getBidderDeposit();
      setBidderDeposit(deposit);
    };
    getBidderDeposit();
  }, [active, auctionContract]);

  useEffect(() => {
    if (!active || !auctionContract) return;
    const getWinner = async () => {
      const winningBidder = await auctionContract.getWinner();
      if (winningBidder !== '0x0000000000000000000000000000000000000000') setWinner(winningBidder);
    };
    getWinner();
  }, [active, auctionContract]);

  useEffect(() => {
    if (!active || !auctionContract) return null;
    auctionContract.once('LogSetWinner', bidder => {
      if (account === bidder) toast.success(`Congratulations, you won the auction`);
      else toast.dark(`Sorry, you lost the auction`);
      setWinner(bidder);
    });
    return () => auctionContract.removeAllListeners('LogSetWinner');
  });

  useEffect(() => {
    if (!active || !auctionContract || winner !== account) return;
    const getEscrow = async () => {
      const escrow = await auctionContract.getEscrow();
      setEscrowAddress(escrow);
    };
    getEscrow();
  }, [account, active, auctionContract, winner]);

  // if (!active && !error) return <div>loading</div>;
  // if (error) return <div>Error {error.message}</div>;
  return (
    <div>
      <h2>Bid</h2>
      {/* <div>auction invited address: {auctionAddress}</div> */}
      <BidderNav showing={showing} setShowing={setShowing} isWinner={winner === account} />
      {/* {showing === 'TOKEN_AND_DATES' && <TokenAndDates />} */}
      {showing === 'COMMIT_BID' && <CommitBid auctionAddress={auctionAddress} bidderDeposit={bidderDeposit} />}
      {showing === 'REVEAL_BID' && <RevealBid auctionAddress={auctionAddress} />}
      {showing === 'PAY' && <Pay escrowAddress={escrowAddress} />}
    </div>
  );
}

const BidderNav = ({ showing, setShowing, isWinner }) => {
  const handleClick = e => setShowing(e.target.value);
  const highlighted = { fontWeight: 600, borderBottom: '2px solid #ee2B7a' };
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
};
