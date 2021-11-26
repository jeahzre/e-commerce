import React, { Component } from "react";
import CartProduct from "../components/CartProduct";
import { AppContext } from "../context";

class Cart extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      // Cart with selected image index property.
      cartWithSelectedImageIndex: [],
    };
    this.handleChangeImage = this.handleChangeImage.bind(this);
  }

  componentWillUnmount() {
    window.scrollTo(0, 0);
  }

  handleChangeImage(e, lastIndex, productIndex) {
    // console.log(e, lastIndex, productIndex);
    const prevOrNext = e.target.id;
    // console.log(prevOrNext, lastIndex);
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
    console.log('Cart state', this.state);

    return (
      <>
        <div className="cart-container">
          <div className="cart-title">Cart</div>
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
                return <CartProduct {...cartProductProps} key={`${cartProduct.id}_cart_product_cart`}/>;
              })}
            {(cart.length === 0 || cart[0].id === "") && <div>No Products</div>}
            {cart.length > 0 && (
              <div className="clear-all-products-container">
                <button
                  className="clear-all-products-btn"
                  onClick={handleClearAllProducts}
                >
                  Clear All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Cart;
