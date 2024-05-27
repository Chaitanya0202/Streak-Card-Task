import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CoinsTable from "./Components/CoinsTable";
import { AppProvider } from "./Components/Context/StockContext";
import Dashboard from "./Components/Dashboard";
import CoinPage from "./Components/Pages/CoinPage";
import SideNav from "./Components/SideNav";


function App() {
  return (

    <Router>

<AppProvider>
      {/* <Header /> */}
      <SideNav/>
      <Routes>
        <Route exact path="/" element={<CoinsTable />} />

        {/* <Route exact path="/" elmement={<CoinsTable />} /> */}
        <Route exact path="/home" element={<Dashboard />} />
        <Route path="/coins/:id" element={<CoinPage/>} exact />
      </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
