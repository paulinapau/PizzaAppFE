import React from 'react'
import './App.css';
import Main from './Pages/Main';
import OrderedPizzas from './Pages/OrderedPizzas';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/OrderedPizzas" element={<OrderedPizzas />}></Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
