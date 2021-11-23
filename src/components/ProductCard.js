import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";
import Attributes from "./Attributes";
import CartProduct from "./CartProduct";

class ProductCard extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      showButtonClicked: false,
      showTypeInCart: false,
      isNotAnyInCart: true,
      attributes: {},
      productCard: {},
    };
    this.handleClickAttributeBtns = this.handleClickAttributeBtns.bind(this);
    this.handleSetIsNotAnyInCart = this.handleSetIsNotAnyInCart.bind(this);
  }

  componentDidMount() {
    const { getSingleProduct } = this.context;
    const { id } = this.props;
    getSingleProduct(id, false).then((data) => {
      this.setState({
        productCard: {
          ...data,
        },
      });
    });
  }

  handleCheckSelectedAllAttribute(attributes, handleAddToCart, idToAdd) {
    const selectedAttributes = this.state.attributes;
    let allAttributes = [];
    attributes.map((attribute) => {
      allAttributes.push(attribute.id);
      return null;
    });
    // console.log(
    //   "check attribute",
    //   allAttributes.every((mandatoryAttribute) =>
    //     Object.keys(selectedAttributes).includes(mandatoryAttribute)
    //   )
    // );

    // Check whether we have chosen all attributes.
    if (
      allAttributes.every((mandatoryAttribute) =>
        Object.keys(selectedAttributes).includes(mandatoryAttribute)
      )
    ) {
      console.log("selected all attributes");
      return (
        <Link
          to="/cart "
          onClick={() =>
            handleAddToCart(window.location, selectedAttributes, idToAdd)
          }
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

  handleClickAttributeBtns(e) {
    const attributeOptions = e.target.closest(".attribute-options");
    const attributeName = attributeOptions.dataset.attributeName;
    const attributeValue = e.target.value;
    const { handleClickAttributeBtns } = this.context;
    handleClickAttributeBtns(e, true);
    this.setState({
      attributes: {
        ...this.state.attributes,
        [attributeName]: attributeValue,
      },
    })
  }

  handleSetIsNotAnyInCart() {
    console.log('is not any');
    this.setState({
      isNotAnyInCart: true
    })
  }

  render() {
    const { id, name, gallery, prices, brand, inStock, attributes } =
      this.state.productCard;
    const { cartProducts, handleAddToCart } = this.context;
    // console.log(productIndex, attributes);
    const attributesProps = {
      attributes,
      selectedAttributes: this.state.attributes,
      handleClickAttributeBtns: this.handleClickAttributeBtns,
    };

    return (
      <>
        {Object.keys(this.state.productCard).length > 0 && (
          <div
            className="product-card"
            style={{
              height: this.state.showTypeInCart ? "auto" : "auto",
            }}
          >
            <div className="inner-product-card">
              <Link
                to={`/pdp?id=${id}`}
                key={`${id}_product_card`}
                className="product-card-link"
              >
                <div className={inStock ? "in-stock" : "out-of-stock"}></div>
                <div
                  className={`img ${
                    inStock ? "in-stock-img" : "out-of-stock-img"
                  }`}
                  style={{
                    background: `url(${gallery[0]})`,
                    backgroundPosition: "center center",
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                  key={`${id}_product_card_out_of_stock_img`}
                >
                  {!inStock && (
                    <div className="out-of-stock">
                      <span className="out-of-stock-label">OUT OF STOCK</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="content" key={`${id}_3`}>
                <h1 key={`${id}_4`} className="brand">
                  {brand}
                </h1>
                <h2 key={`${id}_5`} className="product-name">
                  {name}
                </h2>
                <Attributes {...attributesProps} />
                {prices.map((price) => {
                  if (price.currency === this.context.currency) {
                    return (
                      <p key={`${id}_6`} className="product-card-price">
                        {price.currency} {price.amount}
                      </p>
                    );
                  }
                  return null;
                })}
                {
                  // To determine whether to include the button with link or no.
                  inStock &&
                    this.handleCheckSelectedAllAttribute(
                      attributes,
                      handleAddToCart,
                      id
                    )
                }
                {!inStock && (
                  <button className="out-of-stock-btn">
                    <div className="add-to-cart-label">OUT OF STOCK</div>
                  </button>
                )}
              </div>
              <button
                className="type-in-cart-btn"
                onClick={() => {
                  this.setState({
                    showButtonClicked: true,
                    showTypeInCart: !this.state.showTypeInCart,
                  });
                }}
              >
                v
              </button>
            </div>
            {this.state.showTypeInCart && (
              <div className="product-card-in-cart">
                {cartProducts.map((cartProduct, productIndex) => {
                  console.log("mapping");
                  if (cartProduct.id === id) {
                    if (this.state.isNotAnyInCart === true) {
                      this.setState({
                        isNotAnyInCart: false,
                      });
                    }
                    console.log("same id");
                    const cartProductProps = {
                      cartProduct,
                      productIndex,
                      handleSetIsNotAnyInCart: this.handleSetIsNotAnyInCart
                    };
                    return <CartProduct {...cartProductProps} />;
                  } else {
                    console.log("is not same id");
                    return null;
                  }
                })}
                {this.state.showTypeInCart && this.state.isNotAnyInCart && (
                  <div className="not-any">
                    There is not any of this product in your cart.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
  }
}

export default ProductCard;
