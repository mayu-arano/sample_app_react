import './App.css';
import Header from './component/header/Header';
import OrderPage from './component/pages/order/OrderPage';
import HistoryPage from './component/pages/history/HistoryPage';
import SettingPage from './component/pages/setting/SettingPage';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
          <Header storeName="店舗名" />
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/setting" element={<SettingPage />} />
          </Routes>
    </div>
  );
}

export default App;
