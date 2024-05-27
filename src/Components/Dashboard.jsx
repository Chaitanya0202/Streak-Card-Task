import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { GoArrowUpRight } from "react-icons/go";
import { useGlobalContext } from './Context/StockContext';
import { TrendingCoins } from './config/api';

const Dashboard = () => {
  const [currency, setCurrency] = useState("INR");
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [sectorData, setSectorData] = useState([]);

  const debouncedGetTrendingCoins = useCallback(
    debounce(async (currency) => {
      try {
        const { data } = await axios.get(TrendingCoins(currency));
        setTrendingCoins(data);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    }, 300), // Adjust the delay as needed
    []
  );

  useEffect(() => {
    debouncedGetTrendingCoins(currency);
    getSectorPerformance();
  }, [currency]);

  const getSectorPerformance = async () => {
    try {
      const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);
      setSectorData(data);
    } catch (error) {
      console.error('Error fetching sector performance:', error);
    }
  };

  const { coins, setCoins, search, setSearch } = useGlobalContext();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-54 bg-gray-900 text-white">
      <div className="flex-grow p-1 ml-4 ">
        <header className="mb-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hello, Jane</h1>
            <p className="text-gray-400">{currentDate}</p>
          </div>
          <input
            type="text"
            placeholder="Search For a Crypto Currency..."
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-lg border border-gray-700"
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <NewsCard />
          <SectorPerformanceCard sectorData={sectorData} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Add your existing cards here */}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon }) => {
  return (
    <div className="my-2 text-gray-400 hover:text-blue-500 hover:border-r-4 hover:border-blue-500 p-1">
      <i className={`fas fa-${icon} text-xl`}></i>
    </div>
  );
};

const NewsCard = () => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md h-60 ml-4 flex flex-col justify-between">
      <h2 className="text-lg font-semibold mb-2 bg-gray-700 rounded-full w-1/2 p-1 px-10 flex items-center">
        The markets are
        <span className='text-green-400 cursor-pointer flex items-center ml-2'>
          bullish <GoArrowUpRight className="ml-1" />
        </span>
      </h2>
      <p className='text-gray-400 mt-10'>What you need to know Today?</p>
      <p className="text-gray-500 font-bold">
        Jan Inflation Surges, Squeezing Budgets; S&P 500 Rallies as Markets Face 'Bumpy' 2% Path
      </p>
    </div>
  );
};

const SectorPerformanceCard = ({ sectorData }) => {
  const midIndex = Math.ceil(sectorData.length / 2);
  const firstHalf = sectorData.slice(0, midIndex);
  const secondHalf = sectorData.slice(midIndex);

  return (
    <div className="px-6 py-1 bg-gray-800 rounded-lg shadow-md h-60 overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">Sector Performance</h2>
      <div className="text-gray-400 flex justify-between">
        <div className="w-1/2 mr-20">
          {firstHalf.map((sector, index) => (
            <div key={index} className="flex justify-between p-1">
              <span>{sector.name}</span>
              <span className={`text-${sector.price_change_percentage_24h > 0 ? 'green' : 'red'}-500`}>
                {sector.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
        <div className="w-1/2">
          {secondHalf.map((sector, index) => (
            <div key={index} className="flex justify-between p-1">
              <span>{sector.name}</span>
              <span className={`text-${sector.price_change_percentage_24h > 0 ? 'green' : 'red'}-500`}>
                {sector.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
