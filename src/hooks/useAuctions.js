import { useState, useEffect } from 'react';

export default function useAuctions(factoryContract) {
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  const getAuctions = async () => {
    const response = await factoryContract.getAddresses();
    setAuctionAddresses(response);
  };

  useEffect(() => {
    // const getAuctions = async () => {
    //   const response = await factoryContract.getAddresses();
    //   setAuctionAddresses(response);
    // };
    if (!factoryContract) return;
    getAuctions();
  }, [factoryContract]);

  return { auctionAddresses, getAuctions };
}
