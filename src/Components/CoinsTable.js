import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CoinList, HistoricalChart } from "../Components/config/api";
import { useGlobalContext } from "./Context/StockContext";
import Dashboard from "./Dashboard";
import SelectButton from "./SelectButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const chartDays = [
  { label: "1 D", value: 1 },
  { label: "1 W", value: 7 },
  { label: "1 M", value: 30 },
  { label: "3 M", value: 90 },
  { label: "1 Y", value: 365 },
  { label: "All", value: "all" },
];

export default function CoinsTable() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const [flag, setFlag] = useState(false);

  const navigate = useNavigate();
  const { coins, setCoins, search, setSearch } = useGlobalContext();

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
      if (data.length > 0) {
        setSelectedCoin(data[0]);
      }
    } catch (error) {
      toast.error('Error fetching coins. You have exceeded the limit. Please try again later.');

      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchHistoricData = useCallback(
    debounce(async (coin) => {
      if (!coin) return;
      try {
        const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
        setHistoricData(data.prices);
        setFlag(true);
      } catch (error) {
        // toast.error('Error fetching historical data. Please try again later.');
        toast.error('Error fetching historical data. You have exceeded the limit. Please try again later.');

        console.error('Error fetching historical data:', error);
      }
    }, 300),
    [days, currency]
  );

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  useEffect(() => {
    if (selectedCoin) {
      debouncedFetchHistoricData(selectedCoin);
    }
  }, [days, selectedCoin, currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 450, behavior: "smooth" });
  };

  return (
    <>
      <Dashboard />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-54 bg-gray-900 text-white">
        <div className="w-full max-w-12xl p-1 bg-gray-800 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            {/* Card 1: Cryptocurrency Table */}
            <div className="w-full md:w-1/2 bg-gray-900 ml-1 p-6 rounded-lg">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="w-full h-1 bg-white mb-4" />
                ) : (
                  <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-500">
                      <tr>
                        {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                          <th
                            key={head}
                            className="p-1 text-left font-semibold text-black"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {handleSearch()
                        .slice((page - 1) * 10, (page - 1) * 10 + 10)
                        .map((row) => {
                          const profit = row.price_change_percentage_24h > 0;
                          return (
                            <tr
                              key={row.name}
                              onClick={() => setSelectedCoin(row)}
                              className="cursor-pointer bg-gray-700 hover:bg-gray-600"
                            >
                              <td className="p-1 flex items-center space-x-2 ">
                                <img
                                  src={row.image}
                                  alt={row.name}
                                  className="w-8 h-8"
                                />
                                <div>
                                  <span className="block mr-20 font-semibold">
                                    {row.symbol.toUpperCase()}
                                  </span>
                                  <span className="block text-gray-400">{row.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                              </td>
                              <td
                                className={`py-4 text-right ${
                                  profit ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {profit && "+"}
                                {row.price_change_percentage_24h.toFixed(2)}%
                              </td>
                              <td className="p-4 text-right">
                                {symbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 mx-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page * 10) >= handleSearch().length}
                  className="px-4 py-2 mx-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Card 2: Coin Information */}
            <div className="w-full md:w-1/2 bg-gray-900 p-6 rounded-lg">
              {selectedCoin ? (
                <div className="flex flex-col items-center justify-center w-full mt-6 p-6 bg-gray-800 rounded-lg">
                  {!historicData || flag === false ? (
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-32 w-32 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.528 1.291A8.002 8.002 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <>
                      <Line
                        data={{
                          labels: historicData.map((coin) => {
                            let date = new Date(coin[0]);
                            let time =
                              date.getHours() > 12
                                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                : `${date.getHours()}:${date.getMinutes()} AM`;
                            return days === 1 ? time : date.toLocaleDateString();
                          }),
                          datasets: [
                            {
                              data: historicData.map((coin) => coin[1]),
                              label: `Price (Past ${days} Days) in ${currency}`,
                              borderColor: "#FFFFFF",
                              fill: true,
                            },
                          ],
                        }}
                        options={{
                          elements: {
                            point: {
                              radius: 1,
                            },
                          },
                        }}
                      />
                      <div className="flex justify-around mt-6 w-full">
                        {chartDays.map((day) => (
                          <SelectButton
                            key={day.value}
                            onClick={() => {
                              setDays(day.value);
                              setFlag(false);
                            }}
                            selected={day.value === days}
                          >
                            {day.label}
                          </SelectButton>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Select a coin to view details</h2>
                  <p className="text-gray-400">Click on a coin in the table to see its details here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
