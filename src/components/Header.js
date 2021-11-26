import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";
import CartOverlay from "./CartOverlay";
import CurrencySwitcher from "./CurrencySwitcher";

class Header extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isCurrencySwitcherOpen: false,
      isCartOverlayOpen: false,
      headerContainerLocation: {},
    };
    this.handleToggleCurrencySwitcher =
      this.handleToggleCurrencySwitcher.bind(this);
    this.handleToggleHeaderCart = this.handleToggleHeaderCart.bind(this);
  }

  componentDidMount() {
    const handleBlur = (e) => {
      // If we click element which is not inside the element we have focused. 
      if (!e.target.closest('#currency-switcher-container') && this.state.isCurrencySwitcherOpen) {
        this.setState({
          isCurrencySwitcherOpen: false
        })
      } else if (!e.target.closest('#cart-overlay-action-container') && this.state.isCartOverlayOpen) {
        this.setState({
          isCartOverlayOpen: false
        })
      }
    }
    document.body.addEventListener("click", handleBlur);
    return () => document.body.removeEventListener("click", handleBlur);
  }


  handleToggleCurrencySwitcher(e) {
    const headerContainer = document.getElementById('header-container').getBoundingClientRect();
    const headerContainerBottom = headerContainer.bottom;
    this.setState({
      isCurrencySwitcherOpen: !this.state.isCurrencySwitcherOpen,
      headerContainerLocation: { headerContainerBottom },
    });
  }

  handleToggleHeaderCart(e) {
    const headerContainer = document.getElementById('header-container').getBoundingClientRect();
    const headerContainerBottom = headerContainer.bottom;
    this.setState({
      isCartOverlayOpen: !this.state.isCartOverlayOpen,
      headerContainerLocation: { headerContainerBottom },
    });
  }

  render() {
    const {
      // cart,
      categories,
      handleCategoryUpdate,
      currencies,
      handleSwitchCurrency,
      handleSwitchTheme
    } = this.context;
    // console.log('header state', this.state);

    // let totalAmount = 0;
    // cart.map((product) => {
    //   product.attributes.map((attribute) => {
    //     totalAmount += attribute.amount;
    //     return null;
    //   });
    //   return null;
    // });

    const currencySwitcherProps = {
      currencies,
      isCurrencySwitcherOpen: this.state.isCurrencySwitcherOpen,
      headerContainerLocation: this.state.headerContainerLocation,
      handleSwitchCurrency,
      handleToggleCurrencySwitcher: this.handleToggleCurrencySwitcher,
      handleOnFocus: this.handleOnFocus
    };
    const cartOverlayProps = {
      isCartOverlayOpen: this.state.isCartOverlayOpen,
      headerContainerLocation: this.state.headerContainerLocation,
      handleToggleHeaderCart: this.handleToggleHeaderCart,
    }

    return (
      <>
        <div id="header-container">
          <header>
            <nav>
              <ul>
                {categories &&
                  categories.map((category, index) => {
                    return (
                      <li key={`${category}_category`}>
                        <Link
                          id={category}
                          className="nav-label"
                          onClick={handleCategoryUpdate} to="/"
                        >
                          {category}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </nav>
            <Link to="/" className="logo">
              <img src="/shop-logo.svg" alt="shop-logo" className="logo-img" />
            </Link>
            <div className="action-theme">
              <div id="action">
                <div id="currency-action">
                  <CurrencySwitcher {...currencySwitcherProps} />
                </div>
                <div className="cart-overlay-action">
                  <CartOverlay
                    {...cartOverlayProps}
                  />
                </div>
              </div>
              <button id="toggle-theme" onClick={handleSwitchTheme}>Theme</button>
            </div>
          </header>
        </div>
      </>
    );
  }
}

export default Header;
