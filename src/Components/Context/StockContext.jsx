import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  let navigate = useNavigate();

  const [count, setCount] = useState(1);
  const [search, setSearch] = useState("");
  const [coins, setCoins] = useState([]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <AppContext.Provider value={{handleSearch, count, setCount, search, setSearch,coins, setCoins}}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
