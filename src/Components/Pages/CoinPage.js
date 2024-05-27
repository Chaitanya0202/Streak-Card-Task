import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from '../CoinInfo';
import { numberWithCommas } from '../CoinsTable';
import { SingleCoin } from '../config/api';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  // const { , symbol } = CryptoState();
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    console.log("data are ",data);
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
  }, []);

  if (!coin)
    return (
      <div className="w-full flex justify-center items-center">
        <div className="h-1 w-32 bg-yellow-500 animate-pulse"></div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row p-6">
      <div className="md:w-1/3 w-full flex flex-col items-center mt-6 md:mt-0 md:border-r-2 border-gray-700">
        <img
          src={coin?.image.large}
          alt={coin?.name}
          className="mb-6"
          style={{ height: "200px" }}
        />
        <h3 className="text-3xl font-bold mb-6">{coin?.name}</h3>
        <p className="text-base text-justify p-6">
          {/* {ReactHtmlParser(coin?.description.en.split(". ")[0])}. */}
        </p>
        <div className="w-full p-6">
          <div className="flex mb-4">
            <h5 className="text-xl font-bold">Rank:</h5>
            <p className="text-xl ml-4">{numberWithCommas(coin?.market_cap_rank)}</p>
          </div>
          <div className="flex mb-4">
            <h5 className="text-xl font-bold">Current Price:</h5>
            <p className="text-xl ml-4">
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </p>
          </div>
          <div className="flex mb-4">
            <h5 className="text-xl font-bold">Market Cap:</h5>
            <p className="text-xl ml-4">
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </p>
          </div>
        </div>
      </div>
      <div className="md:w-2/3 w-full">
        <CoinInfo coin={coin} />
      </div>
    </div>
  );
};

export default CoinPage;
