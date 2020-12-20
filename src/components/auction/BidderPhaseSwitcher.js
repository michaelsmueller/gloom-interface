import React, { useContext, useEffect, useState } from 'react';
import useContractAt from 'hooks/useContractAt';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { CommitBid, RevealBid, Pay } from 'components';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function BidderPhaseSwitcher({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const auctionContract = useContractAt(Auction, auctionAddress);
  const [bidderDeposit, setBidderDeposit] = useState(null);
  const [winningBid, setWinningBid] = useState(0);
  const [winningBidder, setWinningBidder] = useState('');
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
    auctionContract.once('LogSetWinner', bidder => {
      if (account === bidder) toast.success(`Congratulations, you won the auction`);
      else toast.dark(`Sorry, you lost the auction`);
      setWinningBidder(bidder);
    });
    return () => auctionContract.removeAllListeners('LogSetWinner');
  });

  useEffect(() => {
    if (!active || !auctionContract || winningBidder !== account) return;
    const getEscrow = async () => {
      const escrow = await auctionContract.getEscrow();
      setEscrowAddress(escrow);
    };
    getEscrow();
  }, [account, active, auctionContract, winningBidder]);

  console.log('render bidder');
  return (
    <div>
      <h2>Bid</h2>
      <BidderNav showing={showing} setShowing={setShowing} isWinner={winningBidder === account} />
      {showing === 'COMMIT_BID' && <CommitBid auctionAddress={auctionAddress} bidderDeposit={bidderDeposit} />}
      {showing === 'REVEAL_BID' && <RevealBid auctionAddress={auctionAddress} />}
      {showing === 'PAY' && <Pay escrowAddress={escrowAddress} />}
    </div>
  );
}

const BidderNav = ({ showing, setShowing, isWinner }) => {
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
};
