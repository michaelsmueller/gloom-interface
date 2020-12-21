import React from 'react';
import { formatUnits } from '@ethersproject/units';
import { DECIMALS } from 'data/constants';
import { useContractAt, useAsset } from 'hooks';
import Auction from 'contracts/Auction.json';

export default function AssetDetails({ auctionAddress }) {
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { tokenAmount, tokenContract } = useAsset(auctionContract);
  return (
    <>
      <h2>Asset details</h2>
      <pre>
        <ul>
          <li>Token amount:&nbsp; {tokenAmount && formatUnits(tokenAmount, DECIMALS)}</li>
          <li>Token contract address:&nbsp; {tokenContract}</li>
        </ul>
      </pre>
    </>
  );
}
