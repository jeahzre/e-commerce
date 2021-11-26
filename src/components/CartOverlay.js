import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";
import CartProduct from "./CartProduct";

class CartOverlay extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: 0,
      cartWithSelectedImageIndex: [],
    };
    this.handleChangeImage = this.handleChangeImage.bind(this);
  }

  handleChangeImage(e, lastIndex, productIndex) {
    const prevOrNext = e.target.id;
    let selectedImageIndex = 0;
    const { cart } = this.context;

    // With selected image index
    let newCart = [];

    // Override the default index with selectedImageIndex property on cartWithSelectedImageIndex which has been set before (if there is any).
    if (this.state.cartWithSelectedImageIndex.length > 0) {
      selectedImageIndex =
        this.state.cartWithSelectedImageIndex[productIndex].selectedImageIndex;
    }

    if (prevOrNext === "prev-img-btn") {
      selectedImageIndex =
        selectedImageIndex - 1 > 0 ? selectedImageIndex - 1 : lastIndex;
    } else if (prevOrNext === "next-img-btn") {
      selectedImageIndex =
        selectedImageIndex + 1 > lastIndex ? 0 : selectedImageIndex + 1;
    }

    if (this.state.cartWithSelectedImageIndex.length <= 0) {
      // If we haven't add any selectedImageIndex on this component state, add initial selected index on all product(s).
      console.log(
        "we haven't add any selectedImageIndex on this component state."
      );
      if (cart.length === 1) {
        console.log("length is 1");
        newCart = [
          {
            ...cart[productIndex],
            selectedImageIndex,
          },
        ];
      } else if (cart.length > 1) {
        console.log("length is more than 1");
        const cartBeforeProductIndex = cart
          .slice(0, productIndex)
          .map((product) => {
            return { ...product, selectedImageIndex: 0 };
          });

        const cartAfterProductIndex = cart
          .slice(productIndex + 1)
          .map((product) => {
            return { ...product, selectedImageIndex: 0 };
          });

        newCart = [
          ...cartBeforeProductIndex,
          {
            ...cart[productIndex],
            selectedImageIndex,
          },
          ...cartAfterProductIndex,
        ];
      }
    } else if (this.state.cartWithSelectedImageIndex.length > 0) {
      // If we have added selectedImageIndex on this component state, change the selectedImageIndex property of some product only and not add initial selected index on another products.
      console.log(
        "If we have added selectedImageIndex on this component state."
      );
      const prevCart = this.state.cartWithSelectedImageIndex;
      newCart = [
        ...prevCart.slice(0, productIndex),
        {
          ...prevCart[productIndex],
          selectedImageIndex,
        },
        ...prevCart.slice(productIndex + 1),
      ];
    }

    // console.log(newCart);
    this.setState({
      cartWithSelectedImageIndex: newCart,
    });
  }

  render() {
    const { cart, cartProducts, handleClearAllProducts } = this.context;
    const { isCartOverlayOpen, headerContainerLocation, handleToggleHeaderCart } = this.props;
    // console.log(cart, cartProducts);
    // console.log("CartOverlay state", this.state);
    let totalAmount = 0;
    cart.map((product) => {
      product.attributes.map((attribute) => {
        totalAmount += attribute.amount;
        return null;
      });
      return null;
    });
    let totalPrice = 0;

    cartProducts.map((cartProduct) => {
      let productAmount = 0;
      cartProduct.chosenAttributesGroups.map((chosenAttributesGroup) => {
        productAmount += chosenAttributesGroup.amount;
        return null;
      });

      cartProduct.prices.map((price) => {
        if (price.currency === this.context.currency) {
          totalPrice += price.amount * productAmount;
        }
        return null;
      });
      return null;
    });

    return (
      <>
        {
          isCartOverlayOpen &&
          <div className="cart-overlay-bg"></div>
        }
        <div
          id="cart-overlay-action-container"
          className="cart-overlay-action-container"
        >
          <button
            className="header-cart-btn"
            onClick={handleToggleHeaderCart}
          >
            <img
              src="/shopping-cart.svg"
              alt="cart"
              className="shopping-cart-img"
            />
            <span id="header-total-amount">{totalAmount}</span>
          </button>
          {isCartOverlayOpen && (
            <div className="cart-overlay-container" style={{
              top: `${headerContainerLocation.headerContainerBottom- 10}px`,
            }}>
              <button className="close-btn" onClick={handleToggleHeaderCart}>
                x
              </button>
              <div className="cart-title">My Bag, {totalAmount} items</div>
              <div className="products-container">
                {cartProducts &&
                  cartProducts.length > 0 &&
                  cartProducts.map((cartProduct, productIndex) => {
                    const cartProductProps = {
                      cartProduct,
                      productIndex,
                      cartWithSelectedImageIndex:
                        this.state.cartWithSelectedImageIndex,
                      handleChangeImage: this.handleChangeImage,
                    };
                    return <CartProduct {...cartProductProps} key={`${cartProduct.id}_cart_product`} />;
                  })}
                {((cartProducts && cart.length === 0) ||
                  (cartProducts && cart[0].id === "")) && <div>No Products</div>}
                {cart.length > 0 && (
                  <>
                    <div className="clear-all-products-container">
                      <button
                        className="clear-all-products-btn"
                        onClick={handleClearAllProducts}
                      >
                        Clear All Products
                      </button>
                    </div>
                    <div className="cart-bottom">
                      <div className="total-prices-container">
                        <div className="total-prices-title">Total</div>
                        <div className="total-prices">
                          {this.context.currency} {totalPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="cart-check-out-buttons-container">
                        <Link
                          className="view-bag-btn"
                          to={"/cart"}
                          onClick={handleToggleHeaderCart}
                        >
                          VIEW BAG
                        </Link>
                        <button className="check-out-btn">CHECK OUT</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default CartOverlay;
