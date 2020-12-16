/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import AuctionFactory from 'contracts/AuctionFactory.json';
// import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
// import { getSigner } from 'utils/web3Library';
import { CommitBid, RevealBid } from 'components';
// import Button from 'styles/buttonStyles';

export default function Bid({ auctionAddress }) {
  // const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  // const [factoryContract, setFactoryContract] = useState(null);
  // const [auctionAddress, setAuctionInvitedAddress] = useState('');
  const [winner, setWinner] = useState('');
  const [showing, setShowing] = useState('COMMIT_BID');

  // useEffect(() => {
  //   if (!active) return;
  //   const signer = getSigner(library);
  //   const { address } = AuctionFactory.networks[chainId];
  //   const factoryInstance = new Contract(address, AuctionFactory.abi, signer);
  //   setFactoryContract(factoryInstance);
  // }, [active, library, chainId]);

  // useEffect(() => {
  //   if (!active || !factoryContract) return;
  //   const getAuctionInvited = async () => {
  //     const auctionInvited = await factoryContract.getAuctionInvited();
  //     if (auctionInvited !== '0x0000000000000000000000000000000000000000') setAuctionInvitedAddress(auctionInvited);
  //   };
  //   getAuctionInvited();
  // }, [active, factoryContract]);

  // useEffect(() => {
  //   if (!active || !factoryContract) return null;
  //   factoryContract.on('LogBidderRegistered', auction => {
  //     console.log('LogBidderRegistered event, auction', auction);
  //     setAuctionInvitedAddress(auction);
  //   });
  //   return () => factoryContract.removeAllListeners('LogBidderRegistered');
  // }, [active, factoryContract]);

  // useEffect(() => {
  //   if (!active || !auctionContract) return null;
  //   auctionContract.on('LogSetWinner', bidder => {
  //     console.log('LogSetWinner event, auction', bidder);
  //     setWinner(bidder);
  //   });
  //   return () => auctionContract.removeAllListeners('LogSetWinner');
  // }, [active, auctionContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  // const goToCommitBid = () => history.push(`/auctions/${auctionAddress}/commit-bid`);
  // const goToRevealBid = () => history.push(`/auctions/${auctionAddress}/reveal-bid`);
  // const goToPay = () => history.push(`/auctions/${auctionAddress}/reveal-bid`);

  return (
    <div>
      <h1>Bid</h1>
      <div>auction invited address: {auctionAddress}</div>
      {/* {auctionAddress ? (
        <div>
          <pre>{auctionAddress}</pre>
          <Button type='button' onClick={goToCommitBid}>
            Commit bid
          </Button>
          <pre>{auctionAddress}</pre>
          <Button type='button' onClick={goToRevealBid}>
            Reveal bid
          </Button>
          {!winner ? (
            <Button type='button' onClick={goToPay}>
              Pay
            </Button>
          ) : null}
        </div>
      ) : (
        <pre>none</pre>
      )} */}
      <TopNav showing={showing} setShowing={setShowing} />
      foo
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
    <div>
      {/* <button>Add</button> */}
      {/* <button type='button' style={setupButtonStyle} onClick={handleClick} value='TOKEN_AND_DATES'>
        Token & Dates
      </button> */}
      <button type='button' style={commitButtonStyle} onClick={handleClick} value='COMMIT_BID'>
        Commit bid
      </button>
      <button type='button' style={revealButtonStyle} onClick={handleClick} value='REVEAL_BID'>
        Reveal bid
      </button>
      {/* {partner && <button style={scanButtonStyle} onClick={handleClick} value='scan'>Scan</button>}
      {partner && <button style={redeemedButtonStyle} onClick={handleClick} value='redeemed'>Redeemed</button>} */}
    </div>
  );
};
