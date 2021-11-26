import { Component } from "react";
import { AppContext } from "../context";

class CurrencySwitcher extends Component {
  static contextType = AppContext;

  render() {
    const {
      handleToggleCurrencySwitcher,
      currencies,
      handleSwitchCurrency,
      headerContainerLocation,
      isCurrencySwitcherOpen
    } = this.props;

    const { handleGiveCurrencySymbol, currency } = this.context;
    // console.log(this.props);

    return (
      <div id="currency-switcher-container" className="currency-switcher-action-container">
        <button onClick={handleToggleCurrencySwitcher} className="action-button">
          <span>{handleGiveCurrencySymbol(currency)}</span>
          <i>{isCurrencySwitcherOpen ? "^" : "v"}</i>
        </button>
        {isCurrencySwitcherOpen &&
          <div
            className="currency-switcher"
            style={{
              top: `${headerContainerLocation.headerContainerBottom}px`,
              display: isCurrencySwitcherOpen ? "grid" : "none",
            }}
          >
            {isCurrencySwitcherOpen &&
            currencies.map((currency) => {
              const isCurrentCurrency = currency === this.context.currency;
                return (
                  <button
                    id={currency}
                    key={`${currency}_switcher`}
                    className={`currency ${isCurrentCurrency && `current`}`}
                    onClick={(e) => {
                      handleSwitchCurrency(e);
                      handleToggleCurrencySwitcher();
                    }
                    }
                  >
                    <span>{handleGiveCurrencySymbol(currency)}</span>
                    <span>{currency}</span>
                  </button>
                );
              })}
          </div>
        }
      </div>
    );
  }
}

export default CurrencySwitcher;
