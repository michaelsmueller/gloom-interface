import { useState, useEffect } from 'react';

export default function useAuctionAddresses(factoryContract) {
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  const getAuctionAddresses = async () => {
    const response = await factoryContract.getAddresses();
    setAuctionAddresses(response);
  };

  useEffect(() => {
    if (!factoryContract) return;
    getAuctionAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factoryContract]);

  return { auctionAddresses, getAuctionAddresses };
}
