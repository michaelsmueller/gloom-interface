import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';

export default function AssetDetails({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const [asset, setAsset] = useState({});

  useEffect(() => {
    if (!auctionContract) return;
    const getAsset = async () => {
      const assetDetails = await auctionContract.getAsset();
      setAsset({
        amount: assetDetails[0].toNumber(),
        tokenContract: assetDetails[1].toString(),
      });
    };
    getAsset();
  }, [auctionContract]);

  const { amount, tokenContract } = asset || '';
  return (
    <>
      <h2>Asset details</h2>
      <pre>
        <ul>
          <li>Token amount:&nbsp; {amount}</li>
          <li>Token contract address:&nbsp; {tokenContract}</li>
        </ul>
      </pre>
    </>
  );
}
