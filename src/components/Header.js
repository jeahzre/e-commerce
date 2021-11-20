import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";
import CartOverlay from "./CartOverlay";
import CurrencySwitcher from "./CurrencySwitcher";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCurrencySwitcherOpen: false,
      isCartOverlayOpen: false,
      buttonLocation: {},
    };
    this.handleToggleCurrencySwitcher =
      this.handleToggleCurrencySwitcher.bind(this);
    this.handleToggleHeaderCart = this.handleToggleHeaderCart.bind(this);
  }

  static contextType = AppContext;

  handleToggleCurrencySwitcher(e) {
    console.log(e.currentTarget);
    const button = e.target.getBoundingClientRect();
    const buttonBottom = button.bottom;
    this.setState({
      isCurrencySwitcherOpen: !this.state.isCurrencySwitcherOpen,
      buttonLocation: { buttonBottom },
    });
  }

  handleToggleHeaderCart(e) {
    const button = e.target.getBoundingClientRect();
    const buttonBottom = button.bottom;
    this.setState({
      isCartOverlayOpen: !this.state.isCartOverlayOpen,
      buttonLocation: { buttonBottom },
    });
  }

  render() {
    const {
      cart,
      categories,
      handleCategoryUpdate,
      currencies,
      handleSwitchCurrency,
    } = this.context;
    console.log(this.state);
    let totalAmount = 0;
    cart.map((product) => {
      product.attributes.map((attribute) => {
        totalAmount += attribute.amount;
        return null;
      });
      return null;
    });
    const currencySwitcherProps = {
      currencies,
      handleSwitchCurrency,
      handleToggleCurrencySwitcher: this.handleToggleCurrencySwitcher,
      isCurrencySwitcherOpen: this.state.isCurrencySwitcherOpen,
      buttonLocation: this.state.buttonLocation,
    };

    return (
      <>
        <div id="header-container">
          <header>
            <nav>
              <ul>
                {categories &&
                  categories.map((category, index) => {
                    return (
                      <li key={index}>
                        <button
                          id={category}
                          className="nav-label"
                          onClick={handleCategoryUpdate}
                        >
                          {category}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </nav>
            <Link to="/" className="logo">
              <img src="/shop-logo.svg" alt="shop-logo" className="logo-img" />
            </Link>
            <div id="action">
              <div id="currency-action">
                <CurrencySwitcher {...currencySwitcherProps} />
              </div>
              <div className="cart-overlay-action">
                <button
                  className="header-cart-btn"
                  onClick={this.handleToggleHeaderCart}
                >
                  <img
                    src="/shopping-cart.svg"
                    alt="cart"
                    className="shopping-cart-img"
                  />
                  <span id="header-total-amount">{totalAmount}</span>
                </button>
                {this.state.isCartOverlayOpen && (
                  <CartOverlay
                    buttonLocation={this.state.buttonLocation}
                    handleToggleHeaderCart={this.handleToggleHeaderCart}
                  />
                )}
              </div>
            </div>
          </header>
        </div>
      </>
    );
  }
}

export default Header;
