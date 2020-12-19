import React, { useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import Auction from 'contracts/Auction.json';

export default function AssetDetails({ auctionAddress }) {
  const auctionContract = useContract(Auction, auctionAddress);
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
