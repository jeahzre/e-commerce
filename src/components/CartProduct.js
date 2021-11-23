import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context";

class CartProduct extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      cart,
      handleChangeAmount,
      handleRemoveAttributesGroup,
      handleClearAllAttributeGroups,
    } = this.context;
    const {
      handleChangeImage,
      cartWithSelectedImageIndex,
      cartProduct,
      productIndex,
      handleSetIsNotAnyInCart
    } = this.props;
    let chosenAttributesGroupIndex = 0;
    const { id, name, brand, prices, chosenAttributesGroups, gallery } =
      cartProduct;
    // console.log(cartProduct, this.props);

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
          <h2 key={`${id}_cart_overlay_name`} className="product-name">
            {name}
          </h2>
          <div className="price-container" key={`${id}_price_container`}>
            {prices &&
              prices.map((price) => {
                if (price.currency === this.context.currency) {
                  return (
                    <p key={`${price.currency}_${id}_cart`}>
                      {price.currency}{" "}
                      {(
                        cart[productIndex].attributes[
                          chosenAttributesGroupIndex
                        ].amount * price.amount
                      ).toFixed(2)}
                      &nbsp;&nbsp; |&nbsp;&nbsp;
                      {
                        cart[productIndex].attributes[
                          chosenAttributesGroupIndex
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
                chosenAttributesGroupIndex = chosenAttributesGroupIndex;
                return (
                  <div className="attributes-amount-container">
                    <div className="attributes-container">
                      {cartProduct.attributes.map((attribute) => {
                        const { id, items, name, type } = attribute;
                        const isDarkTheme = document.getElementById('body').classList.contains('dark-theme');

                        if (type === "swatch") {
                          return (
                            <div
                              className="attribute-container"
                              key={`${id}cart_attribute_container`}
                            >
                              <div
                                className="attribute-title-options"
                                key={`${id}cart_attribute_title_options`}
                              >
                                <div
                                  className="attribute-title"
                                  key={`${id}cart_attribute_title`}
                                >
                                  {name}
                                </div>
                                {chosenAttributesGroup &&
                                  chosenAttributesGroup["Color"] &&
                                  attribute.items.map((item) => {
                                    if (
                                      item.value ===
                                      chosenAttributesGroup["Color"]
                                    ) {
                                      return (
                                        <p className="color-display-value">
                                          {item.displayValue}
                                        </p>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                                <div
                                  data-attribute-name={id}
                                  className="attribute-options color-swatch-container"
                                  key={`${id}_cart_attribute_options`}
                                >
                                  {items &&
                                    items.map((item) => {
                                      const { value, id } = item;
                                      const isOptionChosen =
                                        item.value ===
                                        chosenAttributesGroup[attribute.name];

                                      return (
                                        <button
                                          className="option-btn color-swatch"
                                          value={value}
                                          key={`${id}_cart_attribute_description`}
                                          data-clicked="false"
                                          style={{
                                            backgroundColor: value,
                                            border: isOptionChosen
                                              ? "3px solid #808080"
                                              : "3px solid #fff",
                                          }}
                                        ></button>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          );
                        } else if (type !== "swatch") {
                          return (
                            <>
                              <div
                                className="attribute-container"
                                key={`${id}cart_attribute_container`}
                              >
                                <div
                                  className="attribute-title-options"
                                  key={`${id}cart_attribute_title_options`}
                                >
                                  <div
                                    className="attribute-title"
                                    key={`${id}cart_attribute_title`}
                                  >
                                    {name}
                                  </div>
                                  <div
                                    data-attribute-name={id}
                                    className="attribute-options"
                                    key={`${id}_cart_attribute_title`}
                                  >
                                    {items &&
                                      items.map((item) => {
                                        const { value, displayValue, id } =
                                          item;
                                        const isOptionChosen =
                                          item.value ===
                                          chosenAttributesGroup[attribute.name];

                                        if (isDarkTheme) {
                                          return (
                                            <button
                                              className="option-btn"
                                              value={value}
                                              key={`${id}_cart_attribute_description`}
                                              data-clicked="false"
                                              style={{
                                                backgroundColor: isOptionChosen
                                                  ? "#fff"
                                                  : "#000",
                                                color: isOptionChosen
                                                  ? "#000"
                                                  : "#fff",
                                                border: isOptionChosen
                                                  ? "1px solid #000"
                                                  : "1px solid #fff",
                                              }}
                                            >
                                              {displayValue}
                                            </button>
                                          );
                                        } else if (!isDarkTheme) {
                                          return (
                                            <button
                                              className="option-btn"
                                              value={value}
                                              key={`${id}_cart_attribute_description`}
                                              data-clicked="false"
                                              style={{
                                                backgroundColor: isOptionChosen
                                                  ? "#000"
                                                  : "#fff",
                                                color: isOptionChosen
                                                  ? "#fff"
                                                  : "#000",
                                                border: isOptionChosen
                                                  ? "1px solid #fff"
                                                  : "1px solid #000",
                                              }}
                                            >
                                              {displayValue}
                                            </button>
                                          );
                                        }
                                        return null;
                                      })}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        }
                        return null;
                      })}
                    </div>
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
                        chosenAttributesGroupIndex
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
                        chosenAttributesGroupIndex
                      ] &&
                      cart[productIndex].attributes[chosenAttributesGroupIndex]
                        .amount}
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
                    key={`${id}_cart_decrease_amount_no_attribute`}
                  >
                    v
                  </button>
                </div>
              </div>
            )}
            {cartWithSelectedImageIndex && (
              <div className="cart-images" key={`${id}_cart_images`}>
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
                <Link
                  to={`/pdp?id=${id}`}
                  className="cart-image"
                  style={{
                    backgroundImage: `url(${
                      gallery[
                        cartWithSelectedImageIndex.length > 0
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
                ></Link>
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
