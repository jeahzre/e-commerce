import { Component } from "react";

class CurrencySwitcher extends Component {
  render() {
    const {
      handleToggleCurrencySwitcher,
      currencies,
      handleSwitchCurrency,
      buttonLocation,
      isCurrencySwitcherOpen,
    } = this.props;
    // console.log(this.props);
    return (
      <>
        <button onClick={handleToggleCurrencySwitcher}>
          <span>$</span>
          <i>{isCurrencySwitcherOpen ? "^" : "v"}</i>
        </button>
        <div
          className="currency-switcher"
          style={{
            top: `${buttonLocation.buttonBottom}px`,
            display: isCurrencySwitcherOpen ? "grid" : "none",
          }}
        >
          {isCurrencySwitcherOpen &&
            currencies.map((currency) => {
              return (
                <button
                  id={currency}
                  key={`${currency}_switcher`}
                  className="currency"
                  onClick={handleSwitchCurrency}
                >
                  {currency}
                </button>
              );
            })}
        </div>
      </>
    );
  }
}

export default CurrencySwitcher;
