import React, { Component } from "react";
import { AppContext } from "../context";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import CartProduct from "../components/CartProduct";
import Attributes from "../components/Attributes";

class Description extends Component {
  // Value provided from context.js. To get the context property value, use this.context.
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: 0,
      selectedColor: "",
      isNotAnyInCart: false,
    };
    this.handleOptionsClicked = this.handleOptionsClicked.bind(this);
    this.handleCheckSelectedAllAttribute =
      this.handleCheckSelectedAllAttribute.bind(this);
  }

  componentDidMount() {
    const { getSingleProduct } = this.context;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    getSingleProduct(id, true);
  }

  componentWillUnmount() {
    window.scrollTo(0, 0);
  }

  handleOptionsClicked(e) {
    this.setState({
      selectedImageIndex: Number(e.target.dataset.index),
    });
  }

  handleCheckSelectedAllAttribute(PDP, handleAddToCart) {
    const { attributes } = this.context;
    let allAttributes = [];
    PDP.attributes.map((attribute) => {
      allAttributes.push(attribute.id);
      return null;
    });
    // console.log(
    //   "check attribute",
    //   allAttributes.every((mandatoryAttribute) =>
    //     Object.keys(attributes).includes(mandatoryAttribute)
    //   )
    // );
    
    // Check whether we have chosen all attributes.
    if (
      allAttributes.every((mandatoryAttribute) =>
        Object.keys(attributes).includes(mandatoryAttribute)
      )
    ) {
      console.log("selected all attributes");
      return (
        <Link
          to="/cart "
          onClick={() => handleAddToCart(window.location, attributes)}
          className="add-to-cart-btn"
        >
          <div className="add-to-cart-label">ADD TO CART</div>
        </Link>
      );
    } else {
      return (
        <button
          onClick={() => alert("Please choose all attributes.")}
          className="add-to-cart-btn"
        >
          <div className="add-to-cart-label">ADD TO CART</div>
        </button>
      );
    }
  }

  render() {
    const {
      PDP,
      cartProducts,
      handleAddToCart,
      handleClickAttributeBtns,
      attributes: selectedAttributes,
      handleGiveCurrencySymbol
    } = this.context;
    console.log("PDP state", this.state);
    let attributesProps = {};
    if (PDP) {
      attributesProps = {
        attributes: PDP.attributes,
        selectedAttributes,
        handleClickAttributeBtns,
      };
    }

    return (
      <>
        {PDP && (
          <div className="img-description-container">
            <div className="options">
              {PDP.gallery.map((aPicture, index) => {
                return (
                  <button
                    key={`${PDP.id}_${index}_pdp_gallery`}
                    style={{
                      backgroundImage: `url(${aPicture})`,
                      backgroundPosition: "center center",
                      backgroundSize: "auto 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                    className={`option ${
                      PDP.inStock ? "in-stock-img" : "out-of-stock-img"
                    }`}
                    data-index={index}
                    onClick={this.handleOptionsClicked}
                  >
                    <div
                      key={`${PDP.id}_${index}_pdp_gallery_out_of_stock`}
                      className={!PDP.inStock ? "out-of-stock" : ""}
                    ></div>
                  </button>
                );
              })}
            </div>
            <div className="description-container">
              <div
                className={`img-description ${
                  PDP.inStock ? "in-stock-img" : "out-of-stock-img"
                }`}
                style={{
                  backgroundImage: `url(${
                    PDP.gallery[this.state.selectedImageIndex]
                  })`,
                  backgroundPosition: "center center",
                  backgroundSize: "auto 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {!PDP.inStock && (
                  <div className={!PDP.inStock && "out-of-stock"}>
                    <span>OUT OF STOCK</span>
                  </div>
                )}
              </div>
              <div className="description">
                <h1 className="brand">{PDP.brand}</h1>
                <h2 className="product-name">{PDP.name}</h2>
                <Attributes {...attributesProps}/>
                <div className="price-container">
                  <div className="price-title">PRICE</div>
                  {PDP.prices.map((price) => {
                    if (price.currency === this.context.currency) {
                      return (
                        <p key={`${price.currency}_pdp_currency_${PDP.id}`}>
                          {handleGiveCurrencySymbol(price.currency)}&nbsp;{price.amount}
                        </p>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
                {
                  // To determine whether to include the button with link or no.
                  PDP.inStock &&
                    this.handleCheckSelectedAllAttribute(PDP, handleAddToCart)
                }
                {!PDP.inStock && (
                  <button className="out-of-stock-btn">
                    <div className="add-to-cart-label">OUT OF STOCK</div>
                  </button>
                )}
                <div className="description-text">
                  {/* without using dangerouslySetInnerHTML */}
                  {ReactHtmlParser(PDP.description)}
                </div>
              </div>
              <div className="type-in-cart">
                <div className="in-cart-title">In Your Cart</div>
                {cartProducts.length > 0 &&
                  cartProducts.map((cartProduct, productIndex) => {
                    if (cartProduct.id === PDP.id) {
                      const cartProductProps = {
                        cartProduct,
                        productIndex,
                      };
                      return <CartProduct {...cartProductProps} key={`${cartProduct.id}_cart_product_pdp`}/>;
                    } else {
                      return null;
                    }
                  })}
                {(cartProducts.length === 0 || this.state.isNotAnyInCart) && (
                  <div className="not-any">
                    There is not any of this product in your cart.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Description;
