import { Component } from "react";
import ProductCard from "../components/ProductCard";
import { AppContext } from "../context";

class Category extends Component {
  static contextType = AppContext;

  render() {
    console.log(this.context);
    const { category: categoryContex, productsByCategory } = this.context;
    console.log("productsByCategory", productsByCategory);
    return (
      <>
        <div className="category">
          <h1 className="category-name">{categoryContex}</h1>
          <div className="product-cards">
            {productsByCategory.map((product, productIndex) => {
              console.log(product, productIndex);
              return (
                <ProductCard
                  key={product.id}
                  {...product}
                  productIndex={productIndex}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default Category;
