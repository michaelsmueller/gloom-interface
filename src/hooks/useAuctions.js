import { useState, useEffect } from 'react';

export default function useAuctions(factoryContract) {
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  useEffect(() => {
    const getAuctions = async () => {
      const response = await factoryContract.getAddresses();
      setAuctionAddresses(response);
    };
    if (!factoryContract) return;
    getAuctions();
  }, [factoryContract]);

  return [auctionAddresses];
}
