import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";
import Attributes from "./Attributes";

class CartProduct extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {};
    this.handleMouseEnterGallery = this.handleMouseEnterGallery.bind(this);
    this.handleMouseOutGallery = this.handleMouseOutGallery.bind(this);
    
  }

  handleMouseEnterGallery(e) {
    e.target.innerHTML += `<div className="cart-image-text">Go To Description</div>`
  }
  handleMouseOutGallery(e) {
    e.target.innerHTML = '';
  }

  render() {
    const {
      cart,
      handleChangeAmount,
      handleRemoveAttributesGroup,
      handleClearAllAttributeGroups,
      handleGiveCurrencySymbol
    } = this.context;
    const {
      handleChangeImage,
      cartWithSelectedImageIndex,
      cartProduct,
      productIndex,
      handleSetIsNotAnyInCart
    } = this.props;
    let chosenAttributesGroupIndexz = 0;
    const { id, name, brand, prices, chosenAttributesGroups, gallery } =
      cartProduct;

    // console.log("cart product state", this.props);

    return (
      <div key={`${id}_cart_product_container`} className="product-container">
        <div
          className="description cart-product-description"
          id="cart-product-description"
          key={`${id}_cart_product_description`}
        >
          <h1 key={`${id}_cart_brand`} className="brand">
            {brand}
          </h1>
          <h2 key={`${id}_name`} className="product-name">
            {name}
          </h2>
          <div className="price-container" key={`${id}_price_container`}>
            {prices &&
              prices.map((price) => {
                if (price.currency === this.context.currency) {
                  return (
                    <p key={`${price.currency}_${id}_cart_product`}>
                      {handleGiveCurrencySymbol(price.currency)}{" "}
                      {(
                        cart[productIndex].attributes[
                          chosenAttributesGroupIndexz
                        ].amount * price.amount
                      ).toFixed(2)}
                      &nbsp;&nbsp; |&nbsp;&nbsp;
                      {
                        cart[productIndex].attributes[
                          chosenAttributesGroupIndexz
                        ].amount
                      }{" "}
                      x {price.amount}
                    </p>
                  );
                } else {
                  return null;
                }
              })}
          </div>
          {cartProduct.attributes.length !== 0 &&
            chosenAttributesGroups &&
            chosenAttributesGroups.map(
              (chosenAttributesGroup, chosenAttributesGroupIndex) => {
                const attributesProps = {
                  attributes: cartProduct.attributes,
                  selectedAttributes: chosenAttributesGroup,
                  onCartProduct: true
                }
                chosenAttributesGroupIndexz = chosenAttributesGroupIndex;
                return (
                  <div className="attributes-amount-container" key={`${chosenAttributesGroupIndex}attributes-amount-container`}>
                    <Attributes {...attributesProps} />
                    <div
                      className="amount-container"
                      key={`${id}_cart_amount_container`}
                    >
                      <div
                        className="inner-amount-container"
                        key={`${id}_cart_inner_amount_container`}
                      >
                        <button
                          id="increase-amount"
                          className="increase-amount"
                          onClick={(e) =>
                            handleChangeAmount(
                              e,
                              productIndex,
                              chosenAttributesGroupIndex
                            )
                          }
                          key={`${id}_cart_increase_amount_container`}
                        >
                          ^
                        </button>
                        <div className="amount" key={`${id}_cart_amount`}>
                          {cart[productIndex] &&
                            cart[productIndex].attributes[
                            chosenAttributesGroupIndex
                            ] &&
                            cart[productIndex].attributes[
                              chosenAttributesGroupIndex
                            ].amount}
                        </div>
                        <button
                          id="decrease-amount"
                          className="decrease-amount"
                          onClick={(e) => {
                            handleChangeAmount(
                              e,
                              productIndex,
                              chosenAttributesGroupIndex
                            );
                          }}
                          key={`${id}_cart_decrease_amount`}
                        >
                          v
                        </button>
                      </div>
                    </div>
                    <div
                      className="remove-btn-container"
                      key={`${id}_cart_remove_btn_container`}
                    >
                      <button
                        className="remove-attribute-group-btn"
                        onClick={() => {
                          handleRemoveAttributesGroup(
                            productIndex,
                            chosenAttributesGroupIndex
                          )
                          if (handleSetIsNotAnyInCart && chosenAttributesGroups.length === 1) {
                            handleSetIsNotAnyInCart();
                          };
                        }
                        }
                        key={`${id}_cart_remove_attribute_group_btn`}
                      >
                        Remove Option
                      </button>
                    </div>
                  </div>
                );
              }
            )}
        </div>

        {(cartProduct.attributes.length === 0 ||
          cartWithSelectedImageIndex) && (
            <div
              className="amount-image-container"
              key={`${id}_cart_amount_image-container`}
            >
              {cartProduct.attributes.length === 0 && (
                <div
                  className="amount-container no-attribute"
                  key={`${id}_cart_remove_btn_container`}
                >
                  <div className="inner-amount-container">
                    <button
                      id="increase-amount"
                      className="increase-amount"
                      onClick={(e) =>
                        handleChangeAmount(
                          e,
                          productIndex,
                          chosenAttributesGroupIndexz
                        )
                      }
                      key={`${id}_cart_increase_amount_no_attribute`}
                    >
                      ^
                    </button>
                    <div
                      className="amount"
                      key={`${id}_cart_amount_no_attribute`}
                    >
                      {cart[productIndex] &&
                        cart[productIndex].attributes[
                        chosenAttributesGroupIndexz
                        ] &&
                        cart[productIndex].attributes[chosenAttributesGroupIndexz]
                          .amount}
                    </div>
                    <button
                      id="decrease-amount"
                      className="decrease-amount"
                      onClick={(e) => {
                        handleChangeAmount(
                          e,
                          productIndex,
                          chosenAttributesGroupIndexz
                        );
                      }}
                      key={`${id}_cart_decrease_amount_no_attribute`}
                    >
                      v
                    </button>
                  </div>
                </div>
              )}
              {cartWithSelectedImageIndex && (
                <div className="cart-images" key={`${id}_cart_images`}>
                  {/* If image is more than one, show the prev & next button. */}
                  {
                    cartProduct.gallery.length > 1 &&
                    <button
                      id="prev-img-btn"
                      className="cart-prev-image"
                      onClick={(e) =>
                        handleChangeImage(e, gallery.length - 1, productIndex)
                      }
                      key={`${id}_prev_img_btn`}
                    >
                      &#60;
                    </button>
                }
                {
                  console.log(cartWithSelectedImageIndex[productIndex] ? 'has selected index' : '0'
                    , productIndex, cartWithSelectedImageIndex[productIndex], cartWithSelectedImageIndex)
                }
                  <Link
                  to={`/pdp?id=${id}`}
                  className="cart-image"
                  style={{
                    backgroundImage: `url(${gallery[
                      (cartWithSelectedImageIndex[productIndex])
                        ? cartWithSelectedImageIndex[productIndex]
                          .selectedImageIndex
                        : 0
                    ]
                      })`,
                    backgroundPosition: "center center",
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                  key={`${id}_cart_image`}
                  onMouseEnter={this.handleMouseEnterGallery}
                  onMouseLeave={this.handleMouseOutGallery}
                  ></Link>
                  {
                    cartProduct.gallery.length > 1 &&
                    <button
                      id="next-img-btn"
                      className="cart-next-image"
                      onClick={(e) =>
                        handleChangeImage(e, gallery.length - 1, productIndex)
                      }
                      key={`${id}_cart_next_img_btn`}
                    >
                      &#62;
                    </button>
                  }
                </div>
              )}
            </div>
          )}

        <div
          className="clear-all-attributes-groups-container-btn"
          key={`${id}_cart_clear_all_attributes_groups_container_btn`}
        >
          <button
            className="clear-all-attributes-groups-btn"
            onClick={() => {
              handleClearAllAttributeGroups(productIndex)
              if (handleSetIsNotAnyInCart) {
                handleSetIsNotAnyInCart();
              }
            }}
            key={`${id}_cart_clear_all_attributes_groups_btn`}
          >
            {cartProduct.chosenAttributesGroups.length > 1
              ? "Clear All Options"
              : "Remove"}
          </button>
        </div>
      </div>
    );
  }
}

export default CartProduct;
