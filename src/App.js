import Header from "./components/Header";
import "./App.css";
import Category from "./page/Category";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PDP from "./page/PDP";
import Cart from "./page/Cart";
import React, { Component } from "react";

class App extends Component {

  render() {
    return (
      <>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Category />} />
            <Route path="/pdp" element={<PDP />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
