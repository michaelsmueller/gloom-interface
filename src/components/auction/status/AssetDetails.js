import React, { useEffect, useState } from 'react';
import { formatUnits } from '@ethersproject/units';
import { DECIMALS } from 'data/constants';
import useContractAt from 'hooks/useContractAt';
import Auction from 'contracts/Auction.json';

export default function AssetDetails({ auctionAddress }) {
  const auctionContract = useContractAt(Auction, auctionAddress);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenContract, setTokenContract] = useState('');

  useEffect(() => {
    if (!auctionContract) return;
    const getAsset = async () => {
      const assetDetails = await auctionContract.getAsset();
      if (assetDetails.length) {
        setTokenAmount(formatUnits(assetDetails[0], DECIMALS));
        setTokenContract(assetDetails[1].toString());
      }
    };
    getAsset();
  }, [auctionContract]);

  return (
    <>
      <h2>Asset details</h2>
      <pre>
        <ul>
          <li>Token amount:&nbsp; {tokenAmount}</li>
          <li>Token contract address:&nbsp; {tokenContract}</li>
        </ul>
      </pre>
    </>
  );
}
