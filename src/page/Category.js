import React, { Component } from "react";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { AppContext } from "../context";

class Category extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props)
    this.state = {
      searchProduct: '',
      productsPerPage: 10,
      currentPage: 1
    }
    this.handleSetSearchProduct = this.handleSetSearchProduct.bind(this);
    this.handleSwitchPage = this.handleSwitchPage.bind(this);
  }

  componentWillUnmount() {
    window.scrollTo(0, 0)
  }

  handleSetSearchProduct(e) {
    this.setState({
      searchProduct: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleSwitchPage(pageToGo) {
    this.setState({
      currentPage: pageToGo
    });
  }

  render() {
    const { category: categoryContex, productsByCategory } = this.context;
    // console.log("productsByCategory", productsByCategory);
    let noProductFound = false;
    console.log('Category state', this.state);
    return (
      <>
        <div className="category">
          <h1 className="category-name">{categoryContex}</h1>
          <form onSubmit={this.handleSubmit} className="search-form">
            <input className="search-input" type="text" value={this.state.searchProduct} onChange={this.handleSetSearchProduct} placeholder="Search Product" />
          </form>
          <div className="product-cards">
            {productsByCategory.map((product, productIndex) => {
              let searchProduct = this.state.searchProduct;
              // Make search more accurate by excluding whitespace.
              searchProduct = searchProduct.toLowerCase().trim().split(/\s+/).join('');
              const productToFilter = (product.name).toLowerCase().trim().split(/\s+/).join('');
              // Pagination
              const lastProductIndex = this.state.currentPage * this.state.productsPerPage;
              const firstProductIndex = lastProductIndex - this.state.productsPerPage;

              if (productIndex >= firstProductIndex && productIndex <= lastProductIndex - 1) {
                if (this.state.searchProduct !== '') {
                  if (productToFilter.match(searchProduct)) {
                    return (<ProductCard
                      key={product.id}
                      {...product}
                      productIndex={productIndex}
                    />)
                  } else if (!productToFilter.match(searchProduct)) {
                    noProductFound = true;
                    return null;
                  }
                } else if (this.state.searchProduct === '') {
                  return (<ProductCard
                    key={product.id}
                    {...product}
                    productIndex={productIndex}
                  />)
                }
              }
              return null;
            })}
          </div>
          {
            productsByCategory && !noProductFound &&
            <Pagination totalProducts={productsByCategory.length} productsPerPage={this.state.productsPerPage} handleSwitchPage={this.handleSwitchPage} />
          }
          {
            noProductFound &&
            <div className="no-product-match">No product match your search result.</div>
          }
        </div>
      </>
    );
  }
}

export default Category;
