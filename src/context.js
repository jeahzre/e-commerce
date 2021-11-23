import React, { Component } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const AppContext = React.createContext(null);

class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsByCategory: [],
      categories: "",
      category: "",
      currencies: [],
      currency: "USD",
      // Cart.js (used in)
      cart: [],
      cartProducts: [],
      // PDP.js
      attributes: {},
    };
    this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
    this.getSingleProduct = this.getSingleProduct.bind(this);
    this.handleSwitchCurrency = this.handleSwitchCurrency.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleClickAttributeBtns = this.handleClickAttributeBtns.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleRemoveAttributesGroup =
      this.handleRemoveAttributesGroup.bind(this);
    this.handleClearAllAttributeGroups =
      this.handleClearAllAttributeGroups.bind(this);
    this.handleClearAllProducts = this.handleClearAllProducts.bind(this);
  }

  componentDidMount() {
    console.log(this.state.category);
    const client = new ApolloClient({
      uri: "http://localhost:4000/",
      cache: new InMemoryCache(),
    });

    // Get categories and set current chosen category.
    client
      .query({
        query: gql`
          query GetCategoriesName {
            categories {
              name
            }
          }
        `,
      })
      .then((result) => {
        let categories = [];
        result.data.categories.map((category) =>
          categories.push(category.name)
        );
        client
          .query({
            query: gql`
              query GetProductsByCategory {
                  category(input: {
                      title: "${this.state.category}"
                  }) {
                      name
                      products {
                          attributes {
                            id
                            name
                            type
                            items {
                              displayValue
                              value
                              id
                            }
                          }
                          brand
                          id
                          name
                          inStock
                          gallery
                          prices {
                              currency
                              amount
                          }
                      }
                  }
              }
              `,
          })
          .then((result) => {
            const newState = {
              categories: [result.data.category.name, ...categories],
              category: result.data.category.name,
              productsByCategory: result.data.category.products,
            };
            this.setState(newState);
          });
      });

    // Get currencies
    client
      .query({
        query: gql`
          query GetCurrencies {
            currencies
          }
        `,
      })
      .then((result) => {
        const newState = {
          currencies: result.data.currencies,
        };
        this.setState(newState);
      });
  }
  
  // Header.js
  handleCategoryUpdate(e) {
    let category = e.target.id;
    if (category === "all") {
      category = "";
    }
    const client = new ApolloClient({
      uri: "http://localhost:4000/",
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql`
          query GetProductsByCategory {
                category(input: {
                    title: "${category}"
                }) {
                    name
                    products {
                        attributes {
                          id
                          name
                          type
                          items {
                            displayValue
                            value
                            id
                          }
                        }
                        brand
                        id
                        name
                        inStock
                        gallery
                        prices {
                            currency
                            amount
                        }
                    }
                }
            }
          `,
      })
      .then((result) => {
        const newState = {
          category: result.data.category.name,
          productsByCategory: result.data.category.products,
          loading: result.loading,
        };
        this.setState(newState);
      });
  }

  handleSwitchCurrency(e) {
    const currency = e.target.id;
    this.setState({
      currency,
    });
  }

  // Description.js & Cart.js
  getSingleProduct(id, onPDP) {
    const client = new ApolloClient({
      uri: "http://localhost:4000/",
      cache: new InMemoryCache(),
    });

    return new Promise((resolve) => {
      client
        .query({
          query: gql`
          query GetSingleProduct {
              product(id: "${id}") {
                  id
                  name
                  brand
                  description
                  gallery
                  inStock
                  prices {
                      currency
                      amount
                  }
                  attributes {
                      id
                      type
                      name
                      items {
                          id
                          displayValue
                          value
                      }
                  }
                  }
              }
          `,
        })
        .then((result) => {
          if (onPDP) {
            this.setState({ PDP: result.data.product });
          }
          resolve(result.data.product);
        });
    });
  }

  // Description.js & ProductCard.js
  handleClickAttributeBtns(e, onProductCard) {
    const attributeOptions = e.target.closest(".attribute-options");
    const attributeType = e.target.dataset.attributeType;
    const attributeName = attributeOptions.dataset.attributeName;
    const attributeValue = e.target.value;
    const optionBtnsByAttribute =
      attributeOptions.getElementsByClassName("option-btn");
    const isDarkTheme = document.getElementById('body').classList.contains('dark-theme');

    // console.log(attributeName, attributeValue, attributeType);

    if (attributeType === "swatch") {
      Array.from(optionBtnsByAttribute).map((optionBtn) => {
        // If we have clicked some option and want to click another option, the clicked style in previous option will be removed. Has some error: Property 'dataset' & 'style' does not exist on type 'Element' (TypeScript said). Even though like that, it still works.
        if (
          e.target.dataset.clicked === "false" &&
          optionBtn.dataset.clicked === "true"
        ) {
          if (isDarkTheme) {
            optionBtn.style.border = "3px solid #000";
          } else {
            optionBtn.style.border = "3px solid #fff";
          }
          optionBtn.dataset.clicked = "false";
        }
        return null;
      });

      // Following conditional statement must be in if else statement and not in if if statement. Otherwise, data-clicked will be changed to false and fulfill the false condition, too.
      if (e.target.dataset.clicked === "true") {
        if (isDarkTheme) {
          e.target.style.border = "3px solid #000";
        } else {
          e.target.style.border = "3px solid #fff";
        }
        e.target.dataset.clicked = "false";
        // Remove attribute name property from state.
        const prevAttributes = { ...this.state.attributes };
        let newAttributes = {};
        for (let key in this.state.attributes) {
          if (attributeName !== key) {
            newAttributes[key] = prevAttributes[key];
          }
        }
        this.setState({
          attributes: newAttributes,
        });
      } else if (e.target.dataset.clicked === "false") {
        if (isDarkTheme) {
          e.target.style.border = "3px solid #fff";
        } else {
          e.target.style.border = "3px solid #808080";
        }

        e.target.dataset.clicked = "true";
        // es6 computed property name e.g {[a]:''}
        this.setState({
          attributes: {
            ...this.state.attributes,
            [attributeName]: attributeValue,
          },
        });
      }
    } else if (attributeType !== "swatch") {
      Array.from(optionBtnsByAttribute).map((optionBtn) => {
        // If we have clicked some option and want to click another option, the clicked style in previous option will be removed. Has some error: Property 'dataset' & 'style' does not exist on type 'Element' (TypeScript said). Even though like that, it still works.
        if (
          e.target.dataset.clicked === "false" &&
          optionBtn.dataset.clicked === "true"
        ) {
          if (isDarkTheme) {
            optionBtn.style.backgroundColor = "#000";
            optionBtn.style.color = "#fff";
          } else {
            optionBtn.style.backgroundColor = "#fff";
            optionBtn.style.color = "#000";
          }
          optionBtn.dataset.clicked = "false";
        }
        return null;
      });

      // Following conditional statement must be in if else statement and not in if if statement. Otherwise, data-clicked will be changed to false and fulfill the false condition, too.
      if (e.target.dataset.clicked === "true") {
        if (isDarkTheme) {
          e.target.style.backgroundColor = "#000";
          e.target.style.color = "#fff";
        } else {
          e.target.style.backgroundColor = "#fff";
          e.target.style.color = "#000";
        }
        e.target.dataset.clicked = "false";
        // Remove attribute name property from state.
        const prevAttributes = { ...this.state.attributes };
        let newAttributes = {};
        for (let key in this.state.attributes) {
          if (attributeName !== key) {
            newAttributes[key] = prevAttributes[key];
          }
        }
        this.setState({
          attributes: newAttributes,
        });
      } else if (e.target.dataset.clicked === "false") {
        if (isDarkTheme) {
          e.target.style.backgroundColor = "#fff";
          e.target.style.color = "#000";
        } else {
          e.target.style.backgroundColor = "#000";
          e.target.style.color = "#fff";
        }
        e.target.dataset.clicked = "true";
        // es6 computed property name e.g {[a]:''}
        if (!onProductCard) {
          this.setState({
            attributes: {
              ...this.state.attributes,
              [attributeName]: attributeValue,
            },
          })
        };
      }
    }
  }

  handleAddToCart(windowLocation, attributeGroupToAdd, idToAdd) {
    this.setState({
      attributes: {},
    });
    console.log("added to cart");
    let id;
    let urlParams;
    // windowLocation = window.location
    if (windowLocation.search) {
      urlParams = new URLSearchParams(windowLocation.search);
      id = urlParams.get("id");
    } else {
      id = idToAdd;
    }
    const initialItem = {
      id: id,
      attributes: [{ ...attributeGroupToAdd, amount: 1 }],
    };
    let newCart = [];

    if (this.state.cart.length === 0) {
      console.log("initial");
      // If this.state.cart only has initial meanless product (inital product is set because can't map empty array).
      newCart = [initialItem];
      this.setState({
        cart: [initialItem],
      });
    } else if (this.state.cart.length > 0) {
      let hasSameID = false;
      let sameIDsameAttributesGroup;
      let attributeIndex = 0;
      let productIndex = 0;
      const prevCart = this.state.cart;

      // Check whether cart has same product ID which will be added.
      this.state.cart.map((product, index) => {
        console.log("same id?", product.id, id);
        if (product.id === id) {
          hasSameID = true;
          productIndex = index;
          console.log("same id");
          const productAttributeToBeUpdated = product.attributes.filter(
            (attribute, index) => {
              // Exclude amount property and take otherKeys.
              const { amount, ...otherKeys } = attribute;
              console.log(
                JSON.stringify(otherKeys),
                JSON.stringify(attributeGroupToAdd),
                JSON.stringify(otherKeys) ===
                  JSON.stringify(attributeGroupToAdd)
              );
              // If attributeGroupToAdd is same as attributesGroup in our cart.
              if (
                JSON.stringify(otherKeys) ===
                JSON.stringify(attributeGroupToAdd)
              ) {
                // Get attribute index to be updated.
                attributeIndex = index;
                sameIDsameAttributesGroup = true;
                return true;
              } else {
                return false;
              }
            }
          )[0];
          console.log(
            "attribute to be updated",
            productAttributeToBeUpdated,
            attributeIndex
          );
        } else if (product.id !== id) {
          // If product has not been in cart yet. Don't assign hasSameID to false. Otherwise hasSameID with value true will be switched back to false due to mapping the cart with next product id.
          console.log("products with same id has not been in cart");
        }
        return null;
      });

      // Add to cart.
      if (hasSameID) {
        console.log("has same ID");
        console.log("index", productIndex, attributeIndex);
        console.log(this.state.cart[productIndex]);

        if (sameIDsameAttributesGroup) {
          // If has any same attributes group in cart, pick product with same id & attribute and increase the amount.
          console.log("same id and attributes group");
          newCart = [
            ...prevCart.slice(0, productIndex),
            {
              ...prevCart[productIndex],
              attributes: [
                ...prevCart[productIndex].attributes.slice(0, attributeIndex),
                {
                  ...prevCart[productIndex].attributes[attributeIndex],
                  amount:
                    prevCart[productIndex].attributes[attributeIndex].amount +
                    1,
                },
                ...prevCart[productIndex].attributes.slice([
                  attributeIndex + 1,
                ]),
              ],
            },
            ...prevCart.slice(productIndex + 1),
          ];
        } else if (!sameIDsameAttributesGroup) {
          // If has not any same attributes group, pick product with same id, but different attribute.
          const initialAttributes = { ...attributeGroupToAdd, amount: 1 };
          console.log("same id but different attributes group");
          newCart = [
            ...prevCart.slice(0, productIndex),
            {
              ...prevCart[productIndex],
              attributes: [
                ...prevCart[productIndex].attributes.slice(0),
                initialAttributes,
              ],
            },
            ...prevCart.slice(productIndex + 1),
          ];
        }
      } else if (!hasSameID) {
        console.log("does not have same id");
        newCart = [
          ...this.state.cart,
          {
            ...initialItem,
          },
        ];
      }
    }
    
    // Fetch products specific data.
    newCart.map((product, productIndex) => {
      const { id, attributes } = product;
      console.log("product to be fetched", product);
      if (id !== "") {
        console.log("id is not empty");
        new Promise((resolve) => {
          this.getSingleProduct(id, false).then((data) => {
            console.log("data fetched", data);
            const newCartProducts = [
              ...this.state.cartProducts.slice(0, productIndex),
              {
                ...data,
                chosenAttributesGroups: attributes,
              },
            ];
            resolve(newCartProducts);
          });
        }).then((newCartProducts) => {
          this.setState({
            cart: newCart,
            cartProducts: newCartProducts,
          });
        });
      }
      return null;
    });
  }

  // Cart.js
  handleChangeAmount(e, productIndex, chosenAttributesGroupIndex) {
    const changeAmountType = e.target.id; // Increase or decrease.
    const prevCart = this.state.cart;
    const prevCartProducts = this.state.cartProducts;
    console.log(productIndex, chosenAttributesGroupIndex);
    console.log(prevCart);
    let newCart = [];
    let newCartProducts = [];
    console.log(changeAmountType);
    if (changeAmountType === "increase-amount") {
      // If newCart has been placed in cartProducts state.
      newCartProducts = [
        ...prevCartProducts.slice(0, productIndex),
        {
          ...prevCartProducts[productIndex],
          chosenAttributesGroups: [
            ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
              0,
              chosenAttributesGroupIndex
            ),
            {
              ...prevCartProducts[productIndex].chosenAttributesGroups[
                chosenAttributesGroupIndex
              ],
              amount:
                prevCartProducts[productIndex].chosenAttributesGroups[
                  chosenAttributesGroupIndex
                ].amount + 1,
            },
            ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
              chosenAttributesGroupIndex + 1
            ),
          ],
        },
        ...prevCartProducts.slice(productIndex + 1),
      ];

      // If newCart has been placed in cart state.
      newCart = [
        ...prevCart.slice(0, productIndex),
        {
          ...prevCart[productIndex],
          attributes: [
            ...prevCart[productIndex].attributes.slice(
              0,
              chosenAttributesGroupIndex
            ),
            {
              ...prevCart[productIndex].attributes[chosenAttributesGroupIndex],
              amount:
                prevCart[productIndex].attributes[chosenAttributesGroupIndex]
                  .amount + 1,
            },
            ...prevCart[productIndex].attributes.slice(
              chosenAttributesGroupIndex + 1
            ),
          ],
        },
        ...prevCart.slice(productIndex + 1),
      ];
      console.log("increase", newCart, newCartProducts);
    } else if (changeAmountType === "decrease-amount") {
      newCartProducts = [
        ...prevCartProducts.slice(0, productIndex),
        {
          ...prevCartProducts[productIndex],
          chosenAttributesGroups: [
            ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
              0,
              chosenAttributesGroupIndex
            ),
            {
              ...prevCartProducts[productIndex].chosenAttributesGroups[
                chosenAttributesGroupIndex
              ],
              amount:
                prevCartProducts[productIndex].chosenAttributesGroups[
                  chosenAttributesGroupIndex
                ].amount - 1,
            },
            ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
              chosenAttributesGroupIndex + 1
            ),
          ],
        },
        ...prevCartProducts.slice(productIndex + 1),
      ];

      newCart = [
        ...prevCart.slice(0, productIndex),
        {
          ...prevCart[productIndex],
          attributes: [
            ...prevCart[productIndex].attributes.slice(
              0,
              chosenAttributesGroupIndex
            ),
            {
              ...prevCart[productIndex].attributes[chosenAttributesGroupIndex],
              amount:
                prevCart[productIndex].attributes[chosenAttributesGroupIndex]
                  .amount - 1,
            },
            ...prevCart[productIndex].attributes.slice(
              chosenAttributesGroupIndex + 1
            ),
          ],
        },
        ...prevCart.slice(productIndex + 1),
      ];

      // If product has zero amount. (If statement based on modified prevCart.)
      if (
        prevCart[productIndex].attributes[chosenAttributesGroupIndex].amount -
          1 <=
        0
      ) {
        if (newCartProducts[productIndex].chosenAttributesGroups.length > 1) {
          // If product has any attributes group after reach zero amount.
          console.log("Has any attributes group after reach zero amount");
          console.log(prevCart[productIndex].attributes);
          newCart = [
            ...prevCart.slice(0, productIndex),
            {
              ...prevCart[productIndex],
              attributes: [
                ...prevCart[productIndex].attributes.slice(
                  0,
                  chosenAttributesGroupIndex
                ), // -> removed <-
                ...prevCart[productIndex].attributes.slice(
                  chosenAttributesGroupIndex + 1
                ),
              ],
            },
            ...prevCart.slice(productIndex + 1),
          ];

          newCartProducts = [
            ...prevCartProducts.slice(0, productIndex),
            {
              ...prevCartProducts[productIndex],
              chosenAttributesGroups: [
                ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
                  0,
                  chosenAttributesGroupIndex
                ), // -> removed <-
                ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
                  chosenAttributesGroupIndex + 1
                ),
              ],
            },
            ...prevCartProducts.slice(productIndex + 1),
          ];
          console.log("newCartProducts", newCartProducts);
        } else if (
          newCartProducts[productIndex].chosenAttributesGroups.length === 1 &&
          newCartProducts[productIndex].chosenAttributesGroups[
            chosenAttributesGroupIndex
          ].amount === 0
        ) {
          // If product does not have any attributes group after reach zero amount.
          console.log("Has no attributes group after reach zero amount.");
          newCart = [
            ...prevCart.slice(0, productIndex),
            ...prevCart.slice(productIndex + 1),
          ];

          newCartProducts = [
            ...prevCartProducts.slice(0, productIndex),
            ...prevCartProducts.slice(productIndex + 1),
          ];
        }
      }
    }

    console.log("newCartProducts", newCartProducts);
    console.log("newCart", newCart);
    this.setState({
      cart: newCart,
      cartProducts: newCartProducts,
    });
  }

  handleRemoveAttributesGroup(productIndex, chosenAttributesGroupIndex) {
    console.log(productIndex, chosenAttributesGroupIndex);
    let newCart = [];
    let newCartProducts = [];
    const prevCart = this.state.cart;
    const prevCartProducts = this.state.cartProducts;

    if (prevCart[productIndex].attributes.length >= 2) {
      newCart = [
        ...prevCart.slice(0, productIndex),
        {
          ...prevCart[productIndex],
          attributes: [
            ...prevCart[productIndex].attributes.slice(
              0,
              chosenAttributesGroupIndex
            ), // -> removed <-
            ...prevCart[productIndex].attributes.slice(
              chosenAttributesGroupIndex + 1
            ),
          ],
        },
        ...prevCart.slice(productIndex + 1),
      ];

      newCartProducts = [
        ...prevCartProducts.slice(0, productIndex),
        {
          ...prevCartProducts[productIndex],
          chosenAttributesGroups: [
            ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
              0,
              chosenAttributesGroupIndex
            ), // -> removed <-
            ...prevCartProducts[productIndex].chosenAttributesGroups.slice(
              chosenAttributesGroupIndex + 1
            ),
          ],
        },
        ...prevCartProducts.slice(productIndex + 1),
      ];
    } else if (prevCart[productIndex].attributes.length < 2) {
      newCart = [
        ...prevCart.slice(0, productIndex),
        ...prevCart.slice(productIndex + 1),
      ];

      newCartProducts = [
        ...prevCartProducts.slice(0, productIndex),
        ...prevCartProducts.slice(productIndex + 1),
      ];
    }

    this.setState({
      cart: newCart,
      cartProducts: newCartProducts,
    });
  }

  handleClearAllAttributeGroups(productIndex) {
    let newCart = [];
    let newCartProducts = [];
    const prevCart = this.state.cart;
    const prevCartProducts = this.state.cartProducts;
    newCart = [
      ...prevCart.slice(0, productIndex),
      ...prevCart.slice(productIndex + 1),
    ];

    newCartProducts = [
      ...prevCartProducts.slice(0, productIndex),
      ...prevCartProducts.slice(productIndex + 1),
    ];

    this.setState({
      cart: newCart,
      cartProducts: newCartProducts,
    });
  }

  handleClearAllProducts() {
    this.setState({
      cart: [],
      cartProducts: [],
    });
  }

  render() {
    console.log(this.state);
    const {
      categories,
      category,
      productsByCategory,
      PDP,
      currencies,
      currency,
      cart,
      attributes,
      cartProducts,
    } = this.state;
    const value = {
      productsByCategory,
      categories,
      category,
      PDP,
      currencies,
      currency,
      cart,
      attributes,
      cartProducts,
      handleSwitchCurrency: this.handleSwitchCurrency,
      handleCategoryUpdate: this.handleCategoryUpdate,
      getSingleProduct: this.getSingleProduct,
      handleAddToCart: this.handleAddToCart,
      handleClickAttributeBtns: this.handleClickAttributeBtns,
      handleChangeAmount: this.handleChangeAmount,
      handleRemoveAttributesGroup: this.handleRemoveAttributesGroup,
      handleClearAllAttributeGroups: this.handleClearAllAttributeGroups,
      handleClearAllProducts: this.handleClearAllProducts,
    };

    return (
      <>
        <AppContext.Provider value={value}>
          {this.props.children}
        </AppContext.Provider>
      </>
    );
  }
}

export { AppContext, AppProvider };
