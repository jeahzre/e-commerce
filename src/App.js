import Header from "./components/Header";
import "./App.css";
import Category from "./page/Category";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PDP from "./page/PDP";
import Cart from "./page/Cart";
import React, { Component } from "react";
import ScrollToTop from "./components/ScrollToTop";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    console.log(window.location);
    return (
      <>
        <BrowserRouter>
          <ScrollToTop/>
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
